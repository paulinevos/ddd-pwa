import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import PlayerBar from '@/components/PlayerBar';
import HostTip from '@/components/HostTip';
import ConfirmTip from '@/components/ConfirmTip';
import { ScrollView, StyleSheet, View, Text, Animated } from 'react-native';
import theme from '@/theme';
import { Button, ButtonColor } from '@/components/Button';
import { useGameStateMachine } from '@/contexts/GameStateMachineContext';
import { GameFlowState, reorderPlayers } from '@/utils/GameStateMachine';
import { parseToken } from '@/services/MercureService';
import SortablePlayerList from '@/components/SortablePlayerList';
import { useGameContext } from '@/contexts/GameContext';
import CardDrawOverlay from '@/components/CardDrawOverlay';

function GamePlayScreen() {
	const { flowState } = useGameStateMachine();
	const stateMachine = useGameStateMachine();
	const { transition } = stateMachine;
	const { players, code, hostId } = stateMachine;
	const { setGameState } = useGameContext();
	const [showConfirmTip, setShowConfirmTip] = useState(false);
	const [showCardOverlay, setShowCardOverlay] = useState(false);
	const cardFade = useState(new Animated.Value(0))[0];
	const overlayTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (overlayTimeout.current) {
				clearTimeout(overlayTimeout.current);
			}
		};
	}, []);

	// Determine if current user is the host using the existing parseToken function
	const isHost = useMemo(() => {
		try {
			const cookies = document.cookie.split('; ');
			const authCookie = cookies.find((cookie) =>
				cookie.startsWith('mercureAuthorization=')
			);
			if (authCookie) {
				const token = authCookie.split('=')[1];
				const parsed = parseToken(token);
				return parsed.isHost();
			}
		} catch (error) {
			console.error('[GamePlayScreen] Error checking if user is host:', error);
		}
		return false;
	}, []);

	// Log state information for debugging without changing UI
	console.log('[WaitingRoom] Rendering with state from StateMachine:', {
		code: code,
		playerCount: players?.length,
		flowState: stateMachine.flowState,
		playersInState: stateMachine.players,
		hostIdInState: stateMachine.hostId,
	});

	// Log token data if available
	if (typeof window !== 'undefined') {
		const cookies = document.cookie.split('; ');
		const authCookie = cookies.find((cookie) =>
			cookie.startsWith('mercureAuthorization=')
		);
		if (authCookie) {
			const token = authCookie.split('=')[1];
			try {
				const parsed = parseToken(token);
				console.log('[WaitingRoom] Token data:', {
					userId: parsed.userId,
					isHost: parsed.isHost(),
					code: parsed.code,
				});
			} catch (error) {
				console.error('[WaitingRoom] Error parsing token:', error);
			}
		}
	}

	const styles = StyleSheet.create({
		scrollView: {
			flex: 1,
		},
		container: {
			flex: 1,
			width: '100%',
			padding: theme.spacing.sm,
			paddingBottom: 160,
		},
		content: {
			flex: 1,
		},
		buttonContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: '5%',
		},
		confirmTipContainer: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 1000,
		},
        overlayFill: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 10000,
            elevation: 10000,
        },
		textStyle: {
			fontFamily: theme.typography.fontFamilyPrimary,
			fontSize: theme.typography.fontSizeLg,
			color: theme.colors.textDark,
			paddingTop: 5,
		},
	});

	// Use the players array directly since we're not modifying it

	// Debug logging
	console.log('[GamePlayScreen] Debug:', {
		isHost,
		flowState,
		shouldShowHostTip: isHost && flowState === GameFlowState.WAITING_ROOM,
		hostId,
		players: players?.map((p) => ({
			id: p.id,
			displayName: p.displayName,
			isHost: p.isHost,
		})),
	});

	const handlePlayerReorder = useCallback(
		(newOrder: string[]) => {
			reorderPlayers(stateMachine, newOrder, (updatedState) => {
				setGameState({
					players: updatedState.players,
					hostId: updatedState.hostId,
				});
			});
		},
		[stateMachine, setGameState]
	);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<ScrollView style={styles.scrollView}>
					{flowState === GameFlowState.WAITING_ROOM && isHost ? (
						<SortablePlayerList
							players={players}
							onOrderChange={handlePlayerReorder}
							isHost={isHost}
							flowState={flowState}
						>
							{(player, dragProps) => (
								<View {...dragProps}>
									<PlayerBar player={player} />
								</View>
							)}
						</SortablePlayerList>
					) : (
						<>
							{players.map((player, index) => (
								<PlayerBar
									key={player.id}
									player={player}
									isCurrentPlayer={
										flowState === GameFlowState.IN_GAME && index === 0
									}
								/>
							))}
						</>
					)}

					{isHost &&
						flowState === GameFlowState.WAITING_ROOM &&
						players.length >= 3 && <HostTip isHost={isHost} />}
					<View style={styles.confirmTipContainer}>
						<ConfirmTip
							visible={showConfirmTip}
							onDismiss={() => {
								setShowConfirmTip(false);
								transition(GameFlowState.IN_GAME);
								// Schedule card overlay fade-in 1.0s after confirming
								if (overlayTimeout.current) {
									clearTimeout(overlayTimeout.current);
								}
								overlayTimeout.current = setTimeout(() => {
									setShowCardOverlay(true);
									cardFade.setValue(0);
									Animated.timing(cardFade, {
										toValue: 1,
										duration: 400,
										useNativeDriver: true,
									}).start();
								}, 1000);
							}}
						/>
					</View>

                    {/* Overlay is rendered at root level below for proper full-screen centering */}
                </ScrollView>
            </View>

			<View style={styles.buttonContainer}>
				{flowState === GameFlowState.WAITING_ROOM && (
					<>
						<Button
							color={ButtonColor.Cyan}
							handlePress={() => {
								setShowConfirmTip(true);
							}}
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
					</>
				)}

				{flowState === GameFlowState.IN_GAME && (
					<View>
						{/* Placeholder for the in-game action button */}
						{/* <Text style={styles.textStyle}>Game Action Area</Text> */}
					</View>
				)}
			</View>

			{/* Card overlay with fade-in (root-level for full-screen centering) */}
			{showCardOverlay && (
				<View style={styles.overlayFill}>
					<CardDrawOverlay
						visible={true}
						backdropOpacity={cardFade}
						onDismiss={() => setShowCardOverlay(false)}
						onReveal={() => {
							// Placeholder: parent can swap image or advance state
						}}
					/>
				</View>
			)}
		</View>
	);
}

export default GamePlayScreen;
