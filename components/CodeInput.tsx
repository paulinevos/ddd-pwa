import {TextInput, StyleSheet} from "react-native";
import React from 'react';

const CodeInput = ({value, setValue}) => {

    const styles = StyleSheet.create({
        input: {
            height: 40,
            margin: 10,
            padding: 10,
            paddingVertical: 15,
            textAlign: "center",
            fontWeight: "bold",
            color: value ? "#000000" : "#999999",
            textTransform: "uppercase",
            backgroundColor: "#D9D9D9"
        },
    });

    return (
        <TextInput
            style={ styles.input }
            placeholder={ "#ROOM" }
            maxLength={ 4 }
            textAlign={ "center" }
            autoCapitalize={ "characters" }
            value={ value }
            onChangeText={ setValue }
        >
        </TextInput>
    )
}

export default CodeInput

