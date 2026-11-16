package com.eclipse.launcher;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import androidx.activity.result.ActivityResult;
import androidx.documentfile.provider.DocumentFile;

import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;

@CapacitorPlugin(name = "FolderAccess")
public class FolderAccessPlugin extends Plugin {
    private static final int MAX_FILES = 5000;

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
        } catch (SecurityException ignored) {
            // The current scan can still work even if the provider does not offer a persistent grant.
        }
        try {
            call.resolve(scanTree(treeUri));
        } catch (Exception error) {
            call.reject("Could not scan this folder: " + error.getMessage(), error);
        }
    }

    @PluginMethod
    public void scanFolder(PluginCall call) {
        String value = call.getString("uri");
        if (value == null || value.trim().isEmpty()) {
            call.reject("A saved folder URI is required.");
            return;
        }
        try {
            call.resolve(scanTree(Uri.parse(value)));
        } catch (Exception error) {
            call.reject("Could not rescan this folder: " + error.getMessage(), error);
        }
    }

    private JSObject scanTree(Uri treeUri) throws Exception {
        DocumentFile root = DocumentFile.fromTreeUri(getContext(), treeUri);
        if (root == null || !root.canRead()) throw new SecurityException("ECLIPSE cannot read this folder.");
        JSArray entries = new JSArray();
        walk(root, "", entries);
        JSObject response = new JSObject();
        response.put("uri", treeUri.toString());
        response.put("files", entries);
        response.put("scannedCount", entries.length());
        response.put("truncated", entries.length() >= MAX_FILES);
        return response;
    }

    private void walk(DocumentFile directory, String parent, JSArray entries) {
        if (entries.length() >= MAX_FILES) return;
        DocumentFile[] children = directory.listFiles();
        for (DocumentFile child : children) {
            if (entries.length() >= MAX_FILES) return;
            String name = child.getName();
            if (name == null) continue;
            String relative = parent.isEmpty() ? name : parent + "/" + name;
            if (child.isDirectory()) {
                walk(child, relative, entries);
            } else if (child.isFile()) {
                JSObject item = new JSObject();
                try {
                    item.put("name", name);
                    item.put("relativePath", relative);
                    item.put("uri", child.getUri().toString());
                    item.put("size", child.length());
                    item.put("lastModified", child.lastModified());
                    entries.put(item);
                } catch (JSONException ignored) {
                    // Skip a malformed provider entry and continue scanning.
                }
            }
        }
    }
}
