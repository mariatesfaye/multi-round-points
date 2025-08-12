<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RoundResult implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $round;
    public array $winner;
    public array $players;

    public function __construct(int $round, array $winner, array $players)
    {
        $this->round = $round;
        $this->winner = $winner;
        $this->players = $players;
    }

    public function broadcastOn(): array
    {
        return [new Channel('game')];
    }

    public function broadcastAs(): string
    {
        return 'round.result';
    }
}