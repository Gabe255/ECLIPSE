# ECLIPSE 11.4.0 — Your Gaming Universe

**ECLIPSE is an Android-first gaming frontend evolving into one unified gaming home.** The goal is to bring together the strongest parts of NeoStation, Pegasus, and iiSU in a single ECLIPSE experience—not three separate apps.

## Integration direction

- **NeoStation — candidate foundation:** evaluate its Android/game-library architecture as the core for the unified frontend.
- **Pegasus — customization and navigation:** port or rebuild compatible layout, theme, and navigation capabilities.
- **iiSU — visual system:** adapt its icon and theme direction, and reuse assets only where their licenses and permissions allow.
- **ECLIPSE — the finished product:** one identity, one home screen, one settings system, one APK, and a consistent console-first experience.

ECLIPSE remains a Vite + Capacitor Android app. Pegasus is a Qt/QML application, so its QML runtime cannot be dropped into this frontend. ECLIPSE now includes an independently implemented Pegasus-inspired slide-in navigation layer and retains its own horizontal collection shelves, theme customization, and controller navigation. This is a compatible UI port, not a merge of Pegasus' C++/QML runtime or assets. The upstream fork is [Gabe255/pegasus-frontend](https://github.com/Gabe255/pegasus-frontend); Pegasus is GPLv3, and no upstream QML source or theme assets are copied into this UI layer.

## Current ECLIPSE experience

- Console-inspired home with 37 system categories and dedicated system landing pages.
- Game library with folder scanning, system assignment, search, favorites, and user-managed entries.
- Android Apps Library with installed-app discovery and launching, pin-to-Home shortcuts, Treat as Game labels, and manual session/playtime tracking.
- ECLIPSE orb mascot and first-run setup for storage, display layout, and Android's default Home-app chooser.
- Single-screen responsive layout and dual-screen/foldable layout support, using AndroidX WindowManager detection in the Android APK where a separating fold feature is available.
- Experience Studio: theme presets, custom accent, local wallpaper, per-system themes, local profiles, motion preferences, and JSON backup/restore.
- Control Center: top-edge swipe-down or button access to Wi-Fi and Bluetooth settings, volume panel, app-window brightness, battery status, display settings, and Do Not Disturb settings.
- ECLIPSE Game Mode reduces interface effects; it does not change the phone's CPU/GPU performance profile.
- Android native folder access, installed-app discovery, default-launcher request, foldable display detection, and system-control bridges.

## Important limitations

- The Pegasus-inspired navigation pattern is implemented in `src/pegasus-ui.js` and `src/pegasus-ui.css`. Full Pegasus Qt/QML runtime integration is not part of this Vite/Capacitor app. NeoStation and iiSU code/assets are not merged.
- Android controls the final confirmation when ECLIPSE is selected as the default Home app.
- Wi-Fi, Bluetooth, rotation, and Do Not Disturb shortcuts open Android settings or system panels. ECLIPSE does not bypass Android restrictions to silently toggle them.
- Brightness adjusts the ECLIPSE app window, not global device brightness.
- Treat as Game labels and playtime are local. Session timing is manual; ECLIPSE does not yet observe other apps' foreground/background state.
- Emulator/player assignment and system pages are organizational UI. End-to-end game launching into third-party emulators is not yet implemented.
- Automatic metadata and artwork scraping, online theme marketplace, achievement-service integrations, and cloud sync are not included yet.
- Foldable auto-detection requires Android to report a separating fold feature. Browser preview may not expose the same hardware information; the layout can be selected manually in that case.
- A successful build does not replace testing on a real phone or foldable.

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

The `.github/workflows/android-apk.yml` workflow creates a Capacitor Android project, installs the native plugins, builds an APK, and uploads it as a GitHub Actions artifact. Release branches also build test APK artifacts; stable tagged releases require persistent signing secrets and device validation. Feature branches also build test APKs.

Stable tagged releases require the persistent Android signing secrets configured in GitHub Actions. Do not publish a stable release using a temporary debug signing key. The Android application ID is `com.eclipse.launcher`.

## Project status

See [the Biggest Update Roadmap](docs/BIGGEST-UPDATE-ROADMAP.md) for implemented work, remaining integrations, and the release definition of done.
