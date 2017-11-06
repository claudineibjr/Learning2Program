var Functions = (function () {
    function Functions() {
    }
    Functions.prototype.execFunction = function (nameFunction, parameters_tokens, variableManager, identifier, main, lineNumber, optionalParameters) {
        if (optionalParameters === void 0) { optionalParameters = null; }
        // Instancia o painel de output
        this.txtOutput = document.getElementById("txtOutput");
        this.bString = false;
        this.indexVariableFounded = 0;
        this.indexVariableDisplayed = 0;
        switch (nameFunction) {
            case "printf":
                {
                    this.execPrintf(parameters_tokens, variableManager);
                    break;
                }
            case "scanf":
                {
                    this.execScanf(parameters_tokens, variableManager);
                    break;
                }
            case "if":
                {
                    var ifReturn = this.execIf(parameters_tokens, variableManager);
                    main.executeNextStatement = ifReturn;
                    if (this.getAdditionalParameter(optionalParameters, "bIfAlreadyTreated")) {
                        //Caso não for executar a próxima instrução, vai para 2 linhas abaixo
                        if (!main.executeNextStatement) {
                            main.bModifiedProgramControl = true;
                            main.iLine += 2;
                        }
                        //Define a execução da próxima instrução
                        main.bLastIfResult = main.executeNextStatement;
                    }
                    break;
                }
            case "for":
                {
                    var ifReturn = this.execFor(parameters_tokens, variableManager, identifier, main);
                    main.executeNextStatement = ifReturn;
                    break;
                }
            default:
                {
                    console.log("Função não implementada: " + nameFunction);
                }
        }
    };
    Functions.prototype.getAdditionalParameter = function (optionalParameters, parameterName) {
        //Função responsável por responder o parâmetro adicional passado por parâmetro
        var objReturn = null;
        //Verifica se tem parâmetro adicional
        if (optionalParameters != null) {
            //Percorre todos os parâmetros
            for (var iCount = 0; iCount < optionalParameters.length; iCount++) {
                //Verifica se um dos parâmetros adicionais é a linha do IF sem as aspas... ou seja, apenas uma operação na próxima linha
                if (optionalParameters[iCount][TokenIdentifier.INDEX_OPTIONAL_PARAMETERS_NAME] == "bIfAlreadyTreated") {
                    return optionalParameters[iCount][TokenIdentifier.INDEX_OPTIONAL_PARAMETERS_VALUE];
                }
            }
        }
        return objReturn;
    };
    Functions.prototype.execFor = function (parameters_tokens, variableManager, identififer, main) {
        var answer = null;
        /*  Sepação dos parâmetros em 3 partes:
                1ª parte = Declaração de variáveis e atribuição de valores (Só é executada a primeira vez)
                2ª parte = Verificação de valores para a execução (É executada toda vez, no início)
                3ª parte = Execução após a execução das operações (É executada toda vez, no final)
            
            Execução:   1ª ->
                        2ª -> OP -> 3ª
        */
        var lst_1stPart = Library.newMatriz(1, 2), lst_2ndPart = Library.newMatriz(1, 2), lst_3rdPart = Library.newMatriz(1, 2);
        var num_SemiColon = 0;
        //Percorrendo todos os parâmetros, ignorando o '('
        for (var iCount = 0; iCount < parameters_tokens.length; iCount++) {
            //Se for um ponto e vírgula sabe-se que é um novo parâmetro se iniciando
            if (parameters_tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.SEMICOLON) {
                num_SemiColon++;
            }
            else {
                //Se não for um ponto e vírgula verifica quantos ponto e vírgula já existem para poder fazer a separação correta dos tokens
                switch (num_SemiColon) {
                    case 0:
                        {
                            lst_1stPart.push(parameters_tokens[iCount]);
                            break;
                        }
                    case 1:
                        {
                            lst_2ndPart.push(parameters_tokens[iCount]);
                            break;
                        }
                    case 2:
                        {
                            lst_3rdPart.push(parameters_tokens[iCount]);
                            break;
                        }
                }
            }
        }
        if (identififer.bHaveAlreadyExecuted(main.iLine, main.lstForControl)) {
            variableManager.setValueToVariable(lst_3rdPart);
        }
        else {
            variableManager.setValueToVariable(lst_1stPart);
        }
        answer = this.execIf(lst_2ndPart, variableManager);
        return answer;
    };
    Functions.prototype.execIf = function (parameters_tokens, variableManager) {
        var operators = Library.newMatriz(1, 3);
        var values_tokens = Library.newMatriz(1, 2);
        var operatorVerification;
        var indexVerificator = 0;
        var bFunctionReturn;
        for (var iCount = 0; iCount < parameters_tokens.length; iCount++) {
            //outputString += parameters[iCount][0] + " | (" + parameters[iCount][1] + ")\n";
            switch (parameters_tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                case TokenIdentifier.TYPE_FLOAT_CONST:
                case TokenIdentifier.TYPE_STRING_CONST:
                case TokenIdentifier.TYPE_INT_CONST:
                    {
                        values_tokens.push(parameters_tokens[iCount]);
                        break;
                    }
                case TokenIdentifier.VERIFY_D:
                    {
                        operatorVerification = TokenIdentifier.VERIFY_D;
                        indexVerificator = iCount;
                        break;
                    } //<>
                case TokenIdentifier.VERIFY_E:
                    {
                        operatorVerification = TokenIdentifier.VERIFY_E;
                        indexVerificator = iCount;
                        break;
                    } //==
                case TokenIdentifier.VERIFY_GET:
                    {
                        operatorVerification = TokenIdentifier.VERIFY_GET;
                        indexVerificator = iCount;
                        break;
                    } //>=
                case TokenIdentifier.VERIFY_GT:
                    {
                        operatorVerification = TokenIdentifier.VERIFY_GT;
                        indexVerificator = iCount;
                        break;
                    } //>
                case TokenIdentifier.VERIFY_LET:
                    {
                        operatorVerification = TokenIdentifier.VERIFY_LET;
                        indexVerificator = iCount;
                        break;
                    } //<=
                case TokenIdentifier.VERIFY_LT:
                    {
                        operatorVerification = TokenIdentifier.VERIFY_LT;
                        indexVerificator = iCount;
                        break;
                    } //<
                case TokenIdentifier.VARIABLE:
                    {
                        var variable = variableManager.getVariable(parameters_tokens[iCount][TokenIdentifier.INDEX_TOKENS_VALUE]);
                        switch (variable[TokenIdentifier.INDEX_VARIABLES_TYPE]) {
                            case TokenIdentifier.TYPE_FLOAT:
                                {
                                    values_tokens.push([variable[TokenIdentifier.INDEX_VARIABLES_VALUE], TokenIdentifier.TYPE_FLOAT_CONST]);
                                    break;
                                }
                            case TokenIdentifier.TYPE_INT:
                                {
                                    values_tokens.push([variable[TokenIdentifier.INDEX_VARIABLES_VALUE], TokenIdentifier.TYPE_INT_CONST]);
                                    break;
                                }
                            case TokenIdentifier.TYPE_STRING:
                                {
                                    values_tokens.push([variable[TokenIdentifier.INDEX_VARIABLES_VALUE], TokenIdentifier.TYPE_STRING_CONST]);
                                    break;
                                }
                        }
                        break;
                    }
                default:
                    {
                        values_tokens.push(parameters_tokens[iCount]);
                    }
            }
        }
        //Deixa somente dois valores, um antes e um depois do verificador
        if (indexVerificator > 0) {
            //Verifica se só tem um token antes do verificador
            if (indexVerificator > 2) {
                var tempValues_tokens = values_tokens.slice(0, indexVerificator - 1);
                values_tokens[0] = variableManager.setValueToVariable(tempValues_tokens, true);
            }
            //Verifica se só tem um token depois do verificador
            if (indexVerificator + 1 < values_tokens.length) {
                var tempValues_tokens = values_tokens.slice(indexVerificator - 1, values_tokens.length);
                values_tokens[1] = variableManager.setValueToVariable(tempValues_tokens, true);
            }
        }
        //Atribui o valor à função de retorno
        switch (operatorVerification) {
            case TokenIdentifier.VERIFY_D:
                {
                    bFunctionReturn = values_tokens[0][TokenIdentifier.INDEX_TOKENS_VALUE] != values_tokens[1][TokenIdentifier.INDEX_TOKENS_VALUE];
                    break;
                }
            case TokenIdentifier.VERIFY_E:
                {
                    bFunctionReturn = values_tokens[0][TokenIdentifier.INDEX_TOKENS_VALUE] == values_tokens[1][TokenIdentifier.INDEX_TOKENS_VALUE];
                    break;
                }
            case TokenIdentifier.VERIFY_GET:
                {
                    bFunctionReturn = values_tokens[0][TokenIdentifier.INDEX_TOKENS_VALUE] >= values_tokens[1][TokenIdentifier.INDEX_TOKENS_VALUE];
                    break;
                }
            case TokenIdentifier.VERIFY_GT:
                {
                    bFunctionReturn = values_tokens[0][TokenIdentifier.INDEX_TOKENS_VALUE] > values_tokens[1][TokenIdentifier.INDEX_TOKENS_VALUE];
                    break;
                }
            case TokenIdentifier.VERIFY_LET:
                {
                    bFunctionReturn = values_tokens[0][TokenIdentifier.INDEX_TOKENS_VALUE] <= values_tokens[1][TokenIdentifier.INDEX_TOKENS_VALUE];
                    break;
                }
            case TokenIdentifier.VERIFY_LT:
                {
                    bFunctionReturn = values_tokens[0][TokenIdentifier.INDEX_TOKENS_VALUE] < values_tokens[1][TokenIdentifier.INDEX_TOKENS_VALUE];
                    break;
                }
        }
        return bFunctionReturn;
    };
    Functions.prototype.execPrintf = function (parameters, variableManager) {
        var outputString = "";
        var adicionalParameter = new Array();
        for (var iCount = 0; iCount < parameters.length; iCount++) {
            //outputString += parameters[iCount][0] + " | (" + parameters[iCount][1] + ")\n";
            switch (parameters[iCount][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                case TokenIdentifier.QUOTES_DOUBLE:
                    {
                        this.bString = !this.bString;
                        break;
                    }
                case TokenIdentifier.TYPE_FLOAT_REPRESENTATION:
                    {
                        //Verifica se foi especionado um número de casas decimais após a vírgula para exibir
                        if (parameters[iCount][TokenIdentifier.INDEX_TOKENS_VALUE].indexOf(".") > -1)
                            adicionalParameter.push(parameters[iCount][TokenIdentifier.INDEX_TOKENS_VALUE].substring(parameters[iCount][TokenIdentifier.INDEX_TOKENS_VALUE].indexOf(".") + 1, 3));
                        else
                            adicionalParameter.push("");
                        //Insere na string o placeholder com o índice da variável e o tipo
                        outputString += "< " + this.indexVariableFounded + " - " + TokenIdentifier.TYPE_FLOAT + " - " + adicionalParameter[adicionalParameter.length - 1] + " > ";
                        //Incrementa o indice de variáveis a serem substituídas
                        this.indexVariableFounded++;
                        break;
                    }
                case TokenIdentifier.TYPE_INT_REPRESENTATION:
                    {
                        adicionalParameter.push("");
                        //Insere na string o placeholder com o índice da variável e o tipo
                        outputString += "< " + this.indexVariableFounded + " - " + TokenIdentifier.TYPE_INT + " - " + adicionalParameter[adicionalParameter.length - 1] + " > ";
                        //Incrementa o indice de variáveis a serem substituídas
                        this.indexVariableFounded++;
                        break;
                    }
                case TokenIdentifier.VARIABLE:
                    {
                        //Pega a variável que veio como parâmetro
                        var variable = variableManager.getVariable(parameters[iCount][TokenIdentifier.INDEX_TOKENS_VALUE]);
                        //Identifica o placeholder a ser substituído
                        var placeHolder = "< " + this.indexVariableDisplayed + " - " + variable[TokenIdentifier.INDEX_VARIABLES_TYPE] + " - " + adicionalParameter[this.indexVariableDisplayed] + " >";
                        //Verifica se o placeholder a ser substituído foi encontrado
                        if (outputString.indexOf(placeHolder) > -1) {
                            if (adicionalParameter[this.indexVariableDisplayed].length > 0) {
                                var decimalsToDisplay = Number(adicionalParameter[this.indexVariableDisplayed]);
                                var numToDisplay = variable[TokenIdentifier.INDEX_VARIABLES_VALUE];
                                outputString = outputString.replace(placeHolder, Library.truncateDecimals(numToDisplay, decimalsToDisplay).toString());
                            }
                            else {
                                outputString = outputString.replace(placeHolder, variable[TokenIdentifier.INDEX_VARIABLES_VALUE]);
                            }
                        }
                        //Incrementa o indice de variáveis a serem exibidas
                        this.indexVariableDisplayed++;
                        break;
                    }
                default:
                    {
                        //Caso for uma string, concatena ao painel
                        if (this.bString) {
                            outputString += parameters[iCount][TokenIdentifier.INDEX_TOKENS_VALUE] + " ";
                        }
                    }
            }
        }
        this.txtOutput.value += outputString + "\n";
    };
    Functions.prototype.execScanf = function (parameters, variableManager) {
        var outputString = "";
        for (var iCount = 0; iCount < parameters.length; iCount++) {
            switch (parameters[iCount][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                case TokenIdentifier.QUOTES_DOUBLE:
                    {
                        this.bString = !this.bString;
                        break;
                    }
                case TokenIdentifier.TYPE_FLOAT_REPRESENTATION:
                    {
                        //Insere na string o placeholder com o índice da variável e o tipo
                        outputString += "< " + TokenIdentifier.TYPE_FLOAT + " >";
                        break;
                    }
                case TokenIdentifier.TYPE_INT_REPRESENTATION:
                    {
                        //Insere na string o placeholder com o índice da variável e o tipo
                        outputString += "< " + TokenIdentifier.TYPE_INT + " >";
                        break;
                    }
                case TokenIdentifier.VARIABLE:
                    {
                        //Pega a variável que veio como parâmetro
                        var variable = variableManager.getVariable(parameters[iCount][TokenIdentifier.INDEX_TOKENS_VALUE]);
                        //Identifica o placeholder a ser substituído
                        var placeHolder = "< " + variable[TokenIdentifier.INDEX_VARIABLES_TYPE] + " >";
                        //Verifica se o placeholder a ser substituído foi encontrado
                        if (outputString.indexOf(placeHolder) > -1) {
                            var value;
                            /*swal({  title: "Informe o valor da variável: " + variable[TokenIdentifier.INDEX_VARIABLES_NAME] + " (" + variable[TokenIdentifier.INDEX_VARIABLES_TYPE] + ")",
                                    input: "text",
                                    confirmButtonText: "Ok",
                                    allowOutsideClick: false
                            }).then(function(result){
                                        value = result;
                            });*/
                            value = prompt("Informe o valor da variável: " + variable[TokenIdentifier.INDEX_VARIABLES_NAME] + " (" + variable[TokenIdentifier.INDEX_VARIABLES_TYPE] + ")");
                            if (!(value == null) && !(value == "")) {
                                variableManager.variables[variableManager.getVariableIndex(variable[TokenIdentifier.INDEX_VARIABLES_NAME])][TokenIdentifier.INDEX_VARIABLES_VALUE] = value;
                            }
                            outputString = outputString.replace(placeHolder, variable[TokenIdentifier.INDEX_VARIABLES_VALUE]);
                        }
                        break;
                    }
                default:
                    {
                        //Caso for uma string, concatena ao painel
                        if (this.bString) {
                            outputString += parameters[iCount][TokenIdentifier.INDEX_TOKENS_VALUE] + " ";
                        }
                    }
            }
        }
    };
    return Functions;
}());
