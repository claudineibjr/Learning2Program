var TokenIdentifier = (function () {
    //#endregion
    //#region Construtor da classe
    function TokenIdentifier() {
        //Cria uma matriz que conterá a palavra e sua identificação
        this.tokens = Library.newMatriz(1, 2);
        this.bString = false;
        this.bComment_sameLine = false;
        this.bComment_severalLines = false;
        this.lstComment = new Array();
        this.lstParameter = new Array();
        this.intParameter = 0;
        // Cria a classe responsável por manipular as variáveis
        this.variableManager = new VariableManager();
        //Cria a classe responsável por executar as funções
        this.functions = new Functions();
    }
    //#endregion
    //#region Identificação de tokens
    TokenIdentifier.prototype.identifyTokens = function (line, main, lineNumber) {
        this._main = main;
        this.bIfAlreadyTreated = false;
        this.optionalParameters = Library.newMatriz(1, 2);
        //Reescreve o array com as operações, limpando as que já foram abertas
        main.lstPairsKey = this.cleanOpenStatement(main.lstPairsKey, lineNumber);
        //Cria uma matriz que conterá a palavra e sua identificação
        this.tokens = Library.newMatriz(1, 2);
        var variableType = ""; // string | int | float
        //Array que conterá as informações da string
        var lstString = new Array();
        //Para cada palava da linha verifica o token correspondente
        for (var iCount = 0; iCount < line.length; iCount++) {
            var strWord = line[iCount].trim();
            var token = "";
            if (this.bString) {
                //#region Identificacao de tokens quando string
                switch (strWord) {
                    case "\"":
                        {
                            this.bString = false;
                            token = TokenIdentifier.QUOTES_DOUBLE;
                            //Insere o texto inteiro de dentro das aspas como uma string 
                            this.tokens.push([Library.showMatriz(lstString, false, " "), TokenIdentifier.STRING]);
                            //Zera o array de strings pois esta acabou
                            lstString = new Array();
                            break;
                        }
                    case "%d":
                    case "%i":
                        {
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
                    case "%.9f":
                        {
                            token = TokenIdentifier.TYPE_FLOAT_REPRESENTATION;
                            lstString.push(strWord);
                            break;
                        }
                    case "%s":
                        {
                            token = TokenIdentifier.TYPE_STRING_REPRESENTATION;
                            lstString.push(strWord);
                            break;
                        }
                    case "%c":
                        {
                            token = TokenIdentifier.TYPE_CHAR_REPRESENTATION;
                            lstString.push(strWord);
                            break;
                        }
                    case "\n":
                        {
                            token = TokenIdentifier.TYPE_STRING_REPRESENTATION;
                            lstString.push(strWord);
                            break;
                        }
                    default:
                        {
                            //Insere a palavra como string
                            lstString.push(strWord);
                        }
                }
                //#endregion
            }
            else {
                //#region Identificacao de tokens quando nao for comentario nem string
                //Identifica o devido token para esta linha
                switch (strWord) {
                    case "include":
                        {
                            token = "";
                            break;
                        }
                    case "int":
                        {
                            token = TokenIdentifier.TYPE_INT;
                            variableType = TokenIdentifier.TYPE_INT;
                            break;
                        }
                    case "char":
                        {
                            token = TokenIdentifier.TYPE_CHAR;
                            variableType = TokenIdentifier.TYPE_CHAR;
                            break;
                        }
                    case "string":
                        {
                            token = TokenIdentifier.TYPE_STRING;
                            variableType = TokenIdentifier.TYPE_STRING;
                            break;
                        }
                    case "float":
                        {
                            token = TokenIdentifier.TYPE_FLOAT;
                            variableType = TokenIdentifier.TYPE_FLOAT;
                            break;
                        }
                    case "void":
                        {
                            token = TokenIdentifier.TYPE_VOID;
                            variableType = TokenIdentifier.TYPE_VOID;
                            break;
                        }
                    case "=":
                        {
                            // Verifica se o token anterior é o sinal de maior, menor, mais ou menos
                            if (this.tokens.length >= 1) {
                                switch (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                                    //>=
                                    case TokenIdentifier.VERIFY_GT:
                                        {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_GET;
                                            break;
                                        }
                                    //<=
                                    case TokenIdentifier.VERIFY_LT:
                                        {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_LET;
                                            break;
                                        }
                                    //+=
                                    case TokenIdentifier.OP_SUM:
                                        {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.ASSIGMENT_PE;
                                            break;
                                        }
                                    //-+
                                    case TokenIdentifier.OP_SUBTRACTION:
                                        {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.ASSIGMENT_ME;
                                            break;
                                        }
                                    //==
                                    case TokenIdentifier.ASSIGMENT:
                                        {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_E;
                                            break;
                                        }
                                    //!=
                                    case TokenIdentifier.OP_NOT:
                                        {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_D;
                                            break;
                                        }
                                    default:
                                        {
                                            token = TokenIdentifier.ASSIGMENT;
                                            break;
                                        }
                                }
                            }
                            else {
                                token = TokenIdentifier.ASSIGMENT;
                            }
                            break;
                        }
                    case "+":
                        {
                            if (this.tokens.length >= 1) {
                                //"++"
                                if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.OP_SUM) {
                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.ASSIGMENT_PP;
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
                    case "-":
                        {
                            if (this.tokens.length >= 1) {
                                //"--"
                                if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.OP_SUBTRACTION) {
                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.ASSIGMENT_MM;
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
                    case "*":
                        {
                            //Verifica se é um asterisco seguido de barra, idenficando assim um comentário que pode ser em múltiplas linhas
                            if (this.tokens.length >= 1) {
                                if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.OP_DIVISAO) {
                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.COMMENT_MULTI_LINE_B;
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
                    case "/":
                        {
                            //Verifica se é uma dupla barra, identificando assim um comentário em linha
                            if (this.tokens.length >= 1) {
                                if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.OP_DIVISAO) {
                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.COMMENT_LINE;
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
                    case "!":
                        {
                            token = TokenIdentifier.OP_NOT;
                            break;
                        }
                    case ",":
                        {
                            token = TokenIdentifier.COMMA;
                            break;
                        }
                    case "(":
                        {
                            token = TokenIdentifier.PARENTHESIS_OPEN;
                            var bAlreadySummedUp = false;
                            // Verifica se é chamada ou declaração de função
                            if (this.tokens.length >= 2) {
                                if ((this.tokens[this.tokens.length - 2][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.TYPE_FLOAT || this.tokens[this.tokens.length - 2][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.TYPE_INT || this.tokens[this.tokens.length - 2][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.TYPE_VOID) &&
                                    (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.VARIABLE)) {
                                    //Se era uma variável então a exclui
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.VARIABLE) {
                                        var variableToDelete = this.variableManager.deleteVariableByName(this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE]);
                                    }
                                    // Caso o ultimo token seja uma variável e o antepenultimo seja um tipo, entende-se que é uma declaração de função
                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.FUNCTION_DECLARATION;
                                }
                                else {
                                    // Verifica o último token, pode ser que seja uma função
                                    switch (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                                        case TokenIdentifier.VARIABLE:
                                        case TokenIdentifier.VERIFY_FUNCTION:
                                            {
                                                //O que antes era um if ou uma variável pode se tornar uma chamada de função
                                                this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.FUNCTION_CALL;
                                                this.intParameter++;
                                                bAlreadySummedUp = true;
                                                this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE];
                                                break;
                                            }
                                    }
                                }
                            }
                            else {
                                if (this.tokens.length >= 1) {
                                    // Verifica o último token, pode ser que seja uma função
                                    switch (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                                        case TokenIdentifier.VARIABLE:
                                        case TokenIdentifier.VERIFY_FUNCTION:
                                            {
                                                //O que antes era um if ou uma variável pode se tornar uma chamada de função
                                                this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.FUNCTION_CALL;
                                                //this.bParameter = true;
                                                this.intParameter++;
                                                bAlreadySummedUp = true;
                                                this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE];
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
                    case ")":
                        {
                            token = TokenIdentifier.PARENTHESIS_CLOSE;
                            //if (this.bParameter == true){
                            if (this.intParameter > 1) {
                                this.intParameter--;
                            }
                            else {
                                if (this.intParameter == 1) {
                                    this.functions.execFunction(this.nameFunction, this.lstParameter, this.variableManager, this, main, lineNumber, this.optionalParameters);
                                    //this.bParameter = false;
                                    this.intParameter--;
                                    this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE];
                                    this.lstParameter = new Array();
                                }
                            }
                            break;
                        }
                    case ";":
                        {
                            token = TokenIdentifier.SEMICOLON;
                            break;
                        }
                    case "{":
                        {
                            token = TokenIdentifier.KEYS_OPEN;
                            //Identifica onde que fechará este abre chaves
                            var lineEnd = this.identifyPair(main.lstPairsKey, lineNumber);
                            //Caso o if já tenha sido tratado significa que já foi destinado o próximo local a ir
                            if (!this.bIfAlreadyTreated) {
                                //Verifica se a operação é um if e se for, seta onde termina este if
                                main.lstIfElseControl = this.getPreviousStatementAndSetToIfElseControl(lineNumber, lineEnd, main.executeNextStatement, main.lstIfElseControl, main.arrTokens);
                                //Verifica se a operação é um for e se for, seta onde termina este for
                                main.lstForControl = this.getPreviousStatementAndSetToForControl(lineNumber, lineEnd, main.executeNextStatement, main.lstForControl, main.arrTokens);
                                //Verifica se a próxima operação será executada ou se pulará para o fim deste fecha chaves                                
                                if (!main.executeNextStatement) {
                                    main.bModifiedProgramControl = true;
                                    main.iLine = lineEnd + 1;
                                }
                            }
                            //Insere o par de chaves encontrado
                            main.lstPairsKey.push([lineNumber, lineEnd, main.executeNextStatement]);
                            break;
                        }
                    case "}":
                        {
                            token = TokenIdentifier.KEYS_CLOSE;
                            //Verifica se é o fim de um for e confere se ele vai ser executado de novo
                            this.ifIsEndOfForThenRepeat(lineNumber, main.lstForControl, main);
                            break;
                        }
                    case "\"":
                        {
                            token = TokenIdentifier.QUOTES_DOUBLE;
                            this.bString = true;
                            break;
                        }
                    case "'":
                        {
                            token = TokenIdentifier.QUOTES_SIMPLE;
                            break;
                        }
                    case ">":
                        {
                            token = TokenIdentifier.VERIFY_GT;
                            break;
                        }
                    case "<":
                        {
                            token = TokenIdentifier.VERIFY_LT;
                            break;
                        }
                    case "if":
                        {
                            token = TokenIdentifier.VERIFY_FUNCTION;
                            //Caso a próxima declaração (depois dos parâmetros) não for um abre chaves, identifica um IF
                            //  que só tem uma linha
                            if (!this.nextStatementIsOpenKeys(lineNumber, main.lstWords)) {
                                this.bIfAlreadyTreated = true;
                                this.optionalParameters.push(["bIfAlreadyTreated", this.bIfAlreadyTreated]);
                            }
                            break;
                        }
                    case "else":
                        {
                            token = TokenIdentifier.VERIFY_FUNCTION_ELSE;
                            //Caso o ultimo resultado do if seja diferente de nulo... ou seja, existe um if sem abre/fecha chaves
                            if (main.bLastIfResult != null) {
                                //Se o ultimo if sem abre/fecha chaves foi verdadeiro, não executa o else
                                if (main.bLastIfResult) {
                                    main.bModifiedProgramControl = true;
                                    main.iLine += 2;
                                }
                                else {
                                    main.executeNextStatement = true;
                                }
                                main.bLastIfResult = null;
                            }
                            else {
                                //Quando for um else, só o executa caso o if correspondente não tenha sido executado
                                main.executeNextStatement = this.getIfCorrespondingToElse(lineNumber, main.lstIfElseControl, main.arrTokens);
                                if (!main.executeNextStatement) {
                                    main.bModifiedProgramControl = true;
                                    main.iLine += 2;
                                }
                            }
                            break;
                        }
                    case "[":
                        {
                            token = TokenIdentifier.BRACKET_OPEN;
                            break;
                        }
                    case "]":
                        {
                            token = TokenIdentifier.BRACKET_CLOSE;
                            break;
                        }
                    case "&":
                        {
                            token = TokenIdentifier.ELEMENT_REFERENCE;
                            break;
                        }
                    case "do":
                        {
                            token = TokenIdentifier.REPETITION_DO;
                            break;
                        }
                    default:
                        {
                            if (!isNaN(Number(strWord)))
                                token = TokenIdentifier.TYPE_INT_CONST;
                            else {
                                // Verifica se o anterior é um abre colchete, e então atribui este como um índice de vetor
                                if (this.tokens.length >= 1) {
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.BRACKET_OPEN) {
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
            //#region Inserção dos tokens encontrados como parâmetros para a função encontrada
            // Se o token for um parâmetro, o adiciona
            if (this.intParameter > 0) {
                // Verifica se o atual token é um igual e se o token anterior é o sinal de maior, menor, mais ou menos
                if (this.lstParameter.length >= 1 && this.tokens.length > 0) {
                    switch (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                        case TokenIdentifier.VERIFY_GET:
                        case TokenIdentifier.VERIFY_LET:
                        case TokenIdentifier.VERIFY_D:
                        case TokenIdentifier.VERIFY_E:
                        case TokenIdentifier.ASSIGMENT_PP:
                            {
                                switch (this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                                    //>=
                                    case TokenIdentifier.VERIFY_GT:
                                        {
                                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_GET;
                                            break;
                                        }
                                    //<=
                                    case TokenIdentifier.VERIFY_LT:
                                        {
                                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_LET;
                                            break;
                                        }
                                    //==
                                    case TokenIdentifier.ASSIGMENT:
                                        {
                                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_E;
                                            break;
                                        }
                                    //!=
                                    case TokenIdentifier.OP_NOT:
                                        {
                                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_D;
                                            break;
                                        }
                                    //++
                                    case TokenIdentifier.OP_SUM:
                                        {
                                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.ASSIGMENT_PP;
                                            break;
                                        }
                                    default:
                                        {
                                            this.lstParameter.push([strWord, token]);
                                        }
                                }
                                break;
                            }
                        default:
                            {
                                if (token != TokenIdentifier.PARENTHESIS_OPEN)
                                    this.lstParameter.push([strWord, token]);
                            }
                    }
                }
                else {
                    if (token != TokenIdentifier.PARENTHESIS_OPEN)
                        this.lstParameter.push([strWord, token]);
                }
            }
            //#endregion
            // Se o token for diferente de vazio, insere na lista
            if (token != "")
                this.tokens.push([strWord, token]);
        }
        return this.tokens;
    };
    //#endregion
    //#region Funções auxiliares
    TokenIdentifier.prototype.setValueToVariable = function () {
        this.variableManager.setValueToVariable(this.tokens);
    };
    TokenIdentifier.prototype.getVariables = function () {
        return this.variableManager.getVariables();
    };
    TokenIdentifier.prototype.nextStatementIsOpenKeys = function (lineNumber, words) {
        //Função responsável por identificar se o próximo token é um abre chaves '{'
        var nullAnswer = null;
        var lastCloseParenthesis = -1;
        //Percorre todas as palavras do código, a partir da linha vigente
        for (var iCount = lineNumber; iCount < words.length; iCount++) {
            //Percorre todas as palavras desta linha, de trás para frente
            for (var jCount = words[iCount][TokenIdentifier.INDEX_LINE_WORDS_WORDS].length - 1; jCount >= 0; jCount--) {
                //Se a palavra encontrada for um fecha parênteses, sabe-se que é a partir dali que se deve procurar pelo abre chaves
                if (words[iCount][TokenIdentifier.INDEX_LINE_WORDS_WORDS][jCount] == ")") {
                    lastCloseParenthesis = jCount;
                    break;
                }
            }
            //Se o índice do ultimo fecha parênteses for encontrado, aborta a procura pelo abre parênteses
            if (lastCloseParenthesis > -1)
                break;
        }
        //Verifica se o abre chaves está nesta linha
        for (var iCount = lastCloseParenthesis + 1; iCount < words[lineNumber][TokenIdentifier.INDEX_LINE_WORDS_WORDS].length; iCount++) {
            if (words[lineNumber][TokenIdentifier.INDEX_LINE_WORDS_WORDS][iCount] == "{")
                return true; //O próximo operador é um abre chaves
            else
                return false; // O próximo operador é algo diferente de um fecha chaves
        }
        //Percorre as outras linhas procurando pelo abre chaves
        for (var iCount = lineNumber + 1; iCount < words.length; iCount++) {
            //Percorre a linha procurando o abre chaves (analisa apenas o primeiro token)
            for (var jCount = 0; jCount < 1; jCount++) {
                //Verifica se há algum token nesta linha
                if (words[iCount][TokenIdentifier.INDEX_LINE_WORDS_WORDS].length > 0) {
                    if (words[iCount][TokenIdentifier.INDEX_LINE_WORDS_WORDS][jCount] == "{")
                        return true; //O próximo operador é um abre chaves
                    else
                        return false; // O próximo operador é algo diferente de um fecha chaves
                }
            }
        }
        return nullAnswer;
    };
    TokenIdentifier.prototype.getPreviousStatementAndSetToForControl = function (currentLine, lineEnd, execute, forControl, arrTokens) {
        //Função responsável por identificar se a operação anterior é um e for, e então caso seja, define onde começa e onde termina este for
        var newForControl = Library.newMatriz(1, 3);
        //Insere no novo control de for os já existentes
        for (var iCount = 0; iCount < forControl.length; iCount++) {
            newForControl.push([forControl[iCount][0], forControl[iCount][1], forControl[iCount][2]]);
            //Tal controle de for já existe, apenas o atualiza, caso necessário
            if (forControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_BEGIN] == currentLine &&
                forControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_END] == lineEnd) {
                forControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_RESULT] = execute;
                return forControl;
            }
        }
        //Verifica na linha corrente se o primeiro token é um if
        if (this.tokens.length > 0) {
            for (var iCount = 0; iCount < 1; iCount++) {
                if (this.tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.FUNCTION_CALL && this.tokens[iCount][TokenIdentifier.INDEX_TOKENS_VALUE] == "for") {
                    newForControl.push([currentLine, lineEnd, execute]);
                    return newForControl;
                }
            }
        }
        //Verifica nas linhas anteriores se o primeiro token é um if
        for (var iCount = arrTokens.length - 1; iCount >= 0; iCount--) {
            for (var jCount = 0; jCount < 1; jCount++) {
                if (arrTokens[iCount][TokenIdentifier.INDEX_ARR_TOKENS_TOKEN][jCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.FUNCTION_CALL && arrTokens[iCount][TokenIdentifier.INDEX_ARR_TOKENS_TOKEN][jCount][TokenIdentifier.INDEX_TOKENS_VALUE] == "for") {
                    newForControl.push([currentLine, lineEnd, execute]);
                    return newForControl;
                }
            }
        }
        return newForControl;
    };
    TokenIdentifier.prototype.getPreviousStatementAndSetToIfElseControl = function (currentLine, lineEnd, execute, ifElseControl, arrTokens) {
        //Função responsável por identificar se a operação anterior é um e if, e então caso seja, define onde começa e onde termina este if
        var newIfElseControl = Library.newMatriz(1, 3);
        //Insere no novo control de if/else os já existentes
        for (var iCount = 0; iCount < ifElseControl.length; iCount++) {
            newIfElseControl.push([ifElseControl[iCount][0], ifElseControl[iCount][1], ifElseControl[iCount][2]]);
            //Tal controle de if/else já existe, apenas o atualiza, caso necessário
            if (ifElseControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_BEGIN] == currentLine &&
                ifElseControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_END] == lineEnd) {
                ifElseControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_RESULT] = execute;
                return ifElseControl;
            }
        }
        //Verifica na linha corrente se o primeiro token é um if
        if (this.tokens.length > 0) {
            for (var iCount = 0; iCount < 1; iCount++) {
                if (this.tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.FUNCTION_CALL && this.tokens[iCount][TokenIdentifier.INDEX_TOKENS_VALUE] == "if") {
                    newIfElseControl.push([currentLine, lineEnd, execute]);
                    return newIfElseControl;
                }
            }
        }
        //Verifica nas linhas anteriores se o primeiro token é um if
        for (var iCount = arrTokens.length - 1; iCount >= 0; iCount--) {
            for (var jCount = 0; jCount < 1; jCount++) {
                if (arrTokens[iCount][TokenIdentifier.INDEX_ARR_TOKENS_TOKEN][jCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.FUNCTION_CALL && arrTokens[iCount][TokenIdentifier.INDEX_ARR_TOKENS_TOKEN][jCount][TokenIdentifier.INDEX_TOKENS_VALUE] == "if") {
                    newIfElseControl.push([currentLine, lineEnd, execute]);
                    return newIfElseControl;
                }
            }
        }
        return newIfElseControl;
    };
    TokenIdentifier.prototype.identifyPair = function (statements, currentLine) {
        //Função que é acionada a cada vez que se encontra uma abre chaves.
        //  O objetivo desta função é retornar onde este abre chaves se encerra.
        var linePairFounded = -1;
        var pairsFounded = statements.length;
        var openKey = pairsFounded + 1, closeKey = pairsFounded;
        for (var iCount = currentLine + 1; iCount < this._main.lstCodeLine.length; iCount++) {
            if (this._main.lstCodeLine[iCount].indexOf("}") > -1) {
                closeKey++;
                if (openKey - closeKey == 0)
                    return iCount;
            }
            if (this._main.lstCodeLine[iCount].indexOf("{") > -1) {
                openKey++;
            }
        }
        return -1;
    };
    TokenIdentifier.prototype.cleanOpenStatement = function (statements, currentLine) {
        //Função que irá limpar os statements abertos (ou seja, se já passou pelo início e pelo fim das chaves, ele não deve estar aqui)
        var newStatement = Library.newMatriz(1, 3);
        for (var iCount = 0; iCount < statements.length; iCount++) {
            if (statements[iCount][TokenIdentifier.INDEX_STATEMENT_KEYS_END] > currentLine) {
                newStatement.push([statements[iCount][1], statements[iCount][2], statements[iCount][3]]);
            }
        }
        return newStatement;
    };
    TokenIdentifier.prototype.bHaveAlreadyExecuted = function (beginLine, lstForControl) {
        //Função responsável por identificar se um for já foi executado
        var answer = false;
        //Percorre todos os controles de for para verificar se este já foi executado
        for (var iCount = 0; iCount < lstForControl.length; iCount++) {
            if (lstForControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_BEGIN] == beginLine) {
                answer = true;
            }
        }
        return answer;
    };
    TokenIdentifier.prototype.ifIsEndOfForThenRepeat = function (lineNumber, lstForControl, main) {
        //Função responsável por verificar se é o final de um for e então, caso seja, volta para o início do for        
        //Percorre a lista toda de for
        for (var iCount = 0; iCount < lstForControl.length; iCount++) {
            //Percorre todo o controle de for e Verifica se a linha atual é o final de um deles
            if (lstForControl[iCount][TokenIdentifier.INDEX_STATEMENT_KEYS_END] == lineNumber) {
                //Percorre todas as linhas de forma decrescente a partir da linha do início do abre chaves e verifica se aquela linha é a linha do for
                for (var beginLine = lstForControl[iCount][TokenIdentifier.INDEX_STATEMENT_KEYS_BEGIN] - 1; beginLine >= 0; beginLine--) {
                    //Percorre todos os tokens da linha inicial do abre chaves e verifica se é a linha do for, caso não for verifica se é a de cima
                    for (var jCount = 0; jCount < main.arrTokens[beginLine][TokenIdentifier.INDEX_ARR_TOKENS_TOKEN].length; jCount++) {
                        //Verifica se o token é um for
                        if (main.arrTokens[beginLine][TokenIdentifier.INDEX_ARR_TOKENS_TOKEN][jCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.FUNCTION_CALL && main.arrTokens[beginLine][TokenIdentifier.INDEX_ARR_TOKENS_TOKEN][jCount][TokenIdentifier.INDEX_TOKENS_VALUE] == "for") {
                            //Volta para o início do for
                            main.bModifiedProgramControl = true;
                            main.iLine = beginLine + 1;
                            return;
                        }
                    }
                }
            }
        }
    };
    TokenIdentifier.prototype.getIfCorrespondingToElse = function (currentLine, ifElseControl, arrTokens) {
        var answer = null, actualLine, beginLine;
        //Percorre todo o array de controle if/else
        for (var iCount = 0; iCount < ifElseControl.length; iCount++) {
            //Verifica se a linha atual é uma linha onde se encerra uma if
            if (ifElseControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_END] == currentLine) {
                actualLine = ifElseControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_END];
                beginLine = ifElseControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_BEGIN];
                answer = !ifElseControl[iCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_RESULT];
                return answer;
            }
        }
        var elseLineNumber = currentLine - 1;
        //Percorre todas as linhas
        for (var iCount = arrTokens.length - 1; iCount >= 0; iCount--) {
            //Percorre todo o controle de if/else
            for (var jCount = 0; jCount < ifElseControl.length; jCount++) {
                var lastPositionOfLine = arrTokens[iCount][TokenIdentifier.INDEX_ARR_TOKENS_TOKEN].length - 1;
                //Verifica se o último token da linha é um fecha chaves
                if (arrTokens[iCount][TokenIdentifier.INDEX_ARR_TOKENS_TOKEN][lastPositionOfLine][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.KEYS_CLOSE) {
                    //Verifica se o final do if corresponde à linha atual
                    if (ifElseControl[jCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_END] == elseLineNumber) {
                        actualLine = ifElseControl[jCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_END];
                        beginLine = ifElseControl[jCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_BEGIN];
                        answer = !ifElseControl[jCount][TokenIdentifier.INDEX_STATEMENTS_CONTROL_RESULT];
                        return answer;
                    }
                }
            }
        }
        return answer;
    };
    TokenIdentifier.prototype.treatCode = function (line) {
        //Função responsável por tratar o código retirando os comentários
        var newCode = new Array();
        //return line;
        //Para cada palava da linha verifica o token correspondente
        for (var iCount = 0; iCount < line.length; iCount++) {
            //Pega a palavra atual
            var strWord = line[iCount].trim();
            //Verifica se é um comentário em uma unica linha
            if (this.bComment_sameLine) {
                this.lstComment.push(strWord);
                // A próxima palavra é a ultima da linha
                if (iCount + 1 == line.length) {
                    this.bComment_sameLine = false;
                    this.lstComment = Array();
                    //console.log("Acabou o comentário na mesma linha");
                }
            }
            else {
                //Verifica se é um comentário em multiplas linhas
                if (this.bComment_severalLines) {
                    this.lstComment.push(strWord);
                    //É o fechamento do comentário ('*/')
                    if ((strWord === "/") && (this.lstComment.length >= 2)) {
                        if (this.lstComment[this.lstComment.length - 2] == "*") {
                            //console.log("Acabou o comentário em multiplas linhas");
                            this.bComment_severalLines = false;
                            this.lstComment = Array();
                        }
                    }
                }
                else {
                    //Não é um comentário nem em múltipla e nem em uma linha
                    switch (strWord) {
                        //Verifica se é uma dupla barra, identificando assim um comentário em linha
                        case "/":
                            {
                                if (newCode.length >= 1) {
                                    if (newCode[newCode.length - 1] == "/") {
                                        //console.log("Iniciou o comentário na mesma linha");
                                        this.bComment_sameLine = true;
                                        newCode.pop();
                                        break;
                                    }
                                }
                            }
                        //Verifica se é um asterisco seguido de barra, idenficando assim um comentário que pode ser em múltiplas linhas
                        case "*":
                            {
                                if (newCode.length >= 1) {
                                    if (newCode[newCode.length - 1] == "/") {
                                        //console.log("Iniciou o comentário em multiplas linhas");
                                        this.bComment_severalLines = true;
                                        newCode.pop();
                                        break;
                                    }
                                }
                            }
                        default:
                            {
                                newCode.push(strWord);
                            }
                    }
                }
            }
        }
        return newCode;
    };
    return TokenIdentifier;
}());
//#region Atributos utilizados para identificar os tokens
TokenIdentifier.STRING = "STRING";
TokenIdentifier.LIBRARY = "INCLUDE";
TokenIdentifier.VARIABLE = "VARIÁVEL";
TokenIdentifier.ELEMENT_REFERENCE = "REFERÊNCIA A ENDEREÇO DO ELEMENTO";
TokenIdentifier.FUNCTION_DECLARATION = "DECLARAÇÃO DE FUNÇÃO";
TokenIdentifier.FUNCTION_CALL = "CHAMADA DE FUNÇÃO";
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
TokenIdentifier.TYPE_BOOLEAN = "TIPO BOOLEANO";
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
TokenIdentifier.OP_NOT = "OPERAÇÃO LÓGICA 'NOT'";
TokenIdentifier.OP_OR = "OPERAÇÃO LÓGICA 'OR'";
TokenIdentifier.OP_AND = "OPERAÇÃO LÓGICA 'AND'";
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
//#endregion
//#region Índices para os arrays
TokenIdentifier.INDEX_TOKENS_VALUE = 0;
TokenIdentifier.INDEX_TOKENS_TYPE = 1;
TokenIdentifier.INDEX_ARR_TOKENS_LINE = 0;
TokenIdentifier.INDEX_ARR_TOKENS_TOKEN = 1;
TokenIdentifier.INDEX_VARIABLES_NAME = 0;
TokenIdentifier.INDEX_VARIABLES_TYPE = 1;
TokenIdentifier.INDEX_VARIABLES_VALUE = 2;
TokenIdentifier.INDEX_OPERATORS_VALUE = 0;
TokenIdentifier.INDEX_OPERATORS_COUNT = 1;
TokenIdentifier.INDEX_OPERATORS_PRIORITY = 2;
TokenIdentifier.INDEX_STATEMENT_KEYS_BEGIN = 0;
TokenIdentifier.INDEX_STATEMENT_KEYS_END = 1;
TokenIdentifier.INDEX_STATEMENT_KEYS_RESULT = 2;
TokenIdentifier.INDEX_STATEMENTS_CONTROL_BEGIN = 0;
TokenIdentifier.INDEX_STATEMENTS_CONTROL_END = 1;
TokenIdentifier.INDEX_STATEMENTS_CONTROL_RESULT = 2;
TokenIdentifier.INDEX_OPTIONAL_PARAMETERS_NAME = 0;
TokenIdentifier.INDEX_OPTIONAL_PARAMETERS_VALUE = 1;
TokenIdentifier.INDEX_LINE_WORDS_LINE = 0;
TokenIdentifier.INDEX_LINE_WORDS_WORDS = 1;
