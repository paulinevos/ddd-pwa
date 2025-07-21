import { useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { connect, send, parseToken } from '@/services/MercureService';
import { Message, MessageType } from '@/utils/messages';
import { Player } from '@/lib/types';

interface UsePlayerSyncProps {
  players: Player[];
  isHost: boolean;
  onPlayersReceived: (players: Player[]) => void;
  onPlayerJoined: (player: Player) => void;
}

/**
 * Simplified network sync for player list
 * Handles Mercure messaging without complex state management
 */
export const usePlayerSync = ({ 
  players, 
  isHost, 
  onPlayersReceived, 
  onPlayerJoined 
}: UsePlayerSyncProps) => {
  const [cookies] = useCookies(['mercureAuthorization']);
  const token = cookies.mercureAuthorization;

  // Broadcast current player list to all clients (host only)
  const broadcastPlayers = useCallback(() => {
    if (!token || !isHost || players.length === 0) return;
    
    try {
      console.log('[usePlayerSync] Broadcasting player list:', players.length);
      send(token, new Message(MessageType.SyncPlayers, { players }));
    } catch (error) {
      console.error('[usePlayerSync] Error broadcasting players:', error);
    }
  }, [token, isHost, players]);

  // Request player list from host (guest only)
  const requestPlayers = useCallback(() => {
    if (!token || isHost) return;
    
    try {
      console.log('[usePlayerSync] Requesting player list from host');
      send(token, new Message(MessageType.RequestPlayerList, {}));
    } catch (error) {
      console.error('[usePlayerSync] Error requesting players:', error);
    }
  }, [token, isHost]);

  // Announce player joined
  const announcePlayerJoined = useCallback((player: Player) => {
    if (!token) return;
    
    try {
      console.log('[usePlayerSync] Announcing player joined:', player.displayName);
      send(token, new Message(MessageType.PlayerJoined, player));
    } catch (error) {
      console.error('[usePlayerSync] Error announcing player:', error);
    }
  }, [token]);

  // Set up Mercure connection and message handling
  useEffect(() => {
    if (!token) return;

    let eventSource: EventSource | null = null;
    let mounted = true;

    try {
      const parsed = parseToken(token);
      eventSource = connect(token);
      
      console.log('[usePlayerSync] Connected to Mercure');

      // Handle incoming messages
      const handleMessage = (e: MessageEvent<string>) => {
        if (!mounted) return;
        
        try {
          const data = JSON.parse(e.data);
          const { type, payload } = data;

          console.log('[usePlayerSync] Received message:', type);

          switch (type) {
            case MessageType.PlayerJoined:
              // Someone joined - add them to our list
              onPlayerJoined(payload as Player);
              
              // If we're the host, broadcast updated list
              if (parsed.isHost()) {
                // Small delay to ensure the player is added before broadcasting
                setTimeout(() => broadcastPlayers(), 100);
              }
              break;

            case MessageType.SyncPlayers:
              // Received full player list from host
              console.log('[usePlayerSync] Received player list sync:', payload.players?.length);
              if (payload.players) {
                onPlayersReceived(payload.players);
              }
              break;

            case MessageType.RequestPlayerList:
              // Guest is requesting player list - broadcast if we're host
              if (parsed.isHost()) {
                console.log('[usePlayerSync] Received player list request, broadcasting');
                broadcastPlayers();
              }
              break;

            default:
              console.log('[usePlayerSync] Unhandled message type:', type);
          }
        } catch (error) {
          console.error('[usePlayerSync] Error handling message:', error);
        }
      };

      eventSource.addEventListener('message', handleMessage);

      // Initial sync: guests request player list, hosts broadcast if they have players
      setTimeout(() => {
        if (parsed.isHost() && players.length > 0) {
          broadcastPlayers();
        } else if (!parsed.isHost()) {
          requestPlayers();
        }
      }, 500);

    } catch (error) {
      console.error('[usePlayerSync] Error setting up connection:', error);
    }

    // Cleanup
    return () => {
      mounted = false;
      if (eventSource) {
        eventSource.close();
        console.log('[usePlayerSync] Closed Mercure connection');
      }
    };
  }, [token, isHost, players.length, broadcastPlayers, requestPlayers, onPlayersReceived, onPlayerJoined]);

  return {
    broadcastPlayers,
    requestPlayers,
    announcePlayerJoined
  };
};
