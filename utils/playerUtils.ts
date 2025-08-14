import { Player } from '@/lib/types';
import { GameFlowState } from '@/utils/GameStateMachine';

/**
 * Reorders players based on the new order of player IDs
 * @param currentPlayers Current array of players
 * @param newOrder Array of player IDs in the new order
 * @returns Reordered array of players
 */
export const reorderPlayers = (currentPlayers: Player[], newOrder: string[]): Player[] => {
  // Create a map of player IDs to their data
  const playerMap = new Map(currentPlayers.map(p => [p.id, p]));
  
  // Rebuild players array in new order, preserving player data
  const reorderedPlayers = newOrder
    .map(id => playerMap.get(id))
    .filter((p): p is Player => p !== undefined);

  // If we missed any players (shouldn't happen), append them
  const missingPlayers = currentPlayers.filter(p => !newOrder.includes(p.id));
  return [...reorderedPlayers, ...missingPlayers];
};

/**
 * Checks if reordering is allowed in the current game state
 * @param flowState Current game flow state
 * @param isHost Whether the current user is the host
 * @returns Boolean indicating if reordering is allowed
 */
export const isReorderingAllowed = (flowState: GameFlowState, isHost: boolean): boolean => {
  return flowState === GameFlowState.WAITING_ROOM && isHost;
};
