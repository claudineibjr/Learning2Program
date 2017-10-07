var execFunction;
var TokenIdentifier = (function () {
    function TokenIdentifier() {
        this.STRING = "STRING";
        //private PRINTF                      = "PRINTF";
        //private SCANF                       = "SCANF";
        this.LIBRARY = "INCLUDE";
        this.VARIABLE = "VARIÁVEL";
        this.ELEMENT_REFERENCE = "REFERÊNCIA A ENDEREÇO DO ELEMENTO";
        this.FUNCTION_DECLARATION = "DECLARAÇÃO DE FUNÇÃO";
        this.FUNCAO_CALL = "CHAMADA DE FUNÇÃO";
        this.TYPE_INT = "TIPO INTEIRO";
        this.TYPE_INT_REPRESENTATION = "REPRESENTAÇÃO DO TIPO INT";
        this.TYPE_INT_CONST = "CONSTANTE INTEIRO";
        this.TYPE_FLOAT = "TIPO FLOAT";
        this.TYPE_FLOAT_REPRESENTATION = "REPRESENTAÇÃO DO TIPO FLOAT";
        this.TYPE_FLOAT_CONST = "CONSTANTE FLOAT";
        this.TYPE_VOID = "TIPO VOID";
        this.TYPE_CHAR = "TIPO CHAR";
        this.TYPE_CHAR_REPRESENTATION = "REPRESENTAÇÃO DO TIPO CHAR";
        this.TYPE_STRING = "TIPO STRING";
        this.TYPE_STRING_REPRESENTATION = "REPRESENTAÇÃO DO TIPO STRING";
        this.ASSIGMENT = "ATRIBUIÇÃO DE VALOR";
        this.ASSIGMENT_PP = "ATRIBUIÇÃO DE VALORES SOMANDO 1";
        this.ASSIGMENT_MM = "ATRIBUIÇÃO DE VALORES SUBTRAINDO 1";
        this.ASSIGMENT_PE = "ATRIBUIÇÃO DE VALORES SOMANDO AO VALOR ATUAL";
        this.ASSIGMENT_ME = "ATRIBUIÇÃO DE VALORES SUBTRAINDO DO VALOR ATUAL";
        this.VERIFY_FUNCTION = "IF VERIFICAÇÃO BOOLEANA";
        this.VERIFY_FUNCTION_ELSE = "ELSE VERIFICAÇÃO BOOLEANA";
        this.VERIFY_E = "VERIFICAÇÃO DE VALORES IGUAL";
        this.VERIFY_GT = "VERIFICAÇÃO DE VALORES MAIOR";
        this.VERIFY_GET = "VERIFICAÇÃO DE VALORES MAIOR IGUAL";
        this.VERIFY_LT = "VERIFICAÇÃO DE VALORES MENOR";
        this.VERIFY_LET = "VERIFICAÇÃO DE VALORES MENOR IGUAL";
        this.VERIFY_D = "VERIFICAÇÃO DE VALORES DIFERENTE";
        this.REPETITION_DO = "LAÇO DE REPETIÇÃO DO";
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
        this.BRACKET_OPEN = "ABRE COLCHETE";
        this.BRACKET_CLOSE = "FECHA COLCHETE";
        this.QUOTES_SIMPLE = "ASPAS SIMPLES";
        this.QUOTES_DOUBLE = "ASPAS DUPLAS";
        this.COMMENT = "COMENTÁRIO";
        this.COMMENT_LINE = "DECLARAÇÃO DE COMENTÁRIO EM LINHA";
        this.COMMENT_MULTI_LINE_B = "INÍCIO DE DECLARAÇÃO DE COMENTÁRIO";
        this.COMMENT_MULTI_LINE_E = "FIM DE DECLARAÇÃO DE COMENTÁRIO";
        this.ARRAY_INDEX = "ÍNDICE DE ARRAY";
        //Índices dos Arrays
        //Tokens
        this.TOKENS_I_VALOR = 0;
        this.TOKENS_I_TIPO = 1;
        this.VARIABLES_I_NAME = 0;
        this.VARIABLES_I_TYPE = 1;
        this.VARIABLES_I_VALUE = 2;
        this.variables = newMatriz(1, 3);
        this.bString = false;
        this.bComment_sameLine = false;
        this.bComment_severalLines = false;
        this.lstComment = new Array();
        this.lstParameter = new Array();
        this.bParameter = false;
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
            var strWord = line[iCount].trim();
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
                    case "%i": {
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
                    case "%c": {
                        token = this.TYPE_CHAR_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }
                    case "\n": {
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
                            case "char": {
                                token = this.TYPE_CHAR;
                                variableType = this.TYPE_CHAR;
                                break;
                            }
                            case "string": {
                                token = this.TYPE_STRING;
                                variableType = this.TYPE_STRING;
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
                                // Verifica se o token anterior é o sinal de maior, menor, mais ou menos
                                if (tokens.length >= 1) {
                                    switch (tokens[tokens.length - 1][this.TOKENS_I_TIPO]) {
                                        case this.VERIFY_GT: {
                                            tokens[tokens.length - 1][this.TOKENS_I_VALOR] = tokens[tokens.length - 1][this.TOKENS_I_VALOR] + strWord;
                                            tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.VERIFY_GET;
                                            break;
                                        }
                                        case this.VERIFY_LT: {
                                            tokens[tokens.length - 1][this.TOKENS_I_VALOR] = tokens[tokens.length - 1][this.TOKENS_I_VALOR] + strWord;
                                            tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.VERIFY_LET;
                                            break;
                                        }
                                        case this.OP_SUM: {
                                            tokens[tokens.length - 1][this.TOKENS_I_VALOR] = tokens[tokens.length - 1][this.TOKENS_I_VALOR] + strWord;
                                            tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.ASSIGMENT_PE;
                                            break;
                                        }
                                        case this.OP_SUBTRACTION: {
                                            tokens[tokens.length - 1][this.TOKENS_I_VALOR] = tokens[tokens.length - 1][this.TOKENS_I_VALOR] + strWord;
                                            tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.ASSIGMENT_ME;
                                            break;
                                        }
                                        case this.ASSIGMENT: {
                                            tokens[tokens.length - 1][this.TOKENS_I_VALOR] = tokens[tokens.length - 1][this.TOKENS_I_VALOR] + strWord;
                                            tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.VERIFY_E;
                                            break;
                                        }
                                        default: {
                                            switch (tokens[tokens.length - 1][this.TOKENS_I_VALOR]) {
                                                case "!": {
                                                    tokens[tokens.length - 1][this.TOKENS_I_VALOR] = tokens[tokens.length - 1][this.TOKENS_I_VALOR] + strWord;
                                                    tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.VERIFY_D;
                                                    break;
                                                }
                                                default: {
                                                    token = this.ASSIGMENT;
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }
                                else {
                                    token = this.ASSIGMENT;
                                }
                                break;
                            }
                            case "+": {
                                if (tokens.length >= 1) {
                                    if (tokens[tokens.length - 1][this.TOKENS_I_TIPO] == this.OP_SUM) {
                                        tokens[tokens.length - 1][this.TOKENS_I_VALOR] = tokens[tokens.length - 1][this.TOKENS_I_VALOR] + strWord;
                                        tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.ASSIGMENT_PP;
                                    }
                                    else {
                                        token = this.OP_SUM;
                                    }
                                }
                                else {
                                    token = this.OP_SUM;
                                }
                                break;
                            }
                            case "-": {
                                if (tokens.length >= 1) {
                                    if (tokens[tokens.length - 1][this.TOKENS_I_TIPO] == this.OP_SUBTRACTION) {
                                        tokens[tokens.length - 1][this.TOKENS_I_VALOR] = tokens[tokens.length - 1][this.TOKENS_I_VALOR] + strWord;
                                        tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.ASSIGMENT_MM;
                                    }
                                    else {
                                        token = this.OP_SUBTRACTION;
                                    }
                                }
                                else {
                                    token = this.OP_SUBTRACTION;
                                }
                                break;
                            }
                            case "*": {
                                //Verifica se é um asterisco seguido de barra, idenficando assim um comentário que pode ser em múltiplas linhas
                                if (tokens.length >= 1) {
                                    if (tokens[tokens.length - 1][this.TOKENS_I_TIPO] == this.OP_DIVISAO) {
                                        tokens[tokens.length - 1][this.TOKENS_I_VALOR] = tokens[tokens.length - 1][this.TOKENS_I_VALOR] + strWord;
                                        tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.COMMENT_MULTI_LINE_B;
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
                                    if (tokens[tokens.length - 1][this.TOKENS_I_TIPO] == this.OP_DIVISAO) {
                                        tokens[tokens.length - 1][this.TOKENS_I_VALOR] = tokens[tokens.length - 1][this.TOKENS_I_VALOR] + strWord;
                                        tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.COMMENT_LINE;
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
                                    if ((tokens[tokens.length - 2][this.TOKENS_I_TIPO] == this.TYPE_FLOAT || tokens[tokens.length - 2][this.TOKENS_I_TIPO] == this.TYPE_INT || tokens[tokens.length - 2][this.TOKENS_I_TIPO] == this.TYPE_VOID)
                                        && (tokens[tokens.length - 1][this.TOKENS_I_TIPO] == this.VARIABLE)) {
                                        // Caso o ultimo token seja uma variável e o antepenultimo seja um tipo, entende-se que é uma declaração de função
                                        tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.FUNCTION_DECLARATION;
                                    }
                                    else {
                                        // Caso o ultimo token seja uma variável, entende-se que é uma chamada de função
                                        if (tokens[tokens.length - 1][this.TOKENS_I_TIPO] == this.VARIABLE) {
                                            tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.FUNCAO_CALL;
                                            this.bParameter = true;
                                            this.nameFunction = tokens[tokens.length - 1][this.TOKENS_I_VALOR];
                                        }
                                    }
                                }
                                else {
                                    if (tokens.length >= 1) {
                                        // Caso o ultimo token seja uma variável, entende-se que é uma chamada de função
                                        if (tokens[tokens.length - 1][this.TOKENS_I_TIPO] == this.VARIABLE) {
                                            tokens[tokens.length - 1][this.TOKENS_I_TIPO] = this.FUNCAO_CALL;
                                            this.bParameter = true;
                                            this.nameFunction = tokens[tokens.length - 1][this.TOKENS_I_VALOR];
                                        }
                                    }
                                }
                                break;
                            }
                            case ")": {
                                token = this.PARENTHESIS_CLOSE;
                                if (this.bParameter == true) {
                                    execFunction(this.nameFunction, this.lstParameter);
                                    this.bParameter = false;
                                    this.nameFunction = tokens[tokens.length - 1][this.TOKENS_I_VALOR];
                                    this.lstParameter = new Array();
                                }
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
                            case "[": {
                                token = this.BRACKET_OPEN;
                                break;
                            }
                            case "]": {
                                token = this.BRACKET_CLOSE;
                                break;
                            }
                            case "&": {
                                token = this.ELEMENT_REFERENCE;
                                break;
                            }
                            case "do": {
                                token = this.REPETITION_DO;
                                break;
                            }
                            default: {
                                if (!isNaN(Number(strWord)))
                                    token = this.TYPE_INT_CONST;
                                else {
                                    // Verifica se o anterior é um abre colchete, e então atribui este como um índice de vetor
                                    if (tokens.length >= 1) {
                                        if (tokens[tokens.length - 1][this.TOKENS_I_TIPO] == this.BRACKET_OPEN) {
                                            token = this.ARRAY_INDEX;
                                        }
                                        else {
                                            // Caso não for nenhum dos pontos acima identificados, é uma variável
                                            token = this.VARIABLE;
                                            //Caso for uma variável verifica se ela já foi identificada
                                            this.identifyVariable(strWord, variableType);
                                        }
                                    }
                                    else {
                                        // Caso não for nenhum dos pontos acima identificados, é uma variável
                                        token = this.VARIABLE;
                                        //Caso for uma variável verifica se ela já foi identificada
                                        this.identifyVariable(strWord, variableType);
                                    }
                                }
                                break;
                            }
                        }
                        //#endregion
                    }
                }
            }
            // Se o token for um parâmetro, o adiciona
            if (this.bParameter == true)
                this.lstParameter.push([strWord, token]);
            // Se o token for diferente de vazio, insere na lista
            if (token != "")
                tokens.push([strWord, token]);
        }
        this.setValueToVariable(tokens);
        return tokens;
    };
    TokenIdentifier.prototype.identifyVariable = function (variable, variableType) {
        var alreadyInserted = false;
        if (variableType != "") {
            switch (variableType) {
                case this.TYPE_INT:
                case this.TYPE_FLOAT: {
                    this.variables.push([variable, variableType, 0]);
                    break;
                }
                case this.TYPE_CHAR:
                case this.TYPE_STRING: {
                    this.variables.push([variable, variableType, ""]);
                    break;
                }
                default: {
                    this.variables.push([variable, variableType, null]);
                    break;
                }
            }
        }
    };
    TokenIdentifier.prototype.setValueToVariable = function (tokens) {
        var variableName, assigmentType;
        var valueToAssign, bFound = false;
        var variable;
        var statement = new Array();
        for (var iCount = 0; iCount < tokens.length; iCount++) {
            //Caso já tenha encontrado a variável, insere o token atual como parte da operação
            if (bFound) {
                statement.push(tokens[iCount]);
            }
            if (tokens[iCount][this.TOKENS_I_TIPO] == this.ASSIGMENT ||
                tokens[iCount][this.TOKENS_I_TIPO] == this.ASSIGMENT_ME ||
                tokens[iCount][this.TOKENS_I_TIPO] == this.ASSIGMENT_MM ||
                tokens[iCount][this.TOKENS_I_TIPO] == this.ASSIGMENT_PE ||
                tokens[iCount][this.TOKENS_I_TIPO] == this.ASSIGMENT_PP) {
                //Verifica qual o tipo de atribuição e qual a variável que irá ter seu valor atribuído
                if (!bFound) {
                    assigmentType = tokens[iCount][this.TOKENS_I_TIPO];
                    variableName = tokens[iCount - 1][this.TOKENS_I_VALOR];
                    switch (this.variables[this.getVariableIndex(variableName)][this.VARIABLES_I_TYPE]) {
                        case this.TYPE_FLOAT:
                        case this.TYPE_INT: {
                            valueToAssign = Number();
                            break;
                        }
                        case this.TYPE_CHAR:
                        case this.TYPE_STRING: {
                            valueToAssign = String();
                            break;
                        }
                    }
                    bFound = true;
                }
            }
        }
        //Percorre todos os operadores da atribuição de valor
        for (var iCount = 0; iCount < statement.length; iCount++) {
            //Verifica o tipo de operador
            switch (statement[iCount][this.TOKENS_I_TIPO]) {
                case this.TYPE_FLOAT_CONST:
                case this.TYPE_INT_CONST: {
                    valueToAssign += Number(statement[iCount][this.TOKENS_I_VALOR]);
                    break;
                }
                case this.VARIABLE: {
                    var variableFounded = this.variables[this.getVariableIndex(statement[iCount][this.TOKENS_I_VALOR])];
                    console.log("Variável: " + variableFounded[this.TOKENS_I_VALOR]);
                    switch (variableFounded[this.VARIABLES_I_TYPE]) {
                        case this.TYPE_FLOAT:
                        case this.TYPE_INT: {
                            valueToAssign += Number(variableFounded[this.VARIABLES_I_VALUE]);
                            break;
                        }
                    }
                    break;
                }
                default: {
                    console.log("Resultado: " + statement[iCount][this.TOKENS_I_TIPO]);
                    break;
                }
            }
        }
        if (bFound) {
            var variableIndex = this.getVariableIndex(variableName);
            switch (assigmentType) {
                case this.ASSIGMENT: {
                    this.variables[variableIndex][this.VARIABLES_I_VALUE] = valueToAssign;
                    break;
                }
                case this.ASSIGMENT_ME: {
                    this.variables[variableIndex][this.VARIABLES_I_VALUE] -= valueToAssign;
                    break;
                }
                case this.ASSIGMENT_MM: {
                    this.variables[variableIndex][this.VARIABLES_I_VALUE]--;
                    break;
                }
                case this.ASSIGMENT_PE: {
                    this.variables[variableIndex][this.VARIABLES_I_VALUE] += valueToAssign;
                    break;
                }
                case this.ASSIGMENT_PP: {
                    this.variables[variableIndex][this.VARIABLES_I_VALUE]++;
                    break;
                }
            }
        }
    };
    TokenIdentifier.prototype.getVariableIndex = function (variableName) {
        for (var iCount = 0; iCount < this.variables.length; iCount++) {
            if (this.variables[iCount][this.VARIABLES_I_NAME] == variableName) {
                return iCount;
            }
        }
    };
    TokenIdentifier.prototype.getVariables = function () {
        return this.variables;
    };
    return TokenIdentifier;
}());
