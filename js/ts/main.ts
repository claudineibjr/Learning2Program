function onLoad(): void {
}

function setExample(numberExample): void{
    var readyExample1 = new Array();
    readyExample1.push("int nota1,nota2;");
    readyExample1.push("float notaFinal;");
    readyExample1.push("notaFinal1=(nota1+nota2)/2;");

    var codePanel: HTMLInputElement = ( <HTMLInputElement> document.getElementById("txtCode"));

	switch(numberExample){
		case 1: { codePanel.value = showMatriz(readyExample1, false);	break; }
    }
    
    codePanel.focus();

}

function execute(): void{
    // Recebe o painel de escrita
    var txtCode: HTMLInputElement = ( <HTMLInputElement> document.getElementById("txtCode"));
    
    // Recebe o painel de visualização
    var txtPanel: HTMLInputElement = ( <HTMLInputElement> document.getElementById("txtPanel") );


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
    var strLine: Array<string> = (txtCode.value + " ").split("\n");   

    //Vai linha por linha separando as palavras
    for (var iLine: number = 0; iLine < strLine.length; iLine++){
        var words: Array<string> = separateInWords(strLine[iLine] + " ");
        var tokens: any[] = identifyTokens(words);
        txtPanel.value += "Linha " + iLine + "\n" + showMatriz(tokens, true) + "\n";
    }
}
