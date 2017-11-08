class MemoryViewManager {
    constructor() {

    }

    public static TYPE_IMAGE_MEMORY: number = 1;
    public static TYPE_IMAGE_NEW: number = 2;
    public static TYPE_IMAGE_SET: number = 3;
    public static TYPE_IMAGE_GET: number = 4;

    public static PATH_IMAGE_ROOT: string = "resource\\dynamicMemory\\";

    public static MEMORY_VISIBLE: boolean = false;
    public static IMAGE_VISIBLE: string = "";

    public static showMemoryViewer(show: boolean = !MemoryViewManager.MEMORY_VISIBLE) {

        var leftPanel: HTMLDivElement = < HTMLDivElement > document.getElementById("leftPanel");
        var rightPanel: HTMLDivElement = < HTMLDivElement > document.getElementById("rightPanel");

        if (show) {
            leftPanel.setAttribute("style", "width: 75%;");
            rightPanel.setAttribute("style", "width: 25%; display: inline;");
            MemoryViewManager.MEMORY_VISIBLE = true;
        } else {
            leftPanel.setAttribute("style", "width: 100%;");
            rightPanel.setAttribute("style", "width: 0%; display: none;");
            MemoryViewManager.MEMORY_VISIBLE = false;
        }
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
        //Função responsável por limpar a visualização da memória para que então possa iniciar uma nova visualização da memória

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

    public static createVariableOnMemoryView(variables: Array < Object > , variable) {
        //Função responsável por pintar uma nova linha na visualização da memória 

        var trRow: HTMLTableRowElement = < HTMLTableRowElement > document.getElementById("row_" + variables.length);

        var tdLogicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_LogicalAddress_" + variables.length);
        var tdPhysicalAddress: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_PhysicalAddress_" + variables.length);
        var tdContent: HTMLTableDataCellElement = < HTMLTableDataCellElement > document.getElementById("td_Content_" + variables.length);

        tdLogicalAddress.innerHTML = variable[TokenIdentifier.INDEX_VARIABLES_NAME];
        tdPhysicalAddress.innerHTML = "12x#";
        tdContent.innerHTML = variable[TokenIdentifier.INDEX_VARIABLES_VALUE];

        trRow.className = "newValueToRow";
    }

}