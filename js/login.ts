var firebase;

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
                //bootbox.alert("Login do usuário: " + uid );
            } else {
                console.log("Logoff do usuário");
                console.log(user);
                //bootbox.alert("Logoff do usuário");
            }
        });        
    }*/

    private withoutLogin(){
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
        errorMessage = "Não foi possível fazer seu login.\nPor favor, verifique:\n\n";
        error = false;

        if (email.value.trim().length == 0) {
            error = true;
            errorMessage += " - É obrigatório você informar o e-mail.\n";
        }

        if (pass.value.trim().length == 0) {
            error = true;
            errorMessage += " - É obrigatório você informar a senhas.\n";
        }

        if (error) {
            alert(errorMessage);
        } else {
            this.doLogin(email.value.trim(), pass.value.trim());
        }

    }

    private doLogin(email: string, password: string): boolean {
        var answer: boolean;

        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            console.log("Usuário logado com sucesso");
            //bootbox.alert("Usuário logado com sucesso");

            answer = true;
            return true;

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Houve um erro ao tentarmos fazer seu login.\n\n" + errorCode + " - " + errorMessage);

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
        errorMessage = "Não foi possível criar seu usuário.\nPor favor, verifique:\n\n";
        error = false;

        if (email.value.trim().length == 0) {
            error = true;
            errorMessage += " - É obrigatório você informar o e-mail.\n";
        }

        if (name.value.trim().length == 0) {
            error = true;
            errorMessage += " - É obrigatório você informar o nome.\n";
        }

        if (pass1.value.trim().length == 0 || pass2.value.trim().length == 0) {
            error = true;
            errorMessage += " - É obrigatório você informar a senhas.\n";
        }

        if (pass1.value != pass2.value) {
            error = true;
            errorMessage += " - As senhas informadas não conferem.\n";
        }

        if (error) {
            alert(errorMessage);
        } else {
            this.doRegister(email.value.trim(), name.value.trim(), pass1.value.trim());
        }

    }

    private doRegister(email: string, name: string, password: string): boolean {

        var answer: boolean;

        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            console.log("Usuário cadastrado com sucesso");
            //bootbox.alert("Usuário cadastrado com sucesso");

            answer = true;
            return true;

        }).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Houve um erro ao tentarmos te cadastrar.\n\n" + errorCode + " - " + errorMessage);

            answer = false;
            return false;

        });

        return answer;

    }
}