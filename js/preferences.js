var Preferences = (function () {
    function Preferences(fontSize, lastCodeFileOpen) {
        if (fontSize === void 0) { fontSize = Preferences.FONT_SIZE_DEFAULT; }
        if (lastCodeFileOpen === void 0) { lastCodeFileOpen = ""; }
        this.fontSize = fontSize;
        this.lastCodeFileOpen = lastCodeFileOpen;
    }
    Preferences.prototype.getFontSize = function () {
        return this.fontSize;
    };
    Preferences.prototype.getLastCodeFileOpen = function () {
        return this.lastCodeFileOpen;
    };
    Preferences.prototype.setFontSize = function (newFontSize) {
        this.fontSize = newFontSize;
    };
    Preferences.prototype.setLastCodeFileOpen = function (newLastCodeFileOpen) {
        this.lastCodeFileOpen = newLastCodeFileOpen;
    };
    return Preferences;
}());
Preferences.FONT_SIZE_DEFAULT = 14;
