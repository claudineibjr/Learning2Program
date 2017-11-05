class VariableManager {

    //#region Variáveis públicas
    public variables;
    //#endregion

    //#region Variáveis privadas
    //Variáveis que identificam quantos passos foram necessários para encontrar o próximo operador
    private stepToFindNext: number;
    private stepToFindPrevious: number;
    //#endregion

    //#region Construtor da classe
    constructor() {
        this.variables = Library.newMatriz(1, 3);
        this.stepToFindNext = 1;
        this.stepToFindPrevious = 1;
    }
    //#endregion

    //#region Atribuição de valor à variável
    public setValueToVariable(tokens, bVerification: boolean = false, typeOfValueToAssign: string = ""): Object {

        var variableName: string, assigmentType: string;
        var valueToAssign, bFound: boolean = false;
        var variable;

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

        var statement: Array < Object > = new Array < Object > ();

        //Verifica se o primeiro token é uma chamada de função e então, caso seja, ignora e não atribui valor às variáveis
        if (tokens.length > 0){
            if (tokens[0][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.FUNCTION_CALL){
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

                    variable = this.variables[this.getVariableIndex(variableName)];

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

                    bFound = true;
                }
            }

        }

        switch (typeof valueToAssign) {

            //Operações numerais
            case "number":
                {

                    var basicPriority: number = 0;
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
                                    
                                    if (!bVerification)
                                        this.variables[this.getVariableIndex(variableName)][TokenIdentifier.INDEX_VARIABLES_VALUE] = valueToAssign;

                                    return valueToAssign;
                                }
                            case TokenIdentifier.ASSIGMENT_MM:
                                {
                                    valueToAssign = variable[TokenIdentifier.INDEX_VARIABLES_VALUE] - 1;
                                    
                                    if (!bVerification)
                                        this.variables[this.getVariableIndex(variableName)][TokenIdentifier.INDEX_VARIABLES_VALUE] = valueToAssign;

                                    return valueToAssign;
                                }

                        }
                    }

                    valueToAssign = this.setNumericValue(operators, statement);

                    if (!bVerification)
                        this.variables[this.getVariableIndex(variableName)][TokenIdentifier.INDEX_VARIABLES_VALUE] = valueToAssign;

                    return valueToAssign;
                }
        }
    }

    private setNumericValue(operators, statement: Array < Object > ): number {

        var auxVector = Library.newMatriz(1, 3);
        var valueAux;
        var bHasOperators: boolean = (operators.length == 0 ? false : true);

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
        var result: number = 0;

        for (var iCount = 0; iCount < operators.length; iCount++) {

            var value1: number = 0,
                value2: number = 0;

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

            //alert("O resultado de: \n" + Number(value1) + " " + operators[iCount][TokenIdentifier.OPERATORS_I_VALUE] + " " + Number(value2) + "\n\n" + result + "\n\n" + showMatriz(statement, true));

            //Retira o primeiro numero da operação, a própria operação e o segundo numero da operação, e já insere o resultado
            //  Exemplo: Antes = 5 + 2  | Depois = 7

            var numPreviousToDelete: number = this.stepToFindPrevious;
            var numNextToDelete: number = this.stepToFindPrevious + 1 + this.stepToFindNext;

            statement.splice(operators[iCount][TokenIdentifier.INDEX_OPERATORS_COUNT] - numPreviousToDelete, numNextToDelete, [result, TokenIdentifier.TYPE_FLOAT_CONST]);

            //Reordena os indices do array
            var numToReindex: number = 1 + this.stepToFindNext + (this.stepToFindPrevious - 1);
            operators = this.reIndexArray(operators, operators[iCount][TokenIdentifier.INDEX_OPERATORS_COUNT], numToReindex);

            //alert("Deleta antes: " + numPreviousToDelete + "\nAo total: " + numNextToDelete + "\n\nReindexa em: " + numToReindex + "\n\n" + operators[iCount] + "\n\n" + showMatriz(operators, true) + "\n\n" + showMatriz(statement, true));

        }
        if (bHasOperators)
            return Number(result);
        else
            return Number(statement[0][TokenIdentifier.INDEX_TOKENS_VALUE]);
    }

    private getStatement(statement: Array < Object > , operators, index: number, nextValue: boolean) {

        //Função responsável por retornar o primeiro ou o segundo operador da operação
        var iCount = 1;

        //Se estiver procurando pelo segundo valor
        if (nextValue) {
            for (iCount = 1;
                (iCount + index) < statement.length; iCount++) {
                switch (statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                    case TokenIdentifier.TYPE_FLOAT_CONST:
                    case TokenIdentifier.TYPE_INT_CONST:
                        {
                            return statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_VALUE];
                        }

                    case TokenIdentifier.VARIABLE:
                        {
                            var variable = this.variables[this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_VALUE])];
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
                        var variable = this.variables[this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount][TokenIdentifier.INDEX_TOKENS_VALUE])];
                        return variable[TokenIdentifier.INDEX_VARIABLES_VALUE];
                    }

            }

            alert("Não achou o numero sucessor ao operador: " + statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT]][TokenIdentifier.INDEX_TOKENS_VALUE] + "\n\n" + statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] + iCount] + "\n\n" + Library.showMatriz(statement, true) + "\n\n" + Library.showMatriz(operators, true));

        } else {
            //Se estiver procurando pelo primeiro valor

            for (iCount = 1;
                (index - iCount) >= 0; iCount++) {
                switch (statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_TYPE]) {
                    case TokenIdentifier.TYPE_FLOAT_CONST:
                    case TokenIdentifier.TYPE_INT_CONST:
                        {
                            return statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_VALUE];
                        }

                    case TokenIdentifier.VARIABLE:
                        {
                            var variable = this.variables[this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_VALUE])];
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
                        var variable = this.variables[this.getVariableIndex(statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount][TokenIdentifier.INDEX_TOKENS_VALUE])];
                        return variable[TokenIdentifier.INDEX_VARIABLES_VALUE];
                    }

            }

            alert("Não achou o numero anterior ao operador: " + statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT]][TokenIdentifier.INDEX_TOKENS_VALUE] + "\n\n" + statement[operators[index][TokenIdentifier.INDEX_OPERATORS_COUNT] - iCount] + "\n\n" + Library.showMatriz(statement, true) + "\n\n" + Library.showMatriz(operators, true));

        }

    }

    //#endregion

    //#region Funções auxiliares
    private identifyVariable(variable: string, variableType: string) {
        var alreadyInserted: boolean = false;

        if (variableType != "") {
            switch (variableType) {
                case TokenIdentifier.TYPE_INT:
                case TokenIdentifier.TYPE_FLOAT:
                    {
                        this.variables.push([variable, variableType, 0]);
                        break;
                    }

                case TokenIdentifier.TYPE_CHAR:
                case TokenIdentifier.TYPE_STRING:
                    {
                        this.variables.push([variable, variableType, ""]);
                        break;
                    }

                default:
                    {
                        this.variables.push([variable, variableType, null]);
                        break;
                    }
            }
        }
    }

    private reIndexArray(array, index, numToDec) {

        //Reorganiza o array de operadores, mudando o contador indicando onde o operador está
        for (var iCount = 0; iCount < array.length; iCount++) {
            if (array[iCount][TokenIdentifier.INDEX_OPERATORS_COUNT] >= index)
                array[iCount][TokenIdentifier.INDEX_OPERATORS_COUNT] -= numToDec;
        }

        return array;
    }

    public getVariableIndex(variableName: string) {

        //Função que retorna o índice da variável com o nome passado por parâmetro
        for (var iCount = 0; iCount < this.variables.length; iCount++) {
            if (this.variables[iCount][TokenIdentifier.INDEX_VARIABLES_NAME] == variableName) {
                return iCount;
            }
        }
    }

    public getVariable(variableName: string) {

        //Função que retorna a variável com o nome passado por parâmetro
        for (var iCount = 0; iCount < this.variables.length; iCount++) {
            if (this.variables[iCount][TokenIdentifier.INDEX_VARIABLES_NAME] == variableName) {
                return this.variables[iCount];
            }
        }
    }

    public getVariables() {

        //Função que retorna todas as variáveis
        return this.variables;
    }

    //#endregion

}