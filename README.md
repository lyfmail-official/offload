# Offload — Pre-Sleep Brain Release

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![PWA](https://img.shields.io/badge/PWA-Ready-teal.svg)](https://web.dev/progressive-web-apps/)
[![Privacy](https://img.shields.io/badge/Privacy-First-amber.svg)]()

> "Release your thoughts. Rest deeply."

Offload is a zero-backend, privacy-first ceremonial ritual application for pre-sleep brain dumping. All data remains encrypted on your device. No accounts, no tracking, no cloud storage.

## Features

### 8 Core Views

1. **Landing** — Breathing animation, real-time moon phase, rotating sleep hygiene tip
2. **Brain Dump** — Timer with SVG progress ring, real-time sentiment analysis, voice input, ambient pink noise, binaural beats (4Hz theta)
3. **Closing Ceremony** — WebGL particle system with 200 rising particles
4. **Intention Setting** — AI-generated intentions based on your dump content
5. **Archive** — Session cards with detail view, export/import, share
6. **Dream Journal** — Tag dreams (lucid/vivid/nightmare/recurring/prophetic)
7. **Sleep Insights** — 7-day chart, word cloud, streak counter
8. **Settings** — AES-256-GCM encryption, audio preferences, bedtime reminders

### Privacy & Security

- **AES-256-GCM encryption** via Web Crypto API
- **PBKDF2 key derivation** (150,000 iterations)
- All data stays on your device — zero external API calls
- No accounts, no tracking, no analytics

### Audio

- **Pink noise generator** via Web Audio API
- **Binaural beats** — 4Hz theta wave (200Hz L / 204Hz R)
- **Ceremony chime** — Descending tone sequence
- **UI sound effects** — Synthesized feedback sounds

### PWA

- Installable on iOS, Android, and Desktop
- Works offline after first visit
- Background sync support
- Adaptive icon for Android

## Technology Stack

| Layer | Technology |
|-------|-----------|
| UI | Vanilla HTML5 / CSS3 / ES6+ |
| Storage | localStorage + Web Crypto API |
| Audio | Web Audio API |
| Graphics | WebGL 1.0 |
| Sentiment | Client-side lexicon analysis |
| PWA | Service Worker + Manifest |
| Build | None — pure static files |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/lyfmail-official/offload.git
cd offload

# Serve locally (Python 3)
python -m http.server 8080

# Or with Node.js
npx serve .

# Open http://localhost:8080
```

## Deploy to GitHub Pages

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

1. Fork this repository
2. Go to Settings → Pages
3. Set Source to "GitHub Actions"
4. Push to `main` — your site will be live at `https://yourusername.github.io/offload/`

## Browser Support

- Chrome / Edge 80+
- Firefox 75+
- Safari 14+
- Chrome Android 80+
- Safari iOS 14.5+ (PWA install requires iOS 16.4+)

## File Structure

```
offload/
├── index.html              # Single-page application shell
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── robots.txt              # SEO
├── sitemap.xml             # SEO
├── css/
│   └── style.css           # Complete design system
├── js/
│   ├── data-store.js       # Encrypted localStorage wrapper
│   ├── audio-engine.js     # Web Audio API synthesis
│   ├── ceremony-renderer.js # WebGL particle system
│   ├── sentiment-analyzer.js # Emotion detection
│   └── app.js              # Main application controller
└── *.png                   # Icons, moon phases, screenshots
```

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Made with care by [LYF Mail](https://lyfmail.com)

Contact: [offload@lyfmail.com](mailto:offload@lyfmail.com)
