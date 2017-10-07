function execFunction(nameFunction, parameters) {
    // Recebe o painel de output
    var txtOutput = document.getElementById("txtOutput");
    switch (nameFunction) {
        case "printf": {
            var outputString = "";
            for (var iCount = 0; iCount < parameters.length; iCount++) {
                outputString += parameters[iCount][0] + " | (" + parameters[iCount][1] + ")\n";
                //outputString += parameters[iCount][0] + " ";
            }
            txtOutput.value = outputString;
            break;
        }
    }
}
