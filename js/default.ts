class Library{
	public static newMatriz(linhas, colunas) {
		// Criando matriz	
		var table = new Array(linhas);

		if (colunas == undefined) {
			colunas = linhas;
			linhas = 1;
		}

		var i;
		for (i = 0; i < linhas; i++) {
			table[i] = new Array(colunas);
		}
		// Matriz criada
		table.shift()

		//Exemplo de push
		//table.push(["Coluna 1", "Coluna 2"]);

		return table;
	}

	public static showMatriz(matriz, bMatriz, separator ? : string) {
		var linhas, colunas;

		linhas = matriz.length;
		if (bMatriz == true)
			colunas = matriz[linhas - 1].length;

		var texto;
		texto = "";

		if (separator == undefined)
			separator = "\n";

		for (var i = 0; i < linhas; i++) {
			if (bMatriz == true) {
				for (var j = 0; j < colunas; j++) {
					texto = texto + matriz[i][j] + (j + 1 == colunas ? "" : "\t");
				}
				if (i + 1 == linhas)
					texto = texto + "";
				else
					texto = texto + separator;
			} else {
				if (i + 1 == linhas)
					texto = texto + matriz[i] + "";
				else
					texto = texto + matriz[i] + separator;
			}
		}

		return texto;
	}

	public static obterValorEntre(valor, marcadorInicial, marcadorFinal) {
		var resultado;

		if (marcadorFinal == undefined) marcadorFinal = -1;

		if (valor.indexOf(marcadorInicial) > -1) {
			if (valor.indexOf(marcadorFinal) > -1) {
				resultado = valor.substr(valor.indexOf(marcadorInicial) + 1, valor.indexOf(marcadorFinal) - valor.indexOf(marcadorInicial) - 1)
			} else {
				resultado = valor.substr(valor.indexOf(marcadorInicial) + 1);
			}
		} else
			resultado = "";

		return resultado;
	}

	public static replaceValues(value, valueSubstituted, valueToSubstitute) {
		var valueAux;
		valueAux = "";

		for (var i = 0; i < valueSubstituted.length; i++) {
			value = (valueAux == "" ? value : valueAux);
			valueAux = "";

			for (var j = 0; j < value.length; j++) {
				if (value.substr(j, valueSubstituted[i].length) != valueSubstituted[i]) {
					valueAux = valueAux + value.substr(j, valueSubstituted[i].length);
				}
			}
		}

		return valueAux;
	}

	public static truncNum(numero, precisao) {
		// Função responsável por exibir após a vírgula o número de casas decimais definido como a precisão
		return (numero.toString().indexOf("e") > 0 ? numero : numero.toString().substr(0, numero.toString().indexOf(".") + precisao + 1));
	}

	public static truncateDecimals(num: number, digits: number): number {
		var multiplier = Math.pow(10, digits);
		var adjustedNum = num * multiplier
		var truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

		return truncatedNum / multiplier;
	}
}