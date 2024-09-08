import { Component, ReactNode, createElement } from "react";
import { Text, View, Platform } from "react-native";

import { mergeNativeStyles } from "@mendix/pluggable-widgets-tools";

import { CustomStyle } from "../TcNativeFaceDetection";

export interface HelloWorldProps {
    name?: string;
    style: CustomStyle[];
}

const defaultStyle: CustomStyle = {
    container: {
        borderColor: "#000000",
        borderRadius: Platform.OS === "ios" ? 4 : 0,
        borderWidth: 1,
        overflow: "hidden"
    },
    header: {
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    headerContent: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold"
    },
    content: {
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    label: {
        color: "#F6BB42"
    }
};

export class HelloWorld extends Component<HelloWorldProps> {
    private readonly styles = mergeNativeStyles(defaultStyle, this.props.style);

    render(): ReactNode {
        return (
            <View style={this.styles.container}>
                <Text style={this.styles.label}>Hello {this.props.name || "World"}</Text>
            </View>
        );
    }
}
