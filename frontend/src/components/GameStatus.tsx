import React from 'react';
import { Player } from '../types';

interface GameStatusProps {
  currentRound: number;
  totalRounds: number;
  status: string;
  roundWinner: Player | null;
  gameWinner: Player[] | null;
}

const GameStatus: React.FC<GameStatusProps> = ({
  currentRound,
  totalRounds,
  status,
  roundWinner,
  gameWinner,
}) => {
  return (
    <div className="game-status">
      <h2>Round {currentRound} of {totalRounds}</h2>
      <p className="status">{status}</p>
      {roundWinner && (
        <p className="round-winner">Round Winner: {roundWinner.username}!</p>
      )}
      {gameWinner && (
        <div className="game-winner">
          <h3>Game Over!</h3>
          <p>Winner(s): {gameWinner.map(p => p.username).join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default GameStatus;