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
    var strCode: string = ( <HTMLInputElement> document.getElementById("txtCode")).value;

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

    strCode = separateInWords(strCode + " ");

}
