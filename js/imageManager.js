var MemoryViewManager = (function () {
    function MemoryViewManager() {
    }
    MemoryViewManager.showMemoryViewer = function (show) {
        if (show === void 0) { show = !MemoryViewManager.MEMORY_VISIBLE; }
        var leftPanel = document.getElementById("leftPanel");
        var rightPanel = document.getElementById("rightPanel");
        if (show) {
            leftPanel.setAttribute("style", "width: 75%;");
            rightPanel.setAttribute("style", "width: 25%; display: inline;");
            MemoryViewManager.MEMORY_VISIBLE = true;
        }
        else {
            leftPanel.setAttribute("style", "width: 100%;");
            rightPanel.setAttribute("style", "width: 0%; display: none;");
            MemoryViewManager.MEMORY_VISIBLE = false;
        }
    };
    MemoryViewManager.getVariableOnMemoryView = function (variableManager, variables, variable) {
        //Função responsável por indicar a utilização de uma variável na visualização de memória
        var variableIndex = variableManager.getVariableIndex(variable[TokenIdentifier.INDEX_VARIABLES_NAME]) + 1;
        var trRow = document.getElementById("row_" + variableIndex);
        trRow.className = "getValueRow";
    };
    MemoryViewManager.updateVariableOnMemoryView = function (variableManager, variables, variable) {
        //Função responsável por atualizar o valor de uma variável na visualização da memória
        var variableIndex = variableManager.getVariableIndex(variable[TokenIdentifier.INDEX_VARIABLES_NAME]) + 1;
        var trRow = document.getElementById("row_" + variableIndex);
        var tdContent = document.getElementById("td_Content_" + variableIndex);
        tdContent.innerHTML = variable[TokenIdentifier.INDEX_VARIABLES_VALUE];
        trRow.className = "newValueToRow";
    };
    MemoryViewManager.backToNormal = function () {
        //Função responsável por "voltar à normalidade" a coloração dos elementos na tabela;        
        for (var iCount = 1; iCount <= 10; iCount++) {
            var trRow = document.getElementById("row_" + iCount);
            if (trRow.className === "newValueToRow" || trRow.className === "getValueRow") {
                trRow.className = "filledRow";
            }
            var tdLogicalAddress = document.getElementById("td_LogicalAddress_" + iCount);
            var tdPhysicalAddress = document.getElementById("td_PhysicalAddress_" + iCount);
            var tdContent = document.getElementById("td_Content_" + iCount);
        }
    };
    MemoryViewManager.cleanMemoryView = function () {
        //Função responsável por limpar a visualização da memória para que então possa iniciar uma nova visualização da memória
        for (var iCount = 1; iCount <= 10; iCount++) {
            var trRow = document.getElementById("row_" + iCount);
            var tdLogicalAddress = document.getElementById("td_LogicalAddress_" + iCount);
            var tdPhysicalAddress = document.getElementById("td_PhysicalAddress_" + iCount);
            var tdContent = document.getElementById("td_Content_" + iCount);
            trRow.className = "emptyRow";
            tdLogicalAddress.innerHTML = "<br/>";
            tdPhysicalAddress.innerHTML = "";
            tdContent.innerHTML = "";
        }
    };
    MemoryViewManager.createVariableOnMemoryView = function (variables, variable) {
        //Função responsável por pintar uma nova linha na visualização da memória 
        var trRow = document.getElementById("row_" + variables.length);
        var tdLogicalAddress = document.getElementById("td_LogicalAddress_" + variables.length);
        var tdPhysicalAddress = document.getElementById("td_PhysicalAddress_" + variables.length);
        var tdContent = document.getElementById("td_Content_" + variables.length);
        tdLogicalAddress.innerHTML = variable[TokenIdentifier.INDEX_VARIABLES_NAME];
        tdPhysicalAddress.innerHTML = "12x#";
        tdContent.innerHTML = variable[TokenIdentifier.INDEX_VARIABLES_VALUE];
        trRow.className = "newValueToRow";
    };
    return MemoryViewManager;
}());
MemoryViewManager.TYPE_IMAGE_MEMORY = 1;
MemoryViewManager.TYPE_IMAGE_NEW = 2;
MemoryViewManager.TYPE_IMAGE_SET = 3;
MemoryViewManager.TYPE_IMAGE_GET = 4;
MemoryViewManager.PATH_IMAGE_ROOT = "resource\\dynamicMemory\\";
MemoryViewManager.MEMORY_VISIBLE = false;
MemoryViewManager.IMAGE_VISIBLE = "";
