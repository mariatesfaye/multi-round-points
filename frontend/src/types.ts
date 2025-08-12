export interface Player {
  id: string;
  username: string;
  score: number;
}

export interface GameState {
  currentRound: number;
  totalRounds: number;
  status: 'waiting' | 'spinning' | 'round-over' | 'game-over';
  roundWinner: Player | null;
  gameWinner: Player[] | null;
}