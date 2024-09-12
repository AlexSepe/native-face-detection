import { ReactElement, createElement, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
    Camera as VisionCamera,
    useCameraDevice,
    useCameraFormat,
    useCameraPermission
} from "react-native-vision-camera";
import { CONTENT_SPACING, CONTROL_BUTTON_SIZE, SAFE_AREA_PADDING } from "./Constants";
// import { PressableOpacity } from "react-native-pressable-opacity";
// import IonIcon from "react-native-vector-icons/Ionicons";
import FaceDetection, {
    FaceDetectorContourMode,
    FaceDetectorLandmarkMode,
    FaceDetectorOptionsType,
    FaceDetectorClassificationMode,
    FaceDetectorPerformanceMode
} from "react-native-face-detection-tc";

export interface RecognitionComponentProps {
    facingFront?: boolean;
    executeDetectionId?: string;
    onNewPhoto?: (photoPath: string, facesJson: string, latestDetectionId?: string) => void;
}

export function RecognitionComponent(props: RecognitionComponentProps): ReactElement {
    const { hasPermission, requestPermission } = useCameraPermission();
    const isCameraActive = true;
    const [facingFront, setFacingFront] = useState<boolean>(true);
    const cameraDevice = useCameraDevice(facingFront ? "front" : "back");

    const format = useCameraFormat(cameraDevice, [{ photoResolution: { width: 640, height: 480 }, photoHdr: false }]);
    //
    // vision camera ref
    //
    const camera = useRef<VisionCamera>(null);

    useEffect(() => {
        if (hasPermission) {
            return;
        }
        requestPermission();
    }, []);

    // Monitora o detection Id, quando enviado um Novo, realiza uma foto e detect faces.
    useEffect(() => {
        if (!props.executeDetectionId || props.executeDetectionId === "") {
            return;
        }
        handleCapturePhoto(props.executeDetectionId);
    }, [props.executeDetectionId]);

    useEffect(() => {
        // console.warn(`camera flip - front:${props.facingFront}`);
        setFacingFront(props.facingFront !== undefined ? props.facingFront : true);
    }, [props.facingFront]);

    /**
     * Handle camera UI rotation
     *
     * @param {number} rotation Camera rotation
     */
    function handleUiRotation(_rotation: number) {
        // aRot.value = rotation
        // setRotation(rotation);
    }

    /**
     * Hanldes camera mount error event
     *
     * @param {any} error Error event
     */
    function handleCameraMountError(error: any) {
        console.error("camera mount error", error);
    }

    async function handleCapturePhoto(latestDetectionId: string | undefined): Promise<void> {
        if (camera.current) {
            // take photo, capture video, etc...
            const photo = await camera.current.takePhoto({
                enableShutterSound: false,
                enableAutoDistortionCorrection: false
            });
            // const result = await fetch(`file://${photo.path}`)
            // const data = await result.blob();

            processFaces(photo.path).then(faces => {
                // drawFaces(faces, photo);
                // photo.path
                if (props.onNewPhoto) {
                    props.onNewPhoto(`file://${photo.path}`, JSON.stringify(faces), latestDetectionId);
                }
            });
        }
    }

    async function processFaces(imagePath: string) {
        const options: FaceDetectorOptionsType = {
            landmarkMode: FaceDetectorLandmarkMode.ALL,
            contourMode: FaceDetectorContourMode.ALL,
            classificationMode: FaceDetectorClassificationMode.ALL,
            performanceMode: FaceDetectorPerformanceMode.FAST
        };

        return FaceDetection.processImage(imagePath, options);
    }

    return (
        <View style={styles.container}>
            {hasPermission && cameraDevice != null && (
                <VisionCamera
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    isActive={isCameraActive}
                    // torch={torch ? "on" : "off"}
                    device={cameraDevice}
                    photo
                    photoQualityBalance="speed"
                    format={format}
                    // frameProcessor={props.usarFrameProcessor ? cameraFrameProcessor : undefined}
                    onError={handleCameraMountError}
                    // faceDetectionCallback={handleFacesDetected}
                    onUIRotationChanged={handleUiRotation}
                    // faceDetectionOptions={{
                    //     ...faceDetectionOptions,
                    //     autoScale
                    // }}
                />
            )}

            {/* <View style={styles.rightButtonRow}>
                <PressableOpacity
                    style={styles.button}
                    onPress={() => setFacingFront(current => !current)}
                    disabledOpacity={0.4}
                >
                    <IonIcon name="camera-reverse" color="white" size={24} />
                </PressableOpacity>
                <PressableOpacity style={styles.button} onPress={() => setTorch(!torch)} disabledOpacity={0.4}>
                    <IonIcon name={torch ? "flash" : "flash-off"} color="white" size={24} />
                </PressableOpacity>
            </View> */}

            {/* <PressableOpacity style={styles.captureButton} onPress={handleCapturePhoto}>
                <IonIcon name="scan-circle-outline" color="white" size={60} />
            </PressableOpacity> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },
    captureButton: {
        position: "absolute",
        alignSelf: "center",
        bottom: SAFE_AREA_PADDING.paddingBottom
    },
    button: {
        marginBottom: CONTENT_SPACING,
        width: CONTROL_BUTTON_SIZE,
        height: CONTROL_BUTTON_SIZE,
        borderRadius: CONTROL_BUTTON_SIZE / 2,
        backgroundColor: "rgba(140, 140, 140, 0.3)",
        justifyContent: "center",
        alignItems: "center"
    },
    rightButtonRow: {
        position: "absolute",
        right: SAFE_AREA_PADDING.paddingRight,
        top: SAFE_AREA_PADDING.paddingTop
    },
    backButton: {
        position: "absolute",
        left: SAFE_AREA_PADDING.paddingLeft,
        top: SAFE_AREA_PADDING.paddingTop
    }
});
