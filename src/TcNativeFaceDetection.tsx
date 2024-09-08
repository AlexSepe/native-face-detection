import { Component, ReactNode } from "react";
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
    }

    private setFacesHandler(faces: any): void {
        this.props.faces?.setValue(faces);
    }

    render(): ReactNode {
        // if (!hasPermission) return <div>No camera permission...</div>;
        return RecognitionComponent();
    }
}
