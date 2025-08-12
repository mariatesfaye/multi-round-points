import React, { useEffect, useState } from 'react';
import PlayerList from './PlayerList';
import GameStatus from './GameStatus';
import Spinner from './Spinner';
import { GameState, Player } from '../types';

interface GameProps {
  players: Player[];
  currentPlayerId: string | null;
  gameState: GameState;
  onLeave: () => void;
}

const Game: React.FC<GameProps> = ({
  players,
  currentPlayerId,
  gameState,
  onLeave,
}) => {
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (gameState.status === 'spinning') {
      setSpinning(true);
    } else {
      setSpinning(false);
    }
  }, [gameState.status]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Multi-Round Game</h1>
        <button onClick={onLeave} className="leave-button">
          Leave Game
        </button>
      </div>

      <div className="game-content">
        <div className="game-info">
          <GameStatus
            currentRound={gameState.currentRound}
            totalRounds={gameState.totalRounds}
            status={gameState.status}
            roundWinner={gameState.roundWinner}
            gameWinner={gameState.gameWinner}
          />
          <Spinner spinning={spinning} />
        </div>

        <PlayerList players={players} currentPlayerId={currentPlayerId} />
      </div>
    </div>
  );
};

export default Game;