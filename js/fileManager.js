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
    function FileManager(main, user) {
        this.main = main;
        this.user = user;
    }
    FileManager.prototype.saveFile = function () {
        //Função responsável por salvar o arquivo do usuário
    };
    FileManager.prototype.loadedFile = function () {
        //Função responsável por capturar o evento de envio do botão de upload
        //Chama a função que irá carregar o arquivo selecionado
        this.main.openCodeFile(CodeFile.objectToCode(JSON.parse(localStorage.getItem("codeFile"))));
    };
    FileManager.prototype.uploadFile = function () {
        //Cria o elemento de input
        var htmlInput = document.createElement("input");
        htmlInput.type = "file";
        htmlInput.accept = ".txt";
        htmlInput.id = "inputCodeFile";
        //Captura o evento para quando haver alguma alteração, ou seja, o arquivo foi selecionado
        htmlInput.onchange = function (event) {
            var fileInput = event.target;
            //Cria um reader que fará a leitura do arquivo selecionado
            var reader = new FileReader();
            //Captura o evento de quando a leitura for finalizada
            reader.onload = function (event) {
                //Cria um novo arquivo de código com o texto do arquivo selecionado 
                var codeFile = new CodeFile("", "Sem título", reader.result);
                //Armazena o arquivo de código localmente
                localStorage.removeItem("codeFile");
                localStorage.setItem("codeFile", JSON.stringify(codeFile));
                //Dispara o evento de envio no botão de upload
                document.getElementById("btnUpload").dispatchEvent(new Event("submit"));
            };
            //Faz a leitura do primeiro arquivo selecionado
            reader.readAsText(fileInput.files[0]);
        };
        htmlInput.click();
    };
    FileManager.prototype.openCodeFile = function (idCodeFile) {
        //Função responsável por abrir o arquivo de código selecionado
        //  ou então abrir um código novo de exemplo
        if (idCodeFile === void 0) { idCodeFile = ""; }
        var answer = false;
        //Caso o usuário seja anônimo ou então não há um arquivo de código para abrir, abre um de exemplo
        if (this.user == undefined || idCodeFile == "") {
            var codeFile = new CodeFile("", "Sem título", FileManager.DEFAULT_CODE);
            localStorage.removeItem("codeFile");
            localStorage.setItem("codeFile", JSON.stringify(codeFile));
            return true;
        }
        else {
            //Carrega todos os códigos do usuário logado
            var arrCodeFiles = this.user.getCodeFiles();
            //Pega entre os códigos do usuário o código passado como parâmetro
            var codeFile;
            codeFile = arrCodeFiles.filter(function (x) { return x.id == idCodeFile; })[0];
            if (codeFile == undefined) {
                codeFile = new CodeFile("", "Sem título", FileManager.DEFAULT_CODE);
                localStorage.removeItem("codeFile");
                localStorage.setItem("codeFile", JSON.stringify(codeFile));
                return true;
            }
            else {
                localStorage.removeItem("codeFile");
                localStorage.setItem("codeFile", JSON.stringify(codeFile));
                return true;
            }
        }
    };
    return FileManager;
}());
FileManager.DEFAULT_CODE = "int main(){\n" +
    "    printf(\"===================\");\n" +
    "    printf(\"Learning 2 Program\");\n" +
    "    printf(\"   Hello World!   \");\n" +
    "    printf(\"Learning 2 Program\");\n" +
    "    printf(\"===================\");\n" +
    "}";
