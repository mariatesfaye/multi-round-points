import React from 'react';
import { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string | null;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId }) => {
  return (
    <div className="player-list">
      <h3>Players</h3>
      <ul>
        {players.map(player => (
          <li key={player.id} className={player.id === currentPlayerId ? 'you' : ''}>
            {player.username} {player.id === currentPlayerId && '(You)'} - {player.score} pts
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;