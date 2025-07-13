import {Image, TouchableOpacity} from "react-native";
import React from "react";

type AvatarButtonProps = {
    handlePress: (image: any) => void;
    image: any;
    selected: boolean;
};

const AvatarButton = ({handlePress, image, selected}: AvatarButtonProps) => {
    return (
      <TouchableOpacity
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

