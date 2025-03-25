<?php

namespace App\Jobs;

use App\Mail\Order\ChangeStatusOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendChangeStatusOrderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public array $incoming)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->incoming['order']->email)->send(new ChangeStatusOrder([
            'order' => $this->incoming['order'],
            'status' => $this->incoming['status'],
            'reason' => $this->incoming['reason'],
        ]));
    }
}
