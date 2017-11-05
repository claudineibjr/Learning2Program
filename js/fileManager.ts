/*
    Arquitetura do banco de dados do GoogleFirebase
        User (object)
            123 (userid)
                Name (string)
                Email (string)
                Files (object)
                    123 (string, fileID)
                Preferences (object)
                    Font-size (number)
                    LastFileOpen (string, fileID)
*/

class FileManager{
    
    private user: User;

    constructor(user: User){
        this.user = user;
    }

    public openCodeFile(idCodeFile: string = ""): boolean{
        var answer: boolean = false;

        if (this.user == undefined || idCodeFile == ""){
            var code = new CodeFile("teste", 
                                            "int main(){\n " +
                                            "   printf(\"Que bom\");\n" +
                                            "}");
            console.log("Código antes");
            console.log(code);
            localStorage.setItem("code", JSON.stringify(code));
            window.open("learning2program.html", "_self");
            return false;
        }else{

            var arrCodeFiles: Array<CodeFile> = this.user.getCodeFiles();

            var codeFile: CodeFile;
            codeFile = arrCodeFiles.filter(x => x.getId() == idCodeFile)[0];

            var main: Main = new Main(this.user, codeFile);
            window.open("learning2program.html", "_self");

            if (codeFile == undefined){
                return false;
            }else{
                return true;
            }
        }
    }

}