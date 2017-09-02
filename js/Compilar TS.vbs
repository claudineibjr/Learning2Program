Dim oShell
SET oShell = WScript.CreateObject ("WScript.Shell")

DIM objFSO
SET objFSO = CreateObject("Scripting.FileSystemObject")

DIM strFolder
strFolder = oShell.CurrentDirectory & "\"

DIM objFolderTS
'SET objFolderTS = objFSO.getFolder(strFolder & "ts")
SET objFolderTS = objFSO.getFolder(strFolder)

FOR EACH file IN objFolderTS.Files
	'msgbox file & vbcrlf & LCASE((MID(file.shortname, LEN(file.shortname) - 2)))
	IF LCASE((MID(file.shortname, LEN(file.shortname) - 2))) = ".ts" THEN
		'oShell.run "cmd.exe /C tsc --out " & REPLACE(file.ShortName, ".ts", ".js") & " ts\" & file.ShortName
		oShell.run "cmd.exe /C tsc " & MID(file, InStrRev(file, "\") + 1)
	END IF
NEXT

'msgbox """" & strFolder & "ts\*.js" & """" & vbcrlf & """" & strFolder & """"
'objFSO.CopyFile		"""" & strFolder & "ts\*.js" & """", """" & strFolder & """", true
'objFSO.DeleteFile	"""" & strFolder & "ts\*.js" & """", true

SET oShell = Nothing
SET objFSO = Nothing
SET objFolderTS = Nothing