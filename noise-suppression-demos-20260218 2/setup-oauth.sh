#!/bin/bash

# OAuth Setup Script
# This script helps you configure OAuth for all demos at once

echo "=========================================="
echo "OAuth Configuration Setup"
echo "=========================================="
echo ""
echo "This script will create config.json files for all demos."
echo ""
echo "You need a Genesys Cloud OAuth Client ID."
echo "If you don't have one, see SECURITY-NOTE.md for instructions."
echo ""
echo "Enter your OAuth Client ID:"
read -r CLIENT_ID

if [ -z "$CLIENT_ID" ]; then
  echo "❌ Error: Client ID cannot be empty"
  exit 1
fi

echo ""
echo "Enter your Genesys Cloud environment (default: mypurecloud.com):"
read -r ENVIRONMENT
ENVIRONMENT=${ENVIRONMENT:-mypurecloud.com}

echo ""
echo "Creating config files..."
echo ""

for demo in react-demo-app react-demo-clearervoice react-demo-rnnoise; do
  cat > "$demo/public/config.json" << EOF
{
  "clientId": "$CLIENT_ID",
  "redirectUri": "https://localhost:8443",
  "environment": "$ENVIRONMENT"
}
EOF
  echo "✓ Created $demo/public/config.json"
done

echo ""
echo "✅ OAuth configuration complete!"
echo ""
echo "Next steps:"
echo "1. cd react-demo-clearervoice"
echo "2. npm run dev"
echo "3. Open https://localhost:8443"
echo ""
