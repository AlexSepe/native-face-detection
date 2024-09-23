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
import { useCameraLayout } from "../hooks/use-camera-layout";

export interface RecognitionComponentProps {
    facingFront?: boolean;
    executeDetectionId?: string;
    onNewPhoto?: (photoPath: string, facesJson: string, latestDetectionId?: string) => void;
}

export function RecognitionComponent(props: RecognitionComponentProps): ReactElement {
    const { hasPermission, requestPermission } = useCameraPermission();
    const isCameraActive = true;
    const [facingFront, setFacingFront] = useState<boolean>(true);
    const {
        setContainer,
        CAMERA_SIZE,
        CAMERA_HORZIONTAL_PADDING,
        CAMERA_BORDER_RADIUS,
        X_DEFORMATION_RATIO,
        X_RESTORATION_RATIO,
        CAMERA_VERTICAL_PADDING
    } = useCameraLayout();

    const cameraDevice = useCameraDevice(facingFront ? "front" : "back");

    const format = useCameraFormat(cameraDevice, [{ photoResolution: { width: 1280, height: 720 }, photoHdr: false }]);
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
        console.info("[handleCapturePhoto]", "start");

        if (camera.current) {
            console.info("[handleCapturePhoto]", "has camera");

            // take photo, capture video, etc...
            const photo = await camera.current.takePhoto({
                enableShutterSound: false,
                enableAutoDistortionCorrection: false
            });
            // const result = await fetch(`file://${photo.path}`)
            // const data = await result.blob();

            console.info("[handleCapturePhoto]", "photo", photo);

            processFaces(photo.path)
                .then(
                    faces => {
                        console.info("[handleCapturePhoto]", "faces", faces);
                        // drawFaces(faces, photo);
                        // photo.path
                        if (props.onNewPhoto) {
                            const photoPath = (photo.path.startsWith("file://") ? "" : "file://") + photo.path;
                            props.onNewPhoto(photoPath, JSON.stringify(faces), latestDetectionId);
                        }
                    },
                    rejected => {
                        console.info("[handleCapturePhoto]", "processFaces.rejected", rejected);
                    }
                )
                .catch(error => {
                    console.info("[handleCapturePhoto]", "processFaces.error", error);
                });
        }
        console.info("[handleCapturePhoto]", "end");
    }

    async function processFaces(imagePath: string) {
        const options: FaceDetectorOptionsType = {
            landmarkMode: FaceDetectorLandmarkMode.ALL,//Para tentar detectar os "pontos de referência" faciais, como olhos, orelhas, nariz, bochechas, boca — de todos os rostos detectados.
            contourMode: FaceDetectorContourMode.ALL,//Para detectar os contornos das características faciais. Contornos são detectado apenas no rosto mais proeminente da imagem.
            classificationMode: FaceDetectorClassificationMode.ALL,//Se é necessário classificar rostos em categorias como "sorrindo" e "de olhos abertos".
            performanceMode: FaceDetectorPerformanceMode.FAST
        };

        return FaceDetection.processImage(imagePath, options);
    }

    return (
        <View style={styles.container} onLayout={evt => setContainer(evt.nativeEvent.layout)}>
            {hasPermission && cameraDevice != null && (
                <View
                    style={{
                        position: "absolute",
                        top: CAMERA_VERTICAL_PADDING,
                        left: CAMERA_HORZIONTAL_PADDING,
                        right: CAMERA_HORZIONTAL_PADDING,
                        borderRadius: CAMERA_BORDER_RADIUS,
                        overflow: "hidden",
                        transform: [{ scaleX: X_DEFORMATION_RATIO }]
                    }}
                >
                    <VisionCamera
                        ref={camera}
                        style={{
                            width: CAMERA_SIZE,
                            height: CAMERA_SIZE,
                            transform: [{ scaleX: X_RESTORATION_RATIO }]
                        }}
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
                </View>
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

            {/*
                <PressableOpacity
                    style={styles.captureButton}
                    onPress={evt => handleCapturePhoto(evt.nativeEvent.timestamp.toString())}
                >
                    <IonIcon name="scan-circle-outline" color="white" size={60} />
                </PressableOpacity>
            */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
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
