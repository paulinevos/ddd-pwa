import { Image, TouchableOpacity, StyleSheet, View } from "react-native";
import React from "react";

const handlePress = () => alert('Menu clicked');

function GameMenu() {
    return (
        <View style={styles.container}>
            <View style={styles.menuContent}>
                <Image
                    source={require('@/assets/images/ddd_pixel_banner.png')}
                    style={styles.bannerImage}
                    resizeMode="contain"
                />
                <TouchableOpacity onPress={handlePress} style={styles.menuButton}>
                    <View style={styles.hamburgerLine} />
                    <View style={styles.hamburgerLine} />
                    <View style={styles.hamburgerLine} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        // marginBottom: 16,
    },
    menuContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerImage: {
        height: 35  , // Adjusted to better fit the design
        width: '80%',
    },
    menuButton: {
        padding: 8,
    },
    hamburgerLine: {
        width: 24,
        height: 3,
        backgroundColor: '#000',
        marginVertical: 4,
        borderRadius: 2,
    },
});

export default GameMenu;