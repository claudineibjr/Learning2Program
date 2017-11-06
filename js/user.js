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
            user.codeFiles = object["codeFiles"];
            /*user.codeFiles = new Array<CodeFile>();
            for (var iCount = 0; iCount < object["codeFiles"].length; iCount++ ){
                var newCodeFile: CodeFile = new CodeFile();
                //newCodeFile.setId()
                user.codeFiles.push(new CodeFile)
            }*/
            user.preferences = new Preferences();
            user.preferences.setFontSize(object["preferences.fontSize"]);
            user.preferences.setFontSize(object["preferences.lastCodeFileOpen"]);
            return user;
        }
    };
    return User;
}());
