var tokenIdentifier, wordsSpliter;
var ace;

var editor;
var codePanel: HTMLDivElement;

var strLine: Array<string>;

var txtPanel: HTMLInputElement;

var iLine: number;

var btnExecute: HTMLButtonElement, btnDebug: HTMLButtonElement, btnNext: HTMLButtonElement;

function onLoad(): void {

    codePanel = ( <HTMLDivElement> document.getElementById("txtCode"));
 
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

    btnExecute = (<HTMLButtonElement> document.getElementById("btnExecute"));
    btnDebug = (<HTMLButtonElement> document.getElementById("btnDebug"));
    btnNext = (<HTMLButtonElement> document.getElementById("btnNextStatement"));
    enable("btnNextStatement", false);

}

function enable(elementName: string, enable: boolean){
    (<HTMLButtonElement> document.getElementById(elementName)).disabled = !enable;
}

function setExample(numberExample): void{
	switch(numberExample){
		case 1: { 
            //editor.insert("// Função de exemplo\n");
            editor.insert("int main(){\n");
            editor.insert("     float nota1, nota2;\n");
            editor.insert("     float notaFinal1;\n");
            editor.insert("     nota1 = (10 + 4) / 2;\n");
            editor.insert("     nota2 = (8 + 7) / 2;\n");
            editor.insert("     notaFinal1 = (nota1 + nota2) / 2;\n");
            editor.insert("\n");
            editor.insert("     /*A média para aprovação é 7\n");
            editor.insert("         Caso a nota seja maior do que 7, foi aprovado, caso contrário não*/\n");
            editor.insert("     if (notaFinal1 >= 7)\n");
            editor.insert("         printf(\"Aprovado com nota %d .\", notaFinal1);\n");
            editor.insert("     else\n");
            editor.insert("         printf(\"Reprovado com nota %d .\", notaFinal1);\n");
            editor.insert("}");
        break; }
    }
    
    codePanel.focus();
    editor.gotoLine(editor.session.getLength());
}

function execute(debug: boolean = false): void{

    // Cria a classe responsável por separar as palavras
    wordsSpliter = new WordsSpliter();
    
    // Cria a classe responsável por identificar os tokens
    tokenIdentifier = new TokenIdentifier(); 

    // Recebe o código
    var txtCode = editor.getValue();
    
    // Recebe o painel de visualização
    txtPanel = ( <HTMLInputElement> document.getElementById("txtPanel") );

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

    if (debug){
        editor.setReadOnly(true);
        enable("btnDebug", false);
        enable("btnExecute", false);
        enable("btnNextStatement", true);
        editor.gotoLine(1);
    }
    else
        executeAll();


    console.log(tokenIdentifier.getVariables());
}

function executeDebug(){

    if (iLine + 1 < strLine.length){
        editor.gotoLine(iLine + 2);
        executeLine(iLine);
        iLine++;
    }else{
        editor.setReadOnly(false);
        enable("btnDebug", true);
        enable("btnExecute", true);
        enable("btnNextStatement", false);
        editor.gotoLine(1);  
    }
}

function executeAll(){
    //Vai linha por linha separando as palavras
    for (iLine = 0; iLine < strLine.length; iLine++){
        executeLine(iLine);
    }
}

function executeLine(lineNumber: number){

    var words: Array<string> = wordsSpliter.separateInWords(strLine[lineNumber] + " ");
    var tokens: any = tokenIdentifier.identifyTokens(words);
    tokenIdentifier.setValueToVariable();

    if (tokens.length > 0)
        txtPanel.value += "Linha " + (lineNumber + 1) + "\n" + showMatriz(tokens, true) + "\n\n";

}