package com.eclipse.launcher;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.os.BatteryManager;
import android.os.Build;
import android.provider.Settings;
import android.view.Window;
import android.view.WindowManager;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SystemControls")
public class SystemControlsPlugin extends Plugin {
    private void openSettings(PluginCall call, String action) {
        try {
            Intent intent = new Intent(action);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            JSObject result = new JSObject();
            result.put("opened", true);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Could not open that Android setting.", error);
        }
    }

    @PluginMethod
    public void openWifiSettings(PluginCall call) {
        openSettings(call, Build.VERSION.SDK_INT >= 29
            ? Settings.Panel.ACTION_WIFI : Settings.ACTION_WIFI_SETTINGS);
    }

    @PluginMethod
    public void openBluetoothSettings(PluginCall call) {
        openSettings(call, Settings.ACTION_BLUETOOTH_SETTINGS);
    }

    @PluginMethod
    public void openRotationSettings(PluginCall call) {
        openSettings(call, Settings.ACTION_DISPLAY_SETTINGS);
    }

    @PluginMethod
    public void openDndSettings(PluginCall call) {
        openSettings(call, Settings.ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS);
    }

    @PluginMethod
    public void showVolumePanel(PluginCall call) {
        try {
            AudioManager audio = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
            if (audio == null) throw new IllegalStateException("Audio service unavailable.");
            audio.adjustStreamVolume(AudioManager.STREAM_MUSIC, AudioManager.ADJUST_SAME,
                AudioManager.FLAG_SHOW_UI);
            JSObject result = new JSObject();
            result.put("opened", true);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Could not open the volume controls.", error);
        }
    }

    @PluginMethod
    public void setWindowBrightness(PluginCall call) {
        Double value = call.getDouble("value");
        if (value == null || value < 0.05 || value > 1.0) {
            call.reject("Brightness must be between 0.05 and 1.0.");
            return;
        }
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("ECLIPSE is not in the foreground.");
            return;
        }
        activity.runOnUiThread(() -> {
            Window window = activity.getWindow();
            WindowManager.LayoutParams params = window.getAttributes();
            params.screenBrightness = value.floatValue();
            window.setAttributes(params);
            JSObject result = new JSObject();
            result.put("value", value);
            result.put("scope", "eclipse-window");
            call.resolve(result);
        });
    }

    @PluginMethod
    public void getDeviceStatus(PluginCall call) {
        try {
            Intent battery = getContext().registerReceiver(null,
                new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
            int level = battery == null ? -1 : battery.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            int scale = battery == null ? -1 : battery.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
            int percent = level >= 0 && scale > 0 ? Math.round(level * 100f / scale) : -1;
            int status = battery == null ? -1 : battery.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
            boolean charging = status == BatteryManager.BATTERY_STATUS_CHARGING
                || status == BatteryManager.BATTERY_STATUS_FULL;
            JSObject result = new JSObject();
            result.put("batteryPercent", percent);
            result.put("charging", charging);
            call.resolve(result);
        } catch (Exception error) {
            call.reject("Could not read device battery status.", error);
        }
    }
}
