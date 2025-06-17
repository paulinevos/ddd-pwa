import PlayerBar from '@/components/PlayerBar';
import { useContext, useState } from 'react';
import { GameContext } from '@/utils/game_data';
import { ScrollView, StyleSheet } from 'react-native';
import theme from '@/theme'; // Using the new alias

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
	});

	return (
		<ScrollView style={styles.scrollView}>
			{players.map((player) => (
				<PlayerBar key={player.id} player={player} />
			))}
		</ScrollView>
	);
}

export default WaitingRoom;
