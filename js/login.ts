var firebase;
var swal;

class Login {

    private fileManager: FileManager;
    private main: Main;

    constructor() {
        //this.prepareAuth();
    }

    /*async prepareAuth() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                console.log("Login do usuário: " + uid );
            } else {
                console.log("Logoff do usuário");
                console.log(user);
            }
        });        
    }*/

    private withoutLogin() {
        localStorage.removeItem("user");
        window.open("learning2program.html", "_self");
    }

    private logoff(): void {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
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
            swal({titleText: "Por favor, ajuste!", html: errorMessage, type: "warning"});
        } else {
            this.doLogin(email.value.trim(), pass.value.trim());
        }

    }

    private doLogin(email: string, password: string): boolean {
        var answer: boolean = false;

        if (Main.debug){
            var user = new User("", "claudineibjr@hotmail.com", "Claudinei Brito Junior");
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(user));
            window.open("learning2program.html", "_self");
            return true;
        }
        
        /*firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            console.log("Usuário logado com sucesso");

            answer = true;
            return true;

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            
            swal({  titleText: "Ooops...", 
                    html: "Houve um erro ao tentarmos logar você no sistema, pedidos desculpas.<br/><br/>Consulte o console para mais informações sobre o problema.",
                    type: "error"
            });

            console.log("Houve um erro ao tentarmos fazer seu login.\n\n" + errorCode + " - " + errorMessage);

            answer = false;
            return false;

        });*/

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
            swal({titleText: "Por favor, ajuste!", html: errorMessage, type: "warning"});
        } else {
            this.doRegister(email.value.trim(), name.value.trim(), pass1.value.trim());
        }

    }

    private doRegister(email: string, name: string, password: string): boolean {

        var answer: boolean;

        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            console.log("Usuário cadastrado com sucesso");

            answer = true;
            return true;

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Houve um erro ao tentarmos te cadastrar.\n\n" + errorCode + " - " + errorMessage);
            swal('Oops...', 'Houve um erro ao tentarmos te cadastrar.\n\n' + errorCode + ' - ' + errorMessage, 'error');

            answer = false;
            return false;

        });

        return answer;

    }
}