var txtOutput: HTMLInputElement;
var bString: boolean;
var indexVariableFounded: number;
var indexVariableDisplayed: number;

function execFunction(nameFunction: string, parameters: Array<Object>, variableManager: VariableManager, identifer: TokenIdentifier, main: Main){

    // Recebe o painel de output
    txtOutput = ( <HTMLInputElement> document.getElementById("txtOutput") );
    bString = false;
    indexVariableFounded = 0;
    indexVariableDisplayed = 0;

    switch(nameFunction){
        case "printf":{
            execPrintf(parameters, variableManager);
            break;
        }
        
        case "scanf":{
            execScanf(parameters, variableManager);
            break;
        }

        case "if":{
            execIf(parameters, variableManager);
            //main.iLine++;
            //console.log("Linha atual: " + Number(main.iLine + 1));
            //main.iLine++;
            break;
        }

        default:{
            
        }
    }
}

function execIf(parameters: Array<Object>, variableManager: VariableManager){

    var operators = newMatriz(1, 3);
    var values = newMatriz(1,2);
    
    for(var iCount: number = 1; iCount < parameters.length; iCount++){
        //outputString += parameters[iCount][0] + " | (" + parameters[iCount][1] + ")\n";
        /*switch(parameters[iCount][TokenIdentifier.TOKENS_I_TIPO]){
            case TokenIdentifier.TYPE_FLOAT_REPRESENTATION:
            case TokenIdentifier.TYPE_STRING_REPRESENTATION:
            case TokenIdentifier.TYPE_INT_REPRESENTATION:{
                operators.push();
                break;
            }

            case TokenIdentifier.VERIFY_D:
            case TokenIdentifier.VERIFY_E:
            case TokenIdentifier.VERIFY_GET:
            case TokenIdentifier.VERIFY_GT:
            case TokenIdentifier.VERIFY_LET:
            case TokenIdentifier.VERIFY_LT:{
                break;
            }

            case TokenIdentifier.VARIABLE:{
                break;
            }

            default:{
                
            }

        }*/

        values.push(parameters[iCount]);

    }

    console.log(values);
    alert(variableManager.setValueToVariable(values, true));


}

function execPrintf(parameters: Array<Object>, variableManager: VariableManager){
    
    var outputString: string = "";
    
    for(var iCount: number = 1; iCount < parameters.length; iCount++){
        //outputString += parameters[iCount][0] + " | (" + parameters[iCount][1] + ")\n";
        switch(parameters[iCount][TokenIdentifier.TOKENS_I_TIPO]){
            case TokenIdentifier.QUOTES_DOUBLE:{
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
                var placeHolder: string = "< " + indexVariableDisplayed + " - " + variable[TokenIdentifier.VARIABLES_I_TYPE] + " >";
                
                //Verifica se o placeholder a ser substituído foi encontrado
                if (outputString.indexOf(placeHolder) > -1){
                    outputString = outputString.replace(placeHolder, variable[TokenIdentifier.VARIABLES_I_VALUE]);
                }

                //Incrementa o indice de variáveis a serem exibidas
                indexVariableDisplayed++;
                break;
            }

            default: {
                //Caso for uma string, concatena ao painel
                if (bString){
                    outputString += parameters[iCount][TokenIdentifier.TOKENS_I_VALOR] + " ";
                }
            }

        }
    }

    txtOutput.value += outputString + "\n";        
}

function execScanf(parameters: Array<Object>, variableManager: VariableManager){

    var outputString: string = "";
    
    for(var iCount: number = 1; iCount < parameters.length; iCount++){
        switch(parameters[iCount][TokenIdentifier.TOKENS_I_TIPO]){
            case TokenIdentifier.QUOTES_DOUBLE:{
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
                var placeHolder: string = "< " + variable[TokenIdentifier.VARIABLES_I_TYPE] + " >";
                
                //Verifica se o placeholder a ser substituído foi encontrado
                if (outputString.indexOf(placeHolder) > -1){                            
                    var value = prompt("Informe o valor da variável: " + variable[TokenIdentifier.VARIABLES_I_NAME], variable[TokenIdentifier.VARIABLES_I_TYPE]);
                    
                    if (!(value == null) && !(value == "")){
                        variableManager.variables[variableManager.getVariableIndex(variable[TokenIdentifier.VARIABLES_I_NAME])][TokenIdentifier.VARIABLES_I_VALUE] = value;
                    }

                    outputString = outputString.replace(placeHolder, variable[TokenIdentifier.VARIABLES_I_VALUE]);
                }

                break;
            }

            default:{
                //Caso for uma string, concatena ao painel
                if (bString){

                    outputString += parameters[iCount][TokenIdentifier.TOKENS_I_VALOR] + " ";
                }
            }                    
        }
    }
}