<?php

namespace App\Services;

use Illuminate\Support\Collection;

class GameService
{
    public Collection $players;
    public int $currentRound = 0;
    public int $totalRounds = 5;
    public int $minPlayers = 2;
    public bool $gameStarted = false;

    public function __construct()
    {
        $this->players = collect();
    }

    public function addPlayer(string $id, string $username): void
    {
        $this->players->put($id, [
            'id' => $id,
            'username' => $username,
            'score' => 0,
        ]);
    }

    public function removePlayer(string $id): void
    {
        $this->players->forget($id);
    }

    public function startGame(): void
    {
        $this->gameStarted = true;
        $this->currentRound = 1;
    }

    public function nextRound(): void
    {
        $this->currentRound++;
    }

    public function isGameOver(): bool
    {
        return $this->currentRound > $this->totalRounds;
    }

    public function selectRoundWinner(): string
    {
        $winnerId = $this->players->keys()->random();
        $this->players[$winnerId]['score']++;
        return $winnerId;
    }

    public function getGameWinner(): array
    {
        $maxScore = $this->players->max('score');
        return $this->players->where('score', $maxScore)->values()->all();
    }
}