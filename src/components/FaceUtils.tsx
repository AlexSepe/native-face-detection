import { Dimensions } from "react-native";

type ImageSizeType = {
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
};

type BoundingBoxType = [number, number, number, number];

export type FaceRectType = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const { width: screenWidth } = Dimensions.get("window");

export function calculateImageSize(originalWidth: number, originalHeight: number): ImageSizeType {
    const ratio = originalWidth / originalHeight;

    const w = originalWidth > screenWidth ? screenWidth : originalWidth;
    const h = w / ratio;

    return {
        width: w,
        height: h,
        originalWidth,
        originalHeight
    };
}

export function calculateFaceRectInsideImage(boundingBox: BoundingBoxType, imageSize: ImageSizeType): FaceRectType {
    const wRatio = imageSize.originalWidth / imageSize.width;
    const hRatio = imageSize.originalHeight / imageSize.height;

    const faceX = boundingBox[0] / wRatio;
    const faceY = boundingBox[1] / hRatio;

    const faceWidth = boundingBox[2] / wRatio - faceX;
    const faceHeight = boundingBox[3] / hRatio - faceY;

    return {
        x: faceX,
        y: faceY,
        width: Math.ceil(faceWidth),
        height: Math.ceil(faceHeight)
    };
}
