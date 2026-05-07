# Google Stitch MCP setup

Guide to configuring the Model Context Protocol (MCP) with Google Stitch in Cursor.

## What is Google Stitch?

Google Stitch turns text prompts into full UI designs and production-oriented frontend code. The MCP lets AI agents (such as Cursor) work with Stitch projects directly.

## Prerequisites

- [Google Cloud CLI (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed
- Google Cloud account with billing enabled
- A Google Cloud project

## Option 1: stitch-mcp (recommended — NPX)

This approach uses the `stitch-mcp` package with Google Cloud authentication. It works on Windows, macOS, and Linux.

### Step 1: Sign in to Google Cloud

```bash
# Sign in to Google Cloud
gcloud auth login

# Set your project (replace YOUR_PROJECT_ID with the real ID)
gcloud config set project YOUR_PROJECT_ID
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
```

### Step 2: Enable the Stitch API

```bash
# Install the gcloud beta component (if you do not have it yet)
gcloud components install beta

# Enable the Stitch API on the project
gcloud beta services mcp enable stitch.googleapis.com
```

### Step 3: Application default credentials

```bash
# Configure application default credentials
gcloud auth application-default login
```

### Step 4: Update `mcp.json`

Edit `.cursor/mcp.json` and replace `YOUR_PROJECT_ID` with your Google Cloud project ID:

```json
{
  "mcpServers": {
    "stitch": {
      "command": "npx",
      "args": ["-y", "stitch-mcp"],
      "env": {
        "GOOGLE_CLOUD_PROJECT": "your-project-id"
      }
    }
  }
}
```

### Step 5: Restart Cursor

Quit and reopen Cursor so the MCP configuration is loaded.

---

## Option 2: Official HTTP API (API key)

If you prefer the official Stitch API with an API key:

### Step 1: Create an API key

1. Open [Stitch settings](https://stitch.google.com/settings).
2. Under **API Keys**, click **Create API Key**.
3. Store the key securely (never commit it to public repositories).

### Step 2: Configure `mcp.json`

Replace the Stitch entry in `.cursor/mcp.json` with:

```json
{
  "mcpServers": {
    "stitch": {
      "url": "https://stitch.googleapis.com/mcp",
      "headers": {
        "X-Goog-Api-Key": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

> **Security:** If you use an API key, add `.cursor/mcp.json` to `.gitignore` so the key is not exposed.

---

## Available tools

| Tool | Description |
|------|-------------|
| `extract_design_context` | Extracts “Design DNA” (fonts, colors, layouts) from a screen for consistency |
| `fetch_screen_code` | Downloads HTML/frontend code for a screen |
| `fetch_screen_image` | Downloads a high-resolution screenshot of a screen |
| `generate_screen_from_text` | Generates a **new** screen from your prompt |
| `create_project` | Creates a new workspace/project |
| `list_projects` | Lists all available Stitch projects |
| `list_screens` | Lists all screens in a project |
| `get_project` | Returns project details |
| `get_screen` | Returns screen metadata |

## Designer workflow tip

For consistent UI, use a two-step flow:

1. **Extract:** “Extract design context from the Home screen…”
2. **Generate:** “Using that context, generate a Chat screen…”

That keeps new screens aligned with the existing design system.

## Troubleshooting

### MCP does not show in Cursor

- Confirm `.cursor/mcp.json` exists at the project root.
- Fully restart Cursor.
- In Cursor: **Settings → MCP** and check that the server is listed.

### Authentication errors

- Run again: `gcloud auth application-default login`
- Verify the project: `gcloud config get-value project`

### API not enabled

- Run: `gcloud beta services mcp list --enabled`
- The `stitch.googleapis.com` service should appear in the list
