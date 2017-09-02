var TokenIdentifier = /** @class */ (function () {
    function TokenIdentifier() {
        this.STRING = "STRING";
        //private PRINTF                      = "PRINTF";
        //private SCANF                       = "SCANF";
        this.LIBRARY = "INCLUDE";
        this.VARIABLE = "VARIÁVEL";
        this.FUNCTION_DECLARATION = "DECLARAÇÃO DE FUNÇÃO";
        this.FUNCAO_CALL = "CHAMADA DE FUNÇÃO";
        this.TYPE_INT = "TIPO INTEIRO";
        this.TYPE_INT_REPRESENTATION = "REPRESENTAÇÃO DO TIPO INT";
        this.TYPE_INT_CONST = "CONSTANTE INTEIRO";
        this.TYPE_FLOAT = "TIPO FLOAT";
        this.TYPE_FLOAT_REPRESENTATION = "REPRESENTAÇÃO DO TIPO FLOAT";
        this.TYPE_FLOAT_CONST = "CONSTANTE FLOAT";
        this.TYPE_VOID = "TIPO VOID";
        this.TYPE_CHAR_REPRESENTACAO = "REPRESENTAÇÃO DO TIPO FLOAT";
        this.TYPE_STRING_REPRESENTATION = "REPRESENTAÇÃO DO TIPO STRING";
        this.ASSIGMENT = "ATRIBUIÇÃO DE VALOR";
        this.VERIFY_FUNCTION = "IF VERIFICAÇÃO BOOLEANA";
        this.VERIFY_FUNCTION_ELSE = "ELSE VERIFICAÇÃO BOOLEANA";
        this.VERIFY_E = "VERIFICAÇÃO DE VALORES IGUAL";
        this.VERIFY_GT = "VERIFICAÇÃO DE VALORES MAIOR";
        this.VERIFY_GET = "VERIFICAÇÃO DE VALORES MAIOR IGUAL";
        this.VERIFY_LT = "VERIFICAÇÃO DE VALORES MENOR";
        this.VERIFY_LET = "VERIFICAÇÃO DE VALORES MENOR IGUAL";
        this.VERIFY_D = "VERIFICAÇÃO DE VALORES DIFERENTE";
        this.OP_SUM = "OPERAÇÃO DE SOMA";
        this.OP_SUBTRACTION = "OPERAÇÃO DE SUBSTRAÇÃO";
        this.OP_MULTIPLICATION = "OPERAÇÃO DE MULTIPLICAÇÃO";
        this.OP_DIVISAO = "OPERAÇÃO DE DIVISÃO";
        this.COMMA = "VÍRGULA";
        this.PARENTHESIS_OPEN = "ABRE PARÊNTESES";
        this.PARENTHESIS_CLOSE = "FECHA PARÊNTESES";
        this.SEMICOLON = "PONTO E VÍRGULA";
        this.KEYS_OPEN = "ABRE CHAVES";
        this.KEYS_CLOSE = "FECHA CHAVES";
        this.QUOTES_SIMPLE = "ASPAS SIMPLES";
        this.QUOTES_DOUBLE = "ASPAS DUPLAS";
        this.COMMENT = "COMENTÁRIO";
        this.COMMENT_LINE = "DECLARAÇÃO DE COMENTÁRIO EM LINHA";
        this.COMMENT_MULTI_LINE_B = "INÍCIO DE DECLARAÇÃO DE COMENTÁRIO";
        this.COMMENT_MULTI_LINE_E = "FIM DE DECLARAÇÃO DE COMENTÁRIO";
        this.variables = newMatriz(1, 2);
        this.bString = false;
        this.bComment_sameLine = false;
        this.bComment_severalLines = false;
        this.lstComment = new Array();
    }
    TokenIdentifier.prototype.identifyTokens = function (line) {
        //Cria uma matriz que conterá a palavra e sua identificação
        var tokens = newMatriz(1, 2);
        var variableType = ""; // string | int | float
        //Array que conterá as informações da string
        var lstString = new Array();
        //Para cada palava da linha verifica o token correspondente
        //line.forEach(strWord => {
        for (var iCount = 0; iCount < line.length; iCount++) {
            var strWord = line[iCount];
            var token = "";
            if (this.bString) {
                //#region Identificacao de tokens quando string
                switch (strWord) {
                    case "\"": {
                        this.bString = false;
                        token = this.QUOTES_DOUBLE;
                        //Insere o texto inteiro de dentro das aspas como uma string 
                        tokens.push([showMatriz(lstString, false, " "), this.STRING]);
                        //Zera o array de strings pois esta acabou
                        lstString = new Array();
                        break;
                    }
                    case "%d": {
                        token = this.TYPE_INT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }
                    case "%f": {
                        token = this.TYPE_FLOAT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }
                    case "%s": {
                        token = this.TYPE_STRING_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }
                    default: {
                        //Insere a palavra como string
                        lstString.push(strWord);
                    }
                }
                //#endregion
            }
            else {
                if (this.bComment_sameLine) {
                    //#region Identificação de tokens quando comentário
                    this.lstComment.push(strWord);
                    if (iCount + 1 == line.length) {
                        tokens.push([showMatriz(this.lstComment, false, " "), this.COMMENT]);
                        this.bComment_sameLine = false;
                        this.lstComment = Array();
                    }
                    //#endregion
                }
                else {
                    if (this.bComment_severalLines) {
                        //#region Identificação de tokens quando comentário em mais de uma linha
                        this.lstComment.push(strWord);
                        if ((strWord === "/") && (this.lstComment.length >= 2)) {
                            if (this.lstComment[this.lstComment.length - 2] == "*") {
                                tokens.push([showMatriz(this.lstComment, false, " "), this.COMMENT]);
                                this.bComment_severalLines = false;
                                this.lstComment = Array();
                                tokens.push(["*/", this.COMMENT_MULTI_LINE_E]);
                            }
                        }
                        //#endregion
                    }
                    else {
                        //#region Identificacao de tokens quando nao for comentario nem string
                        //Identifica o devido token para esta linha
                        switch (strWord) {
                            case "include": {
                                token = "";
                                break;
                            }
                            case "int": {
                                token = this.TYPE_INT;
                                variableType = this.TYPE_INT;
                                break;
                            }
                            case "float": {
                                token = this.TYPE_FLOAT;
                                variableType = this.TYPE_FLOAT;
                                break;
                            }
                            case "void": {
                                token = this.TYPE_VOID;
                                variableType = this.TYPE_VOID;
                                break;
                            }
                            case "=": {
                                // Verifica se o token anterior é o sinal de mais ou menos
                                if (tokens[tokens.length - 1][1] == this.VERIFY_GT) {
                                    tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                    tokens[tokens.length - 1][1] = this.VERIFY_GET;
                                }
                                else {
                                    if (tokens[tokens.length - 1][1] == this.VERIFY_LT) {
                                        tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                        tokens[tokens.length - 1][1] = this.VERIFY_LET;
                                    }
                                    else {
                                        token = this.ASSIGMENT;
                                    }
                                }
                                break;
                            }
                            case "+": {
                                token = this.OP_SUM;
                                break;
                            }
                            case "-": {
                                token = this.OP_SUBTRACTION;
                                break;
                            }
                            case "*": {
                                //Verifica se é um asterisco seguido de barra, idenficando assim um comentário que pode ser em múltiplas linhas
                                if (tokens.length >= 1) {
                                    if (tokens[tokens.length - 1][1] == this.OP_DIVISAO) {
                                        tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                        tokens[tokens.length - 1][1] = this.COMMENT_MULTI_LINE_B;
                                        this.bComment_severalLines = true;
                                    }
                                    else {
                                        token = this.OP_MULTIPLICATION;
                                    }
                                }
                                else {
                                    token = this.OP_MULTIPLICATION;
                                }
                                break;
                            }
                            case "/": {
                                //Verifica se é uma dupla barra, identificando assim um comentário em linha
                                if (tokens.length >= 1) {
                                    if (tokens[tokens.length - 1][1] == this.OP_DIVISAO) {
                                        tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                        tokens[tokens.length - 1][1] = this.COMMENT_LINE;
                                        this.bComment_sameLine = true;
                                    }
                                    else {
                                        token = this.OP_DIVISAO;
                                    }
                                }
                                else {
                                    token = this.OP_DIVISAO;
                                }
                                break;
                            }
                            case ",": {
                                token = this.COMMA;
                                break;
                            }
                            case "(": {
                                token = this.PARENTHESIS_OPEN;
                                // Verifica se é chamada ou declaração de função
                                if (tokens.length >= 2) {
                                    if ((tokens[tokens.length - 2][1] == this.TYPE_FLOAT || tokens[tokens.length - 2][1] == this.TYPE_INT || tokens[tokens.length - 2][1] == this.TYPE_VOID)
                                        && (tokens[tokens.length - 1][1] == this.VARIABLE)) {
                                        // Caso o ultimo token seja uma variável e o antepenultimo seja um tipo, entende-se que é uma declaração de função
                                        tokens[tokens.length - 1][1] = this.FUNCTION_DECLARATION;
                                    }
                                    else {
                                        // Caso o ultimo token seja uma variável, entende-se que é uma chamada de função
                                        if (tokens[tokens.length - 1][1] == this.VARIABLE) {
                                            tokens[tokens.length - 1][1] = this.FUNCAO_CALL;
                                        }
                                    }
                                }
                                else {
                                    if (tokens.length >= 1) {
                                        // Caso o ultimo token seja uma variável, entende-se que é uma chamada de função
                                        if (tokens[tokens.length - 1][1] == this.VARIABLE) {
                                            tokens[tokens.length - 1][1] = this.FUNCAO_CALL;
                                        }
                                    }
                                }
                                break;
                            }
                            case ")": {
                                token = this.PARENTHESIS_CLOSE;
                                break;
                            }
                            case ";": {
                                token = this.SEMICOLON;
                                break;
                            }
                            case "{": {
                                token = this.KEYS_OPEN;
                                break;
                            }
                            case "}": {
                                token = this.KEYS_CLOSE;
                                break;
                            }
                            case "\"": {
                                token = this.QUOTES_DOUBLE;
                                this.bString = true;
                                break;
                            }
                            case "'": {
                                token = this.QUOTES_SIMPLE;
                                break;
                            }
                            case ">": {
                                token = this.VERIFY_GT;
                                break;
                            }
                            case "<": {
                                token = this.VERIFY_LT;
                                break;
                            }
                            case "if": {
                                token = this.VERIFY_FUNCTION;
                                break;
                            }
                            case "else": {
                                token = this.VERIFY_FUNCTION_ELSE;
                                break;
                            }
                            default: {
                                if (!isNaN(Number(strWord)))
                                    token = this.TYPE_INT_CONST;
                                else {
                                    token = this.VARIABLE;
                                    //Caso for uma variável verifica se ela já foi identificada
                                    this.identifyVariable(strWord, variableType);
                                }
                                break;
                            }
                        }
                        //#endregion
                    }
                }
            }
            // Se o token for diferente de vazio, insere na lista
            if (token != "")
                tokens.push([strWord, token]);
        }
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
