import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Player, GameState } from '../types';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo?: any;
  }
}

if (!window.Pusher) {
  window.Pusher = Pusher as any;
}

const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.REACT_APP_REVERB_APP_KEY || 'multi_round_game',
  wsHost: process.env.REACT_APP_REVERB_HOST || window.location.hostname,
  wsPort: parseInt(process.env.REACT_APP_REVERB_PORT || '8080'),
  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  cluster: '',
  authorizer: (channel: any) => ({
    authorize: (socketId: string, callback: Function) => {
      callback(false, {
        auth: '',
      });
    },
  }),
});

export class GameService {
  private connectionId: string = '';
  private players: Player[] = [];
  private gameState: GameState = {
    currentRound: 0,
    totalRounds: 5,
    status: 'waiting',
    roundWinner: null,
    gameWinner: null,
  };

  constructor(
    private onPlayersUpdated: (players: Player[]) => void,
    private onGameStateUpdated: (gameState: GameState) => void,
    private onConnected: (connectionId: string) => void
  ) {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    const pusher = (echo.connector as any).pusher;
    
    if (!pusher) {
      console.error('Pusher connector not initialized');
      return;
    }

    pusher.connection.bind('connected', () => {
      this.connectionId = pusher.connection.socket_id || '';
      this.onConnected(this.connectionId);
    });

    echo.channel('game')
      .listen('.player.joined', (data: { players: Player[] }) => {
        this.players = data.players;
        this.onPlayersUpdated(this.players);
      })
      .listen('.player.left', (data: { players: Player[] }) => {
        this.players = data.players;
        this.onPlayersUpdated(this.players);
      })
      .listen('.game.start', (data: { total_rounds: number }) => {
        this.gameState = {
          ...this.gameState,
          totalRounds: data.total_rounds,
          currentRound: 1,
          status: 'waiting',
        };
        this.onGameStateUpdated(this.gameState);
      })
      .listen('.new.round', (data: { current_round: number, total_rounds: number }) => {
        this.gameState = {
          ...this.gameState,
          currentRound: data.current_round,
          totalRounds: data.total_rounds,
          status: 'spinning',
          roundWinner: null,
        };
        this.onGameStateUpdated(this.gameState);
      })
      .listen('.round.result', (data: {
        round: number,
        winner: Player,
        players: Player[]
      }) => {
        this.players = data.players;
        this.gameState = {
          ...this.gameState,
          status: 'round-over',
          roundWinner: data.winner,
        };
        this.onPlayersUpdated(this.players);
        this.onGameStateUpdated(this.gameState);
      })
      .listen('.game.over', (data: { players: Player[], winners: Player[] }) => {
        this.players = data.players;
        this.gameState = {
          ...this.gameState,
          status: 'game-over',
          gameWinner: data.winners,
        };
        this.onPlayersUpdated(this.players);
        this.onGameStateUpdated(this.gameState);
      });
  }

  public joinGame(username: string, currentPlayerId: string): Promise<void> {
    if (!this.connectionId) {
      return Promise.reject('Not connected to WebSocket');
    }

    return fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username, 
        connection_id: this.connectionId 
      }),
    }).then(() => {});
  }

  public leaveGame(currentPlayerId: string): Promise<void> {
    if (!this.connectionId) {
      return Promise.reject('Not connected to WebSocket');
    }

    return fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ connection_id: this.connectionId }),
    }).then(() => {});
  }

  public getConnectionId(): string {
    return this.connectionId;
  }
}