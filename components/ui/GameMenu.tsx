import CodeInput from "@/components/CodeInput";
import {Image, Text, TouchableOpacity} from "react-native";
import React from "react";
import { Button, ButtonColor, ButtonProps } from "@/components/ui/Button";

const handlePress = () => alert('hehe')
function GameMenu() {
    return (
        <TouchableOpacity
            onPress={ handlePress }
            style={{
                width: "100%",
                backgroundColor: "#FFFFFF",
                padding: 20,
                paddingVertical: 30,
                top: -2,
                left: 0,
                zIndex: 100,
                shadowRadius: 12,
                borderBottomEndRadius: 8,
                borderBottomStartRadius: 8,
                position: "absolute"
            }}
        >
        <Image
            source={require('../../assets/images/ddd_pixel_banner.png')}
        />
        </TouchableOpacity>
    )
}

export default GameMenu