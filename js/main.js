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
            bindKey: { win: 'F5', mac: 'Command-1' },
            exec: function (editor) {
                $('#btnExecute').trigger('click');
            },
            readOnly: true
        });
        this.editor.commands.addCommand({
            name: 'Debug',
            bindKey: { win: 'Shift-F5', mac: 'Command-3' },
            exec: function (editor) {
                $('#btnDebug').trigger('click');
            },
            readOnly: true
        });
        this.editor.commands.addCommand({
            name: 'Next',
            bindKey: { win: 'F10', mac: 'Command-3' },
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
            case 1: {
                this.editor.insert("int main(){\n");
                this.editor.insert("     printf(\"Seja bem-vindo à calculadora de média final\");\n");
                this.editor.insert("     int nota1, nota2;\n");
                this.editor.insert("     float notaFinal1, notaMinima;\n");
                this.editor.insert("     scanf(\"%d\", &nota1);\n");
                this.editor.insert("     scanf(\"%d\", &nota2);\n");
                this.editor.insert("     notaMinima = 7;\n");
                this.editor.insert("     notaFinal1 = (nota1 + nota2) / 2;\n");
                this.editor.insert("\n");
                this.editor.insert("     /*A média para aprovação é 7\n");
                this.editor.insert("         Caso a nota seja maior do que 7, foi aprovado, caso contrário não*/\n");
                this.editor.insert("     if (notaFinal1 >= notaMinima)\n");
                this.editor.insert("         printf(\"A primeira nota foi: %d . A segunda nota foi: %d . Aprovado com nota %f .\", nota1, nota2, notaFinal1);\n");
                this.editor.insert("     else\n");
                this.editor.insert("         printf(\"A primeira nota foi: %d . A segunda nota foi: %d . Reprovado com nota %f .\", nota1, nota2, notaFinal1);\n");
                this.editor.insert("}");
                break;
            }
        }
        this.codePanel.focus();
        this.editor.gotoLine(this.editor.session.getLength());
    };
    Main.prototype.execute = function (debug) {
        if (debug === void 0) { debug = false; }
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
        this.strLine = (txtCode + " ").split("\n");
        this.iLine = 0;
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
        if (this.iLine + 1 < this.strLine.length) {
            this.editor.gotoLine(this.iLine + 2);
            console.log("A|Linha: " + Number(this.iLine + 1));
            this.executeLine(this.iLine);
            console.log("D|Linha: " + Number(this.iLine + 1));
            this.iLine++;
        }
        else {
            this.editor.setReadOnly(false);
            this.enable("#btnDebug", true);
            this.enable("#btnExecute", true);
            this.enable("#btnNextStatement", false);
            this.editor.gotoLine(1);
        }
    };
    Main.prototype.executeAll = function () {
        //Vai linha por linha separando as palavras
        for (this.iLine = 0; this.iLine < this.strLine.length; this.iLine++) {
            this.executeLine(this.iLine);
        }
    };
    Main.prototype.executeLine = function (lineNumber) {
        //console.log("Linha: " + lineNumber + "\t" + this.strLine[lineNumber]);
        var words = wordsSpliter.separateInWords(this.strLine[lineNumber] + " ");
        var tokens = tokenIdentifier.identifyTokens(words, this);
        tokenIdentifier.setValueToVariable();
        if (tokens.length > 0)
            this.txtPanel.value += "Linha " + (lineNumber + 1) + "\n" + showMatriz(tokens, true) + "\n\n";
    };
    return Main;
}());
