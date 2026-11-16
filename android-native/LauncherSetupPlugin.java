package com.eclipse.launcher;

import android.app.Activity;
import android.app.role.RoleManager;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.JSObject;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import androidx.activity.result.ActivityResult;

@CapacitorPlugin(name = "LauncherSetup")
public class LauncherSetupPlugin extends Plugin {
    @PluginMethod
    public void requestDefaultHome(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            RoleManager roleManager = getContext().getSystemService(RoleManager.class);
            if (roleManager != null && roleManager.isRoleAvailable(RoleManager.ROLE_HOME)) {
                if (roleManager.isRoleHeld(RoleManager.ROLE_HOME)) {
                    JSObject result = new JSObject();
                    result.put("isDefaultHome", true);
                    call.resolve(result);
                    return;
                }
                Intent intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_HOME);
                startActivityForResult(call, intent, "homeRoleResult");
                return;
            }
        }
        try {
            Intent settings = new Intent(Settings.ACTION_HOME_SETTINGS);
            startActivityForResult(call, settings, "homeSettingsResult");
        } catch (Exception error) {
            call.reject("Android Home app settings are unavailable.", error);
        }
    }

    @ActivityCallback
    private void homeRoleResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        boolean isDefault = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            RoleManager roleManager = getContext().getSystemService(RoleManager.class);
            isDefault = roleManager != null && roleManager.isRoleHeld(RoleManager.ROLE_HOME);
        }
        JSObject response = new JSObject();
        response.put("isDefaultHome", isDefault);
        response.put("resultCode", result.getResultCode());
        call.resolve(response);
    }

    @ActivityCallback
    private void homeSettingsResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        JSObject response = new JSObject();
        response.put("isDefaultHome", false);
        response.put("openedSettings", true);
        call.resolve(response);
    }
}
