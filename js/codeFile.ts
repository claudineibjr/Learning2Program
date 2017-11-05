class CodeFile {

    private id: string;
    public code: string;

    constructor(id: string = "", code: string = "") {
        this.id = id;
        this.code = code;
    }

    public getCode(): string {
        return this.code;
    }
    public getId(): string {
        return this.id;
    }

}