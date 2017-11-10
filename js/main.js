//Classes que serão executadas a partir desta
var tokenIdentifier;
var wordsSpliter;
var ace;
var firebase;
var Main = (function () {
    function Main() {
        this.codePanel = document.getElementById("txtCode");
        // Cria o editor de código
        this.editor = ace.edit("txtCode");
        this.editor.setTheme("ace/theme/textmate");
        this.editor.getSession().setMode("ace/mode/c_cpp");
        // Cria uma barra de status
        var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
        var statusBar = new StatusBar(this.editor, document.getElementById("statusBar"));
        // Seta algumas opções do editor de texto
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        //Desabilita o botão de próximo
        this.enable("#btnNextStatement", false);
        //Cria os atalhos
        this.createShortcutCommands();
        //Busca o usuário logado no armazenamento local do navegador
        this.user = User.objectToUser(JSON.parse(localStorage.getItem("user")));
        //Caso não houver usuário, exibirá uma arquivo de exemplo
        if (this.user == null || this.user == undefined) {
            //Instancia o gerenciador de arquivos
            this.fileManager = new FileManager(this, this.user);
            this.fileManager.setOnLocalStorageCodeFile();
            this.codeFile = CodeFile.objectToCode(JSON.parse(localStorage.getItem("codeFile")));
            this.openCodeFile(this.codeFile);
            this.enable("#btnSave", false);
            this.enable("#btnCodes", false);
        }
        else {
            //Busca os dados do usuário no banco de dados
            var main = this;
            try {
                firebase.database().ref("users/" + this.user.uid).once("value").then(function (snapshot) {
                    main.user = User.objectToUser(snapshot.val());
                    //Instancia o gerenciador de arquivos
                    main.fileManager = new FileManager(main, main.user);
                    main.enable("#btnSave", true);
                    main.enable("#btnCodes", true);
                    main.fileManager.setOnLocalStorageCodeFile(main.user.getPreferences().getLastCodeFileOpen());
                    main.codeFile = CodeFile.objectToCode(JSON.parse(localStorage.getItem("codeFile")));
                    main.openCodeFile(main.codeFile);
                    main.loadCodeFiles(main.user.getCodeFiles());
                });
            }
            catch (ex) {
                var errorMessage;
                errorMessage = "Consulte o console para mais informações sobre o problema.";
                swal({
                    titleText: "Ooops...",
                    html: "Houve um erro ao tentarmos recuperar as suas informações do banco de dados, pedimos desculpas.<br/><br/>" + errorMessage,
                    type: "error"
                });
                console.log("Houve um erro ao tentarmos recuperar as suas informações do banco de dados, pedidmos desculpas\n" + ex.code + " - " + ex.message);
            }
        }
    }
    Main.prototype.insertCodeFilesInList = function (codeFile) {
        var sideNav = document.getElementById("mySidenav");
        var newAnchorElement = document.createElement("a");
        newAnchorElement.href = "#";
        newAnchorElement.innerHTML = codeFile.getName();
        newAnchorElement.id = codeFile.getId();
        var myMain = this;
        newAnchorElement.onclick = function () {
            myMain.fileManager.setOnLocalStorageCodeFile(newAnchorElement.id);
            myMain.codeFile = codeFile;
            myMain.openCodeFile(codeFile);
        };
        sideNav.appendChild(newAnchorElement);
    };
    Main.prototype.loadCodeFiles = function (arrCodeFiles) {
        var sideNav = document.getElementById("mySidenav");
        for (var iCount = 0; iCount < arrCodeFiles.length; iCount++) {
            var codeFile = arrCodeFiles[iCount];
            var newAnchorElement = document.createElement("a");
            newAnchorElement.href = "#";
            newAnchorElement.innerHTML = codeFile.getName();
            newAnchorElement.id = codeFile.getId();
            var myMain = this;
            newAnchorElement.onclick = function () {
                myMain.fileManager.setOnLocalStorageCodeFile(newAnchorElement.id);
                myMain.codeFile = codeFile;
                myMain.openCodeFile(codeFile);
            };
            sideNav.appendChild(newAnchorElement);
        }
    };
    Main.prototype.createShortcutCommands = function () {
        //Cria os atalhos
        this.editor.commands.addCommand({
            name: 'Execute',
            bindKey: {
                win: 'F5',
                mac: 'Command-1'
            },
            exec: function (editor) {
                $('#btnExecute').trigger('click');
            },
            readOnly: true
        });
        this.editor.commands.addCommand({
            name: 'Debug',
            bindKey: {
                win: 'Shift-F5',
                mac: 'Command-3'
            },
            exec: function (editor) {
                $('#btnDebug').trigger('click');
            },
            readOnly: true
        });
        this.editor.commands.addCommand({
            name: 'Next',
            bindKey: {
                win: 'F10',
                mac: 'Command-3'
            },
            exec: function (editor) {
                $('#btnNextStatement').trigger('click');
            },
            readOnly: true
        });
    };
    Main.prototype.enable = function (elementName, enable) {
        $(elementName).attr('disabled', !enable);
    };
    Main.prototype.logoff = function () {
        firebase.auth().signOut().then(function () {
            swal({
                titleText: "Logoff realizado!",
                type: "info"
            }).then(function () {
                localStorage.removeItem("user");
                localStorage.removeItem("codeFile");
                window.open("index.html", "_self");
            });
        })["catch"](function (error) {
            swal({
                titleText: "Problema ao fazer logoff!",
                html: "Desculpe-nos, houve um problema ao fazer logoff.<br/><br/>Consulte o console para mais informações",
                type: "info"
            });
        });
    };
    Main.prototype.openCodeFile = function (codeFile) {
        document.title = Main.TITLE_PAGE + " - " + codeFile.getName();
        this.setHeadingPanel(this.user, codeFile);
        this.editor.selectAll();
        this.editor.removeLines();
        this.editor.insert(codeFile.getCode());
    };
    Main.prototype.setHeadingPanel = function (user, codeFile) {
        var strUser = "", strCode = "";
        strUser = "Usuário: " + (user == null || user == undefined ? "Visitante" : user.getName() + " - " + user.getEmail());
        strCode = "Código em execução: " + codeFile.getName();
        document.getElementById("pnlHeading").innerHTML = strUser + " | " + strCode;
    };
    Main.prototype.execute = function (debug) {
        if (debug === void 0) { debug = false; }
        document.getElementById("txtOutput").value = "";
        // Cria a classe responsável por separar as palavras
        wordsSpliter = new WordsSplitter();
        // Cria a classe responsável por identificar os tokens
        tokenIdentifier = new TokenIdentifier();
        // Recebe o código
        var txtCode = this.editor.getValue();
        // Recebe o painel de visualização
        this.txtPanel = document.getElementById("txtPanel");
        var tokens;
        tokens = Library.newMatriz(1, 2);
        /*  ===================================
            Exemplo - Como manipular uma matriz
            ===================================
            tokens = newMatriz(1, 2);
            alert(showMatriz(tokens, true));
            assembler.push([valor1, valor2]);
            assembler[indice1][indice2]
            ===================================
        */
        //Separa em linhas o código todo
        this.lstCodeLine = ("\n" + txtCode + " ").split("\n");
        this.iLine = 0;
        this.lstPairsKey = Library.newMatriz(1, 3);
        this.lstIfElseControl = Library.newMatriz(1, 3);
        this.lstForControl = Library.newMatriz(1, 3);
        this.executeNextStatement = true;
        this.bModifiedProgramControl = false;
        this.arrTokens = Library.newMatriz(1, 2);
        this.bLastIfResult = null;
        MemoryViewManager.cleanMemoryView();
        //Cria uma lista com todas as palavras de todas as linhas
        this.lstWords = Library.newMatriz(1, 2);
        for (var iCount = 0; iCount < this.lstCodeLine.length; iCount++) {
            //Separa a linha em palavras
            var words = wordsSpliter.separateInWords(this.lstCodeLine[iCount] + " ");
            //Retira os comentários
            words = tokenIdentifier.treatCode(words);
            //Insere a linha com as devidas palavras já separadas no array de palavras
            this.lstWords.push([iCount, words]);
        }
        if (debug) {
            MemoryViewManager.showMemoryViewer(true);
            this.editor.setReadOnly(true);
            this.enable("#btnDebug", false);
            this.enable("#btnExecute", false);
            this.enable("#btnNextStatement", true);
            this.enable(".ace_scroller", false);
            this.enable("#btnSave", false);
            this.enable("#btnCodes", false);
            this.enable("#btnUpload", false);
            this.enable("#btnNewCode", false);
            this.editor.gotoLine(1);
        }
        else
            this.executeAll();
    };
    Main.prototype.executeDebug = function () {
        if (this.iLine + 1 < this.lstCodeLine.length) {
            this.goToNextLine();
        }
        else {
            this.editor.setReadOnly(false);
            this.enable("#btnDebug", true);
            this.enable("#btnExecute", true);
            this.enable("#btnNextStatement", false);
            this.enable("#btnSave", (this.user == null || this.user == undefined ? false : true));
            this.enable("#btnCodes", (this.user == null || this.user == undefined ? false : true));
            this.enable("#btnUpload", true);
            this.enable("#btnNewCode", true);
            this.editor.gotoLine(1);
            MemoryViewManager.showMemoryViewer(false);
        }
    };
    Main.prototype.goToNextLine = function () {
        if (this.bModifiedProgramControl)
            this.bModifiedProgramControl = false;
        else
            this.iLine++;
        MemoryViewManager.backToNormal();
        this.editor.gotoLine(this.iLine);
        this.executeLine(this.iLine);
    };
    Main.prototype.executeAll = function () {
        //Vai linha por linha separando as palavras
        while (this.iLine + 1 < this.lstCodeLine.length) {
            this.goToNextLine();
        }
    };
    Main.prototype.executeLine = function (lineNumber) {
        var tokens = tokenIdentifier.identifyTokens(this.lstWords[lineNumber][TokenIdentifier.INDEX_LINE_WORDS_WORDS], this, lineNumber);
        tokenIdentifier.setValueToVariable();
        if (tokens.length > 0) {
            this.arrTokens.push([lineNumber, tokens]);
            console.log("Linha " + (this.arrTokens[this.arrTokens.length - 1][0]) + "\n" + Library.showMatriz(this.arrTokens[this.arrTokens.length - 1][1], true) + "\n\n");
        }
    };
    return Main;
}());
Main.debug = false;
Main.TITLE_PAGE = "Learning 2 Program";
