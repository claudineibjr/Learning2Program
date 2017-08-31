var TokenIdentifier = (function () {
    function TokenIdentifier() {
        this.STRING = "STRING";
        this.PRINTF = "PRINTF";
        this.SCANF = "SCANF";
        this.BIBLIOTECA = "INCLUDE";
        this.VARIAVEL = "VARIÁVEL";
        this.TIPO_INT = "TIPO INTEIRO";
        this.TIPO_FLOAT = "TIPO FLOAT";
        this.ATRIBUICAO = "ATRIBUIÇÃO DE VALOR";
        this.OP_SOMA = "OPERAÇÃO DE SOMA";
        this.OP_SUBTRACAO = "OPERAÇÃO DE SUBSTRAÇÃO";
        this.OP_MULTIPLICACAO = "OPERAÇÃO DE MULTIPLICAÇÃO";
        this.OP_DIVISAO = "OPERAÇÃO DE DIVISÃO";
        this.VIRGULA = "VÍRGULA";
        this.PARENTESES_ABRE = "ABRE PARÊNTESES";
        this.PARENTESES_FECHA = "FECHA PARÊNTESES";
        this.DELIMITADOR_DE_LINHA = "PONTO E VÍRGULA";
        this.NUMERAL_INTEIRO = "NÚMERO INTEIRO";
        this.NUMERAL_PONTO_FLUTUANTE = "NÚMERO PONTO FLUTUANTE";
        this.CHAVES_ABRE = "ABRE CHAVES";
        this.CHAVES_FECHA = "FECHA CHAVES";
        this.variables = newMatriz(1, 2);
    }
    TokenIdentifier.prototype.identifyTokens = function (line) {
        var _this = this;
        //Cria uma matriz que conterá a palavra e sua identificação
        var tokens = newMatriz(1, 2);
        var variableType = ""; // string | int | float
        //Para cada palava da linha verifica o token correspondente
        line.forEach(function (strWord) {
            var token = "";
            //console.log(strWord);
            //Identifica o devido token para esta linha
            switch (strWord) {
                case "printf":
                    token = _this.PRINTF;
                    break;
                case "scanf":
                    token = _this.SCANF;
                    break;
                case "include":
                    token = "";
                    break;
                case "int":
                    token = _this.TIPO_INT;
                    variableType = _this.TIPO_INT;
                    break;
                case "float":
                    token = _this.TIPO_FLOAT;
                    variableType = _this.TIPO_FLOAT;
                    break;
                case "=":
                    token = _this.ATRIBUICAO;
                    break;
                case "+":
                    token = _this.OP_SOMA;
                    break;
                case "-":
                    token = _this.OP_SUBTRACAO;
                    break;
                case "*":
                    token = _this.OP_MULTIPLICACAO;
                    break;
                case "/":
                    token = _this.OP_DIVISAO;
                    break;
                case ",":
                    token = _this.VIRGULA;
                    break;
                case "(":
                    token = _this.PARENTESES_ABRE;
                    break;
                case ")":
                    token = _this.PARENTESES_FECHA;
                    break;
                case ";":
                    token = _this.DELIMITADOR_DE_LINHA;
                    break;
                case "{":
                    token = _this.CHAVES_ABRE;
                    break;
                case "}":
                    token = _this.CHAVES_FECHA;
                    break;
                default: {
                    token = _this.VARIAVEL;
                    //Caso for uma variável verifica se ela já foi identificada
                    _this.identifyVariable(strWord, variableType);
                    break;
                }
            }
            tokens.push([strWord, token]);
        });
        return tokens;
    };
    TokenIdentifier.prototype.identifyVariable = function (variable, variableType) {
        var alreadyInserted = false;
        /*variables.forEach(strVariable => {
            if (variable === strVariable)
                alreadyInserted = true;

        });*/
        //if (!alreadyInserted){
        if (variableType != "") {
            this.variables.push([variable, variableType]);
        }
    };
    TokenIdentifier.prototype.getVariables = function () {
        return this.variables;
    };
    return TokenIdentifier;
}());
