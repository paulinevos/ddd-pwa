import {StyleSheet, TouchableNativeFeedbackComponent} from "react-native";
import React from 'react';

function PlayerBar({player}) {
    const styles = StyleSheet.create({
    });

    return (
        <TouchableNativeFeedbackComponent>
            <Text>
                { player.displayName }
            </Text>
        </TouchableNativeFeedbackComponent>
    )
}

export default PlayerBar

