import React, { useState, useEffect } from 'react';
import JoinGame from './components/JoinGame';
import Game from './components/Game';
import { GameService } from './services/gameService';
import { Player, GameState } from './types';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 0,
    totalRounds: 5,
    status: 'waiting',
    roundWinner: null,
    gameWinner: null,
  });
  const [currentPlayerId, setCurrentPlayerId] = useState('');
  const [gameService, setGameService] = useState<GameService | null>(null);
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    const service = new GameService(
      (updatedPlayers) => setPlayers(updatedPlayers),
      (updatedGameState) => setGameState(updatedGameState),
      (connectionId) => {
        console.log('WebSocket connected with ID:', connectionId);
        setCurrentPlayerId(connectionId);
      }
    );
    setGameService(service);

    return () => {
      if (service && currentPlayerId) {
        service.leaveGame(currentPlayerId);
      }
    };
  }, []);

  const handleJoin = async (username: string) => {
    try {
      if (!gameService) throw new Error('Game service not initialized');
      if (!currentPlayerId) throw new Error('WebSocket not connected');
      
      console.log('Attempting to join with:', { username, connectionId: currentPlayerId });
      await gameService.joinGame(username, currentPlayerId);
      setJoined(true);
      setJoinError('');
    } catch (error) {
      console.error('Join failed:', error);
      setJoinError('Failed to join game. Please refresh and try again.');
      throw error; 
    }
  };

  const handleLeave = async () => {
    if (gameService) {
      await gameService.leaveGame(currentPlayerId);
      setJoined(false);
    }
  };

  return (
    <div className="app">
      {!joined ? (
        <JoinGame onJoin={handleJoin} />
      ) : (
        <Game
          players={players}
          currentPlayerId={currentPlayerId}
          gameState={gameState}
          onLeave={handleLeave}
        />
      )}
      {joinError && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {joinError}
        </div>
      )}
    </div>
  );
};

export default App;