class WordsSplitter {

    private separators: Array < string > ;
    private strDelimiter: string;

    constructor() {

        this.separators = new Array < string > ();

        this.separators.push(" ");
        this.separators.push(";");
        this.separators.push(",");
        this.separators.push("(");
        this.separators.push(")");
        this.separators.push("+");
        this.separators.push("-");
        this.separators.push("*");
        this.separators.push("/");
        this.separators.push("\n");
        this.separators.push("=");
        this.separators.push("{");
        this.separators.push("}");
        this.separators.push("\"");
        this.separators.push("'");
        this.separators.push("'");
        this.separators.push("%d");
        this.separators.push("%i");
        this.separators.push("%f");
        this.separators.push("%c");
        this.separators.push("%s");
        this.separators.push("[");
        this.separators.push("]");
        this.separators.push(">");
        this.separators.push("<");
        this.separators.push("&");

        this.strDelimiter = ";";

    }

    public separateInWords(strCode: string): Array < string > {

        // Variável que conterá a palavra
        var strWord: string;

        // Variável contadora que irá exibir onde foi a última palavra encontrada
        var iCountAux: number = 0;

        // Array que conterá todas as palavras
        var lstWords: Array < string > = new Array < string > ();

        // Variável que identificará se é o início de uma frase
        var beginStatement: boolean = true;

        // For que irá percorrer letra a letra
        for (var iCount: number = 0; iCount < strCode.length; iCount++) {

            // Verifica se a letra que está sendo lida é um separador
            if (this.isSeparator(this.separators, strCode.substring(iCount, iCount + 1))) {

                // Identifica a palavra, pegando desde o contador atual até o contador anterior
                strWord = strCode.substring(iCount, iCountAux);

                //Verifica se é o início de uma frase
                if (beginStatement) {

                    //Caso for o início da frase, insere a palavra inteira no array de palavras
                    lstWords.push(strWord);
                } else {

                    //Caso não for o início de uma frase e for um for um delimitador (;) insere a palavra inteira no array de palavras 
                    if (strWord === this.strDelimiter)
                        lstWords.push(strWord);
                    else {

                        //Caso não for o início de uma frase e não for um delimitador, insere primeiro o primeiro caracter da palavra (o que pode ser um separador na realidade) e depois o resto da palavra
                        lstWords.push(strWord.substring(0, 1));
                        lstWords.push(strWord.substring(1));
                    }
                }

                // Se a palavra atual for um delimitador (ponto e vírgula), identifica que a próxima palavra será no início da frase
                beginStatement = (strWord == this.strDelimiter ? true : false);

                // Contador auxiliar que identificará de onde parou o contador para saber onde inicia a próxima palavra
                iCountAux = iCount;

            }

        }

        //Remove aquilo que é inútil do array de palavras
        //lstWords = this.removeUseless(lstWords);

        return lstWords;
    }

    private isSeparator(stringArray: Array < string > , character: string): boolean {

        /*  ===================
            Propósito da função
            ===================
            Esta função é responsável por verificar se determinado caracter é um separador
        */

        /*ESTA FUNÇÃO É RESPONSÁVEL POR VERIFICAR SE DETERMINADO CARACTER É UM
                SEPARADOR*/

        for (var iCount: number = 0; iCount < stringArray.length; iCount++) {
            if (character === stringArray[iCount])
                return true;
        }

        return false;
    }

    private removeUseless(lstWords: Array < string > ): Array < string > {
        /*  ===================
            Propósito da função
            ===================
            Esta função serve para remover as palavras identificadas que não são nada além de um espaço em branco
        */

        var arrayReturn: Array < string > = new Array < string > ();

        for (var iCount: number = 0; iCount < lstWords.length; iCount++) {
            if (!(lstWords[iCount].trim() == ""))
                arrayReturn.push(lstWords[iCount]);
        }

        return arrayReturn;
    }

}