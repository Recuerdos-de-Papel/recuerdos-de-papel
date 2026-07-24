@echo off
cd /d "C:\Users\Cesar\Desktop\web papeleria\android"
C:\Users\Cesar\Downloads\flutter\bin\flutter build apk --debug 2>&1
echo Exit code: %ERRORLEVEL%