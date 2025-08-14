import { StyleSheet, Text, Image, View } from 'react-native';
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
	isCurrentPlayer?: boolean;
}

function PlayerBar({ player, isCurrentPlayer = false }: PlayerProps) {
	console.debug('PLAYER', player);
	const styles = StyleSheet.create({
		outerContainer: {
			borderRadius: theme.borders.radiusMd,
			borderWidth: isCurrentPlayer ? 4 : 0,
			borderColor: 'rgba(247, 252, 185, 1)',
			borderStyle: 'solid',
			// marginHorizontal: theme.spacing.md, // Add horizontal margin
			overflow: 'hidden', // Prevent any content from overflowing
		},
		container: {
			position: 'relative',
			backgroundColor: theme.colors.accentGreen,
			borderRadius: theme.borders.radiusMd,
			...theme.shadows.medium,
			height: 95,
			width: '100%', // Take full width of parent
			borderWidth: 2,
			borderColor: 'rgba(0,0,0,1)',
			borderStyle: 'solid',
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

	const content = (
		<View style={styles.container}>
			<Text style={styles.text}>{player.displayName}</Text>
			<View style={styles.avatarContainer}>
				<Image
					source={getAvatarImage(player.avatar)}
					style={styles.avatar}
					resizeMode="contain"
				/>
			</View>
		</View>
	);

	return isCurrentPlayer ? (
		<View style={styles.outerContainer}>{content}</View>
	) : (
		<View style={{ marginTop: '2%' }}>{content}</View>
	);
}

export default PlayerBar;
