const CONSTANTE = 0; 			//	CRCT K (Carregar constante K)
const CARREGA_VALOR = 1;		//	CRVL N (Carregar Valor)
const SOMA = 2;					//	SOMA (Somar)
const SUBTRACAO = 3;			//	SUBT (Subtração)
const MULTIPLICACAO = 4;		//	MULT (Multiplicação)
const DIVISAO = 5;				//	DIVI (Divisão)
const CONJUNCAO = 6;			//	CONJ (Conjunção: and lógico  True= 1 e False = 0)
const DISJUNCAO = 7;			//	DISJ (Disjunção: or lógico  True= 1 e False = 0)
const COMPARA_MENOR = 8;		//	CMME (Comparar Menor)
const COMPARA_MAIOR = 9;		//	CMMA (Comparar Maior)
const COMPARA_IGUAL = 10;		//	CMIG (Comparar Igual)
const COMPARA_DESIGUAL = 11;	//	CMDG (Comparar Desigual)
const COMPARA_MENOR_IGUAL = 12;	//	CMEG (Comparar menor Igual)
const COMPARA_MAIOR_IGUAL = 13;	//	CMAG (Comparar maior igual)
const INVERTE_SINAL = 14;		//	INVR (Inverte o sinal)
const NEGACAO = 15;				//	NEGA (Negação)
const ARMAZENA = 16;			//	ARMZ N (Armazena o valor do topo na posição N)
const LE_VALOR = 17;			//	LEIT (coloca no topo o valor lido)
const ESCREVE_VALOR = 18;		//	IMPR (coloca no dispositivo de saída o valor do topo)
const IF = 19;					/*	if (expr) then c1 else c2
									<expr>
									DSVF (*)
									----   (c1)
									----
									DSVS (**)
									(*) ----  (c2)
									-----
									(**)
								*/
const DESVIA_FALSO = 20;		//	DSVF p (desvia para p se topo for falso; (p é endereço))
const DESVIA = 21;				//	DSVS q (desvia sempre para q (q é endereço)
const WHILE = 22;				/*	WHILE expr DO c
									L1	expr
										DSVF L2
										c
										DSVS L1
									L2	
								*/
const INICIA_PROGRAMA = 23;		//	INPP (iniciar programa principal. Primeira instrução do programa objeto gerado.)
const ALOCA_ESPACO = 24;		//	AMEM n (aloca espaço na memória (pilha M) para n variáveis)
const DESALOCA_ESPACO = 25;		//	DMEM n (desaloca o espaço das n variáveis alocadas em AMEM)
const PARA_EXECUCAO = 26;		//	PARA (para a execução do MEPA)
const TIPO_VARIAVEL = 27;		//	Tipagem de variáveis
const INICIO_BLOCO = 28;		//	Início de bloco
const FIM_BLOCO = 29;			//	Fim de um bloco de código
const INICIO_PARAMETRO = 30;	//	Parâmetro
const FIM_PARAMETRO = 31;		//	Parâmetro
const SEPARADOR = 32;			//	Vírgula
const PARAMETRO = 33;
const ELSE = 34;
const NOME_PROGRAMA = 100;

var variaveis;
variaveis = new Array();

var numVariaveis;

function onLoad(){
	/*
	Restrições:
		 - As variáveis devem estar maiúsculas
		 - As atribuições devem ter a variável, dois pontos e igual. Ex: X:=
		 - Cada token deve ser separado por um espaço
	*/

}

function setExample(numberExample){
	var readyExample1 = new Array();
	readyExample1.push("PROGRAM TESTE; ");

	var readyExample2 = new Array();
	readyExample2.push("PROGRAM XYZ; ");

	var readyExample3 = new Array();
	readyExample3.push("READ ( NUM ); ");

	var readyExample4 = new Array();
	readyExample4.push("WRITE ( N, F1 ); ");

	var readyExample5 = new Array();
	readyExample5.push("S := S + NUM; ");

	var readyExample6 = new Array();
	readyExample6.push("IF NUM > 0 THEN ");

	var readyExample7 = new Array();
	readyExample7.push("WHILE K <= N DO ");
	
	document.getElementById("pascalCode").value = showMatriz(readyExample2, false);	

	switch(numberExample){
		case 1: { document.getElementById("pascalCode").value = showMatriz(readyExample1, false);	break; }
		case 2: { document.getElementById("pascalCode").value = showMatriz(readyExample2, false);	break; }
		case 3: { document.getElementById("pascalCode").value = showMatriz(readyExample3, false);	break; }
		case 4: { document.getElementById("pascalCode").value = showMatriz(readyExample4, false);	break; }
		case 5: { document.getElementById("pascalCode").value = showMatriz(readyExample5, false);	break; }
		case 6: { document.getElementById("pascalCode").value = showMatriz(readyExample6, false);	break; }
		case 7: { document.getElementById("pascalCode").value = showMatriz(readyExample7, false);	break; }
	}

}