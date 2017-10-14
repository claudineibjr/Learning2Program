var VariableManager = (function () {
    function VariableManager() {
        this.variables = newMatriz(1, 3);
        this.stepToFindNext = 1;
        this.stepToFindPrevious = 1;
    }
    VariableManager.prototype.setValueToVariable = function (tokens) {
        var variableName, assigmentType;
        var valueToAssign, bFound = false;
        var variable;
        var statement = new Array();
        for (var iCount = 0; iCount < tokens.length; iCount++) {
            //Caso já tenha encontrado a variável, insere o token atual como parte da operação
            if (bFound) {
                statement.push(tokens[iCount]);
            }
            if (tokens[iCount][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.ASSIGMENT ||
                tokens[iCount][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.ASSIGMENT_ME ||
                tokens[iCount][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.ASSIGMENT_MM ||
                tokens[iCount][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.ASSIGMENT_PE ||
                tokens[iCount][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.ASSIGMENT_PP) {
                //Verifica qual o tipo de atribuição e qual a variável que irá ter seu valor atribuído
                if (!bFound) {
                    assigmentType = tokens[iCount][TokenIdentifier.TOKENS_I_TIPO];
                    variableName = tokens[iCount - 1][TokenIdentifier.TOKENS_I_VALOR];
                    switch (this.variables[this.getVariableIndex(variableName)][TokenIdentifier.VARIABLES_I_TYPE]) {
                        case TokenIdentifier.TYPE_FLOAT:
                        case TokenIdentifier.TYPE_INT: {
                            valueToAssign = Number();
                            break;
                        }
                        case TokenIdentifier.TYPE_CHAR:
                        case TokenIdentifier.TYPE_STRING: {
                            valueToAssign = String();
                            break;
                        }
                    }
                    bFound = true;
                }
            }
        }
        switch (typeof valueToAssign) {
            //Operações numerais
            case "number": {
                var basicPriority = 0;
                var operators = newMatriz(1, 3);
                for (var iCount = 0; iCount < statement.length; iCount++) {
                    //Verifica o tipo de operador
                    switch (statement[iCount][TokenIdentifier.TOKENS_I_TIPO]) {
                        case TokenIdentifier.PARENTHESIS_OPEN: {
                            basicPriority += 2;
                            break;
                        }
                        case TokenIdentifier.PARENTHESIS_CLOSE: {
                            basicPriority -= 2;
                            break;
                        }
                        case TokenIdentifier.OP_SUM:
                        case TokenIdentifier.OP_SUBTRACTION: {
                            operators.push([statement[iCount][TokenIdentifier.TOKENS_I_TIPO], iCount, basicPriority]);
                            break;
                        }
                        case TokenIdentifier.OP_MULTIPLICATION:
                        case TokenIdentifier.OP_DIVISAO: {
                            operators.push([statement[iCount][TokenIdentifier.TOKENS_I_TIPO], iCount, basicPriority + 1]);
                            break;
                        }
                    }
                }
                valueToAssign = this.setNumericValue(operators, statement);
                break;
            }
        }
    };
    VariableManager.prototype.identifyVariable = function (variable, variableType) {
        var alreadyInserted = false;
        if (variableType != "") {
            switch (variableType) {
                case TokenIdentifier.TYPE_INT:
                case TokenIdentifier.TYPE_FLOAT: {
                    this.variables.push([variable, variableType, 0]);
                    break;
                }
                case TokenIdentifier.TYPE_CHAR:
                case TokenIdentifier.TYPE_STRING: {
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
    VariableManager.prototype.setNumericValue = function (operators, statement) {
        var auxVector = newMatriz(1, 3);
        var valueAux;
        //Ordena o vetor de acordo com a prioridade
        for (var iCount = 0; iCount < operators.length; iCount++) {
            for (var jCount = 0; jCount < operators.length - 1; jCount++) {
                if (operators[jCount][TokenIdentifier.OPERATORS_I_PRIORITY] < operators[jCount + 1][TokenIdentifier.OPERATORS_I_PRIORITY]) {
                    valueAux = operators[jCount];
                    operators[jCount] = operators[jCount + 1];
                    operators[jCount + 1] = valueAux;
                }
            }
        }
        //Percorre todos
        var result = 0;
        for (var iCount = 0; iCount < operators.length; iCount++) {
            var value1 = 0, value2 = 0;
            this.stepToFindNext = 1;
            this.stepToFindPrevious = 1;
            //Pega os valores para a operação
            value1 = this.getStatement(statement, operators, iCount, false);
            value2 = this.getStatement(statement, operators, iCount, true);
            switch (operators[iCount][TokenIdentifier.OPERATORS_I_VALUE]) {
                case TokenIdentifier.OP_SUM: {
                    result = Number(Number(value1) + Number(value2));
                    //alert("O resultado de: \n" + Number(value1) + " + " + Number(value2) + "\n\n" + result + "\n\n" + showMatriz(statement, true));
                    break;
                }
                case TokenIdentifier.OP_SUBTRACTION: {
                    result = Number(Number(value1) - Number(value2));
                    //alert("O resultado de: \n" + Number(value1) + " - " + Number(value2) + "\n\n" + result + "\n\n" + showMatriz(statement, true));
                    break;
                }
                case TokenIdentifier.OP_MULTIPLICATION: {
                    result = Number(Number(value1) * Number(value2));
                    //alert("O resultado de: \n" + Number(value1) + " * " + Number(value2) + "\n\n" + result + "\n\n" + showMatriz(statement, true));
                    break;
                }
                case TokenIdentifier.OP_DIVISAO: {
                    result = Number(Number(value1) / Number(value2));
                    //alert("O resultado de: \n" + Number(value1) + " / " + Number(value2) + "\n\n" + result + "\n\n" + showMatriz(statement, true));
                    break;
                }
            }
            //Retira o primeiro numero da operação, a própria operação e o segundo numero da operação, e já insere o resultado
            //  Exemplo: Antes = 5 + 2  | Depois = 7
            var numPreviousToDelete = this.stepToFindPrevious;
            var numNextToDelete = this.stepToFindPrevious + 1 + this.stepToFindNext;
            statement.splice(operators[iCount][TokenIdentifier.OPERATORS_I_COUNT] - numPreviousToDelete, numNextToDelete, [result, TokenIdentifier.TYPE_FLOAT_CONST]);
            //Reordena os indices do array
            var numToReindex = 1 + this.stepToFindNext + (this.stepToFindPrevious - 1);
            operators = this.reIndexArray(operators, operators[iCount][TokenIdentifier.OPERATORS_I_COUNT], numToReindex);
            //alert(showMatriz(statement, true));
            //alert("Deleta antes: " + numPreviousToDelete + "\nAo total: " + numNextToDelete + "\n\nReindexa em: " + numToReindex + "\n\n" + operators[iCount] + "\n\n" + showMatriz(operators, true) + "\n\n" + showMatriz(statement, true));
        }
        alert("Valor total é: " + result);
        return Number(result);
    };
    VariableManager.prototype.reIndexArray = function (array, index, numToDec) {
        //Reorganiza o array de operadores, mudando o contador indicando onde o operador está
        for (var iCount = 0; iCount < array.length; iCount++) {
            if (array[iCount][TokenIdentifier.OPERATORS_I_COUNT] >= index)
                array[iCount][TokenIdentifier.OPERATORS_I_COUNT] -= numToDec;
        }
        return array;
    };
    VariableManager.prototype.getStatement = function (statement, operators, index, nextValue) {
        //Função responsável por retornar o primeiro ou o segundo operador da operação
        var iCount = 1;
        if (nextValue) {
            for (iCount = 1; (iCount + index) <= statement.length; iCount++) {
                console.log(statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] + iCount][TokenIdentifier.TOKENS_I_TIPO] + "\t\tiCount: " + iCount + " index: " + index + " Soma: " + Number(index + iCount) + " Max: " + statement.length);
                switch (statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] + iCount][TokenIdentifier.TOKENS_I_TIPO]) {
                    case TokenIdentifier.TYPE_FLOAT_CONST:
                    case TokenIdentifier.TYPE_INT_CONST: {
                        return statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] + iCount][TokenIdentifier.TOKENS_I_VALOR];
                    }
                    default: {
                        this.stepToFindNext++;
                    }
                }
            }
            switch (statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] + iCount][TokenIdentifier.TOKENS_I_TIPO]) {
                case TokenIdentifier.TYPE_FLOAT_CONST:
                case TokenIdentifier.TYPE_INT_CONST: {
                    return statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] + iCount][TokenIdentifier.TOKENS_I_VALOR];
                }
            }
            alert("Não achou o numero sucessor ao operador: " + statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT]][TokenIdentifier.TOKENS_I_VALOR] + "\n\n" + statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] + iCount] + "\n\n" + showMatriz(statement, true) + "\n\n" + showMatriz(operators, true));
        }
        else {
            for (iCount = 1; (iCount + index) <= statement.length; iCount++) {
                switch (statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] - iCount][TokenIdentifier.TOKENS_I_TIPO]) {
                    case TokenIdentifier.TYPE_FLOAT_CONST:
                    case TokenIdentifier.TYPE_INT_CONST: {
                        return statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] - iCount][TokenIdentifier.TOKENS_I_VALOR];
                    }
                    default: {
                        this.stepToFindPrevious++;
                    }
                }
            }
            switch (statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] - iCount][TokenIdentifier.TOKENS_I_TIPO]) {
                case TokenIdentifier.TYPE_FLOAT_CONST:
                case TokenIdentifier.TYPE_INT_CONST: {
                    return statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] - iCount][TokenIdentifier.TOKENS_I_VALOR];
                }
            }
            alert("Não achou o numero anterior ao operador: " + statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT]][TokenIdentifier.TOKENS_I_VALOR] + "\n\n" + statement[operators[index][TokenIdentifier.OPERATORS_I_COUNT] - iCount] + "\n\n" + showMatriz(statement, true) + "\n\n" + showMatriz(operators, true));
        }
    };
    VariableManager.prototype.getVariableIndex = function (variableName) {
        //Função que retorna o índice da variável com o nome passado por parâmetro
        for (var iCount = 0; iCount < this.variables.length; iCount++) {
            if (this.variables[iCount][TokenIdentifier.VARIABLES_I_NAME] == variableName) {
                return iCount;
            }
        }
    };
    VariableManager.prototype.getVariables = function () {
        //Função que retorna todas as variáveis
        return this.variables;
    };
    return VariableManager;
}());
