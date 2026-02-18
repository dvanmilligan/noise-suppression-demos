# Security Note - OAuth Configuration

## ⚠️ Important: OAuth Client ID Required

The demos require an OAuth Client ID to authenticate with Genesys Cloud. For security reasons, **no OAuth credentials are included in this package**.

## Setup Required

Before running the demos, you must create a `config.json` file in each demo's `public/` directory.

### Step 1: Copy the Example Config

```bash
# For each demo, copy the example config
cp react-demo-app/public/config.example.json react-demo-app/public/config.json
cp react-demo-clearervoice/public/config.example.json react-demo-clearervoice/public/config.json
cp react-demo-rnnoise/public/config.example.json react-demo-rnnoise/public/config.json
```

### Step 2: Add Your OAuth Client ID

Edit each `config.json` file and replace `YOUR-OAUTH-CLIENT-ID-HERE` with your actual OAuth Client ID:

```json
{
  "clientId": "your-actual-client-id-here",
  "redirectUri": "https://localhost:8443",
  "environment": "mypurecloud.com"
}
```

## How to Get an OAuth Client ID

### Option 1: Use an Existing OAuth Client

If you already have an OAuth client for Genesys Cloud WebRTC:
1. Go to Genesys Cloud Admin → Integrations → OAuth
2. Find your existing OAuth client
3. Copy the Client ID
4. Paste it into the config.json files

### Option 2: Create a New OAuth Client

1. Log in to Genesys Cloud Admin
2. Navigate to **Admin** → **Integrations** → **OAuth**
3. Click **Add Client**
4. Configure:
   - **App Name**: WebRTC Noise Suppression Demos
   - **Grant Type**: Token Implicit Grant (Browser)
   - **Authorized redirect URIs**: `https://localhost:8443`
5. Click **Save**
6. Copy the **Client ID**
7. Paste it into the config.json files

## Security Best Practices

### ✅ Safe to Share
- OAuth Client ID (it's meant to be public)
- This package (without config.json)
- Example config files

### ❌ Never Share
- OAuth Client Secret (if you have one)
- Access tokens
- Your Genesys Cloud password
- Actual config.json files with your Client ID

## Why OAuth Client ID is Safe to Share

The OAuth Client ID is **not a secret**. It's designed to be embedded in client-side applications and is safe to share because:

1. It only identifies your application
2. It cannot be used to access your account without user authentication
3. Users must still log in with their Genesys Cloud credentials
4. It's bound to specific redirect URIs (https://localhost:8443)

However, for organizational security policies, we've excluded it from the package. You can choose to:
- Share your OAuth Client ID with reviewers (easiest)
- Have reviewers create their own OAuth client (more secure)

## Quick Setup Script

Run this to set up all config files at once:

```bash
#!/bin/bash
# setup-oauth.sh

echo "Enter your OAuth Client ID:"
read CLIENT_ID

for demo in react-demo-app react-demo-clearervoice react-demo-rnnoise; do
  cat > $demo/public/config.json << EOF
{
  "clientId": "$CLIENT_ID",
  "redirectUri": "https://localhost:8443",
  "environment": "mypurecloud.com"
}
EOF
  echo "✓ Created $demo/public/config.json"
done

echo "✅ OAuth configuration complete!"
```

Save this as `setup-oauth.sh`, make it executable (`chmod +x setup-oauth.sh`), and run it.

## Troubleshooting

### "OAuth redirect URI mismatch" error
- Verify the redirect URI in your OAuth client matches: `https://localhost:8443`
- Make sure you're accessing the demo at `https://localhost:8443` (not http)

### "Invalid client" error
- Check that the Client ID in config.json is correct
- Verify the OAuth client exists in Genesys Cloud
- Ensure the OAuth client is enabled

### Config file not found
- Make sure config.json exists in the `public/` directory of the demo you're running
- Check that you copied from config.example.json and renamed it to config.json

## For Package Recipients

If you received this package, you have two options:

1. **Ask the sender for their OAuth Client ID** (easiest)
   - They can safely share it with you
   - Just add it to the config.json files
   - You'll authenticate with your own Genesys Cloud credentials

2. **Create your own OAuth client** (more secure)
   - Follow the "Create a New OAuth Client" steps above
   - Use your own Client ID
   - Full control over the OAuth client

---

**Questions?** See SETUP-INSTRUCTIONS.md for detailed setup steps.
