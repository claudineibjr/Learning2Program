var firebase;
var Login = (function () {
    function Login() {
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
    Login.prototype.withoutLogin = function () {
        window.open("learning2program.html", "_self");
    };
    Login.prototype.logoff = function () {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
        })["catch"](function (error) {
            // An error happened.
        });
    };
    Login.prototype.login = function () {
        var email, pass;
        email = document.getElementById("inputLoginEmail");
        pass = document.getElementById("inputLoginPassword");
        var errorMessage, error;
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
        }
        else {
            this.doLogin(email.value.trim(), pass.value.trim());
        }
    };
    Login.prototype.doLogin = function (email, password) {
        var answer;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            console.log("Usuário logado com sucesso");
            //bootbox.alert("Usuário logado com sucesso");
            answer = true;
            return true;
        })["catch"](function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Houve um erro ao tentarmos fazer seu login.\n\n" + errorCode + " - " + errorMessage);
            answer = false;
            return false;
        });
        return answer;
    };
    Login.prototype.register = function () {
        var email, pass1, pass2, name;
        email = document.getElementById("inputRegisterEmail");
        name = document.getElementById("inputRegisterName");
        pass1 = document.getElementById("inputRegisterPassword1");
        pass2 = document.getElementById("inputRegisterPassword2");
        var errorMessage, error;
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
        }
        else {
            this.doRegister(email.value.trim(), name.value.trim(), pass1.value.trim());
        }
    };
    Login.prototype.doRegister = function (email, name, password) {
        var answer;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
            console.log("Usuário cadastrado com sucesso");
            //bootbox.alert("Usuário cadastrado com sucesso");
            answer = true;
            return true;
        })["catch"](function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Houve um erro ao tentarmos te cadastrar.\n\n" + errorCode + " - " + errorMessage);
            answer = false;
            return false;
        });
        return answer;
    };
    return Login;
}());
