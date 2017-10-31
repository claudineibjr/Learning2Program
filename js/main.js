//Classes que serão executadas a partir desta
var tokenIdentifier;
var wordsSpliter;
var ace;
var Main = (function () {
    function Main() {
        this.codePanel = document.getElementById("txtCode");
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
        //Seta o exemplo
        this.setExample(1);
        //Desabilita o botão de próximo
        this.enable("#btnNextStatement", false);
        //Cria os atalhos
        this.createShortcutCommands();
    }
    Main.prototype.createShortcutCommands = function () {
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
    };
    Main.prototype.enable = function (elementName, enable) {
        $(elementName).attr('disabled', !enable);
    };
    Main.prototype.setExample = function (numberExample) {
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
        }
        this.codePanel.focus();
        this.editor.gotoLine(this.editor.session.getLength());
    };
    Main.prototype.execute = function (debug) {
        if (debug === void 0) { debug = false; }
        document.getElementById("txtOutput").value = "";
        // Cria a classe responsável por separar as palavras
        wordsSpliter = new WordsSpliter();
        // Cria a classe responsável por identificar os tokens
        tokenIdentifier = new TokenIdentifier();
        // Recebe o código
        var txtCode = this.editor.getValue();
        // Recebe o painel de visualização
        this.txtPanel = document.getElementById("txtPanel");
        var tokens;
        tokens = newMatriz(1, 2);
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
        this.lstPairsKey = newMatriz(1, 3);
        this.lstIfElseControl = newMatriz(1, 3);
        this.executeNextStatement = true;
        this.bModifiedProgramControl = false;
        this.arrTokens = newMatriz(1, 2);
        this.bLastIfResult = null;
        //Cria uma lista com todas as palavras de todas as linhas
        this.lstWords = newMatriz(1, 2);
        for (var iCount = 0; iCount < this.lstCodeLine.length; iCount++) {
            //Separa a linha em palavras
            var words = wordsSpliter.separateInWords(this.lstCodeLine[iCount] + " ");
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
        }
        else
            this.executeAll();
    };
    Main.prototype.executeDebug = function () {
        if (this.iLine + 1 < this.lstCodeLine.length) {
            this.goToNextLine();
        }
        else {
            this.editor.setReadOnly(false);
            this.enable("#btnDebug", true);
            this.enable("#btnExecute", true);
            this.enable("#btnNextStatement", false);
            this.editor.gotoLine(1);
        }
    };
    Main.prototype.goToNextLine = function () {
        if (this.bModifiedProgramControl)
            this.bModifiedProgramControl = false;
        else
            this.iLine++;
        this.editor.gotoLine(this.iLine);
        this.executeLine(this.iLine);
    };
    Main.prototype.executeAll = function () {
        //Vai linha por linha separando as palavras
        while (this.iLine + 1 < this.lstCodeLine.length) {
            this.goToNextLine();
        }
    };
    Main.prototype.executeLine = function (lineNumber) {
        var tokens = tokenIdentifier.identifyTokens(this.lstWords[lineNumber][TokenIdentifier.INDEX_LINE_WORDS_WORDS], this, lineNumber);
        tokenIdentifier.setValueToVariable();
        if (tokens.length > 0) {
            this.arrTokens.push([lineNumber, tokens]);
            console.log("Linha " + (this.arrTokens[this.arrTokens.length - 1][0]) + "\n" + showMatriz(this.arrTokens[this.arrTokens.length - 1][1], true) + "\n\n");
        }
    };
    return Main;
}());
