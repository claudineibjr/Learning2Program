//Classes que serão executadas a partir desta
var tokenIdentifier, wordsSpliter;
var ace;
var editor;
var codePanel;
//Array que contém o código todo separado linha por linha
var strLine;
//Variável que contem o painel à direita
var txtPanel;
//Variável que contem a linha que está sendo lida
var iLine;
function onLoad() {
    codePanel = document.getElementById("txtCode");
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
    //Seta o exemplo
    setExample(1);
    //Desabilita o botão de próximo
    enable("#btnNextStatement", false);
    //Cria os atalhos
    createShortcutCommands();
}
function createShortcutCommands() {
    //Cria os atalhos
    editor.commands.addCommand({
        name: 'Execute',
        bindKey: { win: 'F5', mac: 'Command-1' },
        exec: function (editor) {
            $('#btnExecute').trigger('click');
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'Debug',
        bindKey: { win: 'Shift-F5', mac: 'Command-3' },
        exec: function (editor) {
            $('#btnDebug').trigger('click');
        },
        readOnly: true
    });
    editor.commands.addCommand({
        name: 'Next',
        bindKey: { win: 'F10', mac: 'Command-3' },
        exec: function (editor) {
            $('#btnNextStatement').trigger('click');
        },
        readOnly: true
    });
}
function enable(elementName, enable) {
    $(elementName).attr('disabled', !enable);
}
function setExample(numberExample) {
    switch (numberExample) {
        case 1: {
            editor.insert("int main(){\n");
            editor.insert("     printf(\"Seja bem-vindo à calculadora de média final\");\n");
            editor.insert("     float nota1, nota2;\n");
            editor.insert("     float notaFinal1;\n");
            editor.insert("     scanf(\"%f\", &nota1);\n");
            editor.insert("     scanf(\"%f\", &nota2);\n");
            editor.insert("     notaFinal1 = (nota1 + nota2) / 2;\n");
            editor.insert("\n");
            editor.insert("     /*A média para aprovação é 7\n");
            editor.insert("         Caso a nota seja maior do que 7, foi aprovado, caso contrário não*/\n");
            editor.insert("     if (notaFinal1 >= 7)\n");
            editor.insert("         printf(\"A primeira nota foi: %f . A segunda nota foi: %f . Aprovado com nota %f .\", nota1, nota2, notaFinal1);\n");
            editor.insert("     else\n");
            editor.insert("         printf(\"A primeira nota foi: %f . A segunda nota foi: %f . Reprovado com nota %f .\", nota1, nota2, notaFinal1);\n");
            editor.insert("}");
            break;
        }
    }
    codePanel.focus();
    editor.gotoLine(editor.session.getLength());
}
function execute(debug) {
    if (debug === void 0) { debug = false; }
    // Cria a classe responsável por separar as palavras
    wordsSpliter = new WordsSpliter();
    // Cria a classe responsável por identificar os tokens
    tokenIdentifier = new TokenIdentifier();
    // Recebe o código
    var txtCode = editor.getValue();
    // Recebe o painel de visualização
    txtPanel = document.getElementById("txtPanel");
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
    strLine = (txtCode + " ").split("\n");
    iLine = 0;
    if (debug) {
        editor.setReadOnly(true);
        enable("#btnDebug", false);
        enable("#btnExecute", false);
        enable("#btnNextStatement", true);
        enable(".ace_scroller", false);
        editor.gotoLine(1);
    }
    else
        executeAll();
    console.log(tokenIdentifier.getVariables());
}
function executeDebug() {
    if (iLine + 1 < strLine.length) {
        editor.gotoLine(iLine + 2);
        executeLine(iLine);
        iLine++;
    }
    else {
        editor.setReadOnly(false);
        enable("#btnDebug", true);
        enable("#btnExecute", true);
        enable("#btnNextStatement", false);
        editor.gotoLine(1);
    }
}
function executeAll() {
    //Vai linha por linha separando as palavras
    for (iLine = 0; iLine < strLine.length; iLine++) {
        executeLine(iLine);
    }
}
function executeLine(lineNumber) {
    var words = wordsSpliter.separateInWords(strLine[lineNumber] + " ");
    var tokens = tokenIdentifier.identifyTokens(words);
    tokenIdentifier.setValueToVariable();
    if (tokens.length > 0)
        txtPanel.value += "Linha " + (lineNumber + 1) + "\n" + showMatriz(tokens, true) + "\n\n";
}
