import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';
import React from 'react';
import theme from '@/theme'; // Using the new alias

function PlayerBar({ player }) {
	console.debug('PLAYER', player);
	const styles = StyleSheet.create({
		container: {
			position: 'relative',
			backgroundColor: theme.colors.accentGreen,
			borderRadius: theme.borders.radiusMd,
			...theme.shadows.medium,
			height: 99,
			width: '100%',
			borderWidth: 2,
			borderColor: 'rgba(0,0,0,1)',
			borderStyle: 'solid',
			padding: theme.spacing.sm, // Add some padding to the container itself
		},
		text: {
			color: theme.colors.textDark,
			fontSize: theme.typography.fontSizeLg,
			fontFamily: theme.typography.fontFamilyPrimary,
			textTransform: 'capitalize',
			textAlign: 'left',
			marginTop: theme.spacing.xs,
			marginLeft: theme.spacing.md,
			marginBottom: theme.spacing.xs,
		},
		avatarContainer: {
			width: 72,
			height: 72,
			marginLeft: theme.spacing.sm,
		},
		avatar: {
			width: 41,
			height: 41,
			backgroundColor: 'white',
			borderRadius: theme.borders.radiusMd,
			borderWidth: 1,
			borderColor: 'rgba(0,0,0,1)',
			borderStyle: 'solid',
		},
	});

	return (
		<TouchableOpacity style={styles.container}>
			<Text style={styles.text}>{player.displayName}</Text>
			<View style={styles.avatarContainer}>
				<Image
					source={require('@/assets/images/avatars/cocky.png')}
					style={styles.avatar}
					resizeMode="contain" // Or "cover", depending on desired look
				/>
			</View>
		</TouchableOpacity>
	);
}

export default PlayerBar;
