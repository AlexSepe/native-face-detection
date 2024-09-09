import { Component, ReactNode, createElement } from "react";
import { TextStyle, ViewStyle } from "react-native";
import { Style } from "@mendix/pluggable-widgets-tools";

import { TcNativeFaceDetectionProps } from "../typings/TcNativeFaceDetectionProps";
import { RecognitionComponent } from "./components/Face-detection";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

export class TcNativeFaceDetection extends Component<TcNativeFaceDetectionProps<CustomStyle>> {
    constructor(props: TcNativeFaceDetectionProps<CustomStyle>) {
        super(props);
        this.setFacesHandler = this.setFacesHandler.bind(this);
        this.setPhotoHandler = this.setPhotoHandler.bind(this);
    }

    private setFacesHandler(faces: any): void {
        this.props.faces?.setValue(faces);
    }

    private setPhotoHandler(photoPath: string): void {
        if (this.props.photoPath) {
            this.props.photoPath?.setValue(photoPath);
        }
        if (this.props.onNewPhoto && this.props.onNewPhoto.canExecute){
            this.props.onNewPhoto.execute();
        }
    }

    render(): ReactNode {
        // if (!hasPermission) return <div>No camera permission...</div>;
        return <RecognitionComponent usarFrameProcessor={this.props.frameProcessor.value || false} onNewPhoto={this.setPhotoHandler}/>;
    }
}
