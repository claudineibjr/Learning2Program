var User = (function () {
    function User(uid, email, name, codeFiles, preferences) {
        if (uid === void 0) { uid = null; }
        if (email === void 0) { email = null; }
        if (name === void 0) { name = ""; }
        if (codeFiles === void 0) { codeFiles = new Array(); }
        if (preferences === void 0) { preferences = new Preferences(); }
        this.uid = uid;
        this.email = email;
        this.name = name;
        this.codeFiles = codeFiles;
        this.preferences = preferences;
    }
    User.prototype.setUid = function (newUid) {
        this.uid = newUid;
    };
    User.prototype.setEmail = function (newEmail) {
        this.email = newEmail;
    };
    User.prototype.setName = function (newName) {
        this.name = newName;
    };
    User.prototype.setCodeFiles = function (newCodeFiles) {
        this.codeFiles = newCodeFiles;
    };
    User.prototype.setPreferences = function (newPreferences) {
        this.preferences = newPreferences;
    };
    User.prototype.getUid = function () {
        return this.uid;
    };
    User.prototype.getEmail = function () {
        return this.email;
    };
    User.prototype.getName = function () {
        return this.name;
    };
    User.prototype.getCodeFiles = function () {
        return this.codeFiles;
    };
    User.prototype.getPreferences = function () {
        return this.preferences;
    };
    User.prototype.addNewCodeFile = function (newCodeFile) {
        this.codeFiles.push(newCodeFile);
        return this.codeFiles;
    };
    User.prototype.updateCodeFile = function (updatedCodeFile) {
        for (var iCount = 0; iCount < this.codeFiles.length; iCount++) {
            if (this.codeFiles[iCount].getId() == updatedCodeFile.getId()) {
                this.codeFiles[iCount].setCode(updatedCodeFile.getCode());
                break;
            }
        }
        return this.codeFiles;
    };
    User.objectToUser = function (object) {
        //Função que convert um objeto para a classe Usuário
        var user = new User();
        if (object == null || object == undefined) {
            return undefined;
        }
        else {
            user.uid = object["uid"];
            user.email = object["email"];
            user.name = object["name"];
            user.codeFiles = new Array();
            if (object["codeFiles"] != undefined && object["codeFiles"] != null) {
                for (var iCount = 0; iCount < object["codeFiles"].length; iCount++) {
                    var newCodeFile = new CodeFile();
                    newCodeFile.setId(object["codeFiles"][iCount]["id"]);
                    newCodeFile.setName(object["codeFiles"][iCount]["name"]);
                    newCodeFile.setCode(object["codeFiles"][iCount]["code"]);
                    user.codeFiles.push(newCodeFile);
                }
            }
            user.preferences = new Preferences();
            user.preferences.setFontSize(object["preferences.fontSize"]);
            user.preferences.setFontSize(object["preferences.lastCodeFileOpen"]);
            return user;
        }
    };
    return User;
}());
