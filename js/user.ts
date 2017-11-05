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
}