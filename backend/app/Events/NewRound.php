<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewRound implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $currentRound;
    public int $totalRounds;

    public function __construct(int $currentRound, int $totalRounds)
    {
        $this->currentRound = $currentRound;
        $this->totalRounds = $totalRounds;
    }

    public function broadcastOn(): array
    {
        return [new Channel('game')];
    }

    public function broadcastAs(): string
    {
        return 'new.round';
    }
}