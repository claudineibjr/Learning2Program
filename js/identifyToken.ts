class TokenIdentifier {
    
    private STRING                      = "STRING";
    private PRINTF                      = "PRINTF";
    private SCANF                       = "SCANF";
    private BIBLIOTECA                  = "INCLUDE";
    private VARIAVEL                    = "VARIÁVEL";
    private TIPO_INT                    = "TIPO INTEIRO";
    private TIPO_FLOAT                  = "TIPO FLOAT";
    private ATRIBUICAO                  = "ATRIBUIÇÃO DE VALOR";
    private OP_SOMA                     = "OPERAÇÃO DE SOMA";
    private OP_SUBTRACAO                = "OPERAÇÃO DE SUBSTRAÇÃO";
    private OP_MULTIPLICACAO            = "OPERAÇÃO DE MULTIPLICAÇÃO";
    private OP_DIVISAO                  = "OPERAÇÃO DE DIVISÃO";
    private VIRGULA                     = "VÍRGULA";
    private PARENTESES_ABRE             = "ABRE PARÊNTESES";
    private PARENTESES_FECHA            = "FECHA PARÊNTESES";
    private DELIMITADOR_DE_LINHA        = "PONTO E VÍRGULA";
    private NUMERAL_INTEIRO             = "NÚMERO INTEIRO";
    private NUMERAL_PONTO_FLUTUANTE     = "NÚMERO PONTO FLUTUANTE";
    private CHAVES_ABRE                 = "ABRE CHAVES";
    private CHAVES_FECHA                = "FECHA CHAVES";

    private variables;

    constructor(){
        
        this.variables = newMatriz(1,2);

    }

    public identifyTokens(line: Array<string>): any[]{
        
        //Cria uma matriz que conterá a palavra e sua identificação
        var tokens = newMatriz(1,2);

        var variableType: string = "";   // string | int | float

        //Para cada palava da linha verifica o token correspondente
        line.forEach(strWord => {
            var token: string = "";

            //console.log(strWord);

            //Identifica o devido token para esta linha
            switch (strWord) {
                case "printf":  token = this.PRINTF;                break;
                case "scanf":   token = this.SCANF;                 break;
                case "include": token = "";                         break;
                case "int":     token = this.TIPO_INT;              variableType = this.TIPO_INT;    break;
                case "float":   token = this.TIPO_FLOAT;            variableType = this.TIPO_FLOAT;  break;
                case "=":       token = this.ATRIBUICAO;            break;
                case "+":       token = this.OP_SOMA;               break;
                case "-":       token = this.OP_SUBTRACAO;          break;
                case "*":       token = this.OP_MULTIPLICACAO;      break;
                case "/":       token = this.OP_DIVISAO;            break;
                case ",":       token = this.VIRGULA;               break;
                case "(":       token = this.PARENTESES_ABRE;       break;
                case ")":       token = this.PARENTESES_FECHA;      break;
                case ";":       token = this.DELIMITADOR_DE_LINHA;  break;
                case "{":       token = this.CHAVES_ABRE;           break;
                case "}":       token = this.CHAVES_FECHA;          break;
                
                default:{
                    token = this.VARIAVEL;
                    
                    //Caso for uma variável verifica se ela já foi identificada
                    this.identifyVariable(strWord, variableType);
                    break;
                }
            }

            tokens.push([strWord, token]);

        });

        return tokens;
    }

    private identifyVariable(variable: string, variableType: string){
        var alreadyInserted: boolean = false;
        
        /*variables.forEach(strVariable => {
            if (variable === strVariable)
                alreadyInserted = true;

        });*/

        //if (!alreadyInserted){
        if (variableType != ""){
            this.variables.push([variable, variableType]);
        }
    }

    public getVariables(){
        return this.variables;
    }

}