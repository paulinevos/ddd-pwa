import React, { useMemo } from 'react';
import PlayerBar from '@/components/PlayerBar';
import HostTip from '@/components/HostTip';
import { Player } from '@/lib/types';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import theme from '@/theme';
import { Button, ButtonColor } from '@/components/Button';
import { useGameStateMachine } from '@/contexts/GameStateMachineContext';
import { GameFlowState } from '@/utils/GameStateMachine';
import { parseToken } from '@/services/MercureService';

function GamePlayScreen() {
	const { flowState } = useGameStateMachine();
	const stateMachine = useGameStateMachine();
	const { transition } = stateMachine;
	const { players, code, hostId } = stateMachine;

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
		textStyle: {
			fontFamily: theme.typography.fontFamilyPrimary,
			fontSize: theme.typography.fontSizeLg,
			color: theme.colors.textDark,
			paddingTop: 5,
		},
	});

	// Make sure we always display at least the host player card
	const getDisplayPlayers = (): Player[] => {
		const displayPlayers = [...players];

		// If the host is not in the players list yet, add a placeholder.
		// This ensures the host card is always visible, even before their data has fully propagated.
		if (hostId && !displayPlayers.some((p) => p.id === hostId)) {
			const hostPlaceholder: Player = {
				id: hostId,
				displayName: 'Game Host',
				avatar: 'default', // Use a default avatar
			};
			console.log(
				'[WaitingRoom] Host not found in player list. Injecting placeholder.'
			);
			displayPlayers.unshift(hostPlaceholder);
		}

		return displayPlayers;
	};

	const displayPlayers = getDisplayPlayers();

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

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<ScrollView style={styles.scrollView}>
					{/* Always ensure we have at least the host player to display */}
					{displayPlayers.map((player) => (
						<PlayerBar key={player.id} player={player} />
					))}
					{isHost && flowState === GameFlowState.WAITING_ROOM && (
						<HostTip isHost={isHost} />
					)}
				</ScrollView>
			</View>

			<View style={styles.buttonContainer}>
				{flowState === GameFlowState.WAITING_ROOM && (
					<>
						<Button
							color={ButtonColor.Cyan}
							handlePress={() => transition(GameFlowState.IN_GAME)}
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
		</View>
	);
}

export default GamePlayScreen;
