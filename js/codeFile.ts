class CodeFile {

    public id: string;
    private code: string;
    private name: string;

    constructor(id: string = "", name: string = "", code: string = "") {
        this.id = id;
        this.name = name;
        this.code = code;
    }

    public getId(): string{
        return this.id;
    }
    public getCode(): string{
        return this.code;
    }
    public getName(): string{
        return this.name;
    }
    public setId(newId: string): void{
        this.id = newId;
    }
    public setCode(newCode: string): void{
        this.code = newCode;
    }
    public setName(newName: string): void{
        this.name = newName;
    }

    public static objectToCode(object: Object): CodeFile{
        var codeFile: CodeFile = new CodeFile();

        if (object == null || object == undefined){
            return undefined;
        }else{
            codeFile.code = object["code"];
            codeFile.id = object["id"];
            codeFile.name = object["name"];

            return codeFile;
        }
    }

}