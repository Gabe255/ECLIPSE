# ECLIPSE Video Reference — Frontend Rebuild Spec

This document records the user's 2026-11-16 handheld-launcher video as the primary visual and interaction reference for the next ECLIPSE frontend rebuild.

## Core experience

ECLIPSE should feel like a native console dashboard on a handheld, not a generic web dashboard or a stack of Cocoon-style content rows.

### 1. Startup / boot
- Show a deliberate ECLIPSE boot/loading screen when the launcher starts.
- Use a short, polished transition into the home dashboard.
- Do not leave the user staring at a blank or unresponsive screen while startup work happens.
- Keep startup animation lightweight and respect reduced-motion / Game Mode settings.

### 2. Systems home
- Make the systems/platform browser the primary home experience.
- Present systems as a horizontal carousel/selector with a large selected-system hero treatment.
- The hero should remain visible while the user is within that section; it should naturally leave as the user navigates beyond that section rather than being permanently pinned over the rest of the interface.
- D-pad/left stick moves between systems; A/confirm opens the selected system.
- Opening a system should transition into its dedicated platform page/library.
- Show platform identity, collection count, and a clear launch/enter action.
- Avoid making the home screen primarily a collection of generic horizontal shelves.

### 3. Platform pages and game launching
- Each system gets a dedicated page with its own identity, hero, collection, and player/emulator assignment.
- Selecting a game should lead to a clear launch action.
- Only show launch actions that are actually supported by the installed player and Android permissions. Do not pretend an emulator handoff works when it does not.

### 4. Quick settings / Control Center
- Provide a fast overlay reachable from the home screen and controller shortcut.
- Include Wi-Fi, Bluetooth, Do Not Disturb, brightness, volume, and other practical handheld shortcuts.
- On Android, use supported system panels/settings for controls that apps cannot silently toggle. Brightness should be labelled accurately if it only affects the ECLIPSE window.
- Keep the panel quick, readable, and usable with a controller.

### 5. Social / Steam
- Add an optional Steam friends/status panel so the user can see which friends are online.
- This requires an explicit Steam account connection and appropriate API/auth flow; never display fabricated online statuses.
- Show a clear disconnected state until connected.

### 6. Settings and personalization
- Build a polished settings hub with clear categories and smooth transitions.
- Include appearance/theme/accent, wallpaper, home layout, systems, folders/library, controller navigation, player assignments, system shortcuts, and updates.
- Keep the settings experience visually consistent with the launcher and fully navigable by touch and controller.

### 7. Optional playtime
- Playtime tracking is opt-in.
- Clearly distinguish manual session tracking from automatic foreground tracking.
- Never silently track or imply automatic tracking if it is not implemented.

## Stability requirements (release blockers)
- Folder selection and recursive scanning must not run long directory traversal on Android's UI thread.
- Limit the amount of folder metadata sent across the native/WebView bridge per scan; report when a scan is truncated.
- Handle revoked SAF permissions, inaccessible child folders, provider errors, and cancellation without crashing.
- APK download links inside the Android app must be handed to Android/browser safely rather than navigating the APK download through the embedded WebView.
- Keep update checking separate from APK installation. Explain Android's signing-certificate/version compatibility and preserve app data; never tell the user to uninstall without a backup warning.
- Verify web and Android builds before publishing a stable release.

## Design principle
The video is the source of truth for the desired experience. Existing ECLIPSE features should be reorganized around this console-first flow rather than forcing the user to choose between the current Cocoon rows and current console cards.
