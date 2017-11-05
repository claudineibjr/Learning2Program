class Preferences{
    
    static readonly FONT_SIZE_DEFAULT: number = 14;

    private fontSize: number;
    private lastCodeFileOpen: string;
    
    constructor(fontSize: number = Preferences.FONT_SIZE_DEFAULT, lastCodeFileOpen: string = ""){
        this.fontSize = fontSize;
        this.lastCodeFileOpen = lastCodeFileOpen;
    }

    public getFontSize(): number{
        return this.fontSize;
    }

    public getLastCodeFileOpen(): string{
        return this.lastCodeFileOpen;
    }



}