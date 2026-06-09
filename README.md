# Offload — Pre-Sleep Brain Dump App with Binaural Beats & Dream Journal

**Release your thoughts. Rest deeply. A free, open-source, privacy-first pre-sleep brain dumping ritual with ambient pink noise, binaural beats, dream journaling, and sleep insights — all data stays encrypted on your device.**

[![Live App](https://img.shields.io/badge/Live%20App-offload.lyfmail.com-teal)](https://lyfmail-official.github.io/offload/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://github.com/lyfmail-official/offload/blob/main/LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Offline--First-orange.svg)](https://lyfmail-official.github.io/offload/)
[![Privacy](https://img.shields.io/badge/Privacy-Zero%20Backend-green.svg)](https://lyfmail-official.github.io/offload/)
[![Maintained by LYF Mail](https://img.shields.io/badge/Maintained%20by-LYF%20Mail-red)](https://lyfmail.com)

**"Release your thoughts. Rest deeply."**  
A free, open-source sleep wellness and brain dump journaling tool from [LYF Mail](https://lyfmail.com) — India's privacy-first digital wellness platform.

---

## 🌙 What Is Offload?

**Offload** is a free, open-source, **privacy-first pre-sleep brain release application** and **sleep wellness tool** designed to help you clear your mind before bed through a structured **brain dumping ritual**. It combines **ambient pink noise**, **binaural beats (4Hz theta waves)**, **real-time sentiment analysis**, **dream journaling**, **sleep insights**, and a **closing ceremony** — all within a single-page Progressive Web App (PWA) that works entirely offline.

Unlike sleep apps, meditation apps, or journaling platforms that store your most intimate thoughts on cloud servers, Offload follows a **strict zero-backend architecture**. Your brain dumps, dream journals, sleep patterns, and personal reflections are encrypted with **AES-256-GCM** and stored exclusively on your device. **No accounts. No tracking. No cloud storage. No analytics.**

Built by [LYF Mail](https://lyfmail.com), a [privacy-first digital wellness platform](https://lyfmail.com) serving 50,000+ subscribers across India since 2020, Offload extends our mission of **"Every Choice Shapes Tomorrow"** into **sleep hygiene**, **mental decluttering**, and **restorative wellness technology**.

---

## 🧠 Why Offload Exists — The Sleep & Privacy Crisis

Modern life fills our minds with noise:

- 📱 **Endless notifications** fragment attention and elevate cortisol before bed.
- 💼 **Work stress** bleeds into evenings, making rest impossible.
- 📝 **Mental to-do lists** race through our minds as we try to sleep.
- 😰 **Anxiety and worry** accumulate without a healthy release mechanism.
- 🔒 **Privacy concerns** prevent people from using journaling or sleep apps that store data on servers.

Most sleep apps and journaling platforms demand:
- Cloud accounts and personal data.
- Subscription fees for premium features.
- Tracking and analytics that monetize your sleep patterns.
- Server storage that exposes your intimate thoughts to breaches and subpoenas.

**Offload solves both problems simultaneously** — it provides a powerful, evidence-informed pre-sleep ritual while ensuring your most private mental content never leaves your device.

---

## ✨ Key Features

### 🧘 8 Core Views — Complete Sleep Wellness Experience

| View | Purpose | Key Capabilities |
|------|---------|----------------|
| **1. Landing** | Calm entry into your ritual. | Breathing animation, real-time moon phase display, rotating sleep hygiene tip. |
| **2. Brain Dump** | Release racing thoughts. | 5-minute timer with SVG progress ring, real-time sentiment analysis, voice input, ambient pink noise, binaural beats (4Hz theta). |
| **3. Closing Ceremony** | Symbolic release of worries. | WebGL particle system with 200 rising particles — watch your thoughts dissolve. |
| **4. Intention Setting** | Positive closure before sleep. | AI-generated intentions based on your dump content, or write your own. |
| **5. Archive** | Review past sessions. | Session cards with detail view, encrypted export/import, share functionality. |
| **6. Dream Journal** | Capture morning dreams. | Tag dreams (lucid, vivid, nightmare, recurring, prophetic), mood tracking. |
| **7. Sleep Insights** | Understand your patterns. | 7-day activity chart, word cloud visualization, streak counter, average energy tracking. |
| **8. Settings** | Personalize your experience. | AES-256-GCM encryption toggle, audio preferences, bedtime reminders. |

### 🔒 Privacy-First by Design — Zero-Backend Architecture

- ✅ **AES-256-GCM encryption** via Web Crypto API — military-grade encryption for all journal entries.
- ✅ **PBKDF2 key derivation** (150,000 iterations) — brute-force resistant passphrase protection.
- ✅ **All data stays on your device** — zero external API calls, zero network transmission.
- ✅ **No accounts required** — no signup, no login, no email, no phone number.
- ✅ **No tracking or analytics** — zero cookies, zero fingerprinting, zero behavioral profiling.
- ✅ **Optional passphrase encryption** — add an extra layer of security with a key only you know.

### 🎵 Audio & Sound Therapy

- **🌸 Pink noise generator** — synthesized via Web Audio API for deep relaxation and sleep onset.
- **🧠 Binaural beats** — 4Hz theta wave pattern (200Hz left channel / 204Hz right channel) to promote relaxation and pre-sleep brain states.
- **🔔 Ceremony chime** — descending tone sequence for mindful session closure.
- **🎛️ UI sound effects** — synthesized feedback sounds for calming interaction.

### 📱 Progressive Web App (PWA)

- **Installable on iOS, Android, and Desktop** — add to home screen for native app-like experience.
- **Works entirely offline** after first visit — no internet required for journaling, audio, or insights.
- **Background sync support** — reliable data persistence even with intermittent connectivity.
- **Adaptive icon for Android** — dynamic icon theming based on device settings.

---

## 🧬 How Offload Works

### Step 1: Landing — Enter the Ritual
Open Offload and breathe with the animated guide. The real-time moon phase and a rotating sleep hygiene tip set a calm, intentional tone for your pre-sleep routine.

### Step 2: Brain Dump — Release Racing Thoughts
Set a timer (default 5 minutes) and write everything on your mind — worries, to-do items, anxieties, ideas. Offload provides:
- **Real-time sentiment analysis** — client-side lexicon analysis detects your emotional state as you write.
- **Voice input** — speak your thoughts instead of typing (Web Speech API, local processing).
- **Ambient pink noise** — continuous relaxation soundscape.
- **Optional binaural beats** — 4Hz theta waves to guide your brain toward a pre-sleep state.

### Step 3: Closing Ceremony — Symbolic Release
Watch your written thoughts transform into 200 rising particles in a WebGL visualization. This **ceremonial release** creates a psychological boundary between your active day and restorative sleep.

### Step 4: Intention Setting — Positive Closure
Offload generates a personalized sleep intention based on your brain dump content (e.g., *"I release today and welcome peaceful rest"*). Or write your own intention, gratitude note, or affirmation.

### Step 5: Morning Dream Journal
Upon waking, log your dreams with tags (lucid, vivid, nightmare, recurring, prophetic) and mood tracking. Build a private, encrypted dream archive over time.

### Step 6: Sleep Insights — Understand Your Patterns
Review your 7-day activity chart, word cloud of recurring themes, session streak counter, and average energy levels. All insights are computed **locally on your device** — no data ever leaves.

---

## 🛠️ Technology Stack

Offload is built with **radical simplicity** — zero frameworks, zero dependencies, zero backend:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI** | Vanilla HTML5 / CSS3 / ES6+ | Zero-framework, maximum performance, full transparency. |
| **Storage** | localStorage + Web Crypto API | Encrypted, local-only data persistence. |
| **Audio** | Web Audio API | Real-time synthesis of pink noise, binaural beats, and UI sounds. |
| **Graphics** | WebGL 1.0 | Particle system for closing ceremony visualization. |
| **Sentiment Analysis** | Client-side Lexicon Analysis | Real-time emotion detection without server calls. |
| **PWA** | Service Worker + Manifest | Offline functionality, installability, background sync. |
| **Build** | None — pure Static Files | Maximum transparency, minimal attack surface. |

---

## 🚀 Quick Start Guide

### For Users (No Technical Knowledge Required)

1. **Visit** [lyfmail-official.github.io/offload](https://lyfmail-official.github.io/offload/)
2. **No signup required** — open the app and begin your first brain dump immediately.
3. **Set your timer** — default 5 minutes, adjustable in Settings.
4. **Write or speak your thoughts** — release everything on your mind.
5. **Experience the closing ceremony** — watch your worries dissolve into particles.
6. **Set your sleep intention** — close with purpose and positivity.
7. **Install as PWA** — tap "Add to Home Screen" for offline, app-like experience.
8. **Log dreams in the morning** — build your encrypted dream archive over time.

### For Developers

1. **Clone the repository**
```bash
git clone https://github.com/lyfmail-official/offload.git
cd offload
```

2. **Serve locally** (any static file server)
```bash
# Python 3
python -m http.server 8080

# Or with Node.js
npx serve .

# Or any static server of your choice
```

3. **Open in your browser**
```bash
http://localhost:8080
```

4. **No build step required** — pure HTML, CSS, and vanilla JavaScript. Zero dependencies.

---

## 📁 Project Structure

```
offload/
├── index.html              # Single-page application shell
├── manifest.json           # PWA manifest for installability
├── sw.js                   # Service Worker — offline cache strategy
├── robots.txt              # SEO optimization
├── sitemap.xml             # SEO optimization
├── css/
│   └── style.css           # Complete design system with dark mode
├── js/
│   ├── data-store.js       # Encrypted localStorage wrapper (AES-256-GCM)
│   ├── audio-engine.js     # Web Audio API synthesis (pink noise, binaural beats)
│   ├── ceremony-renderer.js # WebGL particle system for closing ceremony
│   ├── sentiment-analyzer.js # Client-side emotion detection & lexicon analysis
│   └── app.js              # Main application controller & routing
├── assets/
│   └── icons/              # PWA icons (192x192, 512x512, adaptive)
│   └── moon-phases/        # Real-time moon phase images
│   └── screenshots/        # App store / PWA screenshots
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions — auto-deploy to GitHub Pages
├── docs/
│   ├── privacy.md          # Privacy architecture documentation
│   ├── audio-science.md    # Binaural beats & pink noise research
│   └── sleep-hygiene.md    # Sleep hygiene tips & best practices
├── LICENSE
├── README.md
├── CONTRIBUTING.md
└── CODE_OF_CONDUCT.md
```

---

## 🌍 Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome / Edge | 80+ | Full feature support. |
| Firefox | 75+ | Full feature support. |
| Safari | 14+ | Full feature support. |
| Chrome Android | 80+ | PWA install supported. |
| Safari iOS | 14.5+ | PWA install supported. |
| Safari iOS | 16.4+ | Required for PWA "Add to Home Screen". |

---

## 🚀 Deploy to GitHub Pages

The repository includes a **GitHub Actions workflow** that automatically deploys to GitHub Pages on every push to `main`:

1. **Fork** this repository or push to your own.
2. Go to **Settings → Pages** in your GitHub repository.
3. Set **Source** to "GitHub Actions".
4. Push to `main` — your site will be live at `https://yourusername.github.io/offload/`

---

## 🌍 Who Uses Offload?

### 😴 People with Racing Thoughts at Bedtime
Those whose minds fill with worries, to-do lists, and anxieties the moment they lie down. Offload provides a **structured ritual to release mental clutter** before sleep.

### 😰 Anxiety & Stress Sufferers
People experiencing work stress, relationship anxiety, or general overwhelm who need a **private, judgment-free space** to vent before rest — without fear of data exposure.

### 🧘 Mindfulness & Sleep Hygiene Practitioners
Those following **sleep hygiene protocols** who want a digital tool that supports their pre-sleep routine without compromising privacy or requiring subscriptions.

### ✍️ Journalers & Dream Enthusiasts
People who want to **track their dreams**, build a dream archive, and analyze sleep patterns over time — all with **local, encrypted storage**.

### 🔒 Privacy-Conscious Users
Individuals who refuse to store their intimate thoughts, dreams, and mental health data on corporate servers. Offload is **100% local, zero-backend, fully auditable**.

### 🎧 Sound Therapy Users
People who use **pink noise**, **binaural beats**, or **ambient sound** for relaxation and sleep onset who want an integrated, privacy-respecting tool.

---

## 🗺️ Roadmap & Future Development

Planned enhancements include:

- **🤖 On-Device AI Sleep Insights** — TensorFlow.js-based pattern recognition for personalized sleep recommendations (fully local, no cloud).
- **📊 Advanced Sleep Analytics** — Sleep quality scoring, correlation analysis between brain dump content and dream types.
- **🌍 Multi-Language Support** — Sleep hygiene tips, dream tags, and UI localization in Hindi, Tamil, Bengali, and other Indian languages.
- **♿ Enhanced Accessibility** — Screen-reader optimization, motor-friendly inputs, high-contrast themes, reduced-motion options.
- **🔔 Smart Bedtime Reminders** — Local, privacy-respecting notifications based on your sleep schedule.
- **📤 Encrypted Cloud Sync (Optional)** — User-controlled, end-to-end encrypted backup for multi-device access.
- **🎵 Expanded Audio Library** — Additional binaural beat frequencies (alpha for relaxation, delta for deep sleep), nature sounds, and guided breathing.

---

## 🤝 Contributing to Offload

Offload welcomes contributions that respect our core principles:

- **Privacy-first** — never introduce server-side components or data collection.
- **Zero-dependency** — prefer vanilla web platform APIs over frameworks or libraries.
- **Performance-focused** — optimize for low-end devices, slow networks, and limited battery.
- **Accessibility-first** — every feature must work for users with disabilities.
- **Mental health respectful** — no gamification, no metrics pressure, no social comparison.

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) before submitting pull requests.

---

## 🏗️ The LYF Mail Ecosystem

Offload is one of nine free, open-source privacy tools built by [LYF Mail](https://lyfmail.com), a [digital wellness platform](https://lyfmail.com) from Varanasi, India, serving 50,000+ subscribers since 2020. Explore our other projects:

| Project | Description | Live App | Repository |
|---------|-------------|----------|------------|
| **[LYF Mail](https://lyfmail.com)** | Privacy-first newsletters for health, wealth, career & mindfulness. | [lyfmail.com](https://lyfmail.com) | `lyfmail` |
| **[TrustLens](https://trustlens.lyfmail.com)** | Detect misinformation before you share. Privacy-first credibility analysis. | [trustlens.lyfmail.com](https://trustlens.lyfmail.com) | `trustlens` |
| **[Signals](https://signals.lyfmail.com)** | Privacy-first analytics. Human vs. bot detection without cookies or fingerprinting. | [signals.lyfmail.com](https://signals.lyfmail.com) | `signals` |
| **[Ebb](https://ebb.lyfmail.com)** | Period tracker with homomorphic encryption. Your data stays encrypted — even from us. | [ebb.lyfmail.com](https://ebb.lyfmail.com) | `ebb` |
| **[LYF SOS](https://lyfsos.lyfmail.com)** | Offline emergency safety app for Android. Built for Indian families. | [lyfsos.lyfmail.com](https://lyfsos.lyfmail.com) | `lyfsos` |
| **[PDPR](https://pdpr.lyfmail.com)** | Public Dark Pattern Registry. Document deceptive UX ethically. | [pdpr.lyfmail.com](https://pdpr.lyfmail.com) | `pdpr` |
| **[Together](https://together.lyfmail.com)** | Mental health support through therapeutic silence and shared presence. | [together.lyfmail.com](https://together.lyfmail.com) | `together` |
| **[Rewriter](https://lyfmail-official.github.io/rewriter/)** | AI-powered narrative therapy and health content writing assistant. | [lyfmail-official.github.io/rewriter](https://lyfmail-official.github.io/rewriter/) | `rewriter` |

### 📚 Free Newsletters & Guides
- [Health & Wellness Guide](https://lyfmail.com/health-wellness-guide)
- [Personal Finance Guide](https://lyfmail.com/personal-finance-guide)
- [Career Development Guide](https://lyfmail.com/career-development-guide)
- [Creativity Resources](https://lyfmail.com/creativity-resources)
- [Mindfulness Practices](https://lyfmail.com/mindfulness-practices)

**Newsletter Signups:** [Health](https://health.signup.lyfmail.com) · [Finance](https://financing.signup.lyfmail.com) · [Career](https://career.signup.lyfmail.com) · [Creativity](https://creativity.signup.lyfmail.com) · [Personal Development](https://intuition.signup.lyfmail.com)

---

## 📜 License

Offload is released under the **MIT License**.

You are free to use, modify, and distribute it — including commercially. See [`LICENSE`](LICENSE) for full terms.

---

## 📫 Connect With Us

- **🌐 Website:** [lyfmail.com](https://lyfmail.com)
- **🌙 Offload App:** [lyfmail-official.github.io/offload](https://lyfmail-official.github.io/offload/)
- **📱 PWA:** [app.lyfmail.com](https://app.lyfmail.com)
- **📚 Documentation:** [docs.lyfmail.com](https://docs.lyfmail.com)
- **🎨 Brand Assets:** [github.com/lyfmail-official/lyfmail-brand-assets](https://github.com/lyfmail-official/lyfmail-brand-assets)
- **🐦 X / Twitter:** [@lyfmailcom](https://x.com/lyfmailcom)
- **📘 Facebook:** [thelyfmail](https://www.facebook.com/thelyfmail)
- **▶️ YouTube:** [LYF Mail](https://m.youtube.com/channel/UCurymhWrl2nkvv31uJMuc0g)
- **💼 LinkedIn:** [lyfmailcom](https://in.linkedin.com/in/lyfmailcom)
- **📧 Offload Email:** [offload@lyfmail.com](mailto:offload@lyfmail.com)
- **📧 General Email:** contact@lyfmail.com
- **🆘 Support:** [support.lyfmail.com](https://support.lyfmail.com)

---

*"Every Choice Shapes Tomorrow"*

**Maintained by [LYF Mail](https://lyfmail.com)** · Founded by [Ajay Kumar Chaudhary](https://github.com/lyfmail) · Varanasi, Uttar Pradesh, India · Since 2020

---

## 💬 Frequently Asked Questions

**Q: Is Offload really free to use?**  
A: Yes. Offload is completely free. There are no subscription fees, no hidden charges, no premium tiers, and no advertising. It is an open-source project by [LYF Mail](https://lyfmail.com) committed to making sleep wellness tools accessible to everyone.

**Q: How does Offload protect my privacy?**  
A: Offload is built with a **zero-backend architecture**. All your journal entries, brain dumps, dreams, and session data are stored locally on your device using **AES-256-GCM encryption** via the Web Crypto API. There are no accounts, no tracking, no analytics, and no cloud storage. You can optionally set a passphrase for additional encryption.

**Q: What is a brain dump and how does it help with sleep?**  
A: A **brain dump** is the practice of writing down all your thoughts, worries, and to-do items before bed to clear your mind. Research shows that offloading mental clutter before sleep reduces cognitive arousal and improves sleep onset. Offload guides you through a timed 5-minute session with ambient pink noise and optional binaural beats (4Hz theta waves) to help you release mental tension and fall asleep more easily.

**Q: What are binaural beats and are they safe?**  
A: **Binaural beats** are an auditory illusion created when two slightly different frequencies are played in each ear. Offload uses a **4Hz theta wave pattern** (200Hz left channel, 204Hz right channel) which research suggests may promote relaxation and pre-sleep brain states. They are generally considered safe for most people, but those with epilepsy or who are prone to seizures should consult a healthcare provider before use.

**Q: Can I use Offload without an internet connection?**  
A: Yes! Offload is a **Progressive Web App (PWA)** that works entirely offline after the first visit. All features — brain dumping, dream journaling, sleep insights, stats, and audio — function without any internet connection. Your data never leaves your device.

**Q: How do I export or backup my data?**  
A: You can export all your sessions, brain dumps, and dreams as a **JSON file** from the Settings page. This file can be imported back into Offload or kept as a backup. If encryption is enabled, your export will be encrypted with your passphrase.

**Q: What is Progressive Muscle Relaxation (PMR)?**  
A: **Progressive Muscle Relaxation (PMR)** is a technique where you systematically tense and then relax different muscle groups in your body. Offload includes a guided PMR feature that takes you from head to toe, helping release physical tension that may interfere with sleep.

**Q: Does Offload work on iOS and Android?**  
A: Yes. Offload works on all modern browsers including Safari on iOS and Chrome on Android. You can also install it as a PWA by tapping **"Add to Home Screen"** in your browser menu for a native app-like experience.

**Q: Does Offload store my dreams or journal entries on a server?**  
A: No. Offload has **zero backend, zero server, zero database**. All your brain dumps, dream journals, sleep insights, and personal data are stored exclusively in your browser's localStorage with optional AES-256-GCM encryption. We physically cannot access your data because we never receive it.

**Q: Can I use voice input instead of typing?**  
A: Yes. Offload includes **Web Speech API** integration for voice input during brain dump sessions. All voice processing happens locally in your browser — no audio is sent to any server.

**Q: What is the closing ceremony?**  
A: The **closing ceremony** is a symbolic visualization where your written thoughts transform into 200 rising particles in a WebGL animation. This creates a psychological boundary between your active day and restorative sleep, helping you mentally "release" your worries.

**Q: How does the sentiment analysis work?**  
A: Offload uses **client-side lexicon analysis** — a local dictionary of emotional words and phrases — to detect your emotional state in real-time as you write. No text is sent to any server or AI service. The analysis is entirely private and happens instantly in your browser.

**Q: Can I contribute to Offload?**  
A: Yes. We welcome contributions from developers, UX designers, sleep researchers, audio engineers, and accessibility advocates. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) and ensure your contributions respect our privacy-first, zero-backend, zero-dependency principles.

**Q: Is Offload a medical device or sleep treatment?**  
A: No. Offload is a **wellness and journaling tool**, not a medical device or sleep disorder treatment. It is designed to support healthy sleep hygiene and mental decluttering practices. If you have chronic insomnia, sleep apnea, or other sleep disorders, please consult a healthcare professional.

---

*This README is maintained by the LYF Mail team. For issues, feature requests, audio engineering discussions, sleep research collaborations, or contributions, please visit our [GitHub repository](https://github.com/lyfmail-official/offload).*
