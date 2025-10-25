#!/bin/bash

# Color Match App - Expo Setup Script
# This script automates the Expo project setup

echo "=========================================="
echo "Color Match - Expo React Native Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_info "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    print_info "Please install Node.js from https://nodejs.org/"
    exit 1
fi
print_success "Node.js is installed: $(node --version)"

# Check if npm is installed
print_info "Checking for npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
fi
print_success "npm is installed: $(npm --version)"

# Get project details
echo ""
read -p "Project folder name [ColorMatchApp]: " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-ColorMatchApp}

print_info "Creating Expo project: $PROJECT_NAME"
echo ""

# Create Expo project
npx create-expo-app@latest "$PROJECT_NAME" --template blank

if [ $? -ne 0 ]; then
    print_error "Failed to create Expo project"
    exit 1
fi

print_success "Expo project created!"

# Navigate to project directory
cd "$PROJECT_NAME" || exit

# Copy component files
print_info "Setting up project structure..."

# Create directories
mkdir -p components utils styles

# Copy files if they exist in parent directory
if [ -f "../App.js" ]; then
    print_info "Copying app files..."
    cp ../App.js .
    cp -r ../components/* components/ 2>/dev/null
    cp -r ../utils/* utils/ 2>/dev/null
    print_success "App files copied!"
else
    print_warning "App files not found in parent directory"
    print_info "You'll need to manually copy the component files"
fi

# Install dependencies
print_info "Installing dependencies..."
npm install expo-image-picker expo-camera expo-media-library expo-status-bar @expo/vector-icons

if [ $? -eq 0 ]; then
    print_success "Dependencies installed!"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Update app.json if it exists
if [ -f "../app.json" ]; then
    cp ../app.json .
    print_success "app.json updated!"
fi

# Create README
cat > README.md << 'EOF'
# Color Match - Expo React Native App

## Quick Start

### Development

```bash
# Start development server
npx expo start

# Run on iOS simulator (Mac only)
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

### Testing on Device

1. Install Expo Go app from App Store (iOS) or Play Store (Android)
2. Run `npx expo start`
3. Scan QR code with Expo Go app

### Building

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure builds
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Project Structure

- `App.js` - Main application component
- `components/` - React components
- `utils/` - Utility functions
- `assets/` - Images and icons

## Features

- Camera and gallery access
- Color extraction from images
- Color theory-based matching
- Beautiful UI with animations

## Documentation

See EXPO_GUIDE.md for complete documentation.
EOF

print_success "README.md created"

echo ""
echo "=========================================="
print_success "Setup Complete!"
echo "=========================================="
echo ""
echo "Project created at: $PROJECT_NAME"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. npx expo start"
echo "3. Scan QR code with Expo Go app on your phone"
echo ""
echo "For more information, check EXPO_GUIDE.md"
echo ""
print_info "Happy coding! 🚀"
