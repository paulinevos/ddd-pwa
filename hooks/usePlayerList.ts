import { useState, useEffect, useCallback } from 'react';
import { Player } from '@/lib/types';
import { parseToken } from '@/services/MercureService';
import { useCookies } from 'react-cookie';

const PLAYER_LIST_STORAGE_KEY = 'ddd_playerList';
const HOST_ID_STORAGE_KEY = 'ddd_hostId';

interface PlayerListState {
  players: Player[];
  hostId: string | null;
  isHost: boolean;
  currentUserId: string | null;
}

interface PlayerListActions {
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  setPlayers: (players: Player[]) => void;
  clearPlayers: () => void;
}

/**
 * Simplified player list management hook
 * Single source of truth with localStorage persistence and optimistic updates
 */
export const usePlayerList = (): PlayerListState & PlayerListActions => {
  const [cookies] = useCookies(['mercureAuthorization']);
  const [players, setPlayersState] = useState<Player[]>([]);
  const [hostId, setHostIdState] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedPlayers = localStorage.getItem(PLAYER_LIST_STORAGE_KEY);
      const savedHostId = localStorage.getItem(HOST_ID_STORAGE_KEY);
      
      if (savedPlayers) {
        const parsedPlayers = JSON.parse(savedPlayers) as Player[];
        console.log('[usePlayerList] Loaded players from localStorage:', parsedPlayers);
        setPlayersState(parsedPlayers);
      }
      
      if (savedHostId) {
        console.log('[usePlayerList] Loaded hostId from localStorage:', savedHostId);
        setHostIdState(savedHostId);
      }
    } catch (error) {
      console.error('[usePlayerList] Error loading from localStorage:', error);
    }
  }, []);

  // Parse token and set user info
  useEffect(() => {
    if (cookies.mercureAuthorization) {
      try {
        const parsed = parseToken(cookies.mercureAuthorization);
        setCurrentUserId(parsed.userId);
        setIsHost(parsed.isHost());
        
        // If this user is the host and we don't have a hostId, set it
        if (parsed.isHost() && !hostId) {
          setHostIdState(parsed.userId);
          localStorage.setItem(HOST_ID_STORAGE_KEY, parsed.userId);
        }
        
        console.log('[usePlayerList] User info:', {
          userId: parsed.userId,
          isHost: parsed.isHost(),
          code: parsed.code
        });
      } catch (error) {
        console.error('[usePlayerList] Error parsing token:', error);
      }
    }
  }, [cookies.mercureAuthorization, hostId]);

  // Save to localStorage whenever players or hostId changes
  useEffect(() => {
    try {
      localStorage.setItem(PLAYER_LIST_STORAGE_KEY, JSON.stringify(players));
      console.log('[usePlayerList] Saved players to localStorage:', players.length);
    } catch (error) {
      console.error('[usePlayerList] Error saving players to localStorage:', error);
    }
  }, [players]);

  useEffect(() => {
    if (hostId) {
      try {
        localStorage.setItem(HOST_ID_STORAGE_KEY, hostId);
        console.log('[usePlayerList] Saved hostId to localStorage:', hostId);
      } catch (error) {
        console.error('[usePlayerList] Error saving hostId to localStorage:', error);
      }
    }
  }, [hostId]);

  // Actions
  const addPlayer = useCallback((player: Player) => {
    setPlayersState(prev => {
      // Check if player already exists
      const existingIndex = prev.findIndex(p => p.id === player.id);
      if (existingIndex >= 0) {
        // Update existing player
        const updated = [...prev];
        updated[existingIndex] = player;
        console.log('[usePlayerList] Updated existing player:', player.displayName);
        return updated;
      } else {
        // Add new player
        console.log('[usePlayerList] Added new player:', player.displayName);
        return [...prev, player];
      }
    });
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    setPlayersState(prev => {
      const filtered = prev.filter(p => p.id !== playerId);
      console.log('[usePlayerList] Removed player:', playerId);
      return filtered;
    });
  }, []);

  const updatePlayer = useCallback((playerId: string, updates: Partial<Player>) => {
    setPlayersState(prev => {
      const updated = prev.map(p => 
        p.id === playerId ? { ...p, ...updates } : p
      );
      console.log('[usePlayerList] Updated player:', playerId, updates);
      return updated;
    });
  }, []);

  const setPlayers = useCallback((newPlayers: Player[]) => {
    console.log('[usePlayerList] Set players:', newPlayers.length);
    setPlayersState(newPlayers);
  }, []);

  const clearPlayers = useCallback(() => {
    console.log('[usePlayerList] Cleared all players');
    setPlayersState([]);
    setHostIdState(null);
    localStorage.removeItem(PLAYER_LIST_STORAGE_KEY);
    localStorage.removeItem(HOST_ID_STORAGE_KEY);
  }, []);

  return {
    players,
    hostId,
    isHost,
    currentUserId,
    addPlayer,
    removePlayer,
    updatePlayer,
    setPlayers,
    clearPlayers
  };
};
