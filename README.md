# LBAToolkit.ReleaseInfo
Centralized release information and version history management for LBAToolkit, including release notes, version details, and update information.

## Release history web page

A static page (no build step, no dependencies) that renders the published release feed.

```
index.html                   Page shell
releases.json                Published release feed (single source of truth)
assets/<version>/            Media referenced by the changes of that version
src/styles/main.css          Styles
src/scripts/
  app.js                     Composition root + hash routing (e.g. #3.4.0)
  data/releaseRepository.js  Loads and sorts releases.json
  domain/releaseModel.js     Normalization, ordering, grouping, date formatting
  ui/                        DOM rendering (nav, details, media, status)
```

### Running locally

The page loads `releases.json` with `fetch` and uses ES modules, so it must be served over HTTP:

```powershell
python -m http.server 8000
# then open http://localhost:8000
```

### Publishing a release

Add an entry to the `releases` array in `releases.json`:

```json
{
  "version": "1.0.2",
  "date": "2026-08-25",
  "summary": "Bug fixes and improvements.",
  "changes": [
    {
      "type": "fix",
      "title": "Fixed Revit 2027 deployment",
      "description": "Optional longer explanation.",
      "media": [
        {
          "type": "image",
          "url": "assets/1.0.2/revit-2027-deployment.png",
          "caption": "Optional caption, also used as the image alt text."
        }
      ]
    }
  ]
}
```

- `type` is one of `new`, `improved`, `fixed` or `other`; common aliases (`fix`, `added`, `enhancement`, ...) are mapped automatically and unknown values fall back to `other`.
- Sections always render in the order New -> Improved -> Fixed -> Other; empty sections are omitted.
- `media` supports `image` and `video`; store the files under `assets/<version>/`.
- Releases are sorted by version; the newest one is badged `Latest` and shown by default.
