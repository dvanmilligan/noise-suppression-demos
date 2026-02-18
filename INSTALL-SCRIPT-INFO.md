# Automated Install Script

## Overview

The `install.sh` script provides a fully automated setup experience for testers and reviewers. It eliminates all manual terminal commands and guides users through the entire installation process.

## What It Does

The script automates:

1. **Prerequisites Check**
   - Verifies Node.js v16+ is installed
   - Shows clear error messages if requirements aren't met

2. **Dependency Installation**
   - Installs root dependencies
   - Installs dependencies for all three demos
   - Shows progress for each step

3. **OAuth Configuration**
   - Prompts for OAuth Client ID
   - Prompts for Genesys Cloud environment
   - Creates config.json files for all demos

4. **Demo Selection & Launch**
   - Presents menu of available demos
   - Kills any process on port 8443
   - Starts selected demo automatically
   - Provides clear instructions for browser access

## Usage

### Basic Usage

```bash
# Extract the package
tar -xzf noise-suppression-demos-20260218.tar.gz
cd genesys-cloud-webrtc-sdk

# Run the installer
./install.sh
```

### What Users See

1. **Welcome Screen**
   ```
   ==========================================
   Genesys Cloud WebRTC Noise Suppression Demos
   ==========================================
   
   This script will:
     1. Check prerequisites (Node.js)
     2. Install all dependencies
     3. Configure OAuth credentials
     4. Start a demo (optional)
   
   Estimated time: 5-10 minutes
   ```

2. **Prerequisites Check**
   ```
   ✓ Node.js v18.17.0 detected
   ✓ npm 9.6.7 detected
   ```

3. **Dependency Installation**
   ```
   Installing Dependencies
   
   ℹ Installing root dependencies...
   ✓ Root dependencies installed
   
   ℹ Installing Baseline demo dependencies...
   ✓ Baseline demo ready
   
   ℹ Installing Speex demo dependencies...
   ✓ Speex demo ready
   
   ℹ Installing RNNoise demo dependencies...
   ✓ RNNoise demo ready
   ```

4. **OAuth Configuration**
   ```
   OAuth Configuration
   
   You need a Genesys Cloud OAuth Client ID to use these demos.
   
   Enter your OAuth Client ID: [user input]
   Enter your Genesys Cloud environment (default: mypurecloud.com): [user input]
   
   ✓ Created react-demo-app/public/config.json
   ✓ Created react-demo-clearervoice/public/config.json
   ✓ Created react-demo-rnnoise/public/config.json
   ```

5. **Demo Selection**
   ```
   Which demo would you like to start?
   
   1) Speex Demo (Recommended)
      - Open-source noise suppression
      - Real-time audio visualization
      - Best for testing
   
   2) Baseline Demo
      - Browser's built-in noise suppression
      - Reference implementation
   
   3) RNNoise Demo
      - AI-based noise suppression
      - Has known VAD issue (documented)
   
   4) Skip (I'll start it manually later)
   
   Enter your choice (1-4): [user input]
   ```

6. **Demo Launch**
   ```
   Starting Speex Demo
   
   ✓ Port 8443 is available
   
   ✅ Installation complete!
   
   ℹ Starting Speex Demo...
   
   The demo will open at: https://localhost:8443
   
   You'll see a security warning (self-signed certificate).
   Click 'Advanced' and 'Proceed to localhost' to continue.
   
   Press Ctrl+C to stop the demo
   ```

## Features

### User-Friendly
- Color-coded output (green for success, red for errors, yellow for warnings)
- Clear progress indicators
- Helpful error messages
- Estimated time for each step

### Robust Error Handling
- Checks Node.js version before proceeding
- Validates OAuth Client ID is not empty
- Kills processes on port 8443 before starting
- Provides fallback instructions if demo start is skipped

### Flexible
- Users can skip demo start and run manually later
- Supports custom Genesys Cloud environments
- Works on Mac, Linux, and Windows (with Git Bash)

### Safe
- Uses `set -e` to exit on errors
- Validates all inputs
- Provides clear next steps at each stage

## Technical Details

### Script Structure

```bash
#!/bin/bash
set -e  # Exit on error

# Color definitions for output
RED, GREEN, YELLOW, BLUE, NC

# Helper functions
print_header()   # Section headers
print_success()  # Success messages
print_error()    # Error messages
print_warning()  # Warning messages
print_info()     # Info messages

# Main functions
check_nodejs()          # Verify Node.js v16+
install_dependencies()  # Install all npm packages
configure_oauth()       # Create config.json files
start_demo()           # Launch selected demo
main()                 # Orchestrate the flow
```

### Dependencies

- **bash**: Shell interpreter
- **node**: JavaScript runtime (v16+)
- **npm**: Package manager
- **lsof**: List open files (for port checking)
- **tar**: Archive extraction (used before script)

### Exit Codes

- `0`: Success
- `1`: Node.js not found or version too old
- `1`: OAuth Client ID validation failed

## Comparison: Manual vs Automated

### Manual Setup (Old Way)
```bash
# 1. Extract
tar -xzf noise-suppression-demos-20260218.tar.gz
cd genesys-cloud-webrtc-sdk

# 2. Install root deps
npm install

# 3. Install demo deps (3 separate commands)
cd react-demo-app && npm install && cd ..
cd react-demo-clearervoice && npm install && cd ..
cd react-demo-rnnoise && npm install && cd ..

# 4. Create config file (manual editing)
nano react-demo-clearervoice/public/config.json
# User types JSON manually

# 5. Copy config to other demos
cp react-demo-clearervoice/public/config.json react-demo-app/public/
cp react-demo-clearervoice/public/config.json react-demo-rnnoise/public/

# 6. Kill port 8443
lsof -ti :8443 | xargs kill -9 2>/dev/null

# 7. Start demo
cd react-demo-clearervoice
npm run dev
```

**Total**: 10+ commands, manual file editing, error-prone

### Automated Setup (New Way)
```bash
# 1. Extract
tar -xzf noise-suppression-demos-20260218.tar.gz
cd genesys-cloud-webrtc-sdk

# 2. Run installer
./install.sh
# Answer 2-3 prompts, everything else is automatic
```

**Total**: 2 commands, guided prompts, foolproof

## Benefits for Testers

1. **No Terminal Expertise Required**
   - Simple prompts guide the process
   - No need to understand npm, config files, or port management

2. **Faster Setup**
   - 5-10 minutes vs 15-20 minutes manual
   - No context switching between terminal and editor

3. **Fewer Errors**
   - Validates inputs
   - Handles edge cases automatically
   - Clear error messages if something goes wrong

4. **Better Experience**
   - Professional, polished installation
   - Confidence-inspiring progress indicators
   - Immediate demo launch

## Benefits for Developers

1. **Reduced Support Burden**
   - Fewer "how do I set this up?" questions
   - Standardized installation process
   - Self-documenting with clear messages

2. **Consistent Environment**
   - Everyone uses the same setup process
   - Reduces "works on my machine" issues
   - Easier to reproduce bugs

3. **Professional Impression**
   - Shows attention to detail
   - Makes project feel production-ready
   - Easier to share with stakeholders

## Future Enhancements

Possible improvements:

1. **Automatic OAuth Client Creation**
   - Guide users through creating OAuth client in Genesys Cloud
   - Use Genesys Cloud API to create client automatically

2. **Environment Detection**
   - Auto-detect Genesys Cloud environment from user's location
   - Suggest common environments

3. **Demo Health Check**
   - Verify demo started successfully
   - Check for common issues (firewall, ports, etc.)

4. **Uninstall Script**
   - Clean removal of all installed components
   - Reset to fresh state

5. **Update Script**
   - Pull latest changes
   - Reinstall dependencies
   - Preserve config files

## Troubleshooting

### Script Won't Run

**Problem**: `./install.sh: Permission denied`

**Solution**:
```bash
chmod +x install.sh
./install.sh
```

### Node.js Not Found

**Problem**: `Node.js is not installed!`

**Solution**: Install Node.js from https://nodejs.org/

### Port 8443 Already in Use

**Problem**: Demo won't start, port conflict

**Solution**: The script handles this automatically, but if it fails:
```bash
lsof -ti :8443 | xargs kill -9
```

### OAuth Error

**Problem**: Can't login after demo starts

**Solution**: 
1. Check OAuth Client ID is correct
2. Verify redirect URI in Genesys Cloud: `https://localhost:8443`
3. Re-run script to update config

## Documentation Updates

The following files were updated to reference the install script:

1. **QUICK-START-FOR-REVIEWER.txt**
   - Added "OPTION 1: AUTOMATED (RECOMMENDED)" section
   - Kept manual setup as "OPTION 2"

2. **SETUP-INSTRUCTIONS.md**
   - Added "Option 1: Automated Setup (Recommended)" section
   - Moved manual setup to "Option 2"

3. **PACKAGE-FOR-REVIEW.md**
   - Updated quick start to show automated option first
   - Kept manual option for reference

4. **create-package.sh**
   - Updated manifest to list install.sh
   - Updated quick start instructions
   - Added install.sh to tarball

## Testing

To test the install script:

```bash
# Create a test directory
mkdir test-install
cd test-install

# Extract package
tar -xzf ../noise-suppression-demos-20260218.tar.gz
cd genesys-cloud-webrtc-sdk

# Run installer
./install.sh

# Follow prompts
# Verify demo starts successfully
```

## Conclusion

The automated install script transforms the setup experience from a multi-step, error-prone process into a simple, guided installation. This makes the demos more accessible to testers and reviewers, reduces support burden, and creates a professional first impression.

**Key Achievement**: Reduced setup from 10+ manual commands to 2 commands with guided prompts.
