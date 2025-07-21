import React, { useState, useEffect } from 'react';
import {
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
	Animated,
	View,
} from 'react-native';
import theme from '@/theme';

interface HostTipProps {
	isHost: boolean;
}

const HostTip: React.FC<HostTipProps> = ({ isHost }) => {
	const [isVisible, setIsVisible] = useState(false);
	const fadeAnim = useState(new Animated.Value(0))[0];

	// Debug logging
	console.log('[HostTip] Rendering with:', { isHost, isVisible });

	useEffect(() => {
		if (isHost) {
			// Show the tip with fade-in animation
			setIsVisible(true);
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		} else {
			// Hide immediately if not host
			setIsVisible(false);
		}
	}, [isHost, fadeAnim]);

	const handleDismiss = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start(() => setIsVisible(false));
	};

	if (!isVisible) return null;

	return (
		<TouchableWithoutFeedback onPress={handleDismiss}>
			<Animated.View style={[styles.container, { opacity: fadeAnim }]}>
				<View style={styles.header}>
					<Text style={styles.title}>HOST TIP:</Text>
					<Text style={styles.closeButton}>X</Text>
				</View>
				<Text style={styles.text}>
					It's a good idea to order the players here as they are organised in
					real life. Do this by holding and dragging the player's name cards
					now. (you won't be able to change this later!)
				</Text>
			</Animated.View>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
        position:'absolute',
        top: '50%',
		width: '70%',
		marginHorizontal: '15%',
		minHeight: 200,
		backgroundColor: theme.colors.accentGreen,
		borderWidth: 2,
		borderColor: theme.colors.textDark,
		borderRadius: 8,
		padding: 16,
		marginVertical: 16,
	} as const,
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	} as const,
	title: {
		fontFamily: 'Jua',
		fontSize: 22,
		color: theme.colors.textDark,
		fontWeight: 'bold',
	} as const,
	closeButton: {
		fontFamily: 'Jua',
		fontSize: 32,
		lineHeight: 24,
		color: theme.colors.textDark,
		padding: 2,
		marginLeft: 8,
		includeFontPadding: false,
		textAlignVertical: 'center',
	} as const,
	text: {
		fontFamily: 'Jua',
		fontSize: 16,
		color: theme.colors.textDark,
		lineHeight: 18,
	} as const,
});

export default HostTip;
