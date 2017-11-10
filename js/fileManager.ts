var firebase;

class FileManager {

    static readonly DEFAULT_CODE: string = '' +
        'int main(){\n' +
        '    printf("===== Seja bem-vindo ao Learing 2 Program =====");\n' +
        '    printf("------- Exemplo - Calculadora de médias -------");\n' +
        '    \n' +
        '    //Criação das variáveis de nota\n' +
        '    int nota1, nota2; \n' +
        '    \n' +
        '    /*Criação das variáveis que serão \n' +
        '        utilizadas para avaliar se o aluno foi aprovado*/\n' +
        '    float notaFinal1, notaMinima, notaExame;\n' +
        '    \n' +
        '    printf("Digite a primeira e a segunda nota");\n' +
        '    scanf("%d %d", &nota1, &nota2); //Leitura das duas primeiras notas\n' +
        '    \n' +
        '    //Definição das notas utilizadas para avaliar se o aluno foi aprovado\n' +
        '    notaMinima = 7; \n' +
        '    notaExame = 5; \n' +
        '    notaFinal1 = (nota1 + nota2) / 2;       \n' +
        '\n' +
        '    /*A média para aprovação é 7 \n' +
        '    Caso a nota seja maior do que 7, foi aprovado, caso contrário não*/ \n' +
        '    if (notaFinal1 < notaMinima) { \n' +
        '        printf("Que pena, reprovou!"); \n' +
        '    } else { \n' +
        '        printf("Parabéns, você passou!"); \n' +
        '    } \n' +
        '\n' +
        '    printf("--------------- Muito obrigado! ---------------");\n' +
        '}';

    //Propriedade que contém o usuário
    private user: User;

    //Propriedade que contém a classe principal do programa
    private main: Main;

    constructor(main: Main, user: User) {
        this.main = main;
        this.user = user;
    }

    private saveFile() {
        //Função responsável por salvar o arquivo do usuário

        var fileManager = this;

        var actualCodeFile: CodeFile = CodeFile.objectToCode(JSON.parse(localStorage.getItem("codeFile")));

        if (actualCodeFile.getId() != "") {

            actualCodeFile.setCode(fileManager.main.editor.getValue());
            fileManager.user.updateCodeFile(actualCodeFile);
            this.saveFileOnDatabase(fileManager.user.getCodeFiles(), actualCodeFile);

        } else {
            //Abre a caixa de diálogo perguntando o nome do arquivo a ser salvo
            swal({
                title: "Informe o nome do código a ser salvo",
                input: "text",
                type: "question"
            }).then(function (result) {
                var codeFile: CodeFile = new CodeFile();

                codeFile.setName(result);
                codeFile.setCode(fileManager.main.editor.getValue());
                codeFile.setId(fileManager.getNewCodeFileId(fileManager.user.getUid()));
                if (codeFile.getId() != ""){
                    fileManager.saveFileOnDatabase(fileManager.user.addNewCodeFile(codeFile), codeFile);
                    fileManager.main.insertCodeFilesInList(codeFile);
                }
            });
        }

    }

    private getNewCodeFileId(userUID: string): string {

        var newCodeFileId: string = "";

        try {
            var newId: string = firebase.database().ref("users/" + userUID).child("codeFiles").push().key;
            newCodeFileId = newId;
        } catch (ex) {
            var errorMessage;
            errorMessage = "Consulte o console para mais informações sobre o problema.";

            swal({
                titleText: "Ooops...",
                html: "Houve um erro ao tentarmos salvar seu arquivo no banco de dados, pedidos desculpas.<br/><br/>" + errorMessage,
                type: "error"
            });

            console.log("Houve um erro ao tentarmos salvar seu arquivo no banco de dados, pedidos desculpas\n" + ex.code + " - " + ex.message);
        }

        return newCodeFileId;
    }

    private saveFileOnDatabase(arrCodeFile: Array<CodeFile>, newCodeFile: CodeFile) {
        try {
            firebase.database().ref("users/" + this.user.uid + "/codeFiles").set(arrCodeFile).then(function () {
                localStorage.removeItem("codeFile");
                localStorage.setItem("codeFile", JSON.stringify(newCodeFile));

                swal({
                    title: "Código salvo com sucesso",
                    type: "success"
                });
            });
        } catch (ex) {

            var errorMessage;
            errorMessage = "Consulte o console para mais informações sobre o problema.";

            swal({
                titleText: "Ooops...",
                html: "Houve um erro ao tentarmos salvar seu arquivo no banco de dados, pedidos desculpas.<br/><br/>" + errorMessage,
                type: "error"
            });

            console.log("Houve um erro ao tentarmos salvar seu arquivo no banco de dados, pedidos desculpas\n" + ex.code + " - " + ex.message);

        }
    }

    private loadedFile(): any {
        //Função responsável por capturar o evento de envio do botão de upload

        //Chama a função que irá carregar o arquivo selecionado
        this.main.openCodeFile(CodeFile.objectToCode(JSON.parse(localStorage.getItem("codeFile"))));
    }

    private newFile(){
        this.setOnLocalStorageCodeFile("");
        this.main.codeFile = CodeFile.objectToCode(JSON.parse(localStorage.getItem("codeFile")));
        this.main.openCodeFile(this.main.codeFile);
    }

    private uploadFile() {

        //Cria o elemento de input
        var htmlInput: HTMLInputElement = < HTMLInputElement > document.createElement("input");
        htmlInput.type = "file";
        htmlInput.accept = ".txt";
        htmlInput.id = "inputCodeFile";

        //Captura o evento para quando haver alguma alteração, ou seja, o arquivo foi selecionado
        htmlInput.onchange = function (event) {
            var fileInput: HTMLInputElement = < HTMLInputElement > event.target;

            //Cria um reader que fará a leitura do arquivo selecionado
            var reader = new FileReader();

            //Captura o evento de quando a leitura for finalizada
            reader.onload = function (event) {

                //Cria um novo arquivo de código com o texto do arquivo selecionado 
                var codeFile: CodeFile = new CodeFile("", "Sem título", reader.result);

                //Armazena o arquivo de código localmente
                localStorage.removeItem("codeFile");
                localStorage.setItem("codeFile", JSON.stringify(codeFile));

                //Dispara o evento de envio no botão de upload
                document.getElementById("btnUpload").dispatchEvent(new Event("submit"));
            };

            //Faz a leitura do primeiro arquivo selecionado
            reader.readAsText(fileInput.files[0]);
        }
        htmlInput.click();
    }

    public setOnLocalStorageCodeFile(idCodeFile: string = ""): boolean {
        //Função responsável por abrir o arquivo de código selecionado
        //  ou então abrir um código novo de exemplo

        var answer: boolean = false;

        //Caso o usuário seja anônimo ou então não há um arquivo de código para abrir, abre um de exemplo
        if (this.user == undefined || idCodeFile == "") {
            var codeFile = new CodeFile("", "Sem título", FileManager.DEFAULT_CODE);
            localStorage.removeItem("codeFile");
            localStorage.setItem("codeFile", JSON.stringify(codeFile));
            return true;
        } else {

            //Carrega todos os códigos do usuário logado
            var arrCodeFiles: Array < CodeFile > = this.user.getCodeFiles();

            //Pega entre os códigos do usuário o código passado como parâmetro
            var codeFile: CodeFile;
            codeFile = arrCodeFiles.filter(x => x.id == idCodeFile)[0];

            if (codeFile == undefined) {
                if (idCodeFile == "") {
                    codeFile = new CodeFile("", "Sem título", FileManager.DEFAULT_CODE);
                    localStorage.removeItem("codeFile");
                    localStorage.setItem("codeFile", JSON.stringify(codeFile));
                    return true;
                }
            } else {
                localStorage.removeItem("codeFile");
                localStorage.setItem("codeFile", JSON.stringify(codeFile));
                return true;
            }
        }
    }

}