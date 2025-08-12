<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GameOver implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $players;
    public array $winners;

    public function __construct(array $players, array $winners)
    {
        $this->players = $players;
        $this->winners = $winners;
    }

    public function broadcastOn(): array
    {
        return [new Channel('game')];
    }

    public function broadcastAs(): string
    {
        return 'game.over';
    }
}