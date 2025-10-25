@echo off
REM Color Match App - Expo Setup Script (Windows)

echo ==========================================
echo Color Match - Expo React Native Setup
echo ==========================================
echo.

REM Check if Node.js is installed
echo [INFO] Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo [INFO] Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
node --version
echo [SUCCESS] Node.js is installed!

REM Check if npm is installed
echo [INFO] Checking for npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)
npm --version
echo [SUCCESS] npm is installed!

REM Get project details
echo.
set /p PROJECT_NAME="Project folder name [ColorMatchApp]: "
if "%PROJECT_NAME%"=="" set PROJECT_NAME=ColorMatchApp

echo [INFO] Creating Expo project: %PROJECT_NAME%
echo.

REM Create Expo project
call npx create-expo-app@latest "%PROJECT_NAME%" --template blank

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create Expo project
    pause
    exit /b 1
)

echo [SUCCESS] Expo project created!

REM Navigate to project directory
cd "%PROJECT_NAME%"

REM Create directories
echo [INFO] Setting up project structure...
mkdir components 2>nul
mkdir utils 2>nul
mkdir styles 2>nul

REM Copy files if they exist
if exist "..\App.js" (
    echo [INFO] Copying app files...
    copy "..\App.js" . >nul
    xcopy "..\components\*.*" components\ /Y /Q >nul 2>nul
    xcopy "..\utils\*.*" utils\ /Y /Q >nul 2>nul
    echo [SUCCESS] App files copied!
) else (
    echo [WARNING] App files not found in parent directory
    echo [INFO] You'll need to manually copy the component files
)

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install expo-image-picker expo-camera expo-media-library expo-status-bar @expo/vector-icons

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Dependencies installed!
) else (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

REM Update app.json
if exist "..\app.json" (
    copy "..\app.json" . >nul
    echo [SUCCESS] app.json updated!
)

REM Create README
(
echo # Color Match - Expo React Native App
echo.
echo ## Quick Start
echo.
echo ### Development
echo.
echo ```bash
echo # Start development server
echo npx expo start
echo.
echo # Run on iOS simulator ^(Mac only^)
echo npx expo start --ios
echo.
echo # Run on Android emulator
echo npx expo start --android
echo ```
echo.
echo ### Testing on Device
echo.
echo 1. Install Expo Go app from App Store ^(iOS^) or Play Store ^(Android^)
echo 2. Run `npx expo start`
echo 3. Scan QR code with Expo Go app
echo.
echo ### Building
echo.
echo ```bash
echo # Install EAS CLI
echo npm install -g eas-cli
echo.
echo # Login to Expo
echo eas login
echo.
echo # Configure builds
echo eas build:configure
echo.
echo # Build for Android
echo eas build --platform android
echo.
echo # Build for iOS
echo eas build --platform ios
echo ```
echo.
echo ## Project Structure
echo.
echo - `App.js` - Main application component
echo - `components/` - React components
echo - `utils/` - Utility functions
echo - `assets/` - Images and icons
echo.
echo ## Features
echo.
echo - Camera and gallery access
echo - Color extraction from images
echo - Color theory-based matching
echo - Beautiful UI with animations
echo.
echo ## Documentation
echo.
echo See EXPO_GUIDE.md for complete documentation.
) > README.md

echo [SUCCESS] README.md created

echo.
echo ==========================================
echo [SUCCESS] Setup Complete!
echo ==========================================
echo.
echo Project created at: %PROJECT_NAME%
echo.
echo Next steps:
echo 1. cd %PROJECT_NAME%
echo 2. npx expo start
echo 3. Scan QR code with Expo Go app on your phone
echo.
echo For more information, check EXPO_GUIDE.md
echo.
echo [INFO] Happy coding! 🚀
echo.
pause
