package com.eclipse.launcher;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.SystemClock;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.content.SharedPreferences;
import android.webkit.MimeTypeMap;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

import androidx.activity.result.ActivityResult;
import androidx.documentfile.provider.DocumentFile;

import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Collections;
import java.util.List;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CapacitorPlugin(name = "FolderAccess")
public class FolderAccessPlugin extends Plugin {
    private static final int MAX_FILES = 900;
    private static final int MAX_DIRECTORIES = 1200;
    private static final int MAX_DEPTH = 18;
    private static final long MAX_SCAN_MILLIS = 20000L;
    private static final String DATA_FILE = "eclipse-data.json";
    private static final String PREFS = "eclipse_native_storage";
    private final ExecutorService scanExecutor = Executors.newSingleThreadExecutor();
    private final java.util.concurrent.atomic.AtomicBoolean scanRunning = new java.util.concurrent.atomic.AtomicBoolean(false);

    @PluginMethod
    public void pickAndScan(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        startActivityForResult(call, intent, "folderPickerResult");
    }

    @ActivityCallback
    private void folderPickerResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.reject("Folder selection cancelled.");
            return;
        }

        Uri treeUri = result.getData().getData();
        int flags = result.getData().getFlags() & (Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        try {
            getContext().getContentResolver().takePersistableUriPermission(treeUri, flags);
        } catch (Exception ignored) {
            // The current scan can still work even if the provider does not offer a persistent grant.
        }
        if (!scanRunning.compareAndSet(false, true)) { call.reject("A folder scan is already running. Please wait for it to finish."); return; }
        scanExecutor.execute(() -> {
            try { call.resolve(scanTree(treeUri)); }
            catch (Exception error) { call.reject("Could not scan this folder safely: " + error.getMessage(), error); }
            finally { scanRunning.set(false); }
        });
    }

    @PluginMethod
    public void getInstalledApps(PluginCall call) {
        PackageManager manager = getContext().getPackageManager();
        Intent launcherIntent = new Intent(Intent.ACTION_MAIN);
        launcherIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        List<ResolveInfo> matches = manager.queryIntentActivities(launcherIntent, 0);
        Collections.sort(matches, (left, right) ->
            String.CASE_INSENSITIVE_ORDER.compare(
                left.loadLabel(manager).toString(),
                right.loadLabel(manager).toString()
            )
        );

        JSArray apps = new JSArray();
        Set<String> seenPackages = new HashSet<>();
        for (ResolveInfo match : matches) {
            if (match.activityInfo == null) continue;
            String packageName = match.activityInfo.packageName;
            if (getContext().getPackageName().equals(packageName) || !seenPackages.add(packageName)) continue;
            JSObject app = new JSObject();
            app.put("name", match.loadLabel(manager).toString());
            app.put("packageName", packageName);
            apps.put(app);
        }
        JSObject response = new JSObject();
        response.put("apps", apps);
        call.resolve(response);
    }

    @PluginMethod
    public void scanFolder(PluginCall call) {
        String value = call.getString("uri");
        if (value == null || value.trim().isEmpty()) {
            call.reject("A saved folder URI is required.");
            return;
        }
        Uri treeUri;
        try { treeUri = Uri.parse(value); }
        catch (Exception error) { call.reject("The saved folder reference is invalid.", error); return; }
        if (!scanRunning.compareAndSet(false, true)) { call.reject("A folder scan is already running. Please wait for it to finish."); return; }
        scanExecutor.execute(() -> {
            try { call.resolve(scanTree(treeUri)); }
            catch (Exception error) { call.reject("Could not rescan this folder safely: " + error.getMessage(), error); }
            finally { scanRunning.set(false); }
        });
    }


    @PluginMethod
    public void pickDataFolder(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        startActivityForResult(call, intent, "dataFolderPickerResult");
    }

    @ActivityCallback
    private void dataFolderPickerResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.reject("Data folder selection cancelled.");
            return;
        }
        Uri uri = result.getData().getData();
        int flags = result.getData().getFlags() & (Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        try {
            getContext().getContentResolver().takePersistableUriPermission(uri, flags);
            getContext().getSharedPreferences(PREFS, 0).edit().putString("dataFolderUri", uri.toString()).apply();
            JSObject response = new JSObject();
            response.put("uri", uri.toString());
            DocumentFile selected = DocumentFile.fromTreeUri(getContext(), uri);
            response.put("name", selected == null || selected.getName() == null ? "ECLIPSE Data" : selected.getName());
            call.resolve(response);
        } catch (Exception error) {
            call.reject("Could not save access to this data folder: " + error.getMessage(), error);
        }
    }

    @PluginMethod
    public void saveData(PluginCall call) {
        String data = call.getString("data");
        String uriValue = getContext().getSharedPreferences(PREFS, 0).getString("dataFolderUri", null);
        if (uriValue == null) { call.reject("Choose a data folder first."); return; }
        try {
            DocumentFile root = DocumentFile.fromTreeUri(getContext(), Uri.parse(uriValue));
            if (root == null || !root.canWrite()) throw new SecurityException("Data folder is not writable.");
            DocumentFile file = root.findFile(DATA_FILE);
            if (file == null) file = root.createFile("application/json", DATA_FILE);
            if (file == null) throw new IllegalStateException("Could not create the ECLIPSE backup file.");
            try (OutputStream stream = getContext().getContentResolver().openOutputStream(file.getUri(), "wt")) {
                if (stream == null) throw new IllegalStateException("Could not open the backup file.");
                stream.write((data == null ? "{}" : data).getBytes(StandardCharsets.UTF_8));
                stream.flush();
            }
            JSObject response = new JSObject();
            response.put("saved", true);
            response.put("name", file.getName());
            call.resolve(response);
        } catch (Exception error) {
            call.reject("Could not save ECLIPSE data: " + error.getMessage(), error);
        }
    }

    @PluginMethod
    public void loadData(PluginCall call) {
        String uriValue = getContext().getSharedPreferences(PREFS, 0).getString("dataFolderUri", null);
        if (uriValue == null) { call.reject("No data folder has been selected."); return; }
        try {
            DocumentFile root = DocumentFile.fromTreeUri(getContext(), Uri.parse(uriValue));
            DocumentFile file = root == null ? null : root.findFile(DATA_FILE);
            if (file == null || !file.isFile()) { call.reject("No ECLIPSE backup exists in this folder yet."); return; }
            try (InputStream stream = getContext().getContentResolver().openInputStream(file.getUri());
                 ByteArrayOutputStream output = new ByteArrayOutputStream()) {
                if (stream == null) throw new IllegalStateException("Could not read the backup file.");
                byte[] buffer = new byte[8192]; int count;
                while ((count = stream.read(buffer)) != -1) output.write(buffer, 0, count);
                JSObject response = new JSObject();
                response.put("data", output.toString("UTF-8"));
                response.put("name", file.getName());
                call.resolve(response);
            }
        } catch (Exception error) {
            call.reject("Could not load ECLIPSE data: " + error.getMessage(), error);
        }
    }

    @PluginMethod
    public void launchApp(PluginCall call) {
        String packageName = call.getString("packageName");
        if (packageName == null || packageName.trim().isEmpty()) { call.reject("An app package is required."); return; }
        try {
            Intent launch = getContext().getPackageManager().getLaunchIntentForPackage(packageName);
            if (launch == null) throw new IllegalStateException("Android could not find a launch activity for this app.");
            launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(launch);
            JSObject response = new JSObject(); response.put("launched", true); call.resolve(response);
        } catch (Exception error) {
            call.reject("Could not launch this app: " + error.getMessage(), error);
        }
    }

    @PluginMethod
    public void launchGame(PluginCall call) {
        String uriValue = call.getString("uri");
        String packageName = call.getString("packageName");
        if (uriValue == null || packageName == null || packageName.trim().isEmpty()) {
            call.reject("A game file and an installed emulator are required."); return;
        }
        try {
            Uri gameUri = Uri.parse(uriValue);
            String path = gameUri.getLastPathSegment() == null ? "" : gameUri.getLastPathSegment();
            String extension = path.contains(".") ? path.substring(path.lastIndexOf('.') + 1).toLowerCase() : "";
            String mime = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
            if (mime == null) mime = "application/octet-stream";

            Intent targeted = new Intent(Intent.ACTION_VIEW);
            targeted.setDataAndType(gameUri, mime);
            targeted.setPackage(packageName);
            targeted.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            targeted.setClipData(android.content.ClipData.newRawUri("ECLIPSE game", gameUri));

            Intent resolved = targeted;
            PackageManager manager = getContext().getPackageManager();
            if (targeted.resolveActivity(manager) == null) {
                Intent generic = new Intent(Intent.ACTION_VIEW);
                generic.setDataAndType(gameUri, mime);
                generic.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                generic.setClipData(android.content.ClipData.newRawUri("ECLIPSE game", gameUri));
                if (generic.resolveActivity(manager) == null) {
                    generic.setType("*/*");
                    generic.setData(gameUri);
                }
                if (generic.resolveActivity(manager) == null) {
                    throw new IllegalStateException("No installed emulator advertises support for this game file. Try another player or import a supported format.");
                }
                resolved = Intent.createChooser(generic, "Choose an emulator for this game");
                resolved.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            } else {
                try {
                    getContext().grantUriPermission(packageName, gameUri, Intent.FLAG_GRANT_READ_URI_PERMISSION);
                } catch (Exception ignored) {
                    // The activity launch still carries a temporary read grant.
                }
            }
            getContext().startActivity(resolved);
            JSObject response = new JSObject(); response.put("launched", true); call.resolve(response);
        } catch (Exception error) {
            call.reject("This emulator did not accept the game file. Check its supported launch format and try another player. " + error.getMessage(), error);
        }
    }

    private static final class ScanNode {
        final DocumentFile directory; final String relativePath; final int depth;
        ScanNode(DocumentFile directory, String relativePath, int depth) {
            this.directory = directory; this.relativePath = relativePath; this.depth = depth;
        }
    }

    private JSObject scanTree(Uri treeUri) throws Exception {
        DocumentFile root = DocumentFile.fromTreeUri(getContext(), treeUri);
        if (root == null || !root.canRead()) throw new SecurityException("Folder permission expired or folder is not readable. Re-select it in ECLIPSE Settings.");
        JSArray entries = new JSArray();
        String rootName = root.getName() == null ? "Game folder" : root.getName();
        java.util.ArrayDeque<ScanNode> pending = new java.util.ArrayDeque<>();
        pending.add(new ScanNode(root, rootName, 0));
        int visitedDirectories = 0;
        boolean truncated = false;
        final long scanStartedAt = SystemClock.elapsedRealtime();
        while (!pending.isEmpty() && entries.length() < MAX_FILES && visitedDirectories < MAX_DIRECTORIES) {
            if (SystemClock.elapsedRealtime() - scanStartedAt >= MAX_SCAN_MILLIS) {
                truncated = true;
                break;
            }
            ScanNode node = pending.removeFirst();
            if (node.depth > MAX_DEPTH) { truncated = true; continue; }
            visitedDirectories++;
            DocumentFile[] children;
            try { children = node.directory.listFiles(); }
            catch (RuntimeException providerError) { continue; }
            if (children == null) continue;
            for (DocumentFile child : children) {
                if (entries.length() >= MAX_FILES || visitedDirectories + pending.size() >= MAX_DIRECTORIES) { truncated = true; break; }
                if (child == null) continue;
                try {
                    String name = child.getName();
                    if (name == null || name.isEmpty()) continue;
                    String relative = node.relativePath.isEmpty() ? name : node.relativePath + "/" + name;
                    if (child.isDirectory()) pending.addLast(new ScanNode(child, relative, node.depth + 1));
                    else if (child.isFile()) {
                        JSObject item = new JSObject();
                        item.put("name", name);
                        item.put("relativePath", relative);
                        item.put("uri", child.getUri().toString());
                        item.put("size", Math.max(0L, child.length()));
                        item.put("lastModified", Math.max(0L, child.lastModified()));
                        entries.put(item);
                    }
                } catch (RuntimeException inaccessibleChild) {
                    // Providers can revoke access to individual descendants; skip only that item.
                }
            }
        }
        if (!pending.isEmpty() || entries.length() >= MAX_FILES || visitedDirectories >= MAX_DIRECTORIES) truncated = true;
        JSObject response = new JSObject();
        response.put("uri", treeUri.toString());
        response.put("rootName", rootName);
        response.put("files", entries);
        response.put("scannedCount", entries.length());
        response.put("visitedDirectories", visitedDirectories);
        response.put("truncated", truncated);
        return response;
    }
}
