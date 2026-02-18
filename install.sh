#!/bin/bash

# Automated Installation Script for Genesys Cloud WebRTC Noise Suppression Demos
# This script automates the entire setup process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
  echo ""
  echo -e "${BLUE}=========================================="
  echo "$1"
  echo -e "==========================================${NC}"
  echo ""
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ $1${NC}"
}

# Check if Node.js is installed
check_nodejs() {
  print_header "Checking Prerequisites"
  
  if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo ""
    echo "Please install Node.js v16 or higher from:"
    echo "https://nodejs.org/"
    echo ""
    exit 1
  fi
  
  NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version is too old (v$NODE_VERSION)"
    echo "Please upgrade to Node.js v16 or higher"
    exit 1
  fi
  
  print_success "Node.js $(node --version) detected"
  print_success "npm $(npm --version) detected"
}

# Install dependencies
install_dependencies() {
  print_header "Installing Dependencies"
  
  print_info "Installing root dependencies..."
  npm install --silent
  print_success "Root dependencies installed"
  
  echo ""
  print_info "Installing Baseline demo dependencies..."
  cd react-demo-app
  npm install --silent
  cd ..
  print_success "Baseline demo ready"
  
  echo ""
  print_info "Installing Speex demo dependencies..."
  cd react-demo-clearervoice
  npm install --silent
  cd ..
  print_success "Speex demo ready"
  
  echo ""
  print_info "Installing RNNoise demo dependencies..."
  cd react-demo-rnnoise
  npm install --silent
  cd ..
  print_success "RNNoise demo ready"
}

# Configure OAuth
configure_oauth() {
  print_header "OAuth Configuration"
  
  echo "You need a Genesys Cloud OAuth Client ID to use these demos."
  echo ""
  echo "If you don't have one, see SECURITY-NOTE.md for instructions"
  echo "on how to create one in Genesys Cloud."
  echo ""
  
  # Prompt for Client ID
  while true; do
    read -p "Enter your OAuth Client ID: " CLIENT_ID
    if [ -n "$CLIENT_ID" ]; then
      break
    fi
    print_error "Client ID cannot be empty. Please try again."
  done
  
  echo ""
  read -p "Enter your Genesys Cloud environment (default: mypurecloud.com): " ENVIRONMENT
  ENVIRONMENT=${ENVIRONMENT:-mypurecloud.com}
  
  echo ""
  print_info "Creating config.json files..."
  
  # Create config for all demos
  for demo in react-demo-app react-demo-clearervoice react-demo-rnnoise; do
    cat > "$demo/public/config.json" << EOF
{
  "clientId": "$CLIENT_ID",
  "redirectUri": "https://localhost:8443",
  "environment": "$ENVIRONMENT"
}
EOF
    print_success "Created $demo/public/config.json"
  done
}

# Select and start demo
start_demo() {
  print_header "Demo Selection"
  
  echo "Which demo would you like to start?"
  echo ""
  echo "1) Speex Demo (Recommended)"
  echo "   - Open-source noise suppression"
  echo "   - Real-time audio visualization"
  echo "   - Best for testing"
  echo ""
  echo "2) Baseline Demo"
  echo "   - Browser's built-in noise suppression"
  echo "   - Reference implementation"
  echo ""
  echo "3) RNNoise Demo"
  echo "   - AI-based noise suppression"
  echo "   - Has known VAD issue (documented)"
  echo ""
  echo "4) Skip (I'll start it manually later)"
  echo ""
  
  while true; do
    read -p "Enter your choice (1-4): " DEMO_CHOICE
    case $DEMO_CHOICE in
      1)
        DEMO_DIR="react-demo-clearervoice"
        DEMO_NAME="Speex Demo"
        break
        ;;
      2)
        DEMO_DIR="react-demo-app"
        DEMO_NAME="Baseline Demo"
        break
        ;;
      3)
        DEMO_DIR="react-demo-rnnoise"
        DEMO_NAME="RNNoise Demo"
        break
        ;;
      4)
        print_info "Skipping demo start"
        return
        ;;
      *)
        print_error "Invalid choice. Please enter 1, 2, 3, or 4."
        ;;
    esac
  done
  
  echo ""
  print_header "Starting $DEMO_NAME"
  
  # Kill any process on port 8443
  print_info "Checking port 8443..."
  lsof -ti :8443 | xargs kill -9 2>/dev/null || true
  print_success "Port 8443 is available"
  
  echo ""
  print_success "Installation complete!"
  echo ""
  print_info "Starting $DEMO_NAME..."
  echo ""
  echo -e "${GREEN}The demo will open at: https://localhost:8443${NC}"
  echo ""
  echo "You'll see a security warning (self-signed certificate)."
  echo "Click 'Advanced' and 'Proceed to localhost' to continue."
  echo ""
  echo -e "${YELLOW}Press Ctrl+C to stop the demo${NC}"
  echo ""
  
  cd "$DEMO_DIR"
  npm run dev
}

# Main installation flow
main() {
  clear
  
  print_header "Genesys Cloud WebRTC Noise Suppression Demos"
  echo "Automated Installation Script"
  echo ""
  echo "This script will:"
  echo "  1. Check prerequisites (Node.js)"
  echo "  2. Install all dependencies"
  echo "  3. Configure OAuth credentials"
  echo "  4. Start a demo (optional)"
  echo ""
  echo "Estimated time: 5-10 minutes"
  echo ""
  
  read -p "Press Enter to continue or Ctrl+C to cancel..."
  
  # Run installation steps
  check_nodejs
  install_dependencies
  configure_oauth
  
  echo ""
  print_header "Installation Complete!"
  
  echo -e "${GREEN}✓ All dependencies installed${NC}"
  echo -e "${GREEN}✓ OAuth configured${NC}"
  echo -e "${GREEN}✓ Ready to use${NC}"
  echo ""
  
  # Ask if user wants to start a demo
  read -p "Would you like to start a demo now? (y/n): " START_NOW
  if [[ "$START_NOW" =~ ^[Yy]$ ]]; then
    start_demo
  else
    echo ""
    print_info "To start a demo later, run:"
    echo ""
    echo "  cd react-demo-clearervoice"
    echo "  npm run dev"
    echo ""
    echo "Then open: https://localhost:8443"
    echo ""
    print_success "Setup complete! Happy testing!"
    echo ""
  fi
}

# Run main function
main
