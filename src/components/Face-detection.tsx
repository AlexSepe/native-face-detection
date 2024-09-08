import { ReactElement, createElement, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import {
    Frame,
    Camera as VisionCamera,
    runAsync,
    useCameraDevice,
    useCameraPermission,
    useFrameProcessor
} from "react-native-vision-camera";
import { Bounds, Face, FaceDetectionOptions, useFaceDetector } from "react-native-vision-camera-face-detector";
import { CONTENT_SPACING, CONTROL_BUTTON_SIZE, SAFE_AREA_PADDING } from "./Constants";
import { PressableOpacity } from "react-native-pressable-opacity";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useRunOnJS } from "react-native-worklets-core";

export function RecognitionComponent(): ReactElement {
    const { width, height } = useWindowDimensions();
    const { hasPermission, requestPermission } = useCameraPermission();
    // const [cameraMounted, setCameraMounted] = useState<boolean>(false)
    // const [cameraPaused, setCameraPaused] = useState<boolean>(false)
    // const [autoScale] = useState<boolean>(true);
    const [facingFront, setFacingFront] = useState<boolean>(true);
    const [torch, setTorch] = useState(false);
    const faceDetectionOptions = useRef<FaceDetectionOptions>({
        performanceMode: "fast",
        classificationMode: "all",
        contourMode: "all",
        landmarkMode: "all",
        trackingEnabled: false,
        windowWidth: width,
        windowHeight: height,
        autoScale: true
    }).current;
    const isCameraActive = true;
    const cameraDevice = useCameraDevice(facingFront ? "front" : "back");
    //
    // vision camera ref
    //
    const camera = useRef<VisionCamera>(null);
    //
    // face rectangle position
    //
    const [scanFaceText, setScanFaceText] = useState<string[]>([]);
    const [scanFaceBounds, setScanFaceBounds] = useState<Bounds[]>([]);
    const [aRotation, setRotation] = useState<number>(0);

    useEffect(() => {
        if (hasPermission) {
            return;
        }
        requestPermission();
        setScanFaceText([]);
        setScanFaceBounds([]);
    }, []);

    /**
     * Handle camera UI rotation
     *
     * @param {number} rotation Camera rotation
     */
    function handleUiRotation(rotation: number) {
        // aRot.value = rotation
        setRotation(rotation);
    }

    /**
     * Hanldes camera mount error event
     *
     * @param {any} error Error event
     */
    function handleCameraMountError(error: any) {
        console.error("camera mount error", error);
    }

    /**
     * Handle detection result
     *
     * @param {Face[]} faces Detection result
     * @returns {void}
     */

    function handleFacesDetected(faces: Face[], frame: Frame): void {
        if (!frame || !faces) {
            console.log("faces || frame is Empty");
            return;
        }
        // if no faces are detected we do nothing
        if (Object.keys(faces).length <= 0) {
            return;
        }
        console.log("faces", faces.length, "frameTs", frame.timestamp);

        // const contours = JSON.stringify(faces[0]?.contours);
        // const landmarks = JSON.stringify(faces[0]?.landmarks);
        const facesText: string[] = [];
        const faceBounds: Bounds[] = [];
        faces.forEach((face, index) => {
            const smilling = (face.smilingProbability * 100).toFixed(2);
            const leftEyeOpen = (face.leftEyeOpenProbability * 100).toFixed(2);
            const rightEyeOpen = (face.rightEyeOpenProbability * 100).toFixed(2);
            const text = `F:${index} Smiling:${smilling}% Eye L:${leftEyeOpen}% R:${rightEyeOpen}% X:${face.bounds.x.toFixed(
                0
            )} Y:${face.bounds.y.toFixed(0)}`;
            facesText.push(text);
            faceBounds.push(face.bounds);
        });
        setScanFaceText(facesText);
        setScanFaceBounds(faceBounds);

        // only call camera methods if ref is defined
        if (camera.current) {            
            // take photo, capture video, etc...
        }
    }

    /* CUSTOM cameraFrameProcessor */
    const { detectFaces } = useFaceDetector(faceDetectionOptions);

    const runOnJs = useRunOnJS(handleFacesDetected, [handleFacesDetected]);

    const cameraFrameProcessor = useFrameProcessor(
        frame => {
            "worklet";
            console.info("New Frame arrived!");
            runAsync(frame, () => {
                "worklet";
                console.info(`New Frame arrived! Async run...W:${frame?.width} H:${frame?.width}`);
                const faces = detectFaces(frame);
                console.log(faces);
                // runOnJs(faces, frame);
            });
        },
        [runOnJs]
    );

    return (
        <View style={styles.container}>
            {cameraDevice != null && (
                <VisionCamera
                    ref={camera}
                    style={StyleSheet.absoluteFill}
                    isActive={isCameraActive}
                    torch={torch ? "on" : "off"}
                    device={cameraDevice}
                    frameProcessor={cameraFrameProcessor}
                    onError={handleCameraMountError}
                    // faceDetectionCallback={handleFacesDetected}
                    onUIRotationChanged={handleUiRotation}
                    // faceDetectionOptions={{
                    //     ...faceDetectionOptions,
                    //     autoScale
                    // }}
                />
            )}

            {scanFaceBounds.map((faceBound, index) => (
                <View
                    key={`facebox-${index}`}
                    style={{
                        position: "absolute",
                        borderWidth: 4,
                        borderLeftColor: "rgb(0,255,0)",
                        borderRightColor: "rgb(0,255,0)",
                        borderBottomColor: "rgb(0,255,0)",
                        borderTopColor: "rgb(255,0,0)",
                        width: faceBound.width || 0,
                        height: faceBound.height || 0,
                        left: faceBound.x || 0,
                        top: faceBound.y || 0,
                        transform: [{ rotate: `${aRotation}deg` }]
                    }}
                >
                    <Text
                        style={{
                            width: "100%",
                            backgroundColor: "rgb(255,255,0,0.2)",
                            textAlign: "left"
                        }}
                    >
                        {index}
                    </Text>
                </View>
            ))}

            {/* <StatusBarBlurBackground /> */}

            <View style={styles.rightButtonRow}>
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
            </View>

            {/* Back Button */}
            {/* <PressableOpacity style={styles.backButton} onPress={navigation.goBack}>
        <IonIcon name="chevron-back" color="white" size={35} />
      </PressableOpacity> */}

            <View
                style={{
                    position: "absolute",
                    bottom: 20,
                    left: 0,
                    right: 0,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                {scanFaceText.map((text, index) => (
                    <View
                        key={`faceinfotext-${index}`}
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center"
                        }}
                    >
                        <Text
                            style={{
                                width: "100%",
                                backgroundColor: "rgb(255,255,0)",
                                textAlign: "left"
                            }}
                        >
                            {text}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
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
