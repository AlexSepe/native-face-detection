/**
 * This file was generated from TcNativeFaceDetection.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";

export interface TcNativeFaceDetectionProps<Style> {
    name: string;
    style: Style[];
    faces?: EditableValue<string>;
    frameProcessor: EditableValue<boolean>;
    photoPath?: EditableValue<string>;
    onNewPhoto?: ActionValue;
}

export interface TcNativeFaceDetectionPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode?: "design" | "xray" | "structure";
    faces: string;
    frameProcessor: string;
    photoPath: string;
    onNewPhoto: {} | null;
}
