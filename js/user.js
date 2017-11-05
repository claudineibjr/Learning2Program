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
    return User;
}());
