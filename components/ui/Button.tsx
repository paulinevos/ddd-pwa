import CodeInput from "@/components/CodeInput";
import {Text, TextProps, TouchableOpacity} from "react-native";
import React from "react";
import {fetch} from "expo/fetch";
import {useCookies} from "react-cookie";

enum ButtonColor {
    Blue= "#DAFFFE",
    Pink = "#FFDCF7",
}

type ButtonProps = {
    title: string;
    color: ButtonColor
};
const Button = ({color, handlePress, text}) => {
    return (<TouchableOpacity
        onPress={ handlePress }
        style={{
            width: "80%",
            backgroundColor: color,
            padding: 15,
            margin: 20,
            borderWidth: 1,
            borderColor: "#000000",
            borderRadius: 8,
        }}
    ><Text
        style={{
            textTransform: "uppercase",
            textAlign: "center"
        }}
    >{text}</Text></TouchableOpacity>)
}

export { Button, ButtonColor, ButtonProps }

