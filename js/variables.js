var VariableManager = (function () {
    //#endregion
    //#region Construtor da classe
    function VariableManager() {
        this.variables = Library.newMatriz(1, 3);
        this.stepToFindNext = 1;
        this.stepToFindPrevious = 1;
    }
    //#endregion
    //#region Atribuição de valor à variável
    VariableManager.prototype.setValueToVariable = function (tokens, bVerification, typeOfValueToAssign) {
        if (bVerification === void 0) { bVerification = false; }
        if (typeOfValueToAssign === void 0) { typeOfValueToAssign = ""; }
        var variableName, assigmentType;
        var valueToAssign, bFound = false;
        var variable;
        var updateVariableOnMemoryView = false;
        //Caso seja apenas uma verificação não é necessário atribuir valor à variável
        if (bVerification) {
            bFound = true;
        }
        switch (typeOfValueToAssign) {
            case TokenIdentifier.TYPE_BOOLEAN:
                {
                    valueToAssign = Boolean();
                    break;
                }
            case TokenIdentifier.TYPE_STRING:
            case TokenIdentifier.TYPE_CHAR:
                {
                    valueToAssign = String();
                    break;
                }
            case TokenIdentifier.TYPE_INT:
            case TokenIdentifier.TYPE_FLOAT:
                {
                    valueToAssign = Number();
                    break;
                }
            default:
                {
                    if (bVerification)
                        valueToAssign = Number();
                }
        }
        /*var newTokens: Array<Object> = Library.newMatriz(1, 2);
        var indexComma: number = 0;

        for (var iCount = 0; iCount < tokens.length; iCount ++){
            if (tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.COMMA){
                indexComma = iCount;
                newTokens.push*
            }
        }*/
        var statement = new Array();
        //Verifica se o primeiro token é uma chamada de função e então, caso seja, ignora e não atribui valor às variáveis
        if (tokens.length > 0) {
            if (tokens[0][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.FUNCTION_CALL) {
                return;
            }
        }
        for (var iCount = 0; iCount < tokens.length; iCount++) {
            //Caso já tenha encontrado a variável, insere o token atual como parte da operação
            if (bFound) {
                statement.push(tokens[iCount]);
            }
            if (tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.ASSIGMENT ||
                tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.ASSIGMENT_ME ||
                tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.ASSIGMENT_MM ||
                tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.ASSIGMENT_PE ||
                tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.ASSIGMENT_PP) {
                //Verifica qual o tipo de atribuição e qual a variável que irá ter seu valor atribuído
                if (!bFound) {
                    assigmentType = tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE];
                    variableName = tokens[iCount - 1][TokenIdentifier.INDEX_TOKENS_VALUE];
                    //variable = this.variables[this.getVariableIndex(variableName)];
                    variable = this.getVariable(variableName);
                    switch (variable[TokenIdentifier.INDEX_VARIABLES_TYPE]) {
                        case TokenIdentifier.TYPE_FLOAT:
                        case TokenIdentifier.TYPE_INT:
                            {
                                valueToAssign = Number();
                                //Se for ++, --, += ou -=, insere tal token como parte da operação
                                if (tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.ASSIGMENT_ME ||
                                    tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.ASSIGMENT_MM ||
                                    tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.ASSIGMENT_PE ||
                                    tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.ASSIGMENT_PP)
                                    statement.push(tokens[iCount]);
                                break;
                            }
                        case TokenIdentifier.TYPE_CHAR:
                        case TokenIdentifier.TYPE_STRING:
                            {
                                valueToAssign = String();
                                break;
                            }
                    }
                    updateVariableOnMemoryView = true;
                    bFound = true;
                }
            }
        }
        switch (typeof valueToAssign) {
            //Operações numerais
            case "number":
                {
                    var basicPriority = 0;
                    var operators = Library.newMatriz(1, 3);
                    for (var iCount = 0; iCount < statement.length; iCount++) {
                        //Verifica o tipo de operador
                        switch (statement[iCount][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                            case TokenIdentifier.PARENTHESIS_OPEN:
                                {
                                    basicPriority += 2;
                                    break;
                                }
                            case TokenIdentifier.PARENTHESIS_CLOSE:
                                {
                                    basicPriority -= 2;
                                    break;
                                }
                            case TokenIdentifier.OP_SUM:
                            case TokenIdentifier.OP_SUBTRACTION:
                                {
                                    operators.push([statement[iCount][TokenIdentifier.INDEX_TOKENS_TYPE], iCount, basicPriority]);
                                    break;
                                }
                            case TokenIdentifier.OP_MULTIPLICATION:
                            case TokenIdentifier.OP_DIVISAO:
                                {
                                    operators.push([statement[iCount][TokenIdentifier.INDEX_TOKENS_TYPE], iCount, basicPriority + 1]);
                                    break;
                                }
                            case TokenIdentifier.ASSIGMENT_PP:
                                {
                                    valueToAssign = variable[TokenIdentifier.INDEX_VARIABLES_VALUE] + 1;
                                    if (!bVerification) {
                                        //this.variables[this.getVariableIndex(variableName)][TokenIdentifier.INDEX_VARIABLES_VALUE] = valueToAssign;
                                        this.setValueToSpecificVariable(valueToAssign, variableName);
                                    }
                                    return valueToAssign;
                                }
                            case TokenIdentifier.ASSIGMENT_MM:
                                {
                                    valueToAssign = variable[TokenIdentifier.INDEX_VARIABLES_VALUE] - 1;
                                    if (!bVerification) {
                                        //this.variables[this.getVariableIndex(variableName)][TokenIdentifier.INDEX_VARIABLES_VALUE] = valueToAssign;
                                        this.setValueToSpecificVariable(valueToAssign, variableName);
                                    }
                                    return valueToAssign;
                                }
                        }
                    }
                    valueToAssign = this.setNumericValue(operators, statement);
                    if (!bVerification) {
                        //this.variables[this.getVariableIndex(variableName)][TokenIdentifier.INDEX_VARIABLES_VALUE] = valueToAssign;
                        this.setValueToSpecificVariable(valueToAssign, variableName);
                    }
                    //IMAGE_ATTRIBUTION
                    if (updateVariableOnMemoryView)
                        MemoryViewManager.updateVariableOnMemoryView(this, this.getVariables(), variable);
                    return valueToAssign;
                }
        }
    };
    VariableManager.prototype.deleteVariableByName = function (variableName) {
        for (var iCount = 0; iCount < this.variables.length; iCount++) {
            if (this.variables[iCount][TokenIdentifier.INDEX_VARIABLES_NAME] === variableName) {
                this.variables.splice(iCount, 1);
                MemoryViewManager.deleteVariableOnMemoryView(iCount + 1);
                break;
            }
        }
    };
    VariableManager.prototype.setNumericValue = function (operators, statement) {
        var auxVector = Library.newMatriz(1, 3);
        var valueAux;
        var bHasOperators = (operators.length == 0 ? false : true);
        //Ordena o vetor de acordo com a prioridade
        for (var iCount = 0; iCount < operators.length; iCount++) {
            for (var jCount = 0; jCount < operators.length - 1; jCount++) {
                if (operators[jCount][TokenIdentifier.INDEX_OPERATORS_PRIORITY] < operators[jCount + 1][TokenIdentifier.INDEX_OPERATORS_PRIORITY]) {
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
            switch (operators[iCount][TokenIdentifier.INDEX_OPERATORS_VALUE]) {
                case TokenIdentifier.OP_SUM:
                    {
                        result = Number(Number(value1) + Number(value2));
                        break;
                    }
                case TokenIdentifier.OP_SUBTRACTION:
                    {
                        result = Number(Number(value1) - Number(value2));
                        break;
                    }
                case TokenIdentifier.OP_MULTIPLICATION:
                    {
                        result = Number(Number(value1) * Number(value2));
                        break;
                    }
                case TokenIdentifier.OP_DIVISAO:
                    {
                        result = Number(Number(value1) / Number(value2));
                        break;
                    }
            }
            //Retira o primeiro numero da operação, a própria operação e o segundo numero da operação, e já insere o resultado
            //  Exemplo: Antes = 5 + 2  | Depois = 7
            var numPreviousToDelete = this.stepToFindPrevious;
            var numNextToDelete = this.stepToFindPrevious + 1 + this.stepToFindNext;
            statement.splice(operators[iCount][TokenIdentifier.INDEX_OPERATORS_COUNT] - numPreviousToDelete, numNextToDelete, [result, TokenIdentifier.TYPE_FLOAT_CONST]);
            //Reordena os indices do array
            var numToReindex = 1 + this.stepToFindNext + (this.stepToFindPrevious - 1);
            operators = this.reIndexArray(operators, operators[iCount][TokenIdentifier.INDEX_OPERATORS_COUNT], numToReindex);
        }
        if (bHasOperators)
            return Number(result);
        else
            return Number(statement[0][TokenIdentifier.INDEX_TOKENS_VALUE]);
    };
    VariableManager.prototype.getStatement = function (statement, operators, index, nextValue) {
        //Função responsável por retornar o primeiro ou o segundo operador da operação
        var iCount = 1;
        //Se estiver procurando pelo segundo valor
        if (nextValue) {
            for (iCount = 1; (iCount + index) < statement.length; iCount++) {
                switch (statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                    case TokenIdentifier.TYPE_FLOAT_CONST:
                    case TokenIdentifier.TYPE_INT_CONST:
                        {
                            return statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_VALUE];
                        }
                    case TokenIdentifier.VARIABLE:
                        {
                            var variableIndex = this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_VALUE]);
                            var variable = this.getVariableByIndex(variableIndex);
                            //var variable = this.variables[this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_VALUE])];
                            return variable[TokenIdentifier.INDEX_VARIABLES_VALUE];
                        }
                    default:
                        {
                            this.stepToFindNext++;
                        }
                }
            }
            if (statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == undefined)
                return 0;
            switch (statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                case TokenIdentifier.TYPE_FLOAT_CONST:
                case TokenIdentifier.TYPE_INT_CONST:
                    {
                        return statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_VALUE];
                    }
                case TokenIdentifier.VARIABLE:
                    {
                        var variableIndex = this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_VALUE]);
                        var variable = this.getVariableByIndex(variableIndex);
                        //var variable = this.variables[this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_VALUE])];
                        return variable[TokenIdentifier.INDEX_VARIABLES_VALUE];
                    }
            }
            console.log("Não achou o numero sucessor ao operador: " + statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT]][TokenIdentifier.INDEX_TOKENS_VALUE] + "\n\n" + statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount] + "\n\n" + Library.showMatriz(statement, true) + "\n\n" + Library.showMatriz(operators, true));
        }
        else {
            //Se estiver procurando pelo primeiro valor
            for (iCount = 1; (index - iCount) >= 0; iCount++) {
                switch (statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                    case TokenIdentifier.TYPE_FLOAT_CONST:
                    case TokenIdentifier.TYPE_INT_CONST:
                        {
                            return statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_VALUE];
                        }
                    case TokenIdentifier.VARIABLE:
                        {
                            var variableIndex = this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_VALUE]);
                            var variable = this.getVariableByIndex(indexVariable);
                            //var variable = this.variables[this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_VALUE])];
                            return variable[TokenIdentifier.INDEX_VARIABLES_VALUE];
                        }
                    default:
                        {
                            this.stepToFindPrevious++;
                        }
                }
            }
            if (operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount < 0)
                return 0;
            switch (statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                case TokenIdentifier.TYPE_FLOAT_CONST:
                case TokenIdentifier.TYPE_INT_CONST:
                    {
                        return statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_VALUE];
                    }
                case TokenIdentifier.VARIABLE:
                    {
                        var indexVariable = this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_VALUE]);
                        var variable = this.getVariableByIndex(indexVariable);
                        //var variable = this.variables[this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_VALUE])];
                        return variable[TokenIdentifier.INDEX_VARIABLES_VALUE];
                    }
            }
            console.log("Não achou o numero anterior ao operador: " + statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT]][TokenIdentifier.INDEX_TOKENS_VALUE] + "\n\n" + statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount] + "\n\n" + Library.showMatriz(statement, true) + "\n\n" + Library.showMatriz(operators, true));
        }
    };
    //#endregion
    //#region "Get and SetVariable"
    VariableManager.prototype.setValueToSpecificVariable = function (value, variableName) {
        this.variables[this.getVariableIndex(variableName)][TokenIdentifier.INDEX_VARIABLES_VALUE] = value;
        //IMAGE_ATTRIBUTION
        MemoryViewManager.updateVariableOnMemoryView(this, this.getVariables(), this.variables[this.getVariableIndex(variableName)]);
    };
    VariableManager.prototype.getVariableIndex = function (variableName) {
        //Função que retorna o índice da variável com o nome passado por parâmetro
        for (var iCount = 0; iCount < this.variables.length; iCount++) {
            if (this.variables[iCount][TokenIdentifier.INDEX_VARIABLES_NAME] == variableName) {
                return iCount;
            }
        }
    };
    VariableManager.prototype.getVariable = function (variableName) {
        //Função que retorna a variável com o nome passado por parâmetro
        for (var iCount = 0; iCount < this.variables.length; iCount++) {
            if (this.variables[iCount][TokenIdentifier.INDEX_VARIABLES_NAME] == variableName) {
                //IMAGE_RETURN
                MemoryViewManager.getVariableOnMemoryView(this, this.variables, this.variables[iCount]);
                return this.variables[iCount];
            }
        }
    };
    VariableManager.prototype.getVariableByIndex = function (indexVariable) {
        //IMAGE_RETURN
        MemoryViewManager.getVariableOnMemoryView(this, this.variables, this.variables[indexVariable]);
        return this.variables[indexVariable];
    };
    VariableManager.prototype.getVariables = function () {
        //Função que retorna todas as variáveis
        return this.variables;
    };
    //#endregion
    //#region Funções auxiliares
    VariableManager.prototype.identifyVariable = function (variableName, variableType) {
        var alreadyInserted = false;
        var createdVariable = false;
        if (variableType != "") {
            switch (variableType) {
                case TokenIdentifier.TYPE_INT:
                case TokenIdentifier.TYPE_FLOAT:
                    {
                        if (!this.alreadyExistsVariable(variableName)) {
                            this.variables.push([variableName, variableType, 0]);
                            createdVariable = true;
                        }
                        break;
                    }
                case TokenIdentifier.TYPE_CHAR:
                case TokenIdentifier.TYPE_STRING:
                    {
                        if (!this.alreadyExistsVariable(variableName)) {
                            this.variables.push([variableName, variableType, ""]);
                            createdVariable = true;
                        }
                        break;
                    }
                default:
                    {
                        if (!this.alreadyExistsVariable(variableName)) {
                            this.variables.push([variableName, variableType, null]);
                            createdVariable = true;
                        }
                        break;
                    }
            }
        }
        if (createdVariable) {
            MemoryViewManager.createVariableOnMemoryView(this.variables, this.variables[this.variables.length - 1]);
        }
    };
    VariableManager.prototype.alreadyExistsVariable = function (variableName) {
        var answer = false;
        for (var iCount = 0; iCount < this.variables.length; iCount++) {
            if (variableName == this.variables[iCount][TokenIdentifier.INDEX_VARIABLES_NAME]) {
                answer = true;
                return answer;
            }
        }
        return answer;
    };
    VariableManager.prototype.reIndexArray = function (array, index, numToDec) {
        //Reorganiza o array de operadores, mudando o contador indicando onde o operador está
        for (var iCount = 0; iCount < array.length; iCount++) {
            if (array[iCount][TokenIdentifier.INDEX_OPERATORS_COUNT] >= index)
                array[iCount][TokenIdentifier.INDEX_OPERATORS_COUNT] -= numToDec;
        }
        return array;
    };
    return VariableManager;
}());
