class TokenIdentifier {
    
    static readonly STRING                      = "STRING";
    //static readonly PRINTF                      = "PRINTF";
    //static readonly SCANF                       = "SCANF";
    static readonly LIBRARY                     = "INCLUDE";
    
    static readonly VARIABLE                    = "VARIÁVEL";
    
    static readonly ELEMENT_REFERENCE           = "REFERÊNCIA A ENDEREÇO DO ELEMENTO";
    
    static readonly FUNCTION_DECLARATION        = "DECLARAÇÃO DE FUNÇÃO"
    static readonly FUNCAO_CALL                 = "CHAMADA DE FUNÇÃO";
    
    static readonly TYPE_INT                    = "TIPO INTEIRO";
    static readonly TYPE_INT_REPRESENTATION     = "REPRESENTAÇÃO DO TIPO INT";
    static readonly TYPE_INT_CONST              = "CONSTANTE INTEIRO";
    
    static readonly TYPE_FLOAT                  = "TIPO FLOAT";
    static readonly TYPE_FLOAT_REPRESENTATION   = "REPRESENTAÇÃO DO TIPO FLOAT";
    static readonly TYPE_FLOAT_CONST            = "CONSTANTE FLOAT";
    
    static readonly TYPE_VOID                   = "TIPO VOID";
    
    static readonly TYPE_CHAR                   = "TIPO CHAR";
    static readonly TYPE_CHAR_REPRESENTATION    = "REPRESENTAÇÃO DO TIPO CHAR";

    static readonly TYPE_STRING                 = "TIPO STRING";
    static readonly TYPE_STRING_REPRESENTATION  = "REPRESENTAÇÃO DO TIPO STRING";
    
    static readonly ASSIGMENT                   = "ATRIBUIÇÃO DE VALOR";
    static readonly ASSIGMENT_PP                = "ATRIBUIÇÃO DE VALORES SOMANDO 1";
    static readonly ASSIGMENT_MM                = "ATRIBUIÇÃO DE VALORES SUBTRAINDO 1";
    static readonly ASSIGMENT_PE                = "ATRIBUIÇÃO DE VALORES SOMANDO AO VALOR ATUAL";
    static readonly ASSIGMENT_ME                = "ATRIBUIÇÃO DE VALORES SUBTRAINDO DO VALOR ATUAL";
    
    static readonly VERIFY_FUNCTION             = "IF VERIFICAÇÃO BOOLEANA";
    static readonly VERIFY_FUNCTION_ELSE        = "ELSE VERIFICAÇÃO BOOLEANA";
    
    static readonly VERIFY_E                    = "VERIFICAÇÃO DE VALORES IGUAL";
    static readonly VERIFY_GT                   = "VERIFICAÇÃO DE VALORES MAIOR";
    static readonly VERIFY_GET                  = "VERIFICAÇÃO DE VALORES MAIOR IGUAL";
    static readonly VERIFY_LT                   = "VERIFICAÇÃO DE VALORES MENOR";
    static readonly VERIFY_LET                  = "VERIFICAÇÃO DE VALORES MENOR IGUAL";
    static readonly VERIFY_D                    = "VERIFICAÇÃO DE VALORES DIFERENTE";
    
    static readonly REPETITION_DO               = "LAÇO DE REPETIÇÃO DO";

    static readonly OP_SUM                      = "OPERAÇÃO DE SOMA";
    static readonly OP_SUBTRACTION              = "OPERAÇÃO DE SUBTRAÇÃO";
    static readonly OP_MULTIPLICATION           = "OPERAÇÃO DE MULTIPLICAÇÃO";
    static readonly OP_DIVISAO                  = "OPERAÇÃO DE DIVISÃO";
    
    static readonly COMMA                       = "VÍRGULA";

    static readonly PARENTHESIS_OPEN            = "ABRE PARÊNTESES";
    static readonly PARENTHESIS_CLOSE           = "FECHA PARÊNTESES";

    static readonly SEMICOLON                   = "PONTO E VÍRGULA";

    static readonly KEYS_OPEN                   = "ABRE CHAVES";
    static readonly KEYS_CLOSE                  = "FECHA CHAVES";

    static readonly BRACKET_OPEN                = "ABRE COLCHETE";
    static readonly BRACKET_CLOSE               = "FECHA COLCHETE";

    static readonly QUOTES_SIMPLE               = "ASPAS SIMPLES";
    static readonly QUOTES_DOUBLE               = "ASPAS DUPLAS";

    static readonly COMMENT                     = "COMENTÁRIO";
    static readonly COMMENT_LINE                = "DECLARAÇÃO DE COMENTÁRIO EM LINHA";
    static readonly COMMENT_MULTI_LINE_B        = "INÍCIO DE DECLARAÇÃO DE COMENTÁRIO";
    static readonly COMMENT_MULTI_LINE_E        = "FIM DE DECLARAÇÃO DE COMENTÁRIO";

    static readonly ARRAY_INDEX                 = "ÍNDICE DE ARRAY";

    //Índices dos Arrays
    
    //Tokens
    static readonly TOKENS_I_VALOR              = 0;
    static readonly TOKENS_I_TIPO               = 1;

    static readonly VARIABLES_I_NAME            = 0;
    static readonly VARIABLES_I_TYPE            = 1;
    static readonly VARIABLES_I_VALUE           = 2;

    static readonly OPERATORS_I_VALUE           = 0;
    static readonly OPERATORS_I_COUNT           = 1;
    static readonly OPERATORS_I_PRIORITY        = 2;
    
    //Variável que será utilizada para identificar se é uma string ou não
    private bString: boolean;

    //Variável que será utilizada para identificar se é um comentário ou não
    private bComment_sameLine: boolean;    

    //Variável que será utilizada para identificar se é um comentário ou não em várias linhas
    private bComment_severalLines: boolean;     
    
    //Array que conterá as informações do comentário
    private lstComment: Array<string>;

    //Array que conterá os parâmetros de uma função
    private lstParameter: Array<Object>;

    //Variável que será utilizada para identificar se é um parâmetro
    private bParameter: boolean;

    //Variável que conterá o nome da função a ser executada
    private nameFunction: string;

    private variableManager;

    //Cria uma matriz que conterá a palavra e sua identificação
    private tokens = newMatriz(1,2);

    constructor(){
        this.bString = false;
        this.bComment_sameLine = false;
        this.bComment_severalLines = false;
        this.lstComment = new Array<string>();
        this.lstParameter = new Array<Object>();
        this.bParameter = false;

        // Cria a classe responsável por manipular as variáveis
        this.variableManager = new VariableManager(); 

    }

    public identifyTokens(line: Array<string>): any[]{
        
        //Cria uma matriz que conterá a palavra e sua identificação
        this.tokens = newMatriz(1,2);

        var variableType: string = "";   // string | int | float

        //Array que conterá as informações da string
        var lstString: Array<string> = new Array<string>();

        //Para cada palava da linha verifica o token correspondente
        //line.forEach(strWord => {
        for (var iCount: number = 0; iCount < line.length; iCount++){
            var strWord: string = line[iCount].trim();

            var token: string = "";

            if (this.bString){
            //#region Identificacao de this.tokens quando string
                switch(strWord){
                    case "\"":{
                        this.bString = false;
                        token = TokenIdentifier.QUOTES_DOUBLE;

                        //Insere o texto inteiro de dentro das aspas como uma string 
                        this.tokens.push([showMatriz(lstString, false, " "), TokenIdentifier.STRING]);
                        
                        //Zera o array de strings pois esta acabou
                        lstString = new Array<string>(); 
                        break;
                    }

                    case "%d":{
                        token = TokenIdentifier.TYPE_INT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }
                    
                    case "%i" : {
                        token = TokenIdentifier.TYPE_INT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }                    

                    case "%f":{
                        token = TokenIdentifier.TYPE_FLOAT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }

                    case "%s":{
                        token = TokenIdentifier.TYPE_STRING_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }

                    case "%c":{
                        token = TokenIdentifier.TYPE_CHAR_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }         
                    
                    case "\n" :{
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
            }else{
                if (this.bComment_sameLine){
                //#region Identificação de this.tokens quando comentário
                    this.lstComment.push(strWord);

                    if(iCount + 1 == line.length){
                        this.tokens.push([showMatriz(this.lstComment, false, " "), TokenIdentifier.COMMENT]);
                        this.bComment_sameLine = false;
                        this.lstComment = Array<string>();
                    }
                //#endregion
                }else{
                    if (this.bComment_severalLines){
                    //#region Identificação de this.tokens quando comentário em mais de uma linha
                        this.lstComment.push(strWord);
                        
                        if ((strWord === "/") && (this.lstComment.length >= 2)){
                            if (this.lstComment[this.lstComment.length - 2] == "*"){
                                this.tokens.push([showMatriz(this.lstComment, false, " "), TokenIdentifier.COMMENT]);
                                this.bComment_severalLines = false;
                                this.lstComment = Array<string>();

                                this.tokens.push(["*/", TokenIdentifier.COMMENT_MULTI_LINE_E]);
                            }
                        }
                    //#endregion
                    }else{
                    //#region Identificacao de this.tokens quando nao for comentario nem string
                        //Identifica o devido token para esta linha
                        switch (strWord) {
                            case "include": {
                                token = "";                         
                                break;
                            }
                            
                            case "int":     {
                                token = TokenIdentifier.TYPE_INT;              
                                variableType = TokenIdentifier.TYPE_INT;
                                break
                            }
                            
                            case "char":     {
                                token = TokenIdentifier.TYPE_CHAR;
                                variableType = TokenIdentifier.TYPE_CHAR;
                                break
                            }
                            
                            case "string":     {
                                token = TokenIdentifier.TYPE_STRING;
                                variableType = TokenIdentifier.TYPE_STRING;
                                break
                            }                                                        

                            case "float":   {
                                token = TokenIdentifier.TYPE_FLOAT;            
                                variableType = TokenIdentifier.TYPE_FLOAT;  
                                break;
                            }
                            
                            case "void":   {
                                token = TokenIdentifier.TYPE_VOID;            
                                variableType = TokenIdentifier.TYPE_VOID;  
                                break;
                            }                    

                            case "=":       {

                                // Verifica se o token anterior é o sinal de maior, menor, mais ou menos
                                if (this.tokens.length >= 1){

                                    switch(this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO]){
                                        //>=
                                        case TokenIdentifier.VERIFY_GT:{
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
                                        case TokenIdentifier.ASSIGMENT:{
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.VERIFY_E;
                                            break;
                                        }

                                        default: {

                                            switch(this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR]){
                                                case "!":{
                                                    this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                                    this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.VERIFY_D;
                                                    break;
                                                }

                                                default:{
                                                    token = TokenIdentifier.ASSIGMENT;
                                                    break;
                                                }
                                            }

                                            break;
                                        }
                                    }
                                }else{
                                    token = TokenIdentifier.ASSIGMENT;
                                }

                                break;
                            }
                            
                            case "+":       {

                                if (this.tokens.length >= 1){
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.OP_SUM){
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.ASSIGMENT_PP;
                                    }else{
                                        token = TokenIdentifier.OP_SUM;
                                    }
                                }else{
                                    token = TokenIdentifier.OP_SUM;
                                }

                                break;
                            }
                            
                            case "-":       {

                                if (this.tokens.length >= 1){
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.OP_SUBTRACTION){
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.ASSIGMENT_MM;
                                    }else{
                                        token = TokenIdentifier.OP_SUBTRACTION;
                                    }
                                }else{
                                    token = TokenIdentifier.OP_SUBTRACTION;
                                }
                                
                                break;
                            }

                            case "*":       {
                                //Verifica se é um asterisco seguido de barra, idenficando assim um comentário que pode ser em múltiplas linhas
                                if (this.tokens.length >=1){
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.OP_DIVISAO){
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.COMMENT_MULTI_LINE_B;
                                        this.bComment_severalLines = true;
                                    }else{
                                        token = TokenIdentifier.OP_MULTIPLICATION;
                                    }
                                }else{
                                    token = TokenIdentifier.OP_MULTIPLICATION;  
                                }

                                break;
                            }

                            case "/":       {

                                //Verifica se é uma dupla barra, identificando assim um comentário em linha
                                if (this.tokens.length >= 1){
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.OP_DIVISAO){
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.COMMENT_LINE;
                                        this.bComment_sameLine = true;
                                    }else{
                                        token = TokenIdentifier.OP_DIVISAO;
                                    }
                                }else{
                                    token = TokenIdentifier.OP_DIVISAO;
                                }

                                break;
                            }
                            
                            case ",":       {
                                token = TokenIdentifier.COMMA;               
                                break;
                            }
                            
                            case "(":       {
                                token = TokenIdentifier.PARENTHESIS_OPEN;       
                                
                                // Verifica se é chamada ou declaração de função
                                if (this.tokens.length >= 2){
                                    if ((this.tokens[this.tokens.length - 2][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.TYPE_FLOAT || this.tokens[this.tokens.length - 2][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.TYPE_INT || this.tokens[this.tokens.length - 2][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.TYPE_VOID)
                                    && (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.VARIABLE) ){

                                        // Caso o ultimo token seja uma variável e o antepenultimo seja um tipo, entende-se que é uma declaração de função
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.FUNCTION_DECLARATION;

                                    }else{

                                        // Verifica o último token, pode ser que seja uma função
                                        switch(this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO]){
                                            case TokenIdentifier.VARIABLE:
                                            case TokenIdentifier.VERIFY_FUNCTION:{
                                                this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.FUNCAO_CALL;
                                                this.bParameter = true;
                                                this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR];                                                
                                                break;
                                            }
                                        }

                                    }
                                }else{
                                    if (this.tokens.length >= 1){

                                        // Verifica o último token, pode ser que seja uma função
                                        switch(this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO]){
                                            case TokenIdentifier.VARIABLE:
                                            case TokenIdentifier.VERIFY_FUNCTION:{
                                                this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.FUNCAO_CALL;
                                                this.bParameter = true;
                                                this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR];                                                
                                                break;
                                            }
                                        }

                                    }
                                }
                                break;
                            }

                            case ")":       {
                                token = TokenIdentifier.PARENTHESIS_CLOSE;     

                                if (this.bParameter == true){
                                    execFunction(this.nameFunction, this.lstParameter, this.variableManager, this);
                                    this.bParameter = false;
                                    this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_VALOR];
                                    this.lstParameter = new Array<Object>();
                                }
                                break;
                            }

                            case ";":       {
                                token = TokenIdentifier.SEMICOLON;  
                                break;
                            }

                            case "{":       {
                                token = TokenIdentifier.KEYS_OPEN;           
                                break;
                            }
                            
                            case "}":       {
                                token = TokenIdentifier.KEYS_CLOSE;          
                                break;
                            }

                            case "\"":      {
                                token = TokenIdentifier.QUOTES_DOUBLE;          
                                this.bString = true;
                                break;
                            }
                            
                            case "'":       {
                                token = TokenIdentifier.QUOTES_SIMPLE;         
                                break;
                            }

                            case ">":   {
                                token = TokenIdentifier.VERIFY_GT;
                                break;
                            }
                            
                            case "<":   {
                                token = TokenIdentifier.VERIFY_LT;
                                break;
                            }

                            case "if":  {
                                token = TokenIdentifier.VERIFY_FUNCTION;
                                break;
                            }

                            case "else":    {
                                token = TokenIdentifier.VERIFY_FUNCTION_ELSE;
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
                                else{
                                    // Verifica se o anterior é um abre colchete, e então atribui este como um índice de vetor
                                    if (this.tokens.length >= 1){
                                        if (this.tokens[this.tokens.length - 1][TokenIdentifier.TOKENS_I_TIPO] == TokenIdentifier.BRACKET_OPEN){
                                            token = TokenIdentifier.ARRAY_INDEX;
                                        }else{

                                            // Caso não for nenhum dos pontos acima identificados, é uma variável
                                            token = TokenIdentifier.VARIABLE;

                                            //Caso for uma variável verifica se ela já foi identificada
                                            this.variableManager.identifyVariable(strWord, variableType);
                                        }
                                    }else{
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
            if (this.bParameter == true){
                // Verifica se o token anterior é o sinal de maior, menor, mais ou menos
                if (this.lstParameter.length >= 1){

                    switch(this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_TIPO]){
                        //>=
                        case TokenIdentifier.VERIFY_GT:{
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
                        case TokenIdentifier.ASSIGMENT:{
                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_VALOR] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_VALOR] + strWord;
                            this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.TOKENS_I_TIPO] = TokenIdentifier.VERIFY_E;
                            break;
                        }

                        default:{
                            this.lstParameter.push([strWord, token]);
                        }
                    }
                }else{
                    this.lstParameter.push([strWord, token]);
                }

            }

            // Se o token for diferente de vazio, insere na lista
            if (token != "")
                this.tokens.push([strWord, token]);

        }

        return this.tokens;
    }

    private setValueToVariable(): void{
        this.variableManager.setValueToVariable(this.tokens);
    }

    private getVariables(){
        return this.variableManager.getVariables();
    }
    
}