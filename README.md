# Ordobit Website

Static website for the Ordobit public homepage and device-client downloads.

## Structure

```
ordobit-website/
├── .github/workflows/
│   └── test-publish.yml              # Updates releases.json for testing
├── index.html                        # Landing page
├── downloads/
│   └── index.html                    # Platform download cards
├── releases.json                     # Release manifest consumed by downloads page
├── scripts/
│   └── update-release.mjs             # Validates and updates release entries
├── styles.css                        # Global shared styles (tokens, layout, components)
├── assets/
│   ├── ordobit-logo.svg
│   └── icons/
│       ├── windows.svg
│       ├── linux.svg
│       └── android.png
├── components/
│   ├── header.js                     # Reusable site header renderer
│   └── footer.js                     # Reusable site footer renderer
├── pages/
│   ├── landing/
│   │   ├── landing.css               # Landing page-specific styles
│   │   └── landing.js                # Landing page rendering
│   └── downloads/
│       ├── downloads.css             # Downloads page-specific styles
│       └── downloads.js              # Card rendering + shared header/footer
└── shared/
    ├── constants/
    │   └── platforms.js              # Platform definitions & release defaults
    └── utils/
        ├── dateUtils.js              # Date formatting helper
        └── fileUtils.js              # File-size formatting helper
```

## Pages

| Page | Path | Description |
|------|------|-------------|
| Landing | `/` | Under-development landing with nav to Downloads |
| Downloads | `/downloads/` | Windows, Linux & Android device-client downloads |

## Local preview

Because the downloads page fetches `releases.json`, serve the folder through a
small local HTTP server instead of opening the file directly:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Touch & Device Support

The site is designed for kiosk and touch devices:

- **48 px minimum tap targets** on all interactive elements (buttons, nav links)
- **`touch-action: manipulation`** on `body` to prevent double-tap zoom
- **`-webkit-tap-highlight-color: transparent`** for cleaner touch feedback
- **`@media (pointer: coarse)`** overrides that enlarge controls to 52 px on touch devices
- **`user-scalable=no`** viewport for kiosk lockdown mode

## Publishing latest builds

Update `releases.json` after the release pipeline uploads a build. Example:

```json
{
  "releases": [
    {
      "platform": "windows",
      "version": "1.0.12",
      "size": 123456789,
      "releasedAt": "2026-10-29T10:00:00Z",
      "downloadUrl": "https://downloads.ordobit.com/windows/Ordobit-Setup-1.0.12.exe"
    }
  ]
}
```

The cards intentionally show "Release pending" until a real URL is present.

### Update from GitHub Actions

The **Test Publish** workflow provides the test release process:

1. Open the website repository in GitHub.
2. Go to **Actions** and select **Test Publish**.
3. Choose **Run workflow**.
4. Enter the platform, version, public download URL and file size in bytes.

The workflow validates the values, replaces that platform's entry in
`releases.json` and commits the change. It does not deploy the website.

## Hosting

The repository contains static files and can be served directly by Nginx. Point
the Nginx document root at the checked-out website directory. Deployment and
repository updates can be handled on the server separately.
