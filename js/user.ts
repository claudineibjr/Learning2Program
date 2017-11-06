class User {

    private uid: string;
    private email: string;
    private name: string;
    private codeFiles: Array < CodeFile > ;
    private preferences: Preferences;

    constructor(uid: string = null, email: string = null, name: string = "", codeFiles: Array < CodeFile > = new Array < CodeFile > (), preferences: Preferences = new Preferences()) {
        this.uid = uid;
        this.email = email;
        this.name = name;
        this.codeFiles = codeFiles;
        this.preferences = preferences;
    }

    public setUid(newUid: string): void {
        this.uid = newUid;
    }
    public setEmail(newEmail: string): void {
        this.email = newEmail;
    }
    public setName(newName: string): void {
        this.name = newName;
    }
    public setCodeFiles(newCodeFiles: Array < CodeFile > ): void {
        this.codeFiles = newCodeFiles;
    }
    public setPreferences(newPreferences: Preferences): void {
        this.preferences = newPreferences;
    }

    public getUid(): string {
        return this.uid;
    }
    public getEmail(): string {
        return this.email;
    }
    public getName(): string {
        return this.name;
    }
    public getCodeFiles(): Array < CodeFile > {
        return this.codeFiles;
    }
    public getPreferences(): Preferences {
        return this.preferences;
    }

    public static objectToUser(object: Object): User {
        //Função que convert um objeto para a classe Usuário
        var user = new User();

        if (object == null || object == undefined){
            return undefined;
        }else{
            user.uid = object["uid"];
            user.email = object["email"];
            user.name = object["name"];
            user.codeFiles = object["codeFiles"];
    
            /*user.codeFiles = new Array<CodeFile>();
            for (var iCount = 0; iCount < object["codeFiles"].length; iCount++ ){
                var newCodeFile: CodeFile = new CodeFile();
                //newCodeFile.setId()
                user.codeFiles.push(new CodeFile)
            }*/
            
            user.preferences = new Preferences();
            user.preferences.setFontSize(object["preferences.fontSize"]);
            user.preferences.setFontSize(object["preferences.lastCodeFileOpen"]);
    
            return user;
        }
    }

}