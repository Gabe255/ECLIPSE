package com.eclipse.launcher;

import android.app.Activity;
import androidx.window.java.layout.WindowInfoTrackerCallbackAdapter;
import androidx.window.layout.DisplayFeature;
import androidx.window.layout.FoldingFeature;
import androidx.window.layout.WindowInfoTracker;
import androidx.window.layout.WindowLayoutInfo;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.concurrent.Executor;
import androidx.core.util.Consumer;

@CapacitorPlugin(name = "DisplayInfo")
public class DisplayInfoPlugin extends Plugin {
    @PluginMethod
    public void getLayout(PluginCall call) {
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Display information is not available while ECLIPSE is in the background.");
            return;
        }
        try {
            WindowInfoTrackerCallbackAdapter tracker =
                new WindowInfoTrackerCallbackAdapter(WindowInfoTracker.getOrCreate(getContext()));
            Executor mainExecutor = command -> activity.runOnUiThread(command);
            Consumer<WindowLayoutInfo> listener = new Consumer<WindowLayoutInfo>() {
                @Override
                public void accept(WindowLayoutInfo info) {
                    boolean separating = false;
                    String orientation = "unknown";
                    int hingeLeft = -1;
                    int hingeTop = -1;
                    int hingeRight = -1;
                    int hingeBottom = -1;
                    for (DisplayFeature feature : info.getDisplayFeatures()) {
                        if (feature instanceof FoldingFeature) {
                            FoldingFeature fold = (FoldingFeature) feature;
                            separating = fold.isSeparating();
                            orientation = fold.getOrientation() == FoldingFeature.Orientation.VERTICAL
                                ? "vertical" : "horizontal";
                            hingeLeft = fold.getBounds().left;
                            hingeTop = fold.getBounds().top;
                            hingeRight = fold.getBounds().right;
                            hingeBottom = fold.getBounds().bottom;
                            if (separating) break;
                        }
                    }
                    JSObject result = new JSObject();
                    result.put("dual", separating);
                    result.put("orientation", orientation);
                    result.put("hingeLeft", hingeLeft);
                    result.put("hingeTop", hingeTop);
                    result.put("hingeRight", hingeRight);
                    result.put("hingeBottom", hingeBottom);
                    call.resolve(result);
                    tracker.removeWindowLayoutInfoListener(this);
                }
            };
            tracker.addWindowLayoutInfoListener(activity, mainExecutor, listener);
        } catch (Exception error) {
            call.reject("Could not read foldable display information.", error);
        }
    }
}
