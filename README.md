# ECLIPSE — Your Gaming Universe

**ECLIPSE is an Android-first gaming frontend built around one library, one data layer, and a set of selectable console-style experiences.** The original ECLIPSE application is the foundation of the project. Its identity, architecture, and existing working features stay intact while the launcher grows into a more complete gaming home.

## Project direction

- **ECLIPSE is the foundation.** Development continues in this original Vite + Capacitor Android application.
- **NeoStation is a reference and potential donor.** The `migration/neostation-pegasus` branch is audited for useful, compatible pieces; it is not the foundation and will not be merged wholesale.
- **Pegasus is a navigation and customization reference.** ECLIPSE already has its own web-native, Pegasus-inspired navigation layer. The Qt/QML runtime is not embedded.
- **iiSU is a visual reference.** Visual ideas may inform ECLIPSE themes; third-party assets are reused only when their licenses and permissions allow it.
- **ECLIPSE keeps its own identity.** The goal is not to reskin another launcher or ship several disconnected apps.

## The ECLIPSE experience

ECLIPSE is intended to offer multiple selectable interface experiences backed by the same game library, metadata, settings, and local data:

- **ECLIPSE Original** — the signature purple-black cosmic interface.
- **Cocoon-inspired** — artwork-led browsing and wide horizontal shelves.
- **PlayStation-inspired** — a clean console dashboard and game-first navigation.
- **Xbox-inspired** — a content-rich home with quick access to installed games.
- **Nintendo-inspired** — approachable, playful system browsing.
- **Steam Big Picture-inspired** — controller-first library navigation.
- **Retro console** — classic system-focused browsing.
- **Entertainment hub** — a TV-style space for supported installed apps such as YouTube, Hulu, Disney+, and Netflix.

These are product directions, not a claim that every interface is already implemented. They should share the same underlying library and settings rather than creating separate copies of user data.

## What exists in the current application

The current codebase includes:

- A Cocoon-style home and a separate Konsoru console-home experience, with system browsing for a broad set of platforms.
- A game library with folder scanning, system assignment, search, favorites, and user-managed entries.
- An Android Apps Library with installed-app discovery and launch handoff, pin-to-Home shortcuts, Treat as Game labels, and manual session/playtime tracking.
- ECLIPSE's orb mascot and first-run setup for storage, display layout, and Android's default Home-app chooser.
- Responsive single-screen and Android foldable/dual-display layout support.
- Experience Studio with theme presets, custom accent colors, local wallpaper, per-system themes, local profiles, motion preferences, and JSON backup/restore.
- A web-native slide-in navigation layer with keyboard/controller-compatible focus behavior.
- Control Center shortcuts for supported Android system panels, app-window brightness, and battery status.
- ECLIPSE Game Mode, which reduces interface effects rather than changing the device's CPU/GPU performance profile.
- Android native bridges for folder access, installed-app discovery, launcher setup, display information, system controls, and update downloads.

Feature presence in code does not automatically mean every device path has been fully tested. See the roadmap for the distinction between implemented, build-verified, and device-verified work.

## Current limitations and priorities

The current roadmap prioritizes reliable core behavior before adding more decorative features:

1. Audit and improve ROM discovery, metadata scraping, and artwork handling, building on the existing per-game SteamGridDB workflow.
2. Restore clear, accurate system identities and game artwork throughout browsing.
3. Build the original ECLIPSE home and selectable interface experiences on the existing application.
4. Improve real game detail pages and verified launch handoff.
5. Integrate achievements where a supported service and authentication flow are available.
6. Expand customization, Control Center, and the entertainment hub after auditing existing functionality.

Important current limitations:

- SteamGridDB artwork search, manual selection, and per-game artwork fetching are present in the current game-details flow when the user supplies an API key. This is not yet a complete automatic full-library metadata scraper or resilient bulk artwork-matching pipeline.
- Achievement-service integrations are not implemented yet.
- Emulator/player assignment and system pages are organizational UI; launch handoff must be verified per emulator, file type, and Android device.
- Treat as Game labels and playtime are local. Session timing is manual; ECLIPSE does not yet observe other apps' foreground/background state.
- An online theme/add-on marketplace and cloud sync are not included.
- Wi-Fi, Bluetooth, rotation, and Do Not Disturb shortcuts open Android settings or system panels. ECLIPSE does not bypass Android restrictions to silently toggle them.
- Brightness adjusts the ECLIPSE app window, not global device brightness.
- Foldable auto-detection depends on Android reporting a separating fold feature. Browser preview may not expose the same hardware information.
- A successful build does not replace testing on a real phone or foldable.

Scraping must be resilient: a failed match for one game must not stop the rest of the library. The intended experience includes per-game status and failure reasons, retry and manual-match options, fallback artwork, and a clear scan summary. These are requirements for the implementation, not claims that the complete workflow already exists.

## Technical foundation

- Frontend: Vite + vanilla JavaScript.
- Android integration: Capacitor 7 with native Java plugins.
- Android application ID: `com.eclipse.launcher`.
- App display name: `ECLIPSE`.
- Node.js 22 is used by the GitHub Actions workflows.
- Java 21 is used by the Android APK workflow.

ECLIPSE does not include ROMs, BIOS files, emulator cores, or copyrighted game artwork. Only add game files and apps you have the right to use.

## Run locally

```bash
npm install
npm run dev
```

## Build the web app

```bash
npm install
npm run build
```

## Android APK

The `.github/workflows/android-apk.yml` workflow generates the Capacitor Android project, installs the native plugins, builds an APK, and uploads it as a GitHub Actions artifact. Stable tagged releases require the persistent Android signing secrets configured in GitHub Actions. Do not publish a stable release using a temporary debug signing key.

The `.github/workflows/ci.yml` workflow validates the web build. Check both workflows and test the APK on real Android hardware before calling a release ready.

## Project status

See [the Biggest Update Roadmap](docs/BIGGEST-UPDATE-ROADMAP.md) for the current implementation status, remaining integrations, and release definition of done.
