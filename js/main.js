function onLoad() {
}
function setExample(numberExample) {
    var readyExample1 = new Array();
    readyExample1.push("int nota1,nota2;");
    readyExample1.push("float notaFinal;");
    readyExample1.push("notaFinal1=(nota1+nota2)/2;");
    var codePanel = document.getElementById("txtCode");
    switch (numberExample) {
        case 1: {
            codePanel.value = showMatriz(readyExample1, false);
            break;
        }
    }
    codePanel.focus();
}
function execute() {
    // Recebe o painel de escrita
    var txtCode = document.getElementById("txtCode");
    // Recebe o painel de visualização
    var txtPanel = document.getElementById("txtPanel");
    var tokens;
    tokens = newMatriz(1, 2);
    /*  ===================================
        Exemplo - Como manipular uma matriz
        ===================================
        alert(showMatriz(tokens, true));
        assembler.push([valor1, valor2]);
        assembler[indice1][indice2]
        ===================================
    */
    //Separa em linhas o código todo
    var strLine = (txtCode.value + " ").split("\n");
    //Vai linha por linha separando as palavras
    for (var iLine = 0; iLine < strLine.length; iLine++) {
        var words = separateInWords(strLine[iLine] + " ");
        var tokens = identifyTokens(words);
        txtPanel.value += "Linha " + iLine + "\n" + showMatriz(tokens, true) + "\n\n";
    }
}
