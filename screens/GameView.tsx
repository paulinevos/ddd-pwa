import React, { useCallback, useEffect, useContext } from 'react';
import {
	SafeAreaView,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Dimensions,
} from 'react-native';
import { useCookies } from 'react-cookie';
import { Player } from '@/lib/types';
import { connect, send, parseToken } from '@/services/MercureService';
import { MessageType, Message } from '@/utils/messages';
import { GameContext } from '@/contexts/GameContext';
import {
	GameStateMachineProvider,
	useGameStateMachine,
} from '@/contexts/GameStateMachineContext';
import { GameFlowState, addPlayer, updatePlayers } from '@/utils/GameStateMachine';
import AvatarSelectionScreen from './AvatarSelectionScreen';
import GamePlayScreen from './GamePlayScreen';
import RuleSection from '@/components/RuleSection';
import { EventSource } from 'eventsource';

// Main GameView component wrapped with state machine provider
function GameViewWithProvider() {
	return (
		<GameStateMachineProvider>
			<GameViewContent />
		</GameStateMachineProvider>
	);
}

// Inner GameView content that uses the state machine
function GameViewContent(): JSX.Element {
	const [cookies] = useCookies(['mercureAuthorization']);
	const { gameState } = useContext(GameContext);
	const stateMachine = useGameStateMachine();



	console.log('[GameView] Initial render with:', {
		cookie: cookies.mercureAuthorization ? 'Present' : 'Not present',
		gameStateExists: !!gameState,
		gameStatePlayers: gameState?.players?.length || 0,
		playersLength: stateMachine.players.length,
		playerIds: stateMachine.players.map((p: Player) => p.id),
		stateMachineState: stateMachine.flowState,
		stateMachinePlayers: stateMachine.players?.length || 0,
		stateMachineHostId: stateMachine.hostId || 'none',
	});

	// Parse and log cookie data if available
	if (cookies.mercureAuthorization) {
		try {
			const parsed = parseToken(cookies.mercureAuthorization);
			console.log('[GameView] Cookie data:', {
				userId: parsed.userId,
				isHost: parsed.isHost(),
				code: parsed.code,
			});
		} catch (error) {
			console.error('[GameView] Error parsing cookie:', error);
		}
	}

	// Initialize or update game state when needed

	// Function to send the full player list to all clients (host only)
	const broadcastPlayerList = useCallback((token: string, players: Player[]) => {
		try {
			send(token, new Message(MessageType.SyncPlayers, { players }));
			console.log('[GameView] Broadcasted player list to all clients');
		} catch (error) {
			console.error('[GameView] Error broadcasting player list:', error);
		}
	}, []);

	// Connect to event source for real-time updates
	useEffect(() => {
		// Only connect if we have an auth token
		if (!cookies.mercureAuthorization) return;

		console.log('[GameView] Connecting to event source');
		const token = cookies.mercureAuthorization;

		const parsed = parseToken(token);
		console.log('[GameView] Token parsed:', {
			userId: parsed.userId,
			isHost: parsed.isHost(),
			code: parsed.code,
		});

		// Connect to main event source
		const events: EventSource = connect(token);
		console.log('[GameView] EventSource connected');

		// If we're a guest, request the full player list
		if (!parsed.isHost()) {
			send(token, new Message(MessageType.RequestPlayerList, {}));
		}

		// Listen for message events
		events.addEventListener('message', (e: MessageEvent<string>) => {
			try {
				console.log('[GameView] Message received:', e.data);
				const data = JSON.parse(e.data);
				const { type, payload } = data;

				// Handle different message types
				switch (type) {
					case MessageType.PlayerJoined:
						// Add player to state machine if they don't already exist
						const playerExists = stateMachine.players.some(
							(p: Player) => p.id === (payload as Player).id
						);
						if (!playerExists) {
							console.log('[GameView] Adding new player:', payload);
							addPlayer(
								stateMachine,
								payload as Player,
								stateMachine.onStateChange
							);

							// If we're the host, broadcast the updated player list
							if (parsed.isHost()) {
								// The player has already been added to stateMachine.players by addPlayer
								// So we can just broadcast the current state
								broadcastPlayerList(token, stateMachine.players);
							} else if (payload.id !== parsed.userId) {
								// If we're a guest and this is another player joining, request the full player list
								send(token, new Message(MessageType.RequestPlayerList, {}));
							}
						}
						break;

					case MessageType.SyncPlayers:
						// Update local player list with the one from host
						console.log('[GameView] Received player list sync:', payload.players);
						updatePlayers(stateMachine, payload.players, stateMachine.onStateChange);
						break;

					case MessageType.RequestPlayerList:
						// Only the host should respond to player list requests
						if (parsed.isHost()) {
							console.log('[GameView] Received player list request, broadcasting current players');
							broadcastPlayerList(token, stateMachine.players);
						}
						break;

					default:
						console.log('[GameView] Unhandled message type:', type);
				}
			} catch (error) {
				console.error('[GameView] Error handling message:', error, e.data);
			}
		});

		// Clean up on unmount
		return () => {
			console.log('[GameView] Cleanup event source');
			events.close();
		};
	}, [cookies.mercureAuthorization, broadcastPlayerList, stateMachine]);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#EBFFFE',
				// paddingHorizontal: '10%',
			}}
		>
			{stateMachine && (
				<>
					{/* Log component rendering state */}
					{console.log('[GameView] Rendering components based on state:', {
						flowState: stateMachine.flowState,
						showingAvatar:
							stateMachine.flowState === GameFlowState.SELECTING_AVATAR,
						showingWaitingRoom:
							stateMachine.flowState === GameFlowState.WAITING_ROOM,
						currentPlayers: stateMachine.players.length,
					})}

					{/* Show components based on game state machine */}
					{stateMachine.flowState === GameFlowState.SELECTING_AVATAR && (
						<AvatarSelectionScreen />
					)}

					{/* Show game play screen for waiting and in-game states */}
					{(stateMachine.flowState === GameFlowState.WAITING_ROOM ||
						stateMachine.flowState === GameFlowState.IN_GAME) && (
						<>
							<GamePlayScreen />
							<RuleSection />
						</>
					)}

					{stateMachine.flowState === GameFlowState.GAME_OVER && (
						<Text>Game over</Text>
					)}

					{/* Drink button is positioned absolutely, rendered only in-game */}
					{stateMachine.flowState === GameFlowState.IN_GAME && (
						<TouchableOpacity
							style={styles.drinkButtonContainer}
							onPress={() => console.log('Drink button pressed!')}
						>
							<Image
								source={require('@/assets/images/normal.png')}
								style={styles.drinkButtonImage}
							/>
						</TouchableOpacity>
					)}
				</>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	drinkButtonContainer: {
		zIndex: 100,
		position: 'absolute',
		bottom: '15%', // Position above the RuleSection
		right: '-5%',
		width: Dimensions.get('window').width * 0.45,
		height: Dimensions.get('window').width * 0.45, // Maintain aspect ratio
	},
	drinkButtonImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
});

// Export the wrapped component
export default GameViewWithProvider;
