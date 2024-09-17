import { useState } from "react";
import { LayoutRectangle } from "react-native";

export function useCameraLayout() {
    const [container, setContainer] = useState<LayoutRectangle | undefined>();

    const CONTAINER_WIDTH = container?.width ?? 0;
    const CONTAINER_HEIGHT = container?.height ?? 0;

    const X_DEFORMATION_RATIO = 0.8;
    const CAMERA_SIZE = Math.min(CONTAINER_WIDTH, CONTAINER_HEIGHT) * X_DEFORMATION_RATIO;
    const CAMERA_VERTICAL_PADDING = (CONTAINER_HEIGHT - CAMERA_SIZE) / 2;
    const CAMERA_HORZIONTAL_PADDING = (CONTAINER_WIDTH - CAMERA_SIZE) / 2;
    const CAMERA_BORDER_RADIUS = CAMERA_SIZE / 2;
    const X_RESTORATION_RATIO = CAMERA_SIZE / (CAMERA_SIZE * X_DEFORMATION_RATIO);    

    return {
        setContainer,
        CAMERA_SIZE,
        CAMERA_HORZIONTAL_PADDING,
        CAMERA_BORDER_RADIUS,
        X_DEFORMATION_RATIO,
        X_RESTORATION_RATIO,
        CAMERA_VERTICAL_PADDING
    };
}
