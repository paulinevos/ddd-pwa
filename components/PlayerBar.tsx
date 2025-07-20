import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native';
import React from 'react';
import theme from '@/theme'; // Using the new alias

// Helper function to get avatar image based on avatar name
const getAvatarImage = (avatarName: string) => {
	console.log('[PlayerBar] Loading avatar:', avatarName);
	// Default to cocky avatar as fallback
	let avatarImage = require('@/assets/images/avatars/cocky.png');

	// Map avatar names to their image paths
	try {
		switch (avatarName) {
			case 'angry':
				avatarImage = require('@/assets/images/avatars/angry.png');
				break;
			case 'cocky':
				avatarImage = require('@/assets/images/avatars/cocky.png');
				break;
			case 'default':
				avatarImage = require('@/assets/images/avatars/cocky.png');
				break;
			case 'happy':
				avatarImage = require('@/assets/images/avatars/happy.png');
				break;
			case 'sad':
				avatarImage = require('@/assets/images/avatars/sad.png');
				break;
			default:
				console.log('[PlayerBar] Unknown avatar name:', avatarName);
			// Keep default avatarImage
		}
	} catch (error) {
		console.error('[PlayerBar] Error loading avatar image:', error);
	}

	return avatarImage;
};

// Define Player interface to match structure in game_data.ts
interface PlayerProps {
	player: {
		id: string;
		displayName: string;
		avatar: string;
	};
}

function PlayerBar({ player }: PlayerProps) {
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
			marginTop: '2%',
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
					source={getAvatarImage(player.avatar)}
					style={styles.avatar}
					resizeMode="contain"
				/>
			</View>
		</TouchableOpacity>
	);
}

export default PlayerBar;
