<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GameStarted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $totalRounds;

    public function __construct(int $totalRounds)
    {
        $this->totalRounds = $totalRounds;
    }

    public function broadcastOn(): array
    {
        return [new Channel('game')];
    }

    public function broadcastAs(): string
    {
        return 'game.start';
    }
}