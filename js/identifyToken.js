var STRING = "STRING";
var PRINTF = "PRINTF";
var SCANF = "SCANF";
var BIBLIOTECA = "INCLUDE";
var VARIAVEL = "VARIÁVEL";
var TIPO_INT = "TIPO INTEIRO";
var TIPO_FLOAT = "TIPO FLOAT";
var ATRIBUICAO = "ATRIBUIÇÃO DE VALOR";
var OP_SOMA = "OPERAÇÃO DE SOMA";
var OP_SUBTRACAO = "OPERAÇÃO DE SUBSTRAÇÃO";
var OP_MULTIPLICACAO = "OPERAÇÃO DE MULTIPLICAÇÃO";
var OP_DIVISAO = "OPERAÇÃO DE DIVISÃO";
var VIRGULA = "VÍRGULA";
var PARENTESES_ABRE = "ABRE PARÊNTESES";
var PARENTESES_FECHA = "FECHA PARÊNTESES";
var DELIMITADOR_DE_LINHA = "PONTO E VÍRGULA";
function identifyTokens(line) {
    var tokens = newMatriz(1, 2);
    line.forEach(function (strWord) {
        console.log(strWord);
        var token = "";
        switch (strWord) {
            case "printf":
                token = PRINTF;
                break;
            case "scanf":
                token = SCANF;
                break;
            case "include":
                token = "";
                break;
            case "int":
                token = TIPO_INT;
                break;
            case "float":
                token = TIPO_FLOAT;
                break;
            case "=":
                token = ATRIBUICAO;
                break;
            case "+":
                token = OP_SOMA;
                break;
            case "-":
                token = OP_SUBTRACAO;
                break;
            case "*":
                token = OP_MULTIPLICACAO;
                break;
            case "/":
                token = OP_DIVISAO;
                break;
            case ",":
                token = VIRGULA;
                break;
            case "(":
                token = PARENTESES_ABRE;
                break;
            case ")":
                token = PARENTESES_FECHA;
                break;
            case ";":
                token = DELIMITADOR_DE_LINHA;
                break;
            default:
                token = VARIAVEL;
                break;
        }
        tokens.push([strWord, token]);
    });
    return tokens;
}
