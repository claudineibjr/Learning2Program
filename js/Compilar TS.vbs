Dim oShell
SET oShell = WScript.CreateObject ("WScript.Shell")

DIM objFSO
SET objFSO = CreateObject("Scripting.FileSystemObject")

DIM strFolder
strFolder = oShell.CurrentDirectory & "\"

DIM objFolderTS
SET objFolderTS = objFSO.getFolder(strFolder & "ts")

FOR EACH file IN objFolderTS.Files
	IF (MID(file.shortname, LEN(file.shortname) - 2)) = ".ts" THEN
		oShell.run "cmd.exe /C tsc --out " & REPLACE(file.ShortName, ".ts", ".js") & " ts\" & file.ShortName
	END IF
NEXT

SET oShell = Nothing
SET objFSO = Nothing
SET objFolderTS = Nothing