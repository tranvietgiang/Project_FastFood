<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BillMail extends Mailable
{
    use Queueable, SerializesModels;

    public $bill;

    /**
     * Create a new message instance.
     */
    public function __construct($bill)
    {
        $this->bill = $bill;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Hóa đơn mua hàng của bạn')
            ->view('emails.bills')   // file blade hiển thị bill
            ->with([
                'bill' => $this->bill
            ]);
    }
}