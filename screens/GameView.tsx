import React, { useEffect } from 'react';
import { SafeAreaView, Text } from 'react-native';
import { EventSource } from 'eventsource';
import { connect, activeSubscriptions, parseToken } from '@/services/MercureService';
import { MessageType } from "@/utils/messages";
import WaitingRoom from "@/screens/WaitingRoom";
import { useCookies } from "react-cookie";
import { Player } from '@/lib/types';
import { useGameContext } from "@/context/GameContext";
import AvatarSelectionScreen from "@/screens/AvatarSelectionScreen";
import RuleSection from '@/components/ui/RuleSection';
import { GameStateMachineProvider, useGameStateMachine } from "@/contexts/GameStateMachineContext";
import { GameFlowState } from "@/utils/GameStateMachine";

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
		stateMachineHostId: stateMachine.hostId || 'none'
	});
	
	// Parse and log cookie data if available
	if (cookies.mercureAuthorization) {
		try {
			const parsed = parseToken(cookies.mercureAuthorization);
			console.log('[GameView] Cookie data:', {
				userId: parsed.userId,
				isHost: parsed.isHost(),
				code: parsed.code
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
			code: parsed.code
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
					console.log('[GameView] PlayerJoined message received:', payload);
					
					// Log state before adding player
					console.log('[GameView] State before adding player:', {
						stateMachineState: stateMachine.flowState,
						stateMachinePlayers: stateMachine.players?.map(p => ({ id: p.id, name: p.displayName })),
						currentPlayers: stateMachine.players.map((p: Player) => ({ id: p.id, name: p.displayName })),
						newPlayer: payload
					});
					
					// Add player to state machine
					const playerExists = stateMachine.players.some((p: Player) => p.id === (payload as Player).id);
					if (!playerExists) {
						console.log('[GameView] Adding new player to state machine:', payload);
						stateMachine.players.push(payload as Player);
					} else {
						console.log('[GameView] Player already exists in state machine, not adding:', payload);
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
						showingAvatar: stateMachine.flowState === GameFlowState.SELECTING_AVATAR,
						showingWaitingRoom: stateMachine.flowState === GameFlowState.WAITING_ROOM,
						currentPlayers: stateMachine.players.length
					})}
					
					{/* Show components based on game state machine */}
					{stateMachine.flowState === GameFlowState.SELECTING_AVATAR && (
						<AvatarSelectionScreen />
					)}
					
					{stateMachine.flowState === GameFlowState.WAITING_ROOM && (
						<>
							<WaitingRoom />
							<RuleSection />
						</>
					)}
					
					{/* Add additional game states as needed */}
					{stateMachine.flowState === GameFlowState.IN_GAME && (
						<Text>Game in progress</Text>
					)}

					{stateMachine.flowState === GameFlowState.GAME_OVER && (
						<Text>Game over</Text>
					)}
				</>
			)}
		</SafeAreaView>
	);
}

// Export the wrapped component
export default GameViewWithProvider;
