var txtOutput;
var bString;
var indexVariableFounded;
var indexVariableDisplayed;
function execFunction(nameFunction, parameters, variableManager, identifer) {
    // Recebe o painel de output
    txtOutput = document.getElementById("txtOutput");
    bString = false;
    indexVariableFounded = 0;
    indexVariableDisplayed = 0;
    switch (nameFunction) {
        case "printf": {
            execPrintf(parameters, variableManager);
            break;
        }
        case "scanf": {
            execScanf(parameters, variableManager);
            break;
        }
        default: {
        }
    }
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
