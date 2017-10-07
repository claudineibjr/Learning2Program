function execFunction(nameFunction: string, parameters: Array<Object>){

    // Recebe o painel de output
    var txtOutput: HTMLInputElement = ( <HTMLInputElement> document.getElementById("txtOutput") );

    switch(nameFunction){
        case "printf":{
            var outputString: string = "";
            
            for(var iCount: number = 0; iCount < parameters.length; iCount++){
                outputString += parameters[iCount][0] + " | (" + parameters[iCount][1] + ")\n";
                //outputString += parameters[iCount][0] + " ";
            }

            txtOutput.value = outputString;
            break;
        }
    }

}