@echo off
cd /d "%~dp0"
SET /A tag = %RANDOM%*9990/32768+1000
SET build_root_folder="C:\Users\User\Desktop\ihma_front\eld_front"
SET build_folder="%build_root_folder%"
SET image=registry.webase.uz/ihma/eld_front

:: Run npm build and log output
@REM echo Running npm build...
@REM call npm run build > build.log 2>&1
@REM if %ERRORLEVEL% neq 0 (
@REM      echo Build failed, check build.log for details.
@REM     goto :end
@REM )

:: Continue to Docker commands
echo Build succeeded, continuing to Docker commands...

docker build -t %image% .
if %ERRORLEVEL% neq 0 (
    echo Docker build failed.
    goto :end
)

docker logout
docker login -u webaseuz -p webase1989 registry.webase.uz
if %ERRORLEVEL% neq 0 (
    echo Docker login failed.
    goto :end
)

docker push %image%
if %ERRORLEVEL% neq 0 (
    echo Docker push failed.
    goto :end
)
docker image tag %image% %image%:%tag%
docker push %image%:%tag%
echo %image%
echo %image%:%tag%
echo Script finished.
pause