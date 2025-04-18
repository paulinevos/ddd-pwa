import {StyleSheet, TouchableOpacity} from "react-native";
import React from 'react';

function PlayerBar({player}) {
    console.debug('PLAYER', player)
    const styles = StyleSheet.create({

    });

    return (
        <TouchableOpacity>
            { player.displayName }
        </TouchableOpacity>
    )
}

export default PlayerBar

