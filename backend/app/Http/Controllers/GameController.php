<?php

namespace App\Http\Controllers;

use App\Events\GameOver;
use App\Events\GameStarted;
use App\Events\NewRound;
use App\Events\PlayerJoined;
use App\Events\PlayerLeft;
use App\Events\RoundResult;
use App\Services\GameService;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function __construct(protected GameService $gameService)
    {
    }

    public function join(Request $request)
    {
        $username = $request->input('username');
        $connectionId = $request->input('connection_id');

        $this->gameService->addPlayer($connectionId, $username);
        broadcast(new PlayerJoined($this->gameService->players->values()->all()));

        if (!$this->gameService->gameStarted && 
            $this->gameService->players->count() >= $this->gameService->minPlayers) {
            $this->gameService->startGame();
            broadcast(new GameStarted($this->gameService->totalRounds));
            $this->startRound();
        }

        return response()->json([
            'status' => 'success',
            'players' => $this->gameService->players->values()->all(),
        ]);
    }

    public function leave(Request $request)
    {
        $connectionId = $request->input('connection_id');
        $this->gameService->removePlayer($connectionId);
        broadcast(new PlayerLeft($this->gameService->players->values()->all()));

        return response()->json(['status' => 'success']);
    }

    protected function startRound()
    {
        broadcast(new NewRound($this->gameService->currentRound, $this->gameService->totalRounds));

        // Simulate spinning/delay
        sleep(3);

        $winnerId = $this->gameService->selectRoundWinner();
        $winner = $this->gameService->players->get($winnerId);
        broadcast(new RoundResult(
            $this->gameService->currentRound,
            $winner,
            $this->gameService->players->values()->all()
        ));

        if ($this->gameService->isGameOver()) {
            broadcast(new GameOver(
                $this->gameService->players->values()->all(),
                $this->gameService->getGameWinner()
            ));
        } else {
            $this->gameService->nextRound();
            $this->startRound();
        }
    }
}