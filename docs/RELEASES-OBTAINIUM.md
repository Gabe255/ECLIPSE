# ECLIPSE releases and Obtainium

## Versioning

Main-branch builds publish a unique pre-release tag:

- Git tag: `v0.3.0-beta.<GitHub run number>`
- Android `versionName`: `0.3.0-beta.<GitHub run number>`
- Android `versionCode`: the monotonically increasing GitHub Actions run number

This lets update checkers distinguish each build rather than repeatedly overwriting one alpha tag.

## Persistent signing is required for seamless Android updates

The workflow supports a persistent release keystore. Add all four values under **Repository → Settings → Secrets and variables → Actions → New repository secret**:

- `ECLIPSE_KEYSTORE_BASE64`: base64-encoded keystore file
- `ECLIPSE_KEYSTORE_PASSWORD`: keystore password
- `ECLIPSE_KEY_ALIAS`: key alias
- `ECLIPSE_KEY_PASSWORD`: key password

Generate the keystore on a trusted computer or private development environment with Java's `keytool`. Keep the keystore and passwords private. Never commit them, upload them as public artifacts, or paste them into chat.

If any signing secret is missing, CI builds a debug APK for testing. GitHub-hosted runners do not share a persistent debug signing key between builds, so debug APKs are not a reliable in-place update path. Do not treat an unsigned-by-project-key debug build as a daily-driver Obtainium install.

## Obtainium

After a persistently signed release has been published:

1. Add the ECLIPSE GitHub repository as the app source in Obtainium.
2. Enable pre-release tracking.
3. Select the APK asset named `app-debug.apk` (the workflow keeps this filename for compatibility; when signing secrets are configured, the file contains the release-signed APK).
4. Confirm the app ID remains `com.eclipse.launcher` and the release version increases.

Android also requires every update to use the same signing certificate and a higher version code. A signature change requires uninstalling the previous build, which can erase local app data.
