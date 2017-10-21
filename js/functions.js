var txtOutput;
var bString;
var indexVariableFounded;
var indexVariableDisplayed;
function execFunction(nameFunction, parameters_tokens, variableManager, identifer, main) {
    // Recebe o painel de output
    txtOutput = document.getElementById("txtOutput");
    bString = false;
    indexVariableFounded = 0;
    indexVariableDisplayed = 0;
    switch (nameFunction) {
        case "printf": {
            execPrintf(parameters_tokens, variableManager);
            break;
        }
        case "scanf": {
            execScanf(parameters_tokens, variableManager);
            break;
        }
        case "if": {
            execIf(parameters_tokens, variableManager);
            //main.iLine++;
            //console.log("Linha atual: " + Number(main.iLine + 1));
            //main.iLine++;
            break;
        }
        default: {
        }
    }
}
function execIf(parameters_tokens, variableManager) {
    var operators = newMatriz(1, 3);
    var values_tokens = newMatriz(1, 2);
    var typeVerification;
    var indexVerificator = 0;
    for (var iCount = 1; iCount < parameters_tokens.length; iCount++) {
        //outputString += parameters[iCount][0] + " | (" + parameters[iCount][1] + ")\n";
        switch (parameters_tokens[iCount][TokenIdentifier.TOKENS_I_TIPO]) {
            case TokenIdentifier.TYPE_FLOAT_CONST:
            case TokenIdentifier.TYPE_STRING_CONST:
            case TokenIdentifier.TYPE_INT_CONST: {
                values_tokens.push(parameters_tokens[iCount]);
                break;
            }
            case TokenIdentifier.VERIFY_D: {
                typeVerification = TokenIdentifier.VERIFY_D;
                indexVerificator = iCount;
                break;
            } //<>
            case TokenIdentifier.VERIFY_E: {
                typeVerification = TokenIdentifier.VERIFY_E;
                indexVerificator = iCount;
                break;
            } //==
            case TokenIdentifier.VERIFY_GET: {
                typeVerification = TokenIdentifier.VERIFY_GET;
                indexVerificator = iCount;
                break;
            } //>=
            case TokenIdentifier.VERIFY_GT: {
                typeVerification = TokenIdentifier.VERIFY_GT;
                indexVerificator = iCount;
                break;
            } //>
            case TokenIdentifier.VERIFY_LET: {
                typeVerification = TokenIdentifier.VERIFY_LET;
                indexVerificator = iCount;
                break;
            } //<=
            case TokenIdentifier.VERIFY_LT: {
                typeVerification = TokenIdentifier.VERIFY_LT;
                indexVerificator = iCount;
                break;
            } //<
            case TokenIdentifier.VARIABLE: {
                var variable = variableManager.getVariable(parameters_tokens[iCount][TokenIdentifier.TOKENS_I_VALOR]);
                switch (variable[TokenIdentifier.VARIABLES_I_TYPE]) {
                    case TokenIdentifier.TYPE_FLOAT: {
                        values_tokens.push([variable[TokenIdentifier.VARIABLES_I_VALUE], TokenIdentifier.TYPE_FLOAT_CONST]);
                        break;
                    }
                    case TokenIdentifier.TYPE_INT: {
                        values_tokens.push([variable[TokenIdentifier.VARIABLES_I_VALUE], TokenIdentifier.TYPE_INT_CONST]);
                        break;
                    }
                    case TokenIdentifier.TYPE_STRING: {
                        values_tokens.push([variable[TokenIdentifier.VARIABLES_I_VALUE], TokenIdentifier.TYPE_STRING_CONST]);
                        break;
                    }
                }
                break;
            }
            default: {
                values_tokens.push(parameters_tokens[iCount]);
            }
        }
    }
    //Deixa somente dois valores, um antes e um depois do verificador
    if (indexVerificator > 0) {
        //Verifica se só tem um token antes do verificador
        if (indexVerificator > 2) {
            var tempValues_tokens = values_tokens.slice(0, indexVerificator - 1);
            console.log("Novos valores para a primeira posição");
            values_tokens[0] = variableManager.setValueToVariable(tempValues_tokens, true);
            console.log(values_tokens[0]);
        }
        //Verifica se só tem um token depois do verificador
        if (indexVerificator + 1 < values_tokens.length) {
            var tempValues_tokens = values_tokens.slice(indexVerificator - 1, values_tokens.length);
            console.log("Novos valores para a segunda posição");
            values_tokens[1] = variableManager.setValueToVariable(tempValues_tokens, true);
            console.log(values_tokens[1]);
        }
    }
    switch (typeVerification) {
    }
    console.log("Valores");
    console.log(values_tokens);
}
function execPrintf(parameters, variableManager) {
    var outputString = "";
    for (var iCount = 1; iCount < parameters.length; iCount++) {
        //outputString += parameters[iCount][0] + " | (" + parameters[iCount][1] + ")\n";
        switch (parameters[iCount][TokenIdentifier.TOKENS_I_TIPO]) {
            case TokenIdentifier.QUOTES_DOUBLE: {
                bString = !bString;
                break;
            }
            case TokenIdentifier.TYPE_FLOAT_REPRESENTATION: {
                //Insere na string o placeholder com o índice da variável e o tipo
                outputString += "< " + indexVariableFounded + " - " + TokenIdentifier.TYPE_FLOAT + " >";
                //Incrementa o indice de variáveis a serem substituídas
                indexVariableFounded++;
                break;
            }
            case TokenIdentifier.TYPE_INT_REPRESENTATION: {
                //Insere na string o placeholder com o índice da variável e o tipo
                outputString += "< " + indexVariableFounded + " - " + TokenIdentifier.TYPE_INT + " >";
                //Incrementa o indice de variáveis a serem substituídas
                indexVariableFounded++;
                break;
            }
            case TokenIdentifier.VARIABLE: {
                //Pega a variável que veio como parâmetro
                var variable = variableManager.getVariable(parameters[iCount][TokenIdentifier.TOKENS_I_VALOR]);
                //Identifica o placeholder a ser substituído
                var placeHolder = "< " + indexVariableDisplayed + " - " + variable[TokenIdentifier.VARIABLES_I_TYPE] + " >";
                //Verifica se o placeholder a ser substituído foi encontrado
                if (outputString.indexOf(placeHolder) > -1) {
                    outputString = outputString.replace(placeHolder, variable[TokenIdentifier.VARIABLES_I_VALUE]);
                }
                //Incrementa o indice de variáveis a serem exibidas
                indexVariableDisplayed++;
                break;
            }
            default: {
                //Caso for uma string, concatena ao painel
                if (bString) {
                    outputString += parameters[iCount][TokenIdentifier.TOKENS_I_VALOR] + " ";
                }
            }
        }
    }
    txtOutput.value += outputString + "\n";
}
function execScanf(parameters, variableManager) {
    var outputString = "";
    for (var iCount = 1; iCount < parameters.length; iCount++) {
        switch (parameters[iCount][TokenIdentifier.TOKENS_I_TIPO]) {
            case TokenIdentifier.QUOTES_DOUBLE: {
                bString = !bString;
                break;
            }
            case TokenIdentifier.TYPE_FLOAT_REPRESENTATION: {
                //Insere na string o placeholder com o índice da variável e o tipo
                outputString += "< " + TokenIdentifier.TYPE_FLOAT + " >";
                break;
            }
            case TokenIdentifier.TYPE_INT_REPRESENTATION: {
                //Insere na string o placeholder com o índice da variável e o tipo
                outputString += "< " + TokenIdentifier.TYPE_INT + " >";
                break;
            }
            case TokenIdentifier.VARIABLE: {
                //Pega a variável que veio como parâmetro
                var variable = variableManager.getVariable(parameters[iCount][TokenIdentifier.TOKENS_I_VALOR]);
                //Identifica o placeholder a ser substituído
                var placeHolder = "< " + variable[TokenIdentifier.VARIABLES_I_TYPE] + " >";
                //Verifica se o placeholder a ser substituído foi encontrado
                if (outputString.indexOf(placeHolder) > -1) {
                    var value = prompt("Informe o valor da variável: " + variable[TokenIdentifier.VARIABLES_I_NAME], variable[TokenIdentifier.VARIABLES_I_TYPE]);
                    if (!(value == null) && !(value == "")) {
                        variableManager.variables[variableManager.getVariableIndex(variable[TokenIdentifier.VARIABLES_I_NAME])][TokenIdentifier.VARIABLES_I_VALUE] = value;
                    }
                    outputString = outputString.replace(placeHolder, variable[TokenIdentifier.VARIABLES_I_VALUE]);
                }
                break;
            }
            default: {
                //Caso for uma string, concatena ao painel
                if (bString) {
                    outputString += parameters[iCount][TokenIdentifier.TOKENS_I_VALOR] + " ";
                }
            }
        }
    }
}
