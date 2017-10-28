class TokenIdentifier {
    
    static readonly STRING                      = "STRING";
    //static readonly PRINTF                      = "PRINTF";
    //static readonly SCANF                       = "SCANF";
    static readonly LIBRARY                     = "INCLUDE";
    
    static readonly VARIABLE                    = "VARIÁVEL";
    
    static readonly ELEMENT_REFERENCE           = "REFERÊNCIA A ENDEREÇO DO ELEMENTO";
    
    static readonly FUNCTION_DECLARATION        = "DECLARAÇÃO DE FUNÇÃO"
    static readonly FUNCTION_CALL               = "CHAMADA DE FUNÇÃO";
    
    static readonly TYPE_INT                    = "TIPO INTEIRO";
    static readonly TYPE_INT_REPRESENTATION     = "REPRESENTAÇÃO DO TIPO INT";
    static readonly TYPE_INT_CONST              = "CONSTANTE INTEIRO";
    
    static readonly TYPE_FLOAT                  = "TIPO FLOAT";
    static readonly TYPE_FLOAT_REPRESENTATION   = "REPRESENTAÇÃO DO TIPO FLOAT";
    static readonly TYPE_FLOAT_CONST            = "CONSTANTE FLOAT";
    
    static readonly TYPE_VOID                   = "TIPO VOID";
    
    static readonly TYPE_CHAR                   = "TIPO CHAR";
    static readonly TYPE_CHAR_REPRESENTATION    = "REPRESENTAÇÃO DO TIPO CHAR";
    static readonly TYPE_CHAR_CONST             = "CONSTANTE CHAR";

    static readonly TYPE_STRING                 = "TIPO STRING";
    static readonly TYPE_STRING_REPRESENTATION  = "REPRESENTAÇÃO DO TIPO STRING";
    static readonly TYPE_STRING_CONST           = "CONSTANTE STRING";
    
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
    static readonly INDEX_TOKENS_VALUE              = 0;
    static readonly INDEX_TOKENS_TYPE               = 1;

    static readonly INDEX_VARIABLES_NAME            = 0;
    static readonly INDEX_VARIABLES_TYPE            = 1;
    static readonly INDEX_VARIABLES_VALUE           = 2;

    static readonly INDEX_OPERATORS_VALUE           = 0;
    static readonly INDEX_OPERATORS_COUNT           = 1;
    static readonly INDEX_OPERATORS_PRIORITY        = 2;

    static readonly INDEX_STATEMENT_KEYS_BEGIN      = 0;
    static readonly INDEX_STATEMENT_KEYS_END        = 1;
    static readonly INDEX_STATEMENT_KEYS_RESULT     = 2;

    static readonly INDEX_IF_ELSE_CONTROL_BEGIN     = 0;
    static readonly INDEX_IF_ELSE_CONTROL_END       = 1;
    static readonly INDEX_IF_ELSE_CONTROL_RESULT    = 2;
    
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

    //Variável que será utilizada para identificar se é um parâmetro e a cadeia de parênteses
    private intParameter: number;

    //Variável que conterá o nome da função a ser executada
    private nameFunction: string;

    private variableManager;

    //Cria uma matriz que conterá a palavra e sua identificação
    private tokens: Array<Object> = newMatriz(1,2);

    private _main: Main;

    constructor(){
        this.bString = false;
        this.bComment_sameLine = false;
        this.bComment_severalLines = false;
        this.lstComment = new Array<string>();
        this.lstParameter = new Array<Object>();
        this.intParameter = 0;

        // Cria a classe responsável por manipular as variáveis
        this.variableManager = new VariableManager(); 

    }

    public identifyTokens(line: Array<string>, main: Main, lineNumber: number): any[]{

        this._main = main;

        //Reescreve o array com as operações, limpando as que já foram abertas
        main.lstPairsKey = this.cleanOpenStatement(main.lstPairsKey, lineNumber);

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

                    case "%d": case "%i": {
                        token = TokenIdentifier.TYPE_INT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    } 

                    case "%f": case "%.1f": case "%.2f": case "%.3f": case "%.4f": case "%.5f": case "%.6f": case "%.7f":  case "%.8f":  case "%.9f": {
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

                                    switch(this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE]){
                                        //>=
                                        case TokenIdentifier.VERIFY_GT:{
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_GET;
                                            break;
                                        }

                                        //<=
                                        case TokenIdentifier.VERIFY_LT: {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_LET;
                                            break;
                                        }

                                        //+=
                                        case TokenIdentifier.OP_SUM: {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.ASSIGMENT_PE;
                                            break;
                                        }

                                        //-+
                                        case TokenIdentifier.OP_SUBTRACTION: {
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.ASSIGMENT_ME;
                                            break;
                                        }

                                        //==
                                        case TokenIdentifier.ASSIGMENT:{
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                            this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_E;
                                            break;
                                        }

                                        default: {

                                            switch(this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE]){
                                                case "!":{
                                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                                    this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_D;
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
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.OP_SUM){
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.ASSIGMENT_PP;
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
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.OP_SUBTRACTION){
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.ASSIGMENT_MM;
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
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.OP_DIVISAO){
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.COMMENT_MULTI_LINE_B;
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
                                    if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.OP_DIVISAO){
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.COMMENT_LINE;
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
                                
                                var bAlreadySummedUp: boolean = false;

                                // Verifica se é chamada ou declaração de função
                                if (this.tokens.length >= 2){
                                    if ((this.tokens[this.tokens.length - 2][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.TYPE_FLOAT || this.tokens[this.tokens.length - 2][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.TYPE_INT || this.tokens[this.tokens.length - 2][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.TYPE_VOID)
                                    && (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.VARIABLE) ){

                                        // Caso o ultimo token seja uma variável e o antepenultimo seja um tipo, entende-se que é uma declaração de função
                                        this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.FUNCTION_DECLARATION;

                                    }else{

                                        // Verifica o último token, pode ser que seja uma função
                                        switch(this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE]){
                                            case TokenIdentifier.VARIABLE:
                                            case TokenIdentifier.VERIFY_FUNCTION:{
                                                //O que antes era um if poe se tornar uma chamada de função
                                                this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.FUNCTION_CALL;
                                                this.intParameter++;
                                                bAlreadySummedUp = true;
                                                this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE];                                                
                                                break;
                                            }
                                        }

                                    }
                                }else{
                                    if (this.tokens.length >= 1){

                                        // Verifica o último token, pode ser que seja uma função
                                        switch(this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE]){
                                            case TokenIdentifier.VARIABLE:
                                            case TokenIdentifier.VERIFY_FUNCTION:{
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

                                if (!bAlreadySummedUp){
                                    this.intParameter++;
                                }

                                break;
                            }

                            case ")":       {
                                token = TokenIdentifier.PARENTHESIS_CLOSE;

                                //if (this.bParameter == true){
                                if (this.intParameter > 1){
                                    this.intParameter--;
                                }else{
                                    if (this.intParameter == 1){
                                        execFunction(this.nameFunction, this.lstParameter, this.variableManager, this, main, lineNumber);
                                        //this.bParameter = false;
                                        this.intParameter--;
                                        this.nameFunction = this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE];
                                        this.lstParameter = new Array<Object>();
                                    }
                                }
                                break;
                            }

                            case ";": {
                                token = TokenIdentifier.SEMICOLON;
                                break;
                            }

                            case "{": {
                                token = TokenIdentifier.KEYS_OPEN;

                                //Identifica onde que fechará este abre chaves
                                var lineEnd: number = this.identifyPair(main.lstPairsKey, lineNumber);

                                //Verifica se a operação é um if e se for, seta onde termina este if
                                main.lstIfElseControl = this.getPreviousStatementAndSetToIfElseControl(lineNumber, lineEnd, main.executeNextStatement, main.lstIfElseControl, main.arrTokens);

                                //Verifica se a próxima operação será executada ou se pulará para o fim deste fecha chaves                                
                                if(!main.executeNextStatement){
                                    main.bModifiedProgramControl = true;
                                    main.iLine = lineEnd;
                                }

                                //Insere o par de chaves encontrado
                                main.lstPairsKey.push([lineNumber, lineEnd, main.executeNextStatement]);

                                break;
                            }
                            
                            case "}": {
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

                                //Quando for um else, só o executa caso o if correspondente não tenha sido executado
                                var linhaVigente, linhaInicio, resposta;

                                for (var jCount = 0; jCount < main.lstIfElseControl.length; jCount++ ){
                                    if (main.lstIfElseControl[jCount][TokenIdentifier.INDEX_IF_ELSE_CONTROL_END] == lineNumber){
                                        linhaVigente = main.lstIfElseControl[jCount][TokenIdentifier.INDEX_IF_ELSE_CONTROL_END];
                                        linhaInicio = main.lstIfElseControl[jCount][TokenIdentifier.INDEX_IF_ELSE_CONTROL_BEGIN];
                                        resposta = !main.lstIfElseControl[jCount][TokenIdentifier.INDEX_IF_ELSE_CONTROL_RESULT];
                                        break;
                                    }
                                }

                                main.executeNextStatement = resposta;

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
                                        if (this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.BRACKET_OPEN){
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
            //if (this.bParameter == true){
            if (this.intParameter > 0){
                // Verifica se o atual token é um igual e se o token anterior é o sinal de maior, menor, mais ou menos
                if (this.lstParameter.length >= 1 && this.tokens.length > 0 ){

                    switch(this.tokens[this.tokens.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE]){

                        case TokenIdentifier.VERIFY_GET:
                        case TokenIdentifier.VERIFY_LET:
                        case TokenIdentifier.ASSIGMENT:{

                            switch(this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE]){
                                //>=
                                case TokenIdentifier.VERIFY_GT:{
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_GET;                                            
                                    break;
                                }

                                //<=
                                case TokenIdentifier.VERIFY_LT: {
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_LET;
                                    break;
                                }
                                
                                //==
                                case TokenIdentifier.ASSIGMENT:{
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] = this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_VALUE] + strWord;
                                    this.lstParameter[this.lstParameter.length - 1][TokenIdentifier.INDEX_TOKENS_TYPE] = TokenIdentifier.VERIFY_E;
                                    break;
                                }

                                default:{
                                    this.lstParameter.push([strWord, token]);
                                }
                            }
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
        this.tokens = this.cleanComments(this.tokens);
        return this.tokens;
    }

    private cleanComments(oldTokens: Array<Object>): Array<Object>{

        //Função responsável por eliminar os comentários

        var newTokens: Array<Object> = newMatriz(1, 2);

        for (var iCount = 0; iCount < oldTokens.length; iCount++){
            switch(oldTokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE]){
                case TokenIdentifier.COMMENT:
                case TokenIdentifier.COMMENT_LINE:
                case TokenIdentifier.COMMENT_MULTI_LINE_B:
                case TokenIdentifier.COMMENT_MULTI_LINE_E:{
                    break;
                }

                default:{
                    newTokens.push([oldTokens[iCount][0], oldTokens[iCount][1]])
                }
            }
        }

        return newTokens;

    }

    private setValueToVariable(): void{
        this.variableManager.setValueToVariable(this.tokens);
    }

    private getVariables(){
        return this.variableManager.getVariables();
    }


    private getPreviousStatementAndSetToIfElseControl(currentLine: number, lineEnd: number, execute: boolean, ifElseControl: Array<Object>, arrTokens: Array<Object>): Array<Object>{
        
        var newIfElseControl: Array<Object> = newMatriz(1, 3);

        for (var iCount = 0; iCount < ifElseControl.length; iCount++){
            newIfElseControl.push([ifElseControl[iCount][0], ifElseControl[iCount][1], ifElseControl[iCount][2]]);
        }

        //Verifica só se o primeiro token da linha é um if
        for (var iCount = 0; iCount < 1; iCount++){
            if (this.tokens[iCount][TokenIdentifier.INDEX_TOKENS_TYPE] == TokenIdentifier.FUNCTION_CALL && this.tokens[iCount][TokenIdentifier.INDEX_TOKENS_VALUE] == "if" ){
                newIfElseControl.push([currentLine, lineEnd, execute]);
                return newIfElseControl;
            }
        }

        return newIfElseControl;

    }

    private identifyPair(statements: Array<Object>, currentLine: number): number{
        //Função que é acionada a cada vez que se encontra uma abre chaves.
        //  O objetivo desta função é retornar onde este abre chaves se encerra.
        
        var linePairFounded: number = -1;

        var pairsFounded: number = statements.length;

        var openKey: number = pairsFounded + 1, closeKey: number = pairsFounded;

        for (var iCount = currentLine + 1; iCount < this._main.lstCodeLine.length; iCount++){
            if (this._main.lstCodeLine[iCount].indexOf("}") > -1){
                closeKey++;
                if (openKey - closeKey == 0)
                    return iCount;
            }
            if (this._main.lstCodeLine[iCount].indexOf("{") > -1){
                openKey++;
            }
        }

        return -1;
    }

    private cleanOpenStatement(statements: Array<Object>, currentLine: number): Array<Object>{
        //Função que irá limpar os statements abertos (ou seja, se já passou pelo início e pelo fim das chaves, ele não deve estar aqui)

        var newStatement: Array<Object> = newMatriz(1, 3);

        for (var iCount = 0; iCount < statements.length; iCount++){
            if (statements[iCount][TokenIdentifier.INDEX_STATEMENT_KEYS_END] > currentLine){
                newStatement.push([ statements[iCount][1], statements[iCount][2], statements[iCount][3] ]);
            }
        }

        return newStatement;

    }

    private setEndIf(lineNumber: number, lineEnd: number): void{

    }
}