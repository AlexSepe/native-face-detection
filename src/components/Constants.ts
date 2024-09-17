import { Dimensions, Platform } from "react-native";

export const CONTENT_SPACING = 15;

const SAFE_BOTTOM =
    Platform.select({
        ios: 0
    }) ?? 0;

export const SAFE_AREA_PADDING = {
    paddingLeft: 0 + CONTENT_SPACING,
    paddingTop: 0 + CONTENT_SPACING,
    paddingRight: 0 + CONTENT_SPACING,
    paddingBottom: SAFE_BOTTOM + CONTENT_SPACING
};

// The maximum zoom _factor_ you should be able to zoom in
export const MAX_ZOOM_FACTOR = 10;

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Platform.select<number>({
    android: Dimensions.get("window").height - 0,
    ios: Dimensions.get("window").height
}) as number;

// Capture Button
export const CAPTURE_BUTTON_SIZE = 78;

// Control Button like Flash
export const CONTROL_BUTTON_SIZE = 40;
