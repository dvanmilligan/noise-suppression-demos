#!/bin/bash

# Demo Launcher Script
# Simple script to launch WebRTC demos

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Demo configurations
declare -A DEMOS
DEMOS[1]="react-demo-app|Baseline Demo|Standard WebRTC with browser noise suppression"
DEMOS[2]="react-demo-clearervoice|Speex Demo|Open-source Speex noise suppression"
DEMOS[3]="react-demo-rnnoise|RNNoise Demo|AI-based RNNoise noise suppression"

PORT=8443

function print_header() {
    clear
    echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}         ${CYAN}Genesys WebRTC Demo Launcher${NC}                      ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

function print_menu() {
    print_header
    echo -e "${YELLOW}Available Demos:${NC}"
    echo -e "${BLUE}─────────────────────────────────────────────────────────────${NC}"
    
    for key in "${!DEMOS[@]}"; do
        IFS='|' read -r dir name desc <<< "${DEMOS[$key]}"
        echo -e "${GREEN}[$key]${NC} ${CYAN}$name${NC}"
        echo -e "    $desc"
        echo ""
    done
    
    echo -e "${BLUE}─────────────────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}All demos run on port ${PORT}${NC}"
    echo ""
}

function check_port() {
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${RED}⚠️  Port $PORT is already in use!${NC}"
        echo -e "${YELLOW}Please stop the running demo first (Ctrl+C in the terminal where it's running)${NC}"
        echo ""
        read -p "Press Enter to continue..."
        return 1
    fi
    return 0
}

function launch_demo() {
    local demo_key=$1
    IFS='|' read -r dir name desc <<< "${DEMOS[$demo_key]}"
    
    print_header
    echo -e "${GREEN}🚀 Launching: $name${NC}"
    echo -e "${CYAN}Directory: $dir${NC}"
    echo -e "${CYAN}Port: $PORT${NC}"
    echo ""
    
    if ! check_port; then
        return 1
    fi
    
    echo -e "${YELLOW}Installing dependencies and starting dev server...${NC}"
    echo ""
    
    cd "$dir"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies (first time only)...${NC}"
        npm install
        echo ""
    fi
    
    echo -e "${GREEN}✅ Starting demo server...${NC}"
    echo -e "${CYAN}Open in browser: https://localhost:$PORT${NC}"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop the demo${NC}"
    echo ""
    
    npm run dev
}

function main() {
    # Check if a demo number was provided as argument
    if [ $# -eq 1 ]; then
        if [[ -n "${DEMOS[$1]}" ]]; then
            launch_demo "$1"
            exit 0
        else
            echo -e "${RED}Invalid demo number: $1${NC}"
            echo -e "${YELLOW}Valid options: 1, 2, 3${NC}"
            exit 1
        fi
    fi
    
    # Interactive mode
    while true; do
        print_menu
        read -p "Enter demo number (1-3) or 'q' to quit: " choice
        
        case $choice in
            1|2|3)
                launch_demo "$choice"
                ;;
            q|Q)
                echo -e "${GREEN}👋 Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid choice. Please enter 1, 2, 3, or 'q'${NC}"
                sleep 2
                ;;
        esac
    done
}

# Make sure we're in the right directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

main "$@"
