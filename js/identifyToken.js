var TokenIdentifier = /** @class */ (function () {
    function TokenIdentifier() {
        this.STRING = "STRING";
        //private PRINTF                      = "PRINTF";
        //private SCANF                       = "SCANF";
        this.BIBLIOTECA = "INCLUDE";
        this.VARIAVEL = "VARIÁVEL";
        this.FUNCAO_DECLARACAO = "DECLARAÇÃO DE FUNÇÃO";
        this.FUNCAO_CHAMADA = "CHAMADA DE FUNÇÃO";
        this.TIPO_INT = "TIPO INTEIRO";
        this.TIPO_INT_REPRESENTACAO = "REPRESENTAÇÃO DO TIPO INT";
        this.TIPO_FLOAT = "TIPO FLOAT";
        this.TIPO_FLOAT_REPRESENTACAO = "REPRESENTAÇÃO DO TIPO FLOAT";
        this.TIPO_VOID = "TIPO VOID";
        this.TIPO_CHAR_REPRESENTACAO = "REPRESENTAÇÃO DO TIPO FLOAT";
        this.TIPO_STRING_REPRESENTACAO = "REPRESENTAÇÃO DO TIPO STRING";
        this.ATRIBUICAO = "ATRIBUIÇÃO DE VALOR";
        this.OP_SOMA = "OPERAÇÃO DE SOMA";
        this.OP_SUBTRACAO = "OPERAÇÃO DE SUBSTRAÇÃO";
        this.OP_MULTIPLICACAO = "OPERAÇÃO DE MULTIPLICAÇÃO";
        this.OP_DIVISAO = "OPERAÇÃO DE DIVISÃO";
        this.VIRGULA = "VÍRGULA";
        this.PARENTESES_ABRE = "ABRE PARÊNTESES";
        this.PARENTESES_FECHA = "FECHA PARÊNTESES";
        this.DELIMITADOR_DE_LINHA = "PONTO E VÍRGULA";
        this.NUMERAL_INTEIRO = "NÚMERO INTEIRO";
        this.NUMERAL_PONTO_FLUTUANTE = "NÚMERO PONTO FLUTUANTE";
        this.CHAVES_ABRE = "ABRE CHAVES";
        this.CHAVES_FECHA = "FECHA CHAVES";
        this.ASPAS_SIMPLES = "ASPAS SIMPLES";
        this.ASPAS_DUPLAS = "ASPAS DUPLAS";
        this.variables = newMatriz(1, 2);
    }
    TokenIdentifier.prototype.identifyTokens = function (line) {
        var _this = this;
        //Cria uma matriz que conterá a palavra e sua identificação
        var tokens = newMatriz(1, 2);
        var variableType = ""; // string | int | float
        //Variável que será utilizada para identificar se é uma string ou não
        var bString = false;
        //Array que conterá as informações da string
        var lstString = new Array();
        //Para cada palava da linha verifica o token correspondente
        line.forEach(function (strWord) {
            var token = "";
            if (bString) {
                //token = this.STRING;
                switch (strWord) {
                    case "\"": {
                        bString = false;
                        token = _this.ASPAS_DUPLAS;
                        //Insere o texto inteiro de dentro das aspas como uma string 
                        tokens.push([showMatriz(lstString, false, " "), _this.STRING]);
                        //Zera o array de strings pois esta acabou
                        lstString = new Array();
                        break;
                    }
                    case "%d": {
                        token = _this.TIPO_INT_REPRESENTACAO;
                        lstString.push(strWord);
                        break;
                    }
                    case "%f": {
                        token = _this.TIPO_FLOAT_REPRESENTACAO;
                        lstString.push(strWord);
                        break;
                    }
                    case "%s": {
                        token = _this.TIPO_STRING_REPRESENTACAO;
                        lstString.push(strWord);
                        break;
                    }
                    default: {
                        //Insere a palavra como string
                        lstString.push(strWord);
                    }
                }
            }
            else {
                //Identifica o devido token para esta linha
                switch (strWord) {
                    /*case "printf":  {
                        token = this.PRINTF;
                        break;
                    }
                        
                    case "scanf":   {
                        token = this.SCANF;
                        break;
                    }*/
                    case "include": {
                        token = "";
                        break;
                    }
                    case "int": {
                        token = _this.TIPO_INT;
                        variableType = _this.TIPO_INT;
                        break;
                    }
                    case "float": {
                        token = _this.TIPO_FLOAT;
                        variableType = _this.TIPO_FLOAT;
                        break;
                    }
                    case "void": {
                        token = _this.TIPO_VOID;
                        variableType = _this.TIPO_VOID;
                        break;
                    }
                    case "=": {
                        token = _this.ATRIBUICAO;
                        break;
                    }
                    case "+": {
                        token = _this.OP_SOMA;
                        break;
                    }
                    case "-": {
                        token = _this.OP_SUBTRACAO;
                        break;
                    }
                    case "*": {
                        token = _this.OP_MULTIPLICACAO;
                        break;
                    }
                    case "/": {
                        token = _this.OP_DIVISAO;
                        break;
                    }
                    case ",": {
                        token = _this.VIRGULA;
                        break;
                    }
                    case "(": {
                        token = _this.PARENTESES_ABRE;
                        // Verifica se é chamada ou declaração de função
                        if (tokens.length >= 2) {
                            if ((tokens[tokens.length - 2][1] == _this.TIPO_FLOAT || tokens[tokens.length - 2][1] == _this.TIPO_INT || tokens[tokens.length - 2][1] == _this.TIPO_VOID)
                                && (tokens[tokens.length - 1][1] == _this.VARIAVEL)) {
                                // Caso o ultimo token seja uma variável e o antepenultimo seja um tipo, entende-se que é uma declaração de função
                                tokens[tokens.length - 1][1] = _this.FUNCAO_DECLARACAO;
                            }
                            else {
                                // Caso o ultimo token seja uma variável, entende-se que é uma chamada de função
                                if (tokens[tokens.length - 1][1] == _this.VARIAVEL) {
                                    tokens[tokens.length - 1][1] = _this.FUNCAO_CHAMADA;
                                }
                            }
                        }
                        else {
                            if (tokens.length >= 1) {
                                // Caso o ultimo token seja uma variável, entende-se que é uma chamada de função
                                if (tokens[tokens.length - 1][1] == _this.VARIAVEL) {
                                    tokens[tokens.length - 1][1] = _this.FUNCAO_CHAMADA;
                                }
                            }
                        }
                        break;
                    }
                    case ")": {
                        token = _this.PARENTESES_FECHA;
                        break;
                    }
                    case ";": {
                        token = _this.DELIMITADOR_DE_LINHA;
                        break;
                    }
                    case "{": {
                        token = _this.CHAVES_ABRE;
                        break;
                    }
                    case "}": {
                        token = _this.CHAVES_FECHA;
                        break;
                    }
                    case "\"": {
                        token = _this.ASPAS_DUPLAS;
                        bString = true;
                        break;
                    }
                    case "'": {
                        token = _this.ASPAS_SIMPLES;
                        break;
                    }
                    default: {
                        token = _this.VARIAVEL;
                        //Caso for uma variável verifica se ela já foi identificada
                        _this.identifyVariable(strWord, variableType);
                        break;
                    }
                }
            }
            if (token != "")
                tokens.push([strWord, token]);
        });
        return tokens;
    };
    TokenIdentifier.prototype.identifyVariable = function (variable, variableType) {
        var alreadyInserted = false;
        /*variables.forEach(strVariable => {
            if (variable === strVariable)
                alreadyInserted = true;

        });*/
        //if (!alreadyInserted){
        if (variableType != "") {
            this.variables.push([variable, variableType]);
        }
    };
    TokenIdentifier.prototype.getVariables = function () {
        return this.variables;
    };
    return TokenIdentifier;
}());
