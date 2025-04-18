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
const Button = ({color, handlePress, text, disabled}: {
  color: ButtonColor,
  handlePress: Function,
  text: string,
  disabled?: boolean,
}) => {
    return (<TouchableOpacity
        onPress={ handlePress }
        disabled={disabled || false}
        style={{
            width: "80%",
            backgroundColor: color,
            opacity: disabled ? 0.4 : 1,
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

