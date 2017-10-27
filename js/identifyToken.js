var TokenIdentifier = (function () {
    function TokenIdentifier() {
        //Cria uma matriz que conterá a palavra e sua identificação
        this.tokens = newMatriz(1, 2);
        this.bString = false;
        this.bComment_sameLine = false;
        this.bComment_severalLines = false;
        this.lstComment = new Array();
        this.lstParameter = new Array();
        this.intParameter = 0;
        // Cria a classe responsável por manipular as variáveis
        this.variableManager = new VariableManager();
    }
    TokenIdentifier.prototype.identifyTokens = function (line, main, lineNumber) {
        //Cria uma matriz que conterá a palavra e sua identificação
        this.tokens = newMatriz(1, 2);
        var variableType = ""; // string | int | float
        //Array que conterá as informações da string
        var lstString = new Array();
        //Para cada palava da linha verifica o token correspondente
        //line.forEach(strWord => {
        for (var iCount = 0; iCount < line.length; iCount++) {
            var strWord = line[iCount].trim();
            var token = "";
            if (this.bString) {
                //#region Identificacao de this.tokens quando string
                switch (strWord) {
                    case "\"": {
                        this.bString = false;
                        token = TokenIdentifier.QUOTES_DOUBLE;
                        //Insere o texto inteiro de dentro das aspas como uma string 
                        this.tokens.push([showMatriz(lstString, false, " "), TokenIdentifier.STRING]);
                        //Zera o array de strings pois esta acabou
                        lstString = new Array();
                        break;
                    }
                    case "%d":
                    case "%i": {
                        token = TokenIdentifier.TYPE_INT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }
                    case "%f":
                    case "%.1f":
                    case "%.2f":
                    case "%.3f":
                    case "%.4f":
                    case "%.5f":
                    case "%.6f":
                    case "%.7f":
                    case "%.8f":
                    case "%.9f": {
                        token = TokenIdentifier.TYPE_FLOAT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }
                    case "%s": {
                        token = TokenIdentifier.TYPE_STRING_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }
                    case "%c": {
                        token = TokenIdentifier.TYPE_CHAR_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }
                    case "\n": {
                        token = TokenIdentifier.TYPE_STRING_REPRESENTATION;
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
                    //#region Identificação de this.tokens quando comentário
                    this.lstComment.push(strWord);
                    if (iCount + 1 == line.length) {
                        this.tokens.push([showMatriz(this.lstComment, false, " "), TokenIdentifier.COMMENT]);
                        this.bComment_sameLine = false;
                        this.lstComment = Array();
                    }
                    //#endregion
                }
                else {
                    if (this.bComment_severalLines) {
                        //#region Identificação de this.tokens quando comentário em mais de uma linha
                        this.lstComment.push(strWord);
                        if ((strWord === "/") && (this.lstComment.length >= 2)) {
                            if (this.lstComment[this.lstComment.length - 2] == "*") {
                                this.tokens.push([showMatriz(this.lstComment, false, " "), TokenIdentifier.COMMENT]);
                                this.bComment_severalLines = false;
                                this.lstComment = Array();
                                this.tokens.push(["*/", TokenIdentifier.COMMENT_MULTI_LINE_E]);
                            }
                        }
                        //#endregion
                    }
                    else {
                        //#region Identificacao de this.tokens quando nao for comentario nem string
                        //Identifica o devido token para esta linha
                        switch (strWord) {
                            case "include": {
                                token = "";
                                break;
                            }
                            case "int": {
                                token = TokenIdentifier.TYPE_INT;
                                variableType = TokenIdentifier.TYPE_INT;
                                break;
                            }
                            case "char": {
                                token = TokenIdentifier.TYPE_CHAR;
                                variableType = TokenIdentifier.TYPE_CHAR;
                                break;
                            }
                            case "string": {
                                token = TokenIdentifier.TYPE_STRING;
                                variableType = TokenIdentifier.TYPE_STRING;
                                break;
                            }
                            case "float": {
                                token = TokenIdentifier.TYPE_FLOAT;
                                variableType = TokenIdentifier.TYPE_FLOAT;
                                break;
                            }
                            case "void": {
                                token = TokenIdentifier.TYPE_VOID;
                                variableType = TokenIdentifier.TYPE_VOID;
                                break;
                            }
                            case "=": {
                                // Verifica se o token anterior é o sinal de maior, menor, mais ou menos
                                if (this.tokens.length >= 1) {
                                    switch (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO]) {
                                        //>=
                                        case TokenIdentifier.VERIFY_GT: {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.VERIFY_GET;
                                            break;
                                        }
                                        //<=
                                        case TokenIdentifier.VERIFY_LT: {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.VERIFY_LET;
                                            break;
                                        }
                                        //+=
                                        case TokenIdentifier.OP_SUM: {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.ASSIGMENT_PE;
                                            break;
                                        }
                                        //-+
                                        case TokenIdentifier.OP_SUBTRACTION: {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.ASSIGMENT_ME;
                                            break;
                                        }
                                        //==
                                        case TokenIdentifier.ASSIGMENT: {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.VERIFY_E;
                                            break;
                                        }
                                        default: {
                                            switch (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR]) {
                                                case "!": {
                                                    this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                                    this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.VERIFY_D;
                                                    break;
                                                }
                                                default: {
                                                    token = TokenIdentifier.ASSIGMENT;
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }
                                else {
                                    token = TokenIdentifier.ASSIGMENT;
                                }
                                break;
                            }
                            case "+": {
                                if (this.tokens.length >= 1) {
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.OP_SUM) {
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.ASSIGMENT_PP;
                                    }
                                    else {
                                        token = TokenIdentifier.OP_SUM;
                                    }
                                }
                                else {
                                    token = TokenIdentifier.OP_SUM;
                                }
                                break;
                            }
                            case "-": {
                                if (this.tokens.length >= 1) {
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.OP_SUBTRACTION) {
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.ASSIGMENT_MM;
                                    }
                                    else {
                                        token = TokenIdentifier.OP_SUBTRACTION;
                                    }
                                }
                                else {
                                    token = TokenIdentifier.OP_SUBTRACTION;
                                }
                                break;
                            }
                            case "*": {
                                //Verifica se é um asterisco seguido de barra, idenficando assim um comentário que pode ser em múltiplas linhas
                                if (this.tokens.length >= 1) {
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.OP_DIVISAO) {
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.COMMENT_MULTI_LINE_B;
                                        this.bComment_severalLines = true;
                                    }
                                    else {
                                        token = TokenIdentifier.OP_MULTIPLICATION;
                                    }
                                }
                                else {
                                    token = TokenIdentifier.OP_MULTIPLICATION;
                                }
                                break;
                            }
                            case "/": {
                                //Verifica se é uma dupla barra, identificando assim um comentário em linha
                                if (this.tokens.length >= 1) {
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.OP_DIVISAO) {
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.COMMENT_LINE;
                                        this.bComment_sameLine = true;
                                    }
                                    else {
                                        token = TokenIdentifier.OP_DIVISAO;
                                    }
                                }
                                else {
                                    token = TokenIdentifier.OP_DIVISAO;
                                }
                                break;
                            }
                            case ",": {
                                token = TokenIdentifier.COMMA;
                                break;
                            }
                            case "(": {
                                token = TokenIdentifier.PARENTHESIS_OPEN;
                                var bAlreadySummedUp = false;
                                // Verifica se é chamada ou declaração de função
                                if (this.tokens.length >= 2) {
                                    if ((this.tokens[this.tokens.length - 2][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.TYPE_FLOAT || this.tokens[this.tokens.length - 2][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.TYPE_INT || this.tokens[this.tokens.length - 2][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.TYPE_VOID)
                                        && (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.VARIABLE)) {
                                        // Caso o ultimo token seja uma variável e o antepenultimo seja um tipo, entende-se que é uma declaração de função
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.FUNCTION_DECLARATION;
                                    }
                                    else {
                                        // Verifica o último token, pode ser que seja uma função
                                        switch (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO]) {
                                            case TokenIdentifier.VARIABLE:
                                            case TokenIdentifier.VERIFY_FUNCTION: {
                                                this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.FUNCAO_CALL;
                                                //this.bParameter = true;
                                                this.intParameter++;
                                                bAlreadySummedUp = true;
                                                this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR];
                                                break;
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (this.tokens.length >= 1) {
                                        // Verifica o último token, pode ser que seja uma função
                                        switch (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO]) {
                                            case TokenIdentifier.VARIABLE:
                                            case TokenIdentifier.VERIFY_FUNCTION: {
                                                this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.FUNCAO_CALL;
                                                //this.bParameter = true;
                                                this.intParameter++;
                                                bAlreadySummedUp = true;
                                                this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR];
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (!bAlreadySummedUp) {
                                    this.intParameter++;
                                }
                                break;
                            }
                            case ")": {
                                token = TokenIdentifier.PARENTHESIS_CLOSE;
                                //if (this.bParameter == true){
                                if (this.intParameter > 1) {
                                    this.intParameter--;
                                }
                                else {
                                    if (this.intParameter == 1) {
                                        execFunction(this.nameFunction, this.lstParameter, this.variableManager, this, main, lineNumber);
                                        //this.bParameter = false;
                                        this.intParameter--;
                                        this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR];
                                        this.lstParameter = new Array();
                                    }
                                }
                                break;
                            }
                            case ";": {
                                token = TokenIdentifier.SEMICOLON;
                                break;
                            }
                            case "{": {
                                token = TokenIdentifier.KEYS_OPEN;
                                main.statementKey.push([lineNumber, null, main.executeNextStatement]);
                                break;
                            }
                            case "}": {
                                token = TokenIdentifier.KEYS_CLOSE;
                                main.statementKey.pop();
                                if (main.statementKey.length == 1)
                                    main.executeNextStatement = true;
                                break;
                            }
                            case "\"": {
                                token = TokenIdentifier.QUOTES_DOUBLE;
                                this.bString = true;
                                break;
                            }
                            case "'": {
                                token = TokenIdentifier.QUOTES_SIMPLE;
                                break;
                            }
                            case ">": {
                                token = TokenIdentifier.VERIFY_GT;
                                break;
                            }
                            case "<": {
                                token = TokenIdentifier.VERIFY_LT;
                                break;
                            }
                            case "if": {
                                token = TokenIdentifier.VERIFY_FUNCTION;
                                break;
                            }
                            case "else": {
                                token = TokenIdentifier.VERIFY_FUNCTION_ELSE;
                                //Quando for um else, só o executa caso o ultimo if não tenha sido executado
                                main.executeNextStatement = !main.bLastIfResult;
                                break;
                            }
                            case "[": {
                                token = TokenIdentifier.BRACKET_OPEN;
                                break;
                            }
                            case "]": {
                                token = TokenIdentifier.BRACKET_CLOSE;
                                break;
                            }
                            case "&": {
                                token = TokenIdentifier.ELEMENT_REFERENCE;
                                break;
                            }
                            case "do": {
                                token = TokenIdentifier.REPETITION_DO;
                                break;
                            }
                            default: {
                                if (!isNaN(Number(strWord)))
                                    token = TokenIdentifier.TYPE_INT_CONST;
                                else {
                                    // Verifica se o anterior é um abre colchete, e então atribui este como um índice de vetor
                                    if (this.tokens.length >= 1) {
                                        if (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.BRACKET_OPEN) {
                                            token = TokenIdentifier.ARRAY_INDEX;
                                        }
                                        else {
                                            // Caso não for nenhum dos pontos acima identificados, é uma variável
                                            token = TokenIdentifier.VARIABLE;
                                            //Caso for uma variável verifica se ela já foi identificada
                                            this.variableManager.identifyVariable(strWord, variableType);
                                        }
                                    }
                                    else {
                                        // Caso não for nenhum dos pontos acima identificados, é uma variável
                                        token = TokenIdentifier.VARIABLE;
                                        //Caso for uma variável verifica se ela já foi identificada
                                        this.variableManager.identifyVariable(strWord, variableType);
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
            //if (this.bParameter == true){
            if (this.intParameter > 0) {
                // Verifica se o atual token é um igual e se o token anterior é o sinal de maior, menor, mais ou menos
                if (this.lstParameter.length >= 1 && this.tokens.length > 0) {
                    switch (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO]) {
                        case TokenIdentifier.VERIFY_GET:
                        case TokenIdentifier.VERIFY_LET:
                        case TokenIdentifier.ASSIGMENT: {
                            switch (this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_TIPO]) {
                                //>=
                                case TokenIdentifier.VERIFY_GT: {
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.VERIFY_GET;
                                    break;
                                }
                                //<=
                                case TokenIdentifier.VERIFY_LT: {
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.VERIFY_LET;
                                    break;
                                }
                                //==
                                case TokenIdentifier.ASSIGMENT: {
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.VERIFY_E;
                                    break;
                                }
                                default: {
                                    this.lstParameter.push([strWord, token]);
                                }
                            }
                            break;
                        }
                        default: {
                            this.lstParameter.push([strWord, token]);
                        }
                    }
                }
                else {
                    this.lstParameter.push([strWord, token]);
                }
            }
            // Se o token for diferente de vazio, insere na lista
            if (token != "")
                this.tokens.push([strWord, token]);
        }
        return this.tokens;
    };
    TokenIdentifier.prototype.setValueToVariable = function () {
        this.variableManager.setValueToVariable(this.tokens);
    };
    TokenIdentifier.prototype.getVariables = function () {
        return this.variableManager.getVariables();
    };
    return TokenIdentifier;
}());
TokenIdentifier.STRING = "STRING";
//static readonly PRINTF                      = "PRINTF";
//static readonly SCANF                       = "SCANF";
TokenIdentifier.LIBRARY = "INCLUDE";
TokenIdentifier.VARIABLE = "VARIÁVEL";
TokenIdentifier.ELEMENT_REFERENCE = "REFERÊNCIA A ENDEREÇO DO ELEMENTO";
TokenIdentifier.FUNCTION_DECLARATION = "DECLARAÇÃO DE FUNÇÃO";
TokenIdentifier.FUNCAO_CALL = "CHAMADA DE FUNÇÃO";
TokenIdentifier.TYPE_INT = "TIPO INTEIRO";
TokenIdentifier.TYPE_INT_REPRESENTATION = "REPRESENTAÇÃO DO TIPO INT";
TokenIdentifier.TYPE_INT_CONST = "CONSTANTE INTEIRO";
TokenIdentifier.TYPE_FLOAT = "TIPO FLOAT";
TokenIdentifier.TYPE_FLOAT_REPRESENTATION = "REPRESENTAÇÃO DO TIPO FLOAT";
TokenIdentifier.TYPE_FLOAT_CONST = "CONSTANTE FLOAT";
TokenIdentifier.TYPE_VOID = "TIPO VOID";
TokenIdentifier.TYPE_CHAR = "TIPO CHAR";
TokenIdentifier.TYPE_CHAR_REPRESENTATION = "REPRESENTAÇÃO DO TIPO CHAR";
TokenIdentifier.TYPE_CHAR_CONST = "CONSTANTE CHAR";
TokenIdentifier.TYPE_STRING = "TIPO STRING";
TokenIdentifier.TYPE_STRING_REPRESENTATION = "REPRESENTAÇÃO DO TIPO STRING";
TokenIdentifier.TYPE_STRING_CONST = "CONSTANTE STRING";
TokenIdentifier.ASSIGMENT = "ATRIBUIÇÃO DE VALOR";
TokenIdentifier.ASSIGMENT_PP = "ATRIBUIÇÃO DE VALORES SOMANDO 1";
TokenIdentifier.ASSIGMENT_MM = "ATRIBUIÇÃO DE VALORES SUBTRAINDO 1";
TokenIdentifier.ASSIGMENT_PE = "ATRIBUIÇÃO DE VALORES SOMANDO AO VALOR ATUAL";
TokenIdentifier.ASSIGMENT_ME = "ATRIBUIÇÃO DE VALORES SUBTRAINDO DO VALOR ATUAL";
TokenIdentifier.VERIFY_FUNCTION = "IF VERIFICAÇÃO BOOLEANA";
TokenIdentifier.VERIFY_FUNCTION_ELSE = "ELSE VERIFICAÇÃO BOOLEANA";
TokenIdentifier.VERIFY_E = "VERIFICAÇÃO DE VALORES IGUAL";
TokenIdentifier.VERIFY_GT = "VERIFICAÇÃO DE VALORES MAIOR";
TokenIdentifier.VERIFY_GET = "VERIFICAÇÃO DE VALORES MAIOR IGUAL";
TokenIdentifier.VERIFY_LT = "VERIFICAÇÃO DE VALORES MENOR";
TokenIdentifier.VERIFY_LET = "VERIFICAÇÃO DE VALORES MENOR IGUAL";
TokenIdentifier.VERIFY_D = "VERIFICAÇÃO DE VALORES DIFERENTE";
TokenIdentifier.REPETITION_DO = "LAÇO DE REPETIÇÃO DO";
TokenIdentifier.OP_SUM = "OPERAÇÃO DE SOMA";
TokenIdentifier.OP_SUBTRACTION = "OPERAÇÃO DE SUBTRAÇÃO";
TokenIdentifier.OP_MULTIPLICATION = "OPERAÇÃO DE MULTIPLICAÇÃO";
TokenIdentifier.OP_DIVISAO = "OPERAÇÃO DE DIVISÃO";
TokenIdentifier.COMMA = "VÍRGULA";
TokenIdentifier.PARENTHESIS_OPEN = "ABRE PARÊNTESES";
TokenIdentifier.PARENTHESIS_CLOSE = "FECHA PARÊNTESES";
TokenIdentifier.SEMICOLON = "PONTO E VÍRGULA";
TokenIdentifier.KEYS_OPEN = "ABRE CHAVES";
TokenIdentifier.KEYS_CLOSE = "FECHA CHAVES";
TokenIdentifier.BRACKET_OPEN = "ABRE COLCHETE";
TokenIdentifier.BRACKET_CLOSE = "FECHA COLCHETE";
TokenIdentifier.QUOTES_SIMPLE = "ASPAS SIMPLES";
TokenIdentifier.QUOTES_DOUBLE = "ASPAS DUPLAS";
TokenIdentifier.COMMENT = "COMENTÁRIO";
TokenIdentifier.COMMENT_LINE = "DECLARAÇÃO DE COMENTÁRIO EM LINHA";
TokenIdentifier.COMMENT_MULTI_LINE_B = "INÍCIO DE DECLARAÇÃO DE COMENTÁRIO";
TokenIdentifier.COMMENT_MULTI_LINE_E = "FIM DE DECLARAÇÃO DE COMENTÁRIO";
TokenIdentifier.ARRAY_INDEX = "ÍNDICE DE ARRAY";
//Índices dos Arrays
//Tokens
TokenIdentifier.TOKENS_I_VALOR = 0;
TokenIdentifier.TOKENS_I_TIPO = 1;
TokenIdentifier.VARIABLES_I_NAME = 0;
TokenIdentifier.VARIABLES_I_TYPE = 1;
TokenIdentifier.VARIABLES_I_VALUE = 2;
TokenIdentifier.OPERATORS_I_VALUE = 0;
TokenIdentifier.OPERATORS_I_COUNT = 1;
TokenIdentifier.OPERATORS_I_PRIORITY = 2;
TokenIdentifier.STATEMENT_KEYS_BEGIN = 0;
TokenIdentifier.STATEMENT_KEYS_END = 1;
TokenIdentifier.STATEMENT_KEYS_EXECUTE = 2;
