<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ForgotPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    // Khai báo các thuộc tính
    public $email;
    public $resetUrl;
    public $requestTime;
    public $userDevice;
    public $userAgent;
    public $userIpAddress;

    /**
     * Create a new message instance.
     */
    public function __construct($email, $resetUrl, $requestTime, $userAgent = null, $userIpAddress = null, $userDevice = null)
    {
        $this->email = $email;
        $this->resetUrl = $resetUrl;
        $this->requestTime = $requestTime;
        $this->userDevice = $userDevice;
        $this->userAgent = $userAgent;
        $this->userIpAddress = $userIpAddress;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '[' . env('APP_NAME', 'ZCODE') . '] RESET MẬT KHẨU ' . $this->email,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'email.forgot_password',
            with: [
                'email' => $this->email,
                'resetUrl' => $this->resetUrl,
                'requestTime' => $this->requestTime,
                'userDevice' => $this->userDevice,
                'userAgent' => $this->userAgent,
                'userIpAddress' => $this->userIpAddress,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
