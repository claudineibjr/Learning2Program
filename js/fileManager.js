/*
    Arquitetura do banco de dados do GoogleFirebase
        User (object)
            123 (userid)
                Name (string)
                Email (string)
                Files (object)
                    123 (string, fileID)
                Preferences (object)
                    Font-size (number)
                    LastFileOpen (string, fileID)
*/
var FileManager = (function () {
    function FileManager(user) {
        this.user = user;
    }
    FileManager.prototype.openCodeFile = function (idCodeFile) {
        if (idCodeFile === void 0) { idCodeFile = ""; }
        var answer = false;
        if (this.user == undefined || idCodeFile == "") {
            var code = new CodeFile("teste", "int main(){\n " +
                "   printf(\"Que bom\");\n" +
                "}");
            console.log("Código antes");
            console.log(code);
            localStorage.setItem("code", JSON.stringify(code));
            window.open("learning2program.html", "_self");
            return false;
        }
        else {
            var arrCodeFiles = this.user.getCodeFiles();
            var codeFile;
            codeFile = arrCodeFiles.filter(function (x) { return x.getId() == idCodeFile; })[0];
            var main = new Main(this.user, codeFile);
            window.open("learning2program.html", "_self");
            if (codeFile == undefined) {
                return false;
            }
            else {
                return true;
            }
        }
    };
    return FileManager;
}());
