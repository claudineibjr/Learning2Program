Dim oShell
SET oShell = WScript.CreateObject ("WScript.Shell")

DIM objFSO
SET objFSO = CreateObject("Scripting.FileSystemObject")

DIM strFolder, strFolderTS, strNameTSFolder
strFolder = oShell.CurrentDirectory
'strNameTSFolder = "ts\"
strNameTSFolder = ""
strFolderTS = strFolder & "\" & strNameTSFolder

DIM objFolderTS
SET objFolderTS = objFSO.getFolder(strFolderTS)

FOR EACH file IN objFolderTS.Files
	DIM strFileName, strOutFile, strCMD, nameLogFile ,strPathLogFile
	strFileName = MID(file, InStrRev(file, "\") + 1)
	nameLogFile = "Log\outputLog-" & strFileName &".txt"
	strPathLogFile = """" & strFolderTS & nameLogFile &  """"

	IF LCASE((MID(file.shortname, LEN(file.shortname) - 2))) = ".ts" THEN
		strCMD = "cmd.exe /C tsc " & strNameTSFolder & strFileName & " > " & strPathLogFile
		oShell.Run strCMD
	END IF
	
NEXT

SET oShell = Nothing
SET objFSO = Nothing
SET objFolderTS = Nothing