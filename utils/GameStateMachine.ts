import { Player } from '@/lib/types';
import { isReorderingAllowed } from './playerUtils';

// Game flow states as defined in steps.md
export enum GameFlowState {
  HOME = 'HOME',
  SELECTING_PACK = 'SELECTING_PACK',
  SELECTING_AVATAR = 'SELECTING_AVATAR',
  WAITING_ROOM = 'WAITING_ROOM',
  IN_GAME = 'IN_GAME',
  GAME_OVER = 'GAME_OVER'
}

// User roles in the game
export enum UserRole {
  HOST = 'HOST',
  PLAYER = 'PLAYER',
  NONE = 'NONE'
}

// Game state machine interface
export interface GameStateMachineState {
  // Current phase of the game for this user
  flowState: GameFlowState;
  
  // User's role
  userRole: UserRole;
  
  // Game details
  code: string | null;
  cardPack: string | null;
  
  // Player details
  players: Player[];
  currentPlayerTurn: string | null; // userId of the player whose turn it is
  
  // Host-specific
  hostId: string | null;
  
  // UI state
  showAreYouSurePrompt: boolean;

  // Transition method for state changes
  transition: (newState: GameFlowState) => void;
  
  // Force state method to handle invalid transitions
  forceState: (newState: GameFlowState) => void;

  // Callback to notify listeners of any state change
  onStateChange: (state: GameStateMachineState) => void;
}

// Valid state transitions
const validTransitions: Record<GameFlowState, GameFlowState[]> = {
  [GameFlowState.HOME]: [GameFlowState.SELECTING_PACK, GameFlowState.SELECTING_AVATAR],
  [GameFlowState.SELECTING_PACK]: [GameFlowState.SELECTING_AVATAR],
  [GameFlowState.SELECTING_AVATAR]: [GameFlowState.WAITING_ROOM],
  [GameFlowState.WAITING_ROOM]: [GameFlowState.IN_GAME],
  [GameFlowState.IN_GAME]: [GameFlowState.GAME_OVER, GameFlowState.HOME],
  [GameFlowState.GAME_OVER]: [GameFlowState.HOME, GameFlowState.WAITING_ROOM]
};

// Initial state
export const initialGameState: Omit<
	GameStateMachineState,
	'transition' | 'forceState' | 'onStateChange'
> = {
  flowState: GameFlowState.HOME,
  userRole: UserRole.NONE,
  code: null,
  cardPack: null,
  players: [],
  currentPlayerTurn: null,
  hostId: null,
  showAreYouSurePrompt: false
};

// Create a state machine instance
export const createStateMachine = (
  initialState: Omit<
		GameStateMachineState,
		'transition' | 'forceState' | 'onStateChange'
	> = initialGameState,
  onStateChange: (state: GameStateMachineState) => void = () => {}
): GameStateMachineState => {
  let currentState: GameStateMachineState = {
    ...initialState,
    transition: (newState: GameFlowState) => {
      // Check if the transition is valid
      const validNextStates = validTransitions[currentState.flowState];
      
      if (validNextStates.includes(newState)) {
        console.log(`[StateMachine] Valid transition: ${currentState.flowState} -> ${newState}`);
        currentState.flowState = newState;
        onStateChange(currentState);
      } else {
        console.error(
          `[StateMachine] Invalid transition: ${currentState.flowState} -> ${newState}. Valid transitions are: ${validNextStates.join(', ')}`
        );
      }
    },
    forceState: (newState: GameFlowState) => {
      console.log(`[StateMachine] Force state: ${currentState.flowState} -> ${newState}`);
      currentState.flowState = newState;
      onStateChange(currentState);
    },
    onStateChange: onStateChange,
  };
  
  return currentState;
};

// Add a player to the game state
export const addPlayer = (
  machine: GameStateMachineState,
  player: Player,
  onStateChange: (state: GameStateMachineState) => void
) => {
  const playerExists = machine.players.some((p) => p.id === player.id);
  if (!playerExists) {
    machine.players = [...machine.players, player];
    onStateChange(machine);
  }
};

// Update the entire player list (used for syncing)
export const updatePlayers = (
  machine: GameStateMachineState,
  newPlayers: Player[],
  onStateChange: (state: GameStateMachineState) => void
) => {
  // Preserve the host ID if it's set
  const currentHost = machine.players.find(p => p.isHost);
  const newHost = newPlayers.find(p => p.isHost);
  
  // If we have a current host but no new host, preserve the current host
  if (currentHost && !newHost) {
    const updatedNewPlayers = newPlayers.map(p => 
      p.id === currentHost.id ? { ...p, isHost: true } : p
    );
    machine.players = updatedNewPlayers;
  } else {
    machine.players = newPlayers;
  }
  
  onStateChange(machine);
};

// Helper functions for common state changes
export const transitionToHome = (machine: GameStateMachineState) => {
  machine.forceState(GameFlowState.HOME);
  machine.userRole = UserRole.NONE;
  machine.code = null;
  machine.cardPack = null;
  machine.players = [];
  machine.currentPlayerTurn = null;
  machine.hostId = null;
};

export const startHostFlow = (machine: GameStateMachineState) => {
  machine.userRole = UserRole.HOST;
  machine.transition(GameFlowState.SELECTING_PACK);
};

export const joinGameAsPlayer = (machine: GameStateMachineState, gameCode: string) => {
  machine.userRole = UserRole.PLAYER;
  machine.code = gameCode;
  machine.transition(GameFlowState.SELECTING_AVATAR);
};

/**
 * Reorders players in the game
 * @param machine Current state machine
 * @param newOrder Array of player IDs in the new order
 * @param onStateChange Callback when state changes
 */
export const reorderPlayers = (
  machine: GameStateMachineState,
  newOrder: string[],
  onStateChange: (state: GameStateMachineState) => void
) => {
  if (!isReorderingAllowed(machine.flowState, machine.userRole === UserRole.HOST)) {
    console.log('[GameStateMachine] Reordering not allowed in current state');
    return;
  }

  // Create a map of player IDs to their data
  const playerMap = new Map(machine.players.map(p => [p.id, p]));
  
  // Rebuild players array in new order, preserving player data
  const reorderedPlayers = newOrder
    .map(id => playerMap.get(id))
    .filter((p): p is Player => p !== undefined);

  // If we missed any players (shouldn't happen), append them
  const missingPlayers = machine.players.filter(p => !newOrder.includes(p.id));
  machine.players = [...reorderedPlayers, ...missingPlayers];
  
  onStateChange(machine);
};

export const selectAvatar = (
  machine: GameStateMachineState, 
  playerId: string, 
  displayName: string, 
  avatar: string
) => {
  // Add player to players array
  const newPlayer: Player = {
    id: playerId,
    displayName,
    avatar,
    isHost: machine.userRole === UserRole.HOST
  };
  
  console.log('[GameStateMachine] selectAvatar called with:', {
    playerId,
    displayName,
    currentState: machine.flowState,
    currentPlayers: machine.players.length,
    userRole: machine.userRole,
    hostId: machine.hostId
  });
  
  // Check if this player already exists in the array
  const existingPlayerIndex = machine.players.findIndex(p => p.id === playerId);
  
  let updatedPlayers: Player[] = [];
  
  if (existingPlayerIndex >= 0) {
    // Update existing player
    console.log('[GameStateMachine] Updating existing player:', playerId);
    updatedPlayers = [...machine.players];
    updatedPlayers[existingPlayerIndex] = newPlayer;
  } else {
    // Add new player
    console.log('[GameStateMachine] Adding new player:', playerId);
    // If we're the host and this is our first player, start fresh
    if (machine.userRole === UserRole.HOST && machine.players.length === 0) {
      updatedPlayers = [newPlayer];
    } else {
      updatedPlayers = [...machine.players, newPlayer];
    }
  }
  
  // Update players array
  machine.players = updatedPlayers;
  
  // If host, ensure hostId is set
  if (machine.userRole === UserRole.HOST) {
    machine.hostId = playerId;
  }
  
  console.log('[GameStateMachine] Player array after update:', {
    playerCount: machine.players.length,
    players: machine.players.map(p => ({ id: p.id, name: p.displayName }))
  });
  
  // Use forceState to avoid invalid transition errors
  // This ensures we always reach waiting room regardless of current state
  machine.forceState(GameFlowState.WAITING_ROOM);
  
  console.log('[GameStateMachine] Transitioned to:', machine.flowState);
};
