import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  GameStateMachineState, 
  createStateMachine, 
  initialGameState,
  GameFlowState,
  UserRole
} from '../utils/GameStateMachine';
import { useCookies } from 'react-cookie';
import { parseToken } from '@/utils/message_handling';
import { useGameContext } from '@/utils/game_data';

// Create the context
export const GameStateMachineContext = createContext<GameStateMachineState | null>(null);

// Hook for accessing the state machine
export const useGameStateMachine = () => {
  const context = useContext(GameStateMachineContext);
  if (!context) {
    throw new Error('useGameStateMachine must be used within a GameStateMachineProvider');
  }
  return context;
};

// Props for the provider
interface GameStateMachineProviderProps {
  children: React.ReactNode;
}

// The provider component
export const GameStateMachineProvider: React.FC<GameStateMachineProviderProps> = ({ children }) => {
  const [cookies] = useCookies(['mercureAuthorization']);
  const { gameState } = useGameContext();
  const [stateMachine, setStateMachine] = useState<GameStateMachineState | null>(null);

  // Initialize the state machine
  useEffect(() => {
    const machine = createStateMachine(initialGameState, (newState) => {
      console.log('[GameStateMachine] State changed:', newState);
      // We could persist state here if needed
      setStateMachine({ ...newState });
    });

    setStateMachine(machine);

    // If we have a cookie, try to restore the state
    if (cookies.mercureAuthorization) {
      const token = cookies.mercureAuthorization;
      const parsed = parseToken(token);

      console.log('[GameStateMachineContext] Restoring state from token:', {
        userId: parsed.userId,
        isHost: parsed.isHost(),
        code: parsed.code,
        gameStateExists: !!gameState,
        players: gameState?.players?.length || 0
      });
      
      // Set game code regardless of state
      machine.gameCode = parsed.code;
      
      // Set user role based on token
      if (parsed.isHost()) {
        machine.userRole = UserRole.HOST;
      } else {
        machine.userRole = UserRole.PLAYER;
      }
      
      // If we have game state
      if (gameState) {
        // Copy host ID and players from game state
        machine.hostId = gameState.hostId || parsed.userId;
        
        // Ensure we have at least an empty players array
        const existingPlayers = gameState.players || [];
        machine.players = [...existingPlayers];
        
        // Check if the current user has an avatar by looking for their ID in players
        const currentUserHasAvatar = existingPlayers.some(p => p.id === parsed.userId);
        
        console.log('[GameStateMachineContext] Current user avatar check:', {
          currentUserId: parsed.userId,
          hasAvatar: currentUserHasAvatar,
          matchingPlayers: existingPlayers.filter(p => p.id === parsed.userId)
        });
        
        if (currentUserHasAvatar) {
          // User has already selected an avatar, show waiting room
          machine.forceState(GameFlowState.WAITING_ROOM);
        } else {
          // User hasn't selected an avatar yet
          machine.forceState(GameFlowState.SELECTING_AVATAR);
        }
      }
      // If we have token but no game state, we're selecting avatar
      else {
        // Initialize empty players array
        machine.players = [];
        machine.forceState(GameFlowState.SELECTING_AVATAR);
      }
    }
  }, [cookies.mercureAuthorization, gameState]);

  if (!stateMachine) {
    return null; // or a loading indicator
  }

  return (
    <GameStateMachineContext.Provider value={stateMachine}>
      {children}
    </GameStateMachineContext.Provider>
  );
};
