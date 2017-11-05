//Classes que serão executadas a partir desta
var tokenIdentifier;
var wordsSpliter;
var ace;

class Main {

    public editor;
    private codePanel: HTMLDivElement;

    //Array que contém o código todo separado linha por linha
    public lstCodeLine: Array < string > ;

    //Array que contém o código todo, separado linha por linha e token por token
    public arrTokens: Array < Object > ;

    //Variável que contem o painel à direita
    private txtPanel: HTMLInputElement;

    //Variável que contem a linha que está sendo lida
    public iLine: number;

    //Variável que identificará e controlará a execução da próxima linha
    public executeNextStatement: boolean;

    //Cria uma matriz que conterá os operadores de abre chaves e suas respectivas linhas
    public lstPairsKey: Array < Object > ;

    //Array que irá fazer o controle dos ifs e elses
    public lstIfElseControl: Array < Object > ;

    //Array que irá fazer o controle do for
    public lstForControl: Array < Object > ;

    public bLastIfResult: boolean;

    //Lista com o código inteiro separado entre linhas e palavras
    public lstWords: Array < Object > ;

    //Variável que irá identificar quando o controle do programa foi modificado
    public bModifiedProgramControl: boolean;

    private user: User;
    private codeFile: CodeFile;

    constructor(user: User = null, codeFile: CodeFile = null) {
        this.user = user;
        this.codeFile = codeFile;

        this.codePanel = ( < HTMLDivElement > document.getElementById("txtCode"));

        // Cria o editor de código
        this.editor = ace.edit("txtCode");
        this.editor.setTheme("ace/theme/textmate");
        this.editor.getSession().setMode("ace/mode/c_cpp");

        // Cria uma barra de status
        var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
        var statusBar = new StatusBar(this.editor, document.getElementById("statusBar"));

        // Seta algumas opções do editor de texto
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });

        //Desabilita o botão de próximo
        this.enable("#btnNextStatement", false);

        //Cria os atalhos
        this.createShortcutCommands();

        this.openCodeFile(this.codeFile);

    }

    private saveFile(){

    }

    private uploadFile(){
        var input: HTMLInputElement = document.createElement("input");
        input.type = "file";
        input.click();
    }

    private createShortcutCommands() {
        //Cria os atalhos
        this.editor.commands.addCommand({
            name: 'Execute',
            bindKey: {
                win: 'F5',
                mac: 'Command-1'
            },
            exec: function (editor) {
                $('#btnExecute').trigger('click');
            },
            readOnly: true
        });

        this.editor.commands.addCommand({
            name: 'Debug',
            bindKey: {
                win: 'Shift-F5',
                mac: 'Command-3'
            },
            exec: function (editor) {
                $('#btnDebug').trigger('click');
            },
            readOnly: true
        });

        this.editor.commands.addCommand({
            name: 'Next',
            bindKey: {
                win: 'F10',
                mac: 'Command-3'
            },
            exec: function (editor) {
                $('#btnNextStatement').trigger('click');
            },
            readOnly: true
        });
    }

    private enable(elementName: string, enable: boolean) {
        var strEnable: string = (!enable == true ? "true" : "false");
        $(elementName).attr('disabled', strEnable);
    }

    private openCodeFile(codeFile: CodeFile) {

        var newCode: CodeFile;
        newCode = (<CodeFile> JSON.parse(localStorage.getItem("code")));
        this.editor.insert(newCode.code);
        return;/*

        if (codeFile == undefined || codeFile == null) {
            this.editor.insert("int main(){\n");
            this.editor.insert("    printf(\"================================\");\n");
            this.editor.insert("    printf(\"Hello World - Learning 2 Program\");\n");
            this.editor.insert("    printf(\"================================\");\n");
            this.editor.insert("}");
        } else {
            this.editor.insert(codeFile);
        }*/
    }

    private setExample(numberExample): void {
        switch (numberExample) {
            case 1:
                {
                    this.editor.insert("int main(){ \n");
                    this.editor.insert("    printf(\"Seja bem-vindo à calculadora de média final\"); \n");
                    this.editor.insert("    int nota1, nota2; \n");
                    this.editor.insert("    float notaFinal1, notaMinima, notaExame; \n");
                    this.editor.insert("    scanf(\"%d %d\", &nota1, &nota2); \n");
                    this.editor.insert("    notaMinima = 7; \n");
                    this.editor.insert("    notaExame = 5; \n");
                    this.editor.insert("    notaFinal1 = (nota1 + nota2) / 2; \n");
                    this.editor.insert("     \n");
                    this.editor.insert("    /*A média para aprovação é 7 \n");
                    this.editor.insert("    Caso a nota seja maior do que 7, foi aprovado, caso contrário não*/ \n");
                    this.editor.insert("    if (notaFinal1 < notaMinima) { \n");
                    this.editor.insert("        printf(\"Que pena, reprovou!\"); \n");
                    this.editor.insert("         \n");
                    this.editor.insert("        float indiceAbaixo; \n");
                    this.editor.insert("        indiceAbaixo = notaFinal1 * 100 / notaMinima - 100; \n");
                    this.editor.insert("         \n");
                    this.editor.insert("        printf(\"Sua nota foi %f , %.4f % abaixo de %f . \", notaFinal1, indiceAbaixo, notaMinima); \n");
                    this.editor.insert("        if (notaFinal1 > notaExame) {  \n");
                    this.editor.insert("            printf(\"Pelo menos vai para exame, ufa\");  \n");
                    this.editor.insert("        } else { \n");
                    this.editor.insert("            printf(\"Nem exame\"); \n");
                    this.editor.insert("            if (notaFinal1 <= 0){ \n");
                    this.editor.insert("                printf(\"Sabe nada\"); \n");
                    this.editor.insert("            } \n");
                    this.editor.insert("        }           \n");
                    this.editor.insert("         \n");
                    this.editor.insert("    } else { \n");
                    this.editor.insert("        printf(\"Que legal, você passou!\"); \n");
                    this.editor.insert("         \n");
                    this.editor.insert("        float indiceAcima; \n");
                    this.editor.insert("        indiceAcima = notaFinal1 * 100 / notaMinima - 100; \n");
                    this.editor.insert("         \n");
                    this.editor.insert("        printf(\"Sua nota foi %f , %.4f % acima de %f . \", notaFinal1, indiceAcima, notaMinima); \n");
                    this.editor.insert("        if (notaFinal1 >= 10){ \n");
                    this.editor.insert("            printf(\"Você é o cara\"); \n");
                    this.editor.insert("        } else { \n");
                    this.editor.insert("            printf(\"Quase lá\");  \n");
                    this.editor.insert("        }                 \n");
                    this.editor.insert("    } \n");
                    this.editor.insert("     \n");
                    this.editor.insert("    printf(\"Bye-bye\"); \n");
                    this.editor.insert("     \n");
                    this.editor.insert("} \n");
                    break;
                }
            case 2:
                {
                    this.editor.insert("int main(){ \n");
                    this.editor.insert("    int inicio, fim;\n");
                    this.editor.insert("    inicio = 1;\n");
                    this.editor.insert("    fim = 10;\n");
                    this.editor.insert("    inicio++;\n");
                    this.editor.insert("    printf(\"Vamos contar de %d até %d\", &inicio, &fim);\n");
                    this.editor.insert("    for (inicio = 5; inicio <= fim; inicio++){\n");
                    this.editor.insert("        printf(\"Contando: %d\", &inicio);\n");
                    this.editor.insert("    }\n");
                    this.editor.insert("    printf(\"Falou, valeu\");\n");
                    this.editor.insert("}");
                    break;
                }

            case 3:
                {
                    this.editor.insert("int main(){\n");
                    this.editor.insert("    int iCount;\n");
                    this.editor.insert("    float notaFinal, nota1, nota2, notaMinima;\n");
                    this.editor.insert("    notaMinima = 5;\n");
                    this.editor.insert("    \n");
                    this.editor.insert("    for (iCount = 0; notaFinal < notaMinima; iCount++){\n");
                    this.editor.insert("        printf(\"Vamos lá para a %d ª tentativa\", &iCount);\n");
                    this.editor.insert("        scanf(\"%f %f\", &nota1, &nota2);\n");
                    this.editor.insert("        notaFinal = (nota1 + nota2) / 2;\n");
                    this.editor.insert("        \n");
                    this.editor.insert("        if (notaFinal < notaMinima)\n");
                    this.editor.insert("            printf(\"Reprovado com nota %.2f\", &notaFinal);\n");
                    this.editor.insert("        \n");
                    this.editor.insert("    }\n");
                    this.editor.insert("    \n");
                    this.editor.insert("    printf(\"Parabéns, aprovado após a %d tentativa. Nota: %.2f\", &iCount, &notaFinal);\n");
                    this.editor.insert("\n");
                    this.editor.insert("}    ");
                    break;
                }
        }

        this.codePanel.focus();
        this.editor.gotoLine(this.editor.session.getLength());
    }

    private execute(debug: boolean = false): void {

        ( < HTMLInputElement > document.getElementById("txtOutput")).value = "";

        // Cria a classe responsável por separar as palavras
        wordsSpliter = new WordsSpliter();

        // Cria a classe responsável por identificar os tokens
        tokenIdentifier = new TokenIdentifier();

        // Recebe o código
        var txtCode = this.editor.getValue();

        // Recebe o painel de visualização
        this.txtPanel = ( < HTMLInputElement > document.getElementById("txtPanel"));

        var tokens;
        tokens = Library.newMatriz(1, 2);
        /*  ===================================
            Exemplo - Como manipular uma matriz
            ===================================
            tokens = newMatriz(1, 2);
            alert(showMatriz(tokens, true));
            assembler.push([valor1, valor2]);
            assembler[indice1][indice2]
            ===================================
        */

        //Separa em linhas o código todo
        this.lstCodeLine = ("\n" + txtCode + " ").split("\n");

        this.iLine = 0;

        this.lstPairsKey = Library.newMatriz(1, 3);

        this.lstIfElseControl = Library.newMatriz(1, 3);
        this.lstForControl = Library.newMatriz(1, 3);

        this.executeNextStatement = true;

        this.bModifiedProgramControl = false;

        this.arrTokens = Library.newMatriz(1, 2);

        this.bLastIfResult = null;

        //Cria uma lista com todas as palavras de todas as linhas
        this.lstWords = Library.newMatriz(1, 2);

        for (var iCount = 0; iCount < this.lstCodeLine.length; iCount++) {
            //Separa a linha em palavras
            var words: Array < string > = wordsSpliter.separateInWords(this.lstCodeLine[iCount] + " ");

            //Retira os comentários
            words = tokenIdentifier.treatCode(words);

            //Insere a linha com as devidas palavras já separadas no array de palavras
            this.lstWords.push([iCount, words]);
        }

        if (debug) {
            this.editor.setReadOnly(true);
            this.enable("#btnDebug", false);
            this.enable("#btnExecute", false);
            this.enable("#btnNextStatement", true);
            this.enable(".ace_scroller", false);
            this.editor.gotoLine(1);
        } else
            this.executeAll();

    }

    private executeDebug() {

        if (this.iLine + 1 < this.lstCodeLine.length) {
            this.goToNextLine();
        } else {
            this.editor.setReadOnly(false);
            this.enable("#btnDebug", true);
            this.enable("#btnExecute", true);
            this.enable("#btnNextStatement", false);
            this.editor.gotoLine(1);
        }
    }

    public goToNextLine() {

        if (this.bModifiedProgramControl)
            this.bModifiedProgramControl = false;
        else
            this.iLine++;

        this.editor.gotoLine(this.iLine);
        this.executeLine(this.iLine);


    }

    private executeAll() {
        //Vai linha por linha separando as palavras
        while (this.iLine + 1 < this.lstCodeLine.length) {
            this.goToNextLine();
        }
    }

    private executeLine(lineNumber: number) {

        var tokens: any = tokenIdentifier.identifyTokens(this.lstWords[lineNumber][TokenIdentifier.INDEX_LINE_WORDS_WORDS], this, lineNumber);
        tokenIdentifier.setValueToVariable();

        if (tokens.length > 0) {
            this.arrTokens.push([lineNumber, tokens]);
            console.log("Linha " + (this.arrTokens[this.arrTokens.length - 1][0]) + "\n" + Library.showMatriz(this.arrTokens[this.arrTokens.length - 1][1], true) + "\n\n");
        }

    }
}