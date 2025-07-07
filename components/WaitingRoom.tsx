import PlayerBar from '@/components/PlayerBar';
import { useContext, useState } from 'react';
import { GameContext } from '@/utils/game_data';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import theme from '@/theme'; // Using the new alias
import { Button, ButtonColor } from '@/components/ui/Button';

let roomCode = '_____';

function WaitingRoom() {
	const { gameState, setGameState } = useContext(GameContext);
	const { players } = gameState;

	const styles = StyleSheet.create({
		scrollView: {
			height: '100%',
			width: '120%',
			padding: theme.spacing.sm, // Use a spacing token
			top: 77 + 20,
		},
		buttonContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: '100%',
		},
		textStyle: {
			fontFamily: theme.typography.fontFamilyPrimary,
			fontSize: theme.typography.fontSizeLg,
			color: theme.colors.textDark,
			paddingTop: 5,
		},
	});

	return (
		<ScrollView style={styles.scrollView}>
			{players.map((player) => (
				<PlayerBar key={player.id} player={player} />
			))}

			<View style={styles.buttonContainer}>
				<Button
					color={ButtonColor.Cyan}
					handlePress={() => console.log('cyan button pressed')}
					text="play now!"
					variant="borderless"
					fontFamily={theme.typography.fontFamilyPixel}
					fontSize={27}
					width={224}
					height={37}
				/>
				<Text style={styles.textStyle}>Room code :</Text>
				<Text style={styles.textStyle}>{roomCode}</Text>
				<Text style={styles.textStyle}>
					use this code to invite your friends
				</Text>
			</View>
		</ScrollView>
	);
}

export default WaitingRoom;
