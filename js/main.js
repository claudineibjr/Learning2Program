var tokenIdentifier, wordsSpliter;
var ace;
var editor;
var codePanel;
function onLoad() {
    codePanel = document.getElementById("txtCode");
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
            //editor.insert("// Função de exemplo\n");
            editor.insert("int main(){\n");
            //editor.insert("     int nota1,nota2;\n");
            //editor.insert("     float notaFinal1, notaFinal2;\n");
            editor.insert("     float notaFinal2;\n");
            //editor.insert("     notaFinal1=(nota1+nota2)/2;\n");
            //editor.insert("     notaFinal1++;\n");
            //editor.insert("     notaFinal1--;\n");
            //editor.insert("     notaFinal1+= 5;\n");
            //editor.insert("     notaFinal2 = 10 * 3;\n");
            editor.insert("     notaFinal2 = (10 * 3 + 5 - 4 * (5 + 2) * 2 / 4) * 10;\n");
            //editor.insert("     notaFinal1 = notaFinal2;\n");
            //editor.insert("\n");
            //editor.insert("     /*A média para aprovação é 7\n");
            //editor.insert("         Caso a nota seja maior do que 7, foi aprovado, caso contrário não*/\n");
            //editor.insert("     if (notaFinal1 >= 7)\n");
            //editor.insert("         printf(\"Aprovado com nota %d .\", notaFinal1);\n");
            //editor.insert("     else\n");
            //editor.insert("         printf(\"Reprovado com nota %d .\", notaFinal1);\n");
            editor.insert("}");
            break;
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
        tokenIdentifier.setValueToVariable();
        if (tokens.length > 0)
            txtPanel.value += "Linha " + (iLine + 1) + "\n" + showMatriz(tokens, true) + "\n\n";
    }
    console.log(tokenIdentifier.getVariables());
}
