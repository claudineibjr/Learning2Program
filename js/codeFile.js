var CodeFile = (function () {
    function CodeFile(id, code) {
        if (id === void 0) { id = ""; }
        if (code === void 0) { code = ""; }
        this.id = id;
        this.code = code;
    }
    CodeFile.prototype.getCode = function () {
        return this.code;
    };
    CodeFile.prototype.getId = function () {
        return this.id;
    };
    return CodeFile;
}());
