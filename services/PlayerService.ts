import { Player } from '@/lib/types';
import { Message, MessageType } from '@/utils/messages';
import { send } from './MercureService';

class PlayerService {
  private static instance: PlayerService;
  
  private constructor() {}

  public static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }

  /**
   * Creates a new player object with required fields
   */
  public createPlayer(id: string, displayName: string, avatar: string, isHost: boolean): Player {
    return {
      id,
      displayName,
      avatar,
      isHost
    };
  }

  /**
   * Creates a host placeholder player
   */
  public createHostPlaceholder(hostId: string, displayName: string = 'Game Host'): Player {
    return this.createPlayer(hostId, displayName, 'default', true);
  }

  /**
   * Broadcasts the current player list to all clients
   */
  public broadcastPlayerList(token: string, players: Player[]): void {
    console.log('[PlayerService] Broadcasting player list:', players);
    try {
      send(token, new Message(MessageType.SyncPlayers, { players }));
    } catch (error) {
      console.error('[PlayerService] Error broadcasting player list:', error);
    }
  }

  /**
   * Requests the full player list from the host
   */
  public requestPlayerList(token: string): void {
    console.log('[PlayerService] Requesting player list from host');
    try {
      send(token, new Message(MessageType.RequestPlayerList, {}));
    } catch (error) {
      console.error('[PlayerService] Error requesting player list:', error);
    }
  }
}

export default PlayerService.getInstance();
