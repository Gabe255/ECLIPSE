# ECLIPSE

ECLIPSE is an Android-first gaming library frontend prototype built with Vite and Capacitor.

## Current prototype
- Responsive library dashboard
- Console category filters
- Theme switching
- Keyboard/controller-friendly selection
- Capacitor configuration for Android packaging

The sample game tiles are placeholders. ECLIPSE does not include game ROMs, BIOS files, emulator cores, or copyrighted game artwork. Users must supply legally obtained game files and compatible emulator software.

## Run locally
```bash
npm install
npm run dev
```

## Build web assets
```bash
npm run build
```

## Android
The GitHub Actions workflow creates a temporary Android Capacitor project, builds a debug APK, and uploads it as a workflow artifact. A signed release APK/AAB requires a separately configured signing key and secure GitHub Actions secrets.
