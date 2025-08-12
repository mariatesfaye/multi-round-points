<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PlayerJoined implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $players;

    public function __construct(array $players)
    {
        $this->players = $players;
    }

    public function broadcastOn(): array
    {
        return [new Channel('game')];
    }

    public function broadcastAs(): string
    {
        return 'player.joined';
    }
}