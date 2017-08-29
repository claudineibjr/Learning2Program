const STRING                    = "STRING";
const PRINTF                    = "PRINTF";
const SCANF                     = "SCANF";
const BIBLIOTECA                = "INCLUDE";
const VARIAVEL                  = "VARIÁVEL";
const TIPO_INT                  = "TIPO INTEIRO";
const TIPO_FLOAT                = "TIPO FLOAT";
const ATRIBUICAO                = "ATRIBUIÇÃO DE VALOR";
const OP_SOMA                   = "OPERAÇÃO DE SOMA";
const OP_SUBTRACAO              = "OPERAÇÃO DE SUBSTRAÇÃO";
const OP_MULTIPLICACAO          = "OPERAÇÃO DE MULTIPLICAÇÃO";
const OP_DIVISAO                = "OPERAÇÃO DE DIVISÃO";
const VIRGULA                   = "VÍRGULA";
const PARENTESES_ABRE           = "ABRE PARÊNTESES";
const PARENTESES_FECHA          = "FECHA PARÊNTESES";
const DELIMITADOR_DE_LINHA      = "PONTO E VÍRGULA";

function identifyTokens(line: Array<string>): any[]{
    var tokens = newMatriz(1,2);

    line.forEach(strWord => {
        console.log(strWord);

        var token: string = identifySpecificToken(strWord);
        tokens.push([strWord, token]);

    });

    return tokens;
}

function identifySpecificToken(strWord: string): string{
    
    var token: string;

    switch (strWord) {
        case "printf":  token = PRINTF;                 break;
        case "scanf":   token = SCANF;                  break;
        case "include": token = "";                     break;
        case "int":     token = TIPO_INT;               break;
        case "float":   token = TIPO_FLOAT;             break;
        case "=":       token = ATRIBUICAO;             break;
        case "+":       token = OP_SOMA;                break;
        case "-":       token = OP_SUBTRACAO;           break;
        case "*":       token = OP_MULTIPLICACAO;       break;
        case "/":       token = OP_DIVISAO;             break;
        case ",":       token = VIRGULA;                break;
        case "(":       token = PARENTESES_ABRE;        break;
        case ")":       token = PARENTESES_FECHA;       break;
        case ";":       token = DELIMITADOR_DE_LINHA;   break;
        
        default:        token = VARIAVEL;               break;
    }

    return token;

}