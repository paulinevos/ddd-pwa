import { GameState, Player } from '@/lib/types';
import { send } from '@/services/MercureService';
import { Message, MessageType } from '@/utils/messages';
import { GameStateMachineState, selectAvatar } from '@/utils/GameStateMachine';

/**
 * Handles the complete logic for a player joining the game.
 * This includes sending the Mercure message and updating local state.
 * @param token The player's JWT.
 * @param player The player object with details like id, displayName, and avatar.
 * @param stateMachine The current state machine instance.
 * @param setGameState The function to update and persist the global game state.
 */
export const handlePlayerJoin = async (
	token: string,
	player: Player,
	stateMachine: GameStateMachineState,
	setGameState: (state: GameState) => void
) => {
	console.log('[GameActions] Handling player join for:', player.displayName);
	try {
		// 1. Announce the player's arrival to other clients via Mercure
		await send(token, new Message(MessageType.PlayerJoined, player));
		console.log('[GameActions] PlayerJoined message sent successfully.');

		// 2. Update the local state machine in memory
		selectAvatar(stateMachine, player.id, player.displayName, player.avatar);

		// TODO: Remove test players before production
		if (player.isHost && stateMachine.players.length === 1) { // Only add test players if we're the first player
			console.log('[GameActions] Adding test players');
			
			// Add two test players with simple names
			const testPlayers = [
				{ id: 'test-guest-1', displayName: 'Guest 1', avatar: 'cocky.png', isHost: false },
				{ id: 'test-guest-2', displayName: 'Guest 2', avatar: 'dranky.png', isHost: false }
			];

			for (const testPlayer of testPlayers) {
				selectAvatar(stateMachine, testPlayer.id, testPlayer.displayName, testPlayer.avatar);
				console.log(`[GameActions] Added test player: ${testPlayer.displayName}`);
			}
		}

		// 3. Persist the new state to context and localStorage
		setGameState({
			players: stateMachine.players,
			hostId: stateMachine.hostId,
		});

		console.log('[GameActions] Player join process complete.');
	} catch (error) {
		console.error('[GameActions] Error during player join process:', error);
		throw error;
	}
};
