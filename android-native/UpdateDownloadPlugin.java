package com.eclipse.launcher;

import android.content.Intent;
import android.net.Uri;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "UpdateDownload")
public class UpdateDownloadPlugin extends Plugin {
    @PluginMethod
    public void openExternal(PluginCall call) {
        String value = call.getString("url");
        if (value == null || value.trim().isEmpty()) {
            call.reject("A download URL is required.");
            return;
        }
        try {
            Uri uri = Uri.parse(value);
            String host = uri.getHost();
            if (!"https".equalsIgnoreCase(uri.getScheme()) ||
                host == null || !(host.equalsIgnoreCase("github.com") ||
                host.equalsIgnoreCase("objects.githubusercontent.com"))) {
                call.reject("Only secure GitHub download links are supported.");
                return;
            }
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            JSObject result = new JSObject();
            result.put("opened", true);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Could not open the APK download in Android.", error);
        }
    }
}