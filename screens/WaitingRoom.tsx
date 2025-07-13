import PlayerBar from '@/components/PlayerBar';

import { Player } from '@/lib/types';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import theme from '@/theme';
import { Button, ButtonColor } from '@/components/ui/Button';
import { useGameStateMachine } from '@/contexts/GameStateMachineContext';
import { parseToken } from '@/services/MercureService';

function WaitingRoom() {
	const stateMachine = useGameStateMachine();
	const { players, code, hostId } = stateMachine;
	
	// Log state information for debugging without changing UI
	console.log('[WaitingRoom] Rendering with state from StateMachine:', {
		code: code,
		playerCount: players?.length,
		flowState: stateMachine.flowState,
		playersInState: stateMachine.players,
		hostIdInState: stateMachine.hostId
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
	const getDisplayPlayers = (): Player[] => {
		const displayPlayers = [...players];

		// If the host is not in the players list yet, add a placeholder.
		// This ensures the host card is always visible, even before their data has fully propagated.
		if (hostId && !displayPlayers.some(p => p.id === hostId)) {
			const hostPlaceholder: Player = {
				id: hostId,
				displayName: 'Game Host',
				avatar: 'default' // Use a default avatar
			};
			console.log('[WaitingRoom] Host not found in player list. Injecting placeholder.');
			displayPlayers.unshift(hostPlaceholder);
		}

		return displayPlayers;
	};

	const displayPlayers = getDisplayPlayers();

	return (
		<ScrollView style={styles.scrollView}>
			{/* Always ensure we have at least the host player to display */}
			{displayPlayers.map((player) => (
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
