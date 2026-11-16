# ECLIPSE — Biggest Update Roadmap

**Target release:** 3.0.0  
**Release style:** Stable releases only (3.1.0, 3.2.0, etc.). No alpha/beta labels.  
**Development approach:** Ship in small, testable mini-updates. Fix bugs as soon as they are found instead of waiting for the entire roadmap.

## Release philosophy

This roadmap is the master plan, not a promise that every feature is already implemented. Each feature must be built, tested on-device, and checked in CI before being marked complete.

### Mini-update cycle
1. Pick one small feature or bug fix.
2. Implement only that change and keep the rest of the app stable.
3. Run the Android build and check the GitHub Actions result.
4. Test the feature on the device.
5. Fix any bugs immediately in a follow-up mini-update.
6. Update this roadmap with status and notes.

Do not call an update complete just because the code was pushed or uploaded. A successful build and a real device test are required.

## 1. ECLIPSE home experience
- Clean, console-inspired home screen with a clear systems menu.
- Per-system pages with Overview, Games, Players, Scan Games, and System Settings.
- Customizable shelves and library organization.
- Favorites and recently played sections based only on real user library data.
- Search across game title, system, filename, and file path.
- Useful empty states instead of fake/demo games.
- Responsive layout for phone, tablet, and desktop-sized screens.

## 2. System pages and navigation
- Each system gets its own menu and settings.
- Games view shows only games actually imported or discovered.
- Players view lets the user assign an installed emulator/player to that system.
- Scan Games rescans the selected game folder.
- System Settings contains system-specific options.
- Menu selection and navigation should remain consistent when switching systems.

## 3. Game library and scanning
- Scan user-selected folders using Android's document picker.
- Support platform folders and common game-file extensions.
- Preserve file names, relative paths, and content URIs.
- Never invent game entries when a scan finds no supported files.
- Allow rescanning without duplicating existing entries.
- Let users remove a library entry without deleting the original game file.
- Add metadata scraping for title, platform, cover art, description, and screenshots where a reliable match exists.
- If a match is uncertain or unavailable, show the filename and let the user correct it rather than inventing details.

## 4. Players and emulator support
- Discover launchable apps visible to Android.
- Let users manually choose a player/emulator for each system.
- Add known emulator options and matching rules, while still allowing manual selection.
- Show which player is assigned to each system.
- Implement real game launching by passing the selected game's content URI to the chosen emulator using that emulator's documented launch method.
- Show a clear message when an emulator cannot open a selected file.
- Do not claim universal emulator compatibility; test each supported emulator and file type.

## 5. Treat as Game
- Add a way to mark an installed launchable app as a game.
- Let the user assign it to a platform/category.
- Let users undo the choice or change its category.
- Keep emulator/player apps separate from the user's game collection unless the user chooses otherwise.
- Respect Android package-visibility limits; do not claim to scan every Play Store app.

## 6. Data, backups, and portability
- Finish the native Android data-folder picker and its persistent folder permission handling.
- Save and restore an ECLIPSE backup containing library metadata, settings, favorites, and other supported app data.
- Clearly show whether a folder is connected and whether a backup succeeded.
- Keep the backup flow separate from the live primary-storage system until automatic folder-backed persistence is actually implemented.
- Do not overwrite a backup without clear user confirmation.
- Test restore behavior and handle malformed or incompatible backup files safely.

## 7. Playtime and activity
- Track playtime only when a game is actually launched through ECLIPSE and a reliable session can be observed.
- Show recent activity and per-game playtime when supported.
- Explain limitations when Android or an emulator does not provide enough information to track a session accurately.
- Do not fabricate playtime.

## 8. Desktop shortcuts and Home
- When adding a shortcut, ask which platform/system it belongs to.
- Offer an option to add the game/app to the ECLIPSE Home screen.
- Keep shortcut labels and icons tied to the selected real app or game.
- Respect Android launcher and browser/desktop platform limitations; only show actions the current platform can actually perform.

## 9. Mascot and onboarding
- Keep the ECLIPSE mascot: a mysterious character in a suit, hat, and shades, with an eclipse-themed identity.
- Use the mascot to guide first-time setup: choose a data/backup location, add game folders, scan systems, and assign players.
- Make tips dismissible and avoid blocking normal navigation.
- Add helpful explanations for empty libraries, missing players, and scan errors.

## 10. Settings and polish
- Clear settings sections for Library, Data & Backup, Players, Appearance, and About.
- Readable text, accessible contrast, and touch-friendly controls.
- Consistent animations and transitions without slowing navigation.
- Confirm destructive actions and explain what will and will not be deleted.
- Keep error messages actionable and understandable.

## 11. Stable release and update safety
- Keep the Android application ID stable: `com.eclipse.launcher`.
- Use a persistent private Android signing key for stable releases.
- Never publish a tagged stable release using a temporary/debug signing key.
- Keep signing secrets in GitHub Actions secrets; never commit the keystore or expose passwords.
- Verify that a new APK can update an existing installation before publishing.
- Publish stable version tags such as `v3.0.0`, then `v3.1.0`, `v3.2.0`, and so on.
- Keep release notes honest about implemented, tested, and known-limited features.

## Suggested mini-update order

| Update | Focus | Completion check |
|---|---|---|
| 1 | Finish native data-folder picker, save, and restore methods | Backup and restore tested on Android |
| 2 | Verify system menu and per-system navigation | Every menu item opens the correct section |
| 3 | Treat as Game and platform assignment | User can mark, categorize, edit, and undo |
| 4 | Emulator launch foundation | One supported emulator opens a real selected game |
| 5 | Expand tested emulator/player support | Each listed player has verified launch behavior |
| 6 | Game metadata and artwork scraping | Reliable matches only; graceful no-match behavior |
| 7 | Desktop/Home shortcuts | Platform-appropriate shortcut flow works |
| 8 | Playtime and activity | Sessions are measured accurately where supported |
| 9 | Final stability, accessibility, and release checks | Clean CI build and device regression test |

## Current known gaps to track
- The data-folder UI has been added, but its matching native Android methods still need verification/implementation.
- Game launching through assigned emulators is not yet wired end-to-end.
- Treat as Game is not yet implemented.
- Metadata/artwork scraping is not yet implemented.
- Desktop/Home shortcut flow is not yet implemented.
- Playtime tracking is not yet implemented.
- Persistent release signing still needs to be configured and tested.
- The current system menu is an initial navigation implementation and needs on-device verification.

## Definition of done
A feature is complete only when:
- Its code is committed.
- The Android CI build passes.
- It has been tested on a real device or a clearly documented platform-appropriate test environment.
- Bugs and limitations are recorded.
- The app does not display fake games, fake metadata, fake player compatibility, or fake activity.

---
**Roadmap status:** Planning document. Feature status must be updated as mini-updates are implemented and tested.
