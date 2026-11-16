# ECLIPSE — Biggest Update Roadmap

**Project version:** 4.0.0 — The Eclipse Experience  
**Release policy:** Stable releases only. Do not publish the v4.0.0 stable tag until the release checks below pass.  
**Status language:** “Implemented” means the code exists. “Build verified” means CI passed. “Device verified” means it was tested on real Android hardware. These are separate checks.

## Current release-readiness snapshot

| Area | Current status | Notes |
|---|---|---|
| Web dashboard and system picker | Implemented; latest web CI passing | 37 system categories and system landing-page UI |
| Experience Studio | Implemented | Themes, wallpaper, profiles, motion settings, JSON backup/restore |
| Apps Library | Implemented foundation | Android app discovery, Treat as Game labels, manual playtime |
| Folder scanning and backup folder | Native implementation present; bounded scan duration added in v4.0.2 branch | Requires Odin testing with large folders, slow providers, revoked permissions, and duplicate rescans |
| Mascot and first-run setup | Implemented | Eclipse orb mascot; display, default Home, and storage setup |
| Single/dual display | Implemented; Android APK build verified | AndroidX WindowManager detection; real foldable/phone validation still required |
| Default Android Home request | Implemented; Android APK build verified | User must confirm through Android's system role picker; device behavior still needs validation |
| Control Center | Implemented in web and native code | Android panels, app-window brightness, battery status; APK/device validation required |
| Game Mode | Implemented as an ECLIPSE UI mode | Reduces interface effects only; no CPU/GPU tuning |
| Third-party emulator launching | Native ACTION_VIEW handoff implemented | Verify each emulator, content-URI permissions, and file type on device; unsupported combinations must show a clear error |
| Metadata/artwork scraping | Not implemented | Requires provider integration and reliable-match handling |
| Achievements and online theme marketplace | Not implemented | Future work |
| Cloud sync and automatic foreground playtime | Not implemented | Requires additional services/permissions and privacy design |

## 1. Home and system worlds

- Console-inspired ECLIPSE home with system picker and 37 platform categories.
- System landing pages generated from the selected platform and real library data.
- Home widgets, page customization, library shelves, favorites, and search.
- Phone-first responsive design.
- Dual-display layouts: side-by-side layout for vertical hinge devices and top/bottom layout for horizontal hinge devices.
- Auto-detection through AndroidX WindowManager when Android reports a separating fold feature.
- Manual Auto / Single Screen / Dual Screen override for devices or previews that do not expose display-segment information.

**Build status:** The Android APK workflow has compiled and uploaded a test APK. **Remaining:** Test on a normal phone, a foldable/dual-screen device, portrait/landscape, and app resize/posture changes. Do not claim hardware auto-detection works on every foldable until verified.

## 2. Apps and game library

- Android launchable-app discovery and native launch handoff through the Apps Library.
- Pin installed apps to ECLIPSE Home and launch/remove those shortcuts.
- Treat as Game labels saved locally.
- Manual app session timer and locally saved playtime totals.
- Folder picker and game-file scanning foundation.
- System assignment and library organization.

**Remaining:**
- Real-device stress tests for large folders and slow document providers.
- Reliable add/edit/remove game flows and duplicate-safe rescans.
- Automatic foreground-app tracking only if Android permissions and platform behavior allow it.
- End-to-end launch handoff for individually tested emulators and file types.
- Clear unsupported-player and failed-launch messages.
- Never invent app compatibility, playtime, metadata, or game entries.

## 3. Players and emulator support

- Platform/player assignment UI and platform-specific player suggestions are organizational starting points.
- The user must be able to choose a player installed on their device.

**Remaining:**
- Verify the existing selected-game content URI handoff against one supported emulator and file type at a time.
- Record tested versions and known limitations.
- Keep unsupported or untested players clearly labelled.

## 4. ECLIPSE Experience Studio

Implemented in the current branch:
- Theme presets and custom accent color.
- Local wallpaper upload and reset.
- Per-system accent themes.
- Local player profiles.
- Animation speed, reduced-motion, and lightweight visual preferences.
- JSON export and restore for supported settings and library metadata.
- ECLIPSE Hub links to releases, source, and bug reports.

**Remaining:** Validate backup/restore on Android, malformed backup handling, large wallpaper storage, and profile switching across app restarts.

## 5. Mascot and onboarding

- ECLIPSE's mascot is the eclipse orb with eyes and a small hat.
- First-run setup explains storage choices.
- Setup includes Auto / Single / Dual display choice and an action to request ECLIPSE as the default Home app.
- Android decides the final default-launcher confirmation.
- Settings can request the Home-app chooser again and change display preference.

**Build status:** Native launcher integration compiled into the test APK. **Remaining:** Device-test first launch, returning launch, cancel/skip paths, and default-Home selection on supported Android versions. Keep onboarding dismissible.

## 6. Control Center and Game Mode

Implemented foundation:
- Wi-Fi shortcut opens Android's Wi-Fi panel/settings.
- Bluetooth shortcut opens Android Bluetooth settings.
- Volume shortcut opens the system volume UI.
- Brightness slider adjusts the ECLIPSE app window only.
- Battery status reads Android battery information.
- Rotation shortcut opens Android display settings.
- Do Not Disturb shortcut opens Android's DND access settings.
- Game Mode reduces ECLIPSE interface effects.

**Build status:** Native control bridge compiled into the test APK. **Important platform limits:** These shortcuts do not bypass Android restrictions. ECLIPSE cannot silently toggle restricted system settings or claim to boost device CPU/GPU performance. Test each shortcut on supported Android versions.

## 7. Data, backups, and privacy

- Folder access uses Android's document picker and persistable URI permissions where offered.
- Experience Studio exports/imports supported ECLIPSE data as JSON.
- Backup-folder storage is distinct from primary app storage.

**Remaining:**
- Test backup creation, restore, cancellation, permission revocation, malformed files, and version mismatch.
- Confirm before overwriting an existing backup.
- Explain exactly what is included in an export.
- Avoid collecting account or device data that is not needed.

## 8. Visual quality, accessibility, and stability

- Consistent dark visual system, responsive panels, touch-friendly controls, and reduced-motion option.
- Keep loading, empty, success, and error states explicit.
- Keep navigation and settings usable on narrow screens and large displays.
- Avoid heavy animations in Game Mode and when reduced motion is enabled.

**Remaining:** Real-device QA for text scaling, contrast, keyboard/controller navigation, screen readers, orientation changes, and long library lists.

## 9. Android build and stable releases

- Keep application ID stable: `com.eclipse.launcher`.
- Web CI must pass.
- Android APK workflow must compile all native plugins and upload a test APK.
- Test install, launch, default Home selection, app restart, backup/restore, and update-over-existing-install.
- Stable tags require the persistent private signing key and GitHub Actions secrets.
- Never publish a stable tag using a temporary debug signing key.
- Keep the keystore and passwords out of the repository.
- Keep release notes honest about implemented, build-verified, and device-verified features.

## Definition of done

A release is ready only when:
1. Web CI passes on the exact release commit.
2. Android APK build succeeds on the exact release commit.
3. The APK installs and opens on a real Android phone.
4. Default Home, storage, folder scan, settings panels, brightness, battery status, and backup/restore are tested where supported.
5. Dual-display behavior is tested on actual foldable/dual-screen hardware before being advertised as device-verified.
6. Known limitations are documented.
7. A stable signing/update path is verified before publishing a stable release.

**Current decision:** The v4.0.0 feature set is present on `main`. The version/release preparation is in progress. Web CI and Android APK compilation must pass on the exact v4.0.0 commit, and real-device checks remain outstanding before publishing a stable tag.


## v4.0.2 branch changes

- Large-library scan deduplication uses a `Set` rather than repeatedly searching the full library for every discovered file.
- Library persistence is guarded so storage quota errors produce a visible message instead of leaving in-memory state half-updated.
- Native folder traversal has a 20-second time budget in addition to file, directory, and depth limits. A time-limited scan reports itself as truncated; rescan a narrower folder to continue.
- The selected-system hero art now uses original platform-family visual treatments rather than relying only on a symbol.
- Settings copy now reflects active gamepad navigation alongside keyboard controls.
- Emulator handoff remains device/emulator-dependent; manual playtime, Steam integration, and privileged Android Quick Settings remain separate unfinished integrations.
