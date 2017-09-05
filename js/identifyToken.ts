class TokenIdentifier {
    
    private STRING                      = "STRING";
    //private PRINTF                      = "PRINTF";
    //private SCANF                       = "SCANF";
    private LIBRARY                     = "INCLUDE";
    
    private VARIABLE                    = "VARIÁVEL";
    
    private ELEMENT_REFERENCE           = "REFERÊNCIA A ENDEREÇO DO ELEMENTO";
    
    private FUNCTION_DECLARATION        = "DECLARAÇÃO DE FUNÇÃO"
    private FUNCAO_CALL                 = "CHAMADA DE FUNÇÃO";
    
    private TYPE_INT                    = "TIPO INTEIRO";
    private TYPE_INT_REPRESENTATION     = "REPRESENTAÇÃO DO TIPO INT";
    private TYPE_INT_CONST              = "CONSTANTE INTEIRO";
    
    private TYPE_FLOAT                  = "TIPO FLOAT";
    private TYPE_FLOAT_REPRESENTATION   = "REPRESENTAÇÃO DO TIPO FLOAT";
    private TYPE_FLOAT_CONST            = "CONSTANTE FLOAT";
    
    private TYPE_VOID                   = "TIPO VOID";
    
    private TYPE_CHAR_REPRESENTATION    = "REPRESENTAÇÃO DO TIPO CHAR";
    private TYPE_STRING_REPRESENTATION  = "REPRESENTAÇÃO DO TIPO STRING";
    
    private ASSIGMENT                   = "ATRIBUIÇÃO DE VALOR";
    private ASSIGMENT_PP                = "ATRIBUIÇÃO DE VALORES SOMANDO 1";
    private ASSIGMENT_MM                = "ATRIBUIÇÃO DE VALORES SUBTRAINDO 1";
    private ASSIGMENT_PE                = "ATRIBUIÇÃO DE VALORES SOMANDO AO VALOR ATUAL";
    private ASSIGMENT_ME                = "ATRIBUIÇÃO DE VALORES SUBTRAINDO DO VALOR ATUAL";
    
    private VERIFY_FUNCTION             = "IF VERIFICAÇÃO BOOLEANA";
    private VERIFY_FUNCTION_ELSE        = "ELSE VERIFICAÇÃO BOOLEANA";
    
    private VERIFY_E                    = "VERIFICAÇÃO DE VALORES IGUAL";
    private VERIFY_GT                   = "VERIFICAÇÃO DE VALORES MAIOR";
    private VERIFY_GET                  = "VERIFICAÇÃO DE VALORES MAIOR IGUAL";
    private VERIFY_LT                   = "VERIFICAÇÃO DE VALORES MENOR";
    private VERIFY_LET                  = "VERIFICAÇÃO DE VALORES MENOR IGUAL";
    private VERIFY_D                    = "VERIFICAÇÃO DE VALORES DIFERENTE";
    
    private REPETITION_DO               = "LAÇO DE REPETIÇÃO DO";

    private OP_SUM                      = "OPERAÇÃO DE SOMA";
    private OP_SUBTRACTION              = "OPERAÇÃO DE SUBSTRAÇÃO";
    private OP_MULTIPLICATION           = "OPERAÇÃO DE MULTIPLICAÇÃO";
    private OP_DIVISAO                  = "OPERAÇÃO DE DIVISÃO";
    
    private COMMA                       = "VÍRGULA";

    private PARENTHESIS_OPEN            = "ABRE PARÊNTESES";
    private PARENTHESIS_CLOSE           = "FECHA PARÊNTESES";

    private SEMICOLON                   = "PONTO E VÍRGULA";

    private KEYS_OPEN                   = "ABRE CHAVES";
    private KEYS_CLOSE                  = "FECHA CHAVES";

    private BRACKET_OPEN                = "ABRE COLCHETE";
    private BRACKET_CLOSE               = "FECHA COLCHETE";

    private QUOTES_SIMPLE               = "ASPAS SIMPLES";
    private QUOTES_DOUBLE               = "ASPAS DUPLAS";

    private COMMENT                     = "COMENTÁRIO";
    private COMMENT_LINE                = "DECLARAÇÃO DE COMENTÁRIO EM LINHA";
    private COMMENT_MULTI_LINE_B        = "INÍCIO DE DECLARAÇÃO DE COMENTÁRIO";
    private COMMENT_MULTI_LINE_E        = "FIM DE DECLARAÇÃO DE COMENTÁRIO";

    private ARRAY_INDEX                 = "ÍNDICE DE ARRAY";


    private variables;
    
    //Variável que será utilizada para identificar se é uma string ou não
    private bString: boolean;

    //Variável que será utilizada para identificar se é um comentário ou não
    private bComment_sameLine: boolean;    

    //Variável que será utilizada para identificar se é um comentário ou não em várias linhas
    private bComment_severalLines: boolean;     
    
    //Array que conterá as informações do comentário
    private lstComment: Array<string>;

    constructor(){
        
        this.variables = newMatriz(1,2);
        this.bString = false;
        this.bComment_sameLine = false;
        this.bComment_severalLines = false;
        this.lstComment = new Array<string>();

    }

    public identifyTokens(line: Array<string>): any[]{
        
        //Cria uma matriz que conterá a palavra e sua identificação
        var tokens = newMatriz(1,2);

        var variableType: string = "";   // string | int | float

        //Array que conterá as informações da string
        var lstString: Array<string> = new Array<string>();

        //Para cada palava da linha verifica o token correspondente
        //line.forEach(strWord => {
        for (var iCount: number = 0; iCount < line.length; iCount++){
            var strWord: string = line[iCount].trim();

            var token: string = "";

            if (this.bString){
            //#region Identificacao de tokens quando string
                switch(strWord){
                    case "\"":{
                        this.bString = false;
                        token = this.QUOTES_DOUBLE;

                        //Insere o texto inteiro de dentro das aspas como uma string 
                        tokens.push([showMatriz(lstString, false, " "), this.STRING]);
                        
                        //Zera o array de strings pois esta acabou
                        lstString = new Array<string>(); 
                        break;
                    }

                    case "%d":{
                        token = this.TYPE_INT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }
                    
                    case "%i" : {
                        token = this.TYPE_INT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }                    

                    case "%f":{
                        token = this.TYPE_FLOAT_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }

                    case "%s":{
                        token = this.TYPE_STRING_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }

                    case "%c":{
                        token = this.TYPE_CHAR_REPRESENTATION;
                        lstString.push(strWord);
                        break;
                    }         
                    
                    case "\n" :{
                        token = this.TYPE_STRING_REPRESENTATION;
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
                //#region Identificação de tokens quando comentário
                    this.lstComment.push(strWord);

                    if(iCount + 1 == line.length){
                        tokens.push([showMatriz(this.lstComment, false, " "), this.COMMENT]);
                        this.bComment_sameLine = false;
                        this.lstComment = Array<string>();
                    }
                //#endregion
                }else{
                    if (this.bComment_severalLines){
                    //#region Identificação de tokens quando comentário em mais de uma linha
                        this.lstComment.push(strWord);
                        
                        if ((strWord === "/") && (this.lstComment.length >= 2)){
                            if (this.lstComment[this.lstComment.length - 2] == "*"){
                                tokens.push([showMatriz(this.lstComment, false, " "), this.COMMENT]);
                                this.bComment_severalLines = false;
                                this.lstComment = Array<string>();

                                tokens.push(["*/", this.COMMENT_MULTI_LINE_E]);
                            }
                        }
                    //#endregion
                    }else{
                    //#region Identificacao de tokens quando nao for comentario nem string
                        //Identifica o devido token para esta linha
                        switch (strWord) {
                            case "include": {
                                token = "";                         
                                break;
                            }
                            
                            case "int":     {
                                token = this.TYPE_INT;              
                                variableType = this.TYPE_INT;
                                break
                            }

                            case "float":   {
                                token = this.TYPE_FLOAT;            
                                variableType = this.TYPE_FLOAT;  
                                break;
                            }
                            
                            case "void":   {
                                token = this.TYPE_VOID;            
                                variableType = this.TYPE_VOID;  
                                break;
                            }                    

                            case "=":       {

                                // Verifica se o token anterior é o sinal de maior, menor, mais ou menos
                                if (tokens.length >= 1){

                                    switch(tokens[tokens.length - 1][1]){
                                        case this.VERIFY_GT:{
                                            tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                            tokens[tokens.length - 1][1] = this.VERIFY_GET;                                            
                                            break;
                                        }

                                        case this.VERIFY_LT: {
                                            tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                            tokens[tokens.length - 1][1] = this.VERIFY_LET;
                                            break;
                                        }

                                        case this.OP_SUM: {
                                            tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                            tokens[tokens.length - 1][1] = this.ASSIGMENT_PE;
                                            break;
                                        }

                                        case this.OP_SUBTRACTION: {
                                            tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                            tokens[tokens.length - 1][1] = this.ASSIGMENT_ME;
                                            break;
                                        }

                                        case this.ASSIGMENT:{
                                            tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                            tokens[tokens.length - 1][1] = this.VERIFY_E;
                                            break;
                                        }

                                        default: {

                                            switch(tokens[tokens.length - 1][0]){
                                                case "!":{
                                                    tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                                    tokens[tokens.length - 1][1] = this.VERIFY_D;
                                                    break;
                                                }

                                                default:{
                                                    token = this.ASSIGMENT;
                                                    break;
                                                }

                                            }

                                            break;
                                        }

                                    }
                                }else{
                                    token = this.ASSIGMENT;
                                }
                                
                                break;
                            }
                            
                            case "+":       {

                                if (tokens.length >= 1){
                                    if (tokens[tokens.length - 1][1] == this.OP_SUM){
                                        tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                        tokens[tokens.length - 1][1] = this.ASSIGMENT_PP;
                                    }else{
                                        token = this.OP_SUM;
                                    }
                                }else{
                                    token = this.OP_SUM;
                                }

                                break;
                            }
                            
                            case "-":       {

                                if (tokens.length >= 1){
                                    if (tokens[tokens.length - 1][1] == this.OP_SUBTRACTION){
                                        tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                        tokens[tokens.length - 1][1] = this.ASSIGMENT_MM;
                                    }else{
                                        token = this.OP_SUBTRACTION;
                                    }
                                }else{
                                    token = this.OP_SUBTRACTION;
                                }
                                
                                break;
                            }

                            case "*":       {
                                //Verifica se é um asterisco seguido de barra, idenficando assim um comentário que pode ser em múltiplas linhas
                                if (tokens.length >=1){
                                    if (tokens[tokens.length - 1][1] == this.OP_DIVISAO){
                                        tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                        tokens[tokens.length - 1][1] = this.COMMENT_MULTI_LINE_B;
                                        this.bComment_severalLines = true;
                                    }else{
                                        token = this.OP_MULTIPLICATION;
                                    }
                                }else{
                                    token = this.OP_MULTIPLICATION;  
                                }

                                break;
                            }

                            case "/":       {

                                //Verifica se é uma dupla barra, identificando assim um comentário em linha
                                if (tokens.length >= 1){
                                    if (tokens[tokens.length - 1][1] == this.OP_DIVISAO){
                                        tokens[tokens.length - 1][0] = tokens[tokens.length - 1][0] + strWord;
                                        tokens[tokens.length - 1][1] = this.COMMENT_LINE;
                                        this.bComment_sameLine = true;
                                    }else{
                                        token = this.OP_DIVISAO;
                                    }
                                }else{
                                    token = this.OP_DIVISAO;
                                }

                                break;
                            }
                            
                            case ",":       {
                                token = this.COMMA;               
                                break;
                            }
                            
                            case "(":       {
                                token = this.PARENTHESIS_OPEN;       
                                
                                // Verifica se é chamada ou declaração de função
                                if (tokens.length >= 2){
                                    if ((tokens[tokens.length - 2][1] == this.TYPE_FLOAT || tokens[tokens.length - 2][1] == this.TYPE_INT || tokens[tokens.length - 2][1] == this.TYPE_VOID)
                                    && (tokens[tokens.length - 1][1] == this.VARIABLE) ){

                                        // Caso o ultimo token seja uma variável e o antepenultimo seja um tipo, entende-se que é uma declaração de função
                                        tokens[tokens.length - 1][1] = this.FUNCTION_DECLARATION;

                                    }else{

                                        // Caso o ultimo token seja uma variável, entende-se que é uma chamada de função
                                        if (tokens[tokens.length - 1][1] == this.VARIABLE){
                                            tokens[tokens.length - 1][1] = this.FUNCAO_CALL;
                                        }
                                    }
                                }else{
                                    if (tokens.length >= 1){

                                        // Caso o ultimo token seja uma variável, entende-se que é uma chamada de função
                                        if (tokens[tokens.length - 1][1] == this.VARIABLE){
                                            tokens[tokens.length - 1][1] = this.FUNCAO_CALL;
                                        }
                                    }
                                }
                                break;
                            }

                            case ")":       {
                                token = this.PARENTHESIS_CLOSE;      
                                break;
                            }

                            case ";":       {
                                token = this.SEMICOLON;  
                                break;
                            }

                            case "{":       {
                                token = this.KEYS_OPEN;           
                                break;
                            }
                            
                            case "}":       {
                                token = this.KEYS_CLOSE;          
                                break;
                            }

                            case "\"":      {
                                token = this.QUOTES_DOUBLE;          
                                this.bString = true;
                                break;
                            }
                            
                            case "'":       {
                                token = this.QUOTES_SIMPLE;         
                                break;
                            }

                            case ">":   {
                                token = this.VERIFY_GT;
                                break;
                            }
                            
                            case "<":   {
                                token = this.VERIFY_LT;
                                break;
                            }

                            case "if":  {
                                token = this.VERIFY_FUNCTION;
                                break;
                            }

                            case "else":    {
                                token = this.VERIFY_FUNCTION_ELSE;
                                break;
                            }

                            case "[": {
                                token = this.BRACKET_OPEN;
                                break;
                            }

                            case "]": {
                                token = this.BRACKET_CLOSE;
                                break;
                            }        
                            
                            case "&": {
                                token = this.ELEMENT_REFERENCE;
                                break;
                            }
                            
                            case "do": {
                                token = this.REPETITION_DO;
                                break;
                            }

                            default: {
                                
                                if (!isNaN(Number(strWord)))
                                    token = this.TYPE_INT_CONST;
                                else{
                                    // Verifica se o anterior é um abre colchete, e então atribui este como um índice de vetor
                                    if (tokens.length >= 1){
                                        if (tokens[tokens.length - 1][1] == this.BRACKET_OPEN){
                                            token = this.ARRAY_INDEX;
                                        }else{

                                            // Caso não for nenhum dos pontos acima identificados, é uma variável
                                            token = this.VARIABLE;

                                            //Caso for uma variável verifica se ela já foi identificada
                                            this.identifyVariable(strWord, variableType);
                                        }
                                    }else{
                                        // Caso não for nenhum dos pontos acima identificados, é uma variável
                                        token = this.VARIABLE;
                                        
                                        //Caso for uma variável verifica se ela já foi identificada
                                        this.identifyVariable(strWord, variableType);                                        
                                    }
                                }
                                break;
                            }
                        }
                    //#endregion
                    }                    
                }
            }

            // Se o token for diferente de vazio, insere na lista
            if (token != "")
                tokens.push([strWord, token]);

        }

        return tokens;
    }

    private identifyVariable(variable: string, variableType: string){
        var alreadyInserted: boolean = false;
        
        /*variables.forEach(strVariable => {
            if (variable === strVariable)
                alreadyInserted = true;

        });*/

        //if (!alreadyInserted){
        if (variableType != ""){
            this.variables.push([variable, variableType]);
        }
    }

    public getVariables(){
        return this.variables;
    }

}