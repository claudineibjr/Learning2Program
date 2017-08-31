var tokenIdentifier, wordsSpliter;
var ace;

var editor;
var codePanel: HTMLDivElement = ( <HTMLDivElement> document.getElementById("txtCode"));

function onLoad(): void {

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

function setExample(numberExample): void{
	switch(numberExample){
		case 1: { 
            editor.insert("int main(){\n");
            editor.insert("     int nota1,nota2;\n");
            editor.insert("     float notaFinal1;\n");
            editor.insert("     notaFinal1=(nota1+nota2)/2;\n");
            editor.insert("     printf(\"A nota final foi: %d\", notaFinal1);\n");
            editor.insert("}");
        break; }
    }
    
    codePanel.focus();
    editor.gotoLine(editor.session.getLength());
}

function execute(): void{
    // Recebe o código
    var txtCode = editor.getValue();
    
    // Recebe o painel de visualização
    var txtPanel: HTMLInputElement = ( <HTMLInputElement> document.getElementById("txtPanel") );

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
    var strLine: Array<string> = (txtCode + " ").split("\n");   

    //Vai linha por linha separando as palavras
    for (var iLine: number = 0; iLine < strLine.length; iLine++){
        var words: Array<string> = wordsSpliter.separateInWords(strLine[iLine] + " ");
        var tokens: any = tokenIdentifier.identifyTokens(words);
        
        txtPanel.value += "Linha " + (iLine + 1) + "\n" + showMatriz(tokens, true) + "\n\n";
    }
}
