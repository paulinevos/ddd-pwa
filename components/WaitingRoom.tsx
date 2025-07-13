import PlayerBar from '@/components/PlayerBar';
import { useContext } from 'react';
import { GameContext, Player } from '@/utils/game_data';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import theme from '@/theme';
import { Button, ButtonColor } from '@/components/ui/Button';
import { useGameStateMachine } from '@/contexts/GameStateMachineContext';
import { parseToken } from '@/utils/message_handling';

function WaitingRoom() {
	const { gameState } = useContext(GameContext);
	const stateMachine = useGameStateMachine();
	// Use gameState.code instead of roomCode to match GameState type
	const { players, code } = gameState || { players: [], code: '_____' };
	
	// Log state information for debugging without changing UI
	console.log('[WaitingRoom] Rendering with:', {
		gameStateExists: !!gameState,
		codeProp: code,
		playerCount: players?.length,
		stateMachineState: stateMachine.flowState,
		stateMachinePlayers: stateMachine.players?.length,
		stateMachinePlayersData: stateMachine.players,
		gameStatePlayers: gameState?.players,
		stateMachineHostId: stateMachine.hostId,
		gameStateHostId: gameState?.hostId
	});
	
	// Log token data if available
	if (typeof window !== 'undefined') {
		const cookies = document.cookie.split('; ');
		const authCookie = cookies.find(cookie => cookie.startsWith('mercureAuthorization='));
		if (authCookie) {
			const token = authCookie.split('=')[1];
			try {
				const parsed = parseToken(token);
				console.log('[WaitingRoom] Token data:', {
					userId: parsed.userId,
					isHost: parsed.isHost(),
					code: parsed.code
				});
			} catch (error) {
				console.error('[WaitingRoom] Error parsing token:', error);
			}
		}
	}

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
			marginTop: '80%',
		},
		textStyle: {
			fontFamily: theme.typography.fontFamilyPrimary,
			fontSize: theme.typography.fontSizeLg,
			color: theme.colors.textDark,
			paddingTop: 5,
		},
	});

	// Make sure we always display at least the host player card
	const ensurePlayers = (): Player[] => {
		// Prefer players from gameState if available, otherwise use stateMachine.players
		const playersToShow = players && players.length > 0 ? [...players] : 
			(stateMachine.players && stateMachine.players.length > 0 ? [...stateMachine.players] : []);
		
		// For debugging
		console.log('[WaitingRoom] Current players:', {
			gameStatePlayers: players ? players.length : 0,
			stateMachinePlayers: stateMachine.players ? stateMachine.players.length : 0,
			finalCount: playersToShow.length
		});
		
		// Add host player if not present
		const hostId = stateMachine.hostId || gameState?.hostId;
		if (hostId) {
			const hostPlayer = playersToShow.find(p => p.id === hostId);
			if (!hostPlayer) {
				// Create a placeholder for the host
				const hostPlaceholder = {
					id: hostId,
					displayName: 'Game Host',
					avatar: 'default'
				};
				console.log('[WaitingRoom] Adding host placeholder:', hostPlaceholder);
				playersToShow.unshift(hostPlaceholder);
			}
		}
		
		return playersToShow;
	};

	return (
		<ScrollView style={styles.scrollView}>
			{/* Always ensure we have at least the host player to display */}
			{ensurePlayers().map((player) => (
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
				<Text style={styles.textStyle}>{code}</Text>
				<Text style={styles.textStyle}>
					use this code to invite your friends
				</Text>
			</View>
		</ScrollView>
	);
}

export default WaitingRoom;
