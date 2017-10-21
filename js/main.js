var tokenIdentifier, wordsSpliter;
var ace;
<<<<<<< HEAD
var editor;
var codePanel;
function onLoad() {
    var codePanel = document.getElementById("txtCode");
    // Cria a classe responsável por separar as palavras
    wordsSpliter = new WordsSpliter();
    // Cria a classe responsável por identificar os tokens
    tokenIdentifier = new TokenIdentifier();
    // Cria o editor de código
    editor = ace.edit("txtCode");
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/c_cpp");
    // Cria uma barra de status
    var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
    var statusBar = new StatusBar(editor, document.getElementById("statusBar"));
    // Seta algumas opções do editor de texto
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    setExample(1);
}
function setExample(numberExample) {
    switch (numberExample) {
        case 1: {
            editor.insert("// Função de exemplo\n");
            editor.insert("int main(){\n");
            editor.insert("     int nota1,nota2;\n");
            editor.insert("     float notaFinal1;\n");
            editor.insert("     notaFinal1=(nota1+nota2)/2;\n");
            editor.insert("\n");
            editor.insert("     /*A média para aprovação é 7\n");
            editor.insert("         Caso a nota seja maior do que 7, foi aprovado, caso contrário não*/\n");
            editor.insert("     if (notaFinal1 >= 7)\n");
            editor.insert("         printf(\"Aprovado com nota %d.\");\n");
            editor.insert("     else\n");
            editor.insert("         printf(\"Reprovado com nota %d.\");\n");
            editor.insert("}");
            break;
=======
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
                this.editor.insert("     float notaFinal1;\n");
                this.editor.insert("     scanf(\"%d\", &nota1);\n");
                this.editor.insert("     scanf(\"%d\", &nota2);\n");
                this.editor.insert("     notaFinal1 = (nota1 + nota2) / 2;\n");
                this.editor.insert("\n");
                this.editor.insert("     /*A média para aprovação é 7\n");
                this.editor.insert("         Caso a nota seja maior do que 7, foi aprovado, caso contrário não*/\n");
                this.editor.insert("     if (notaFinal1 > 6)\n");
                this.editor.insert("         printf(\"A primeira nota foi: %d . A segunda nota foi: %d . Aprovado com nota %f .\", nota1, nota2, notaFinal1);\n");
                this.editor.insert("     else\n");
                this.editor.insert("         printf(\"A primeira nota foi: %d . A segunda nota foi: %d . Reprovado com nota %f .\", nota1, nota2, notaFinal1);\n");
                this.editor.insert("}");
                break;
            }
>>>>>>> 376fb70... Conseguindo separar em dois valores dentro do if
        }
    }
    codePanel.focus();
    editor.gotoLine(editor.session.getLength());
}
function execute() {
    // Recebe o código
    var txtCode = editor.getValue();
    // Recebe o painel de visualização
    var txtPanel = document.getElementById("txtPanel");
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
    var strLine = (txtCode + " ").split("\n");
    //Vai linha por linha separando as palavras
    for (var iLine = 0; iLine < strLine.length; iLine++) {
        var words = wordsSpliter.separateInWords(strLine[iLine] + " ");
        var tokens = tokenIdentifier.identifyTokens(words);
        if (tokens.length > 0)
            txtPanel.value += "Linha " + (iLine + 1) + "\n" + showMatriz(tokens, true) + "\n\n";
    }
}
