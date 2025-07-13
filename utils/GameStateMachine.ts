import { Player } from './game_data';

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
  gameCode: string | null;
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
export const initialGameState: Omit<GameStateMachineState, 'transition' | 'forceState'> = {
  flowState: GameFlowState.HOME,
  userRole: UserRole.NONE,
  gameCode: null,
  cardPack: null,
  players: [],
  currentPlayerTurn: null,
  hostId: null,
  showAreYouSurePrompt: false
};

// Create a state machine instance
export const createStateMachine = (
  initialState: Omit<GameStateMachineState, 'transition' | 'forceState'> = initialGameState,
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
    }
  };
  
  return currentState;
};

// Helper functions for common state changes
export const transitionToHome = (machine: GameStateMachineState) => {
  machine.forceState(GameFlowState.HOME);
  machine.userRole = UserRole.NONE;
  machine.gameCode = null;
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
  machine.gameCode = gameCode;
  machine.transition(GameFlowState.SELECTING_AVATAR);
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
    avatar
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
