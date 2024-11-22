import {Image, Text, TextProps, TouchableOpacity} from "react-native";
import React, {useState} from "react";

type AvatarButtonProps = {
    image: string;
};

const AvatarButton = ({handlePress, image, selected}) => {
    return (<TouchableOpacity
        onPress={ () => handlePress(image) }
        style={{
            backgroundColor: selected? '#FFA3A3' : '#FFFFFF',
            padding: 10,
            margin: 15,
            borderWidth: 1,
            borderColor: "#000000",
            borderRadius: 20,
        }}
    >
        <Image
            source={image}
        />
    </TouchableOpacity>)
}

export { AvatarButton, AvatarButtonProps }

