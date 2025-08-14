import React, { useState, useEffect } from 'react';
import {
	Text,
	StyleSheet,
	Pressable,
	TouchableOpacity,
	Animated,
	View,
} from 'react-native';
import theme from '@/theme';

interface ConfirmTipProps {
	onDismiss: () => void;
	visible: boolean;
}

const ConfirmTip: React.FC<ConfirmTipProps> = ({ onDismiss, visible }) => {
	const fadeAnim = useState(new Animated.Value(0))[0];

	useEffect(() => {
		if (visible) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(fadeAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	}, [visible, fadeAnim]);

	const handleDismiss = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start(onDismiss);
	};

	if (!visible) return null;

	return (
		<Pressable
			onPress={handleDismiss}
			style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}
		>
			<Animated.View style={[styles.container, { opacity: fadeAnim }]}>
				<View style={styles.header}>
					<Text style={styles.text}>
						are you sure you're ready to start? is everyone in?
					</Text>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.button} onPress={handleDismiss}>
							<Text style={styles.buttonText}>
								I'M SURE
								<br />
								LETS GO
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Animated.View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		width: '90%',
		height: 300, // Fixed height as before
		backgroundColor: '#FDFFE6',
		borderWidth: 2,
		borderColor: '#000000',
		borderRadius: theme.borders.radiusMd,
		padding: 16,
		alignItems: 'center',
		justifyContent: 'center',
	} as const,
	header: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
	} as const,
	text: {
		fontFamily: 'Jua',
		fontSize: 20,
		color: 'rgba(112, 112, 112, 1)',
		textAlign: 'center',
		maxWidth: '80%',
		marginBottom: 24,
	} as const,
	buttonContainer: {
		marginTop: 16,
		marginBottom: 8,
	} as const,
	button: {
		backgroundColor: 'rgba(233, 99, 110, 1)', // Red color
		paddingHorizontal: 32,
		paddingVertical: 16, // Double the vertical padding
		borderRadius: 20,
		borderWidth: 2,
		borderColor: theme.colors.textDark,
		minWidth: 180, // Wider button
		alignItems: 'center',
		justifyContent: 'center',
	} as const,
	buttonText: {
		fontFamily: 'Jua',
		fontSize: 20,
		color: '#FFFFFF', // White text
	} as const,
});

export default ConfirmTip;
