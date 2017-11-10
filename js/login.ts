var firebase;
var swal;

class Login {

    private fileManager: FileManager;
    private main: Main;
    private user: User = null;

    private isRegister: boolean;

    constructor() {
        this.prepareAuth();
        this.isRegister = false;
    }

    private prepareAuth() {
        firebase.auth().onAuthStateChanged(function (firebaseUser) {
            if (firebaseUser) {

                swal({
                    titleText: "Login efetuado com sucesso",
                    type: "success",
                    position: "top"
                }).then(function () {
                    //Verifica se o usuário já existe... caso não, o cria
                    if (this.user == null) {
                        this.user = new User(firebaseUser.uid, firebaseUser.email);
                    }

                    //Verifica se é a criação de um usuário e então, caso seja, o cria no banco de dados Firebase
                    if (this.isRegister) {
                        try {

                            //Após criar o usuário no banco de dados, abre a próxima tela
                            firebase.database().ref("users/" + this.user.uid).set(this.user).then(function () {
                                //Seta o usuário logado no armazenamento local e vai para a próxima página
                                localStorage.removeItem("user");
                                localStorage.setItem("user", JSON.stringify(this.user));
                                window.open("learning2program.html", "_self");
                            });

                        } catch (ex) {

                            var errorMessage;
                            errorMessage = "Consulte o console para mais informações sobre o problema.";

                            swal({
                                titleText: "Ooops...",
                                html: "Houve um erro ao tentarmos cadastrar você no sistema, pedidos desculpas.<br/><br/>" + errorMessage,
                                type: "error"
                            });

                            console.log("Houve um erro ao tentar gravar o usuário no banco de dados\n" + ex.code + " - " + ex.message);
                        }
                    } else {
                        //Seta o usuário logado no armazenamento local e vai para a próxima página
                        localStorage.removeItem("user");
                        localStorage.setItem("user", JSON.stringify(this.user));
                        window.open("learning2program.html", "_self");
                    }
                });
            }
        });
    }

    private withoutLogin() {
        localStorage.removeItem("user");
        window.open("learning2program.html", "_self");
    }

    private sendEmailToResetPassword() {
        swal({
            title: "Esqueceu sua senha?",
            html: "Digite o e-mail que você utilizou para se cadastrar no Learning 2 Program",
            input: "email",
            type: "question"
        }).then(function (result) {
            if (result != "") {
                firebase.auth().sendPasswordResetEmail(result).then(function () {
                    swal({
                        title: "E-mail enviado com sucesso",
                        type: "success"
                    });
                }).catch(function (ex) {
                    var errorMessage: string = "";

                    switch (ex.code) {
                        case "auth/user-not-found":
                            {
                                errorMessage = "Não existe nenhum usuário cadastrado com este endereço de e-mail.";
                                break;
                            }
                        default:
                            {
                                errorMessage = "Consulte o console para mais informações sobre o problema.";
                            }
                    }

                    swal({
                        titleText: "Ooops...",
                        html: "Houve um erro ao tentarmos te enviar um e-mail de recuperação de senha, pedidos desculpas.<br/><br/>" + errorMessage,
                        type: "error"
                    });

                    console.log("Houve um erro ao tentarmos fazer seu login.\n\n" + ex.code + " - " + ex.message);
                });
            }
        });
    }

    private login(): void {
        var email: HTMLInputElement, pass: HTMLInputElement;
        email = < HTMLInputElement > document.getElementById("inputLoginEmail");
        pass = < HTMLInputElement > document.getElementById("inputLoginPassword");

        var errorMessage: string, error: boolean;
        errorMessage = "Não foi possível fazer seu login.\nPor favor, verifique:<br/><br/>";
        error = false;

        if (email.value.trim().length == 0) {
            error = true;
            errorMessage += " - É obrigatório você informar o e-mail.<br/>";
        }

        if (pass.value.trim().length == 0) {
            error = true;
            errorMessage += " - É obrigatório você informar a senhas.<br/>";
        }

        if (error) {
            swal({
                titleText: "Por favor, ajuste!",
                html: errorMessage,
                type: "warning"
            });
        } else {
            this.doLogin(email.value.trim(), pass.value.trim());
        }

    }

    private doLogin(email: string, password: string): boolean {
        var answer: boolean = true;

        if (Main.debug) {
            var user = new User("", "claudineibjr@hotmail.com", "Claudinei Brito Junior");
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(user));
            window.open("learning2program.html", "_self");
            return true;
        }

        firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
            if (user) {
                console.log("Login funcionou");
            }
        }).catch(function (error) {
            var errorMessage;

            switch (error.code) {
                case "auth/invalid-email":
                    {
                        errorMessage = "O e-mail digitado é inválido.<br/>Verifique se o e-mail foi digitado corretamente.";
                        break;
                    }
                case "auth/user-not-found":
                    {
                        errorMessage = "Não existe um usuário cadastro com este endereço de e-mail.<br/>Verifique se o e-mail foi digitado corretamente.";
                        break;
                    }
                case "auth/wrong-password":
                    {
                        errorMessage = "Senha incorreta.<br/>Verifique se a senha foi digitada corretamente";
                        break;
                    }
                default:
                    {
                        errorMessage = "Consulte o console para mais informações sobre o problema.";
                    }
            }

            swal({
                titleText: "Ooops...",
                html: "Houve um erro ao tentarmos logar você no sistema, pedidos desculpas.<br/><br/>" + errorMessage,
                type: "error"
            });

            console.log("Houve um erro ao tentarmos fazer seu login.\n\n" + error.code + " - " + error.message);

            answer = false;
            return false;

        });

        return answer;
    }

    private register(): void {
        var email: HTMLInputElement, pass1: HTMLInputElement, pass2: HTMLInputElement, name: HTMLInputElement;
        email = < HTMLInputElement > document.getElementById("inputRegisterEmail");
        name = < HTMLInputElement > document.getElementById("inputRegisterName");
        pass1 = < HTMLInputElement > document.getElementById("inputRegisterPassword1");
        pass2 = < HTMLInputElement > document.getElementById("inputRegisterPassword2");

        var errorMessage: string, error: boolean;
        errorMessage = "Não foi possível criar seu usuário.\nPor favor, verifique:<br/><br/>";
        error = false;

        if (email.value.trim().length == 0) {
            error = true;
            errorMessage += " - É obrigatório você informar o e-mail.<br/>";
        }

        if (name.value.trim().length == 0) {
            error = true;
            errorMessage += " - É obrigatório você informar o nome.<br/>";
        }

        if (pass1.value.trim().length == 0 || pass2.value.trim().length == 0) {
            error = true;
            errorMessage += " - É obrigatório você informar a senhas.<br/>";
        }

        if (pass1.value != pass2.value) {
            error = true;
            errorMessage += " - As senhas informadas não conferem.<br/>";
        }

        if (error) {
            swal({
                titleText: "Por favor, ajuste!",
                html: errorMessage,
                type: "warning"
            });
        } else {
            this.doRegister(email.value.trim(), name.value.trim(), pass1.value.trim());
        }

    }

    private doRegister(email: string, name: string, password: string): boolean {

        var answer: boolean = true;

        //Tenta fazer a criação do usuário no servidor Firebase
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
            var errorMessage: string;

            //Verifica o código de erro
            switch (error.code) {
                case "auth/email-already-in-use":
                    {
                        errorMessage = "O e-mail <b>" + email + "</b> já está em uso.<br/>Utilize um outro e-mail por favor."
                        break;
                    }

                case "auth/invalid-email":
                    {
                        errorMessage = "O e-mail digitado é inválido.<br/>Verifique se o e-mail foi digitado corretamente.";
                        break;
                    }

                case "auth/weak-password":
                    {
                        errorMessage = "A senha digitada é muito fraca.";
                        if (error.message === "Password should be at least 6 characters") {
                            errorMessage += " A senha precisa ter no mínimo 6 caracteres.";
                        }
                        errorMessage += "<br/>Tente novamente com outra senha por favor.";
                        break;
                    }

                default:
                    {
                        errorMessage = "Consulte o console para mais informações sobre o problema.";
                    }
            }

            //Exibe a mensagem de erro
            swal({
                titleText: "Ooops...",
                html: "Houve um erro ao tentarmos cadastrar você no sistema, pedidos desculpas.<br/><br/>" + errorMessage,
                type: "error"
            });

            console.log("Houve um erro ao tentarmos fazer seu login.\n\n" + error.code + " - " + error.message);

            answer = false;
            return false;

        }).then(function (firebaseUser) {
            if (firebaseUser) {
                this.isRegister = true;
                this.user = new User(firebaseUser.uid, email, name);

                answer = true;
                return true;
            }
        });

        return answer;

    }
}