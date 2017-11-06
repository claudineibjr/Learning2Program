var CodeFile = (function () {
    function CodeFile(id, name, code) {
        if (id === void 0) { id = ""; }
        if (name === void 0) { name = ""; }
        if (code === void 0) { code = ""; }
        this.id = id;
        this.name = name;
        this.code = code;
    }
    CodeFile.prototype.getId = function () {
        return this.id;
    };
    CodeFile.prototype.getCode = function () {
        return this.code;
    };
    CodeFile.prototype.getName = function () {
        return this.name;
    };
    CodeFile.prototype.setId = function (newId) {
        this.id = newId;
    };
    CodeFile.prototype.setCode = function (newCode) {
        this.code = newCode;
    };
    CodeFile.prototype.setName = function (newName) {
        this.name = newName;
    };
    CodeFile.objectToCode = function (object) {
        var codeFile = new CodeFile();
        if (object == null || object == undefined) {
            return undefined;
        }
        else {
            codeFile.code = object["code"];
            codeFile.id = object["id"];
            codeFile.name = object["name"];
            return codeFile;
        }
    };
    return CodeFile;
}());
