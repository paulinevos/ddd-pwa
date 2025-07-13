import React, { useEffect } from 'react';
import {
	SafeAreaView,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
	Dimensions,
} from 'react-native';
import { EventSource } from 'eventsource';
import {
	connect,
	activeSubscriptions,
	parseToken,
} from '@/services/MercureService';
import { MessageType } from '@/utils/messages';
import GamePlayScreen from '@/screens/GamePlayScreen';
import RuleSection from '@/components/RuleSection';
import { useCookies } from 'react-cookie';
import { Player } from '@/lib/types';
import { useGameContext } from '@/contexts/GameContext';
import AvatarSelectionScreen from '@/screens/AvatarSelectionScreen';
import {
	GameStateMachineProvider,
	useGameStateMachine,
} from '@/contexts/GameStateMachineContext';
import { GameFlowState, addPlayer } from '@/utils/GameStateMachine';

// Main GameView component wrapped with state machine provider
function GameViewWithProvider() {
	return (
		<GameStateMachineProvider>
			<GameViewContent />
		</GameStateMachineProvider>
	);
}

// Inner GameView content that uses the state machine
function GameViewContent() {
	const [cookies] = useCookies(['mercureAuthorization']);
	const { gameState } = useGameContext();
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

		// Set up host-specific subscription if user is host
		if (parsed.isHost()) {
			console.log('[GameView] User is host, setting up subscription listener');
			const subscriptions = activeSubscriptions(token);
			subscriptions.addEventListener('message', (e: MessageEvent<string>) => {
				console.log('[GameView] Subscription update:', e);
			});
		}

		// Connect to main event source
		const events: EventSource = connect(token);
		console.log('[GameView] EventSource connected');

		// Listen for message events
		events.addEventListener('message', (e: MessageEvent<string>) => {
			console.log('[GameView] Message received:', e.data);
			const data = JSON.parse(e.data);
			const { type, payload } = data;

			// Handle different message types
			switch (type) {
				case MessageType.PlayerJoined:
					// Add player to state machine if they don't already exist
					// eslint-disable-next-line no-case-declarations
					const playerExists = stateMachine.players.some(
						(p: Player) => p.id === (payload as Player).id
					);
					if (!playerExists) {
						addPlayer(stateMachine, payload as Player, stateMachine.onStateChange);
					}
					break;
				default:
					console.log('[GameView] Unhandled message type:', type);
			}
		});

		// Clean up on unmount
		return () => {
			console.log('[GameView] Cleanup event source');
			events.close();
		};
	}, [cookies.mercureAuthorization, stateMachine]);

	return (
		<SafeAreaView
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#EBFFFE',
				paddingHorizontal: '10%',
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
