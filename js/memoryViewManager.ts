class MemoryViewManager {
    constructor() {

    }

    public static TYPE_IMAGE_MEMORY: number = 1;
    public static TYPE_IMAGE_NEW: number = 2;
    public static TYPE_IMAGE_SET: number = 3;
    public static TYPE_IMAGE_GET: number = 4;

    public static MAX_OF_VARIABLES_ON_VIEW: number = 10;

    public static PATH_IMAGE_ROOT: string = "resource\\dynamicMemory\\";

    public static MEMORY_VISIBLE: boolean = false;
    public static IMAGE_VISIBLE: string = "";

    public static help() {
        swal({
            titleText: "Ajuda",
            html: "<p><b>Legenda</b></p>" +
                "       <p style='color: black' class='emptyRow'>Campo da memória vazio</p>" +
                "       <p style='color: black' class='filledRow'>Campo da memória preenchido</p>" +
                "       <p style='color: black' class='newValueToRow'>Atribuição de valor à memória</p>" +
                "       <p style='color: black' class='getValueRow'>Busca de valor na memória</p><br/>" +
                "<p>* O endereço físico exibido não corresponde à realidade, é apenas uma simulação do endereçamento de valores na memória.</p>",
            type: "info"
        })
    }

    public static showMemoryViewer(show: boolean = !MemoryViewManager.MEMORY_VISIBLE) {

        var leftPanel: HTMLDivElement = < HTMLDivElement > document.getElementById("leftPanel");
        var rightPanel: HTMLDivElement = < HTMLDivElement > document.getElementById("rightPanel");

        /*if (show) {
            leftPanel.setAttribute("style", "width: 75%;");
            rightPanel.setAttribute("style", "width: 25%; display: inline;");
            MemoryViewManager.MEMORY_VISIBLE = true;
        } else {
            leftPanel.setAttribute("style", "width: 100%;");
            rightPanel.setAttribute("style", "width: 0%; display: none;");
            MemoryViewManager.MEMORY_VISIBLE = false;
        }*/
    }

    public static getVariableOnMemoryView(variableManager: VariableManager, variables: Array < Object > , variable) {
        //Função responsável por indicar a utilização de uma variável na visualização de memória

        var variableIndex: number = variableManager.getVariableIndex(variable[TokenIdentifier.INDEX_VARIABLES_NAME]) + 1;

        var trRow: HTMLTableRowElement = < HTMLTableRowElement > document.getElementById("row_" + variableIndex);
        trRow.className = "getValueRow";
    }

    public static updateVariableOnMemoryView(variableManager: VariableManager, variables: Array < Object > , variable) {
        //Função responsável por atualizar o valor de uma variável na visualização da memória

        var variableIndex: number = variableManager.getVariableIndex(variable[TokenIdentifier.INDEX_VARIABLES_NAME]) + 1;

        var trRow: HTMLTableRowElement = < HTMLTableRowElement > document.getElementById("row_" + variableIndex);

        var tdContent: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_Content_" + variableIndex);

        tdContent.innerHTML = variable[TokenIdentifier.INDEX_VARIABLES_VALUE];

        trRow.className = "newValueToRow";

    }

    public static backToNormal() {
        //Função responsável por "voltar à normalidade" a coloração dos elementos na tabela;        

        for (var iCount = 1; iCount <= 10; iCount++) {
            var trRow: HTMLTableRowElement = < HTMLTableRowElement > document.getElementById("row_" + iCount);

            if (trRow.className === "newValueToRow" || trRow.className === "getValueRow") {
                trRow.className = "filledRow";
            }

            var tdLogicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_LogicalAddress_" + iCount);
            var tdPhysicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_PhysicalAddress_" + iCount);
            var tdContent: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_Content_" + iCount);
        }
    }

    public static cleanMemoryView() {
        //Função responsável por limpar a visualização da memória para que então possa iniciar uma nova visualização da memória ou então limpar um campo específico

        for (var iCount = 1; iCount <= 10; iCount++) {
            var trRow: HTMLTableRowElement = < HTMLTableRowElement > document.getElementById("row_" + iCount);

            var tdLogicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_LogicalAddress_" + iCount);
            var tdPhysicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_PhysicalAddress_" + iCount);
            var tdContent: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_Content_" + iCount);

            trRow.className = "emptyRow";

            tdLogicalAddress.innerHTML = "<br/>";
            tdPhysicalAddress.innerHTML = "";
            tdContent.innerHTML = "";

        }

    }

    public static deleteVariableOnMemoryView(variableIndex) {
        //Função responsável por limpar uma variável que estava na visualização da memória

        var trRow: HTMLTableRowElement = < HTMLTableRowElement > document.getElementById("row_" + variableIndex);

        var tdLogicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_LogicalAddress_" + variableIndex);
        var tdPhysicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_PhysicalAddress_" + variableIndex);
        var tdContent: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_Content_" + variableIndex);

        tdLogicalAddress.innerHTML = "<br/>";
        tdPhysicalAddress.innerHTML = "";
        tdContent.innerHTML = "";

        trRow.className = "emptyRow";
    }

    public static createVariableOnMemoryView(variables: Array < Object > , variable) {
        //Função responsável por pintar uma nova linha na visualização da memória 

        var trRow: HTMLTableRowElement = < HTMLTableRowElement > document.getElementById("row_" + variables.length);

        var tdLogicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_LogicalAddress_" + variables.length);
        var tdPhysicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_PhysicalAddress_" + variables.length);
        var tdContent: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_Content_" + variables.length);

        tdLogicalAddress.innerHTML = variable[TokenIdentifier.INDEX_VARIABLES_NAME];
        tdPhysicalAddress.innerHTML = MemoryViewManager.generateUniqueBinaryNumber(32);
        tdContent.innerHTML = variable[TokenIdentifier.INDEX_VARIABLES_VALUE];

        trRow.className = "newValueToRow";
    }

    private static generateUniqueBinaryNumber(maxNumber: number): string{
        var binaryNumber: string;
        var aleatoryNumber: number = 0;
        var numberAlreadyIsUsed: boolean = true;

        while (numberAlreadyIsUsed){
            aleatoryNumber = Math.floor(Math.random() * maxNumber);
            binaryNumber = aleatoryNumber.toString(2);

            for (var iCount = 0; iCount < MemoryViewManager.MAX_OF_VARIABLES_ON_VIEW; iCount++){
                var tdPhysicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_PhysicalAddress_" + iCount);
                
                if (tdPhysicalAddress != null){
                    if (tdPhysicalAddress.innerHTML != binaryNumber)
                        numberAlreadyIsUsed = false;
                }else{
                    numberAlreadyIsUsed = false;
                }
            }

        }
        
        return binaryNumber;
    }

}