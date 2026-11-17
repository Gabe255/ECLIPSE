# ECLIPSE releases and Obtainium

## Versioning and build behavior

The Android workflow uses the version in `package.json` for ordinary branch builds. The current repository version is **11.2.0**.

- Main and feature-branch builds create an APK artifact named `ECLIPSE-v11.2.0-apk`.
- A pushed tag such as `v11.2.1` builds that tagged version and publishes a GitHub Release.
- Android `versionCode` is set from the monotonically increasing GitHub Actions run number.
- A manual workflow run can replace the APK asset on an existing release when its `release_tag` input is supplied.

A branch build is a test artifact, not automatically a stable GitHub Release. Keep the package version, release tag, and release notes aligned.

## Persistent signing is required for seamless Android updates

Stable tagged releases require the persistent ECLIPSE release keystore. Configure all four values under **Repository → Settings → Secrets and variables → Actions → New repository secret**:

- `ECLIPSE_KEYSTORE_BASE64`: base64-encoded keystore file
- `ECLIPSE_KEYSTORE_PASSWORD`: keystore password
- `ECLIPSE_KEY_ALIAS`: key alias
- `ECLIPSE_KEY_PASSWORD`: key password

Generate the keystore in a trusted private development environment. Keep the keystore and passwords private. Never commit them, upload them as public artifacts, or paste them into chat.

If any signing secret is missing, branch builds use a debug APK for testing. The workflow intentionally fails a stable tagged release when the persistent signing key is unavailable. Do not treat a debug build as a guaranteed in-place update path.

Android requires every update to use the same signing certificate and a higher version code. A signature change prevents an in-place update and may require uninstalling the previous build, which can erase local app data. Back up local ECLIPSE data before any reinstall.

## Obtainium

After a persistently signed GitHub Release has been published:

1. Add the ECLIPSE GitHub repository as the app source in Obtainium.
2. Choose the release APK asset named `ECLIPSE-v<version>.apk`.
3. Confirm the app ID remains `com.eclipse.launcher` and the release version increases.
4. Keep the same signing certificate for every update.

The workflow's artifact filename and release asset filename are versioned. Do not rely on the internal Gradle output name.
