<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Mật Khẩu</title>
    <style>
        * {margin: 0;padding: 0;box-sizing: border-box;}body {font-family: Arial, sans-serif;line-height: 1.6;background-color: #f4f4f4;margin: 0;padding: 0;}.email-container {max-width: 600px;margin: 20px auto;background: #ffffff;border-radius: 8px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);padding: 20px;}.header {text-align: center;padding: 20px 0;border-bottom: 2px solid #f0f0f0;}.logo {font-size: 24px;color: #333;font-weight: bold;}.content {padding: 30px 20px;color: #555;}.reset-button {display: inline-block;padding: 12px 30px;background-color: #007bff;color: #ffffff !important;text-decoration: none;border-radius: 5px;margin: 20px 0;font-weight: bold;text-align: center;}.reset-button:hover {background-color: #0056b3;}.info-box {background-color: #f8f9fa;border: 1px solid #e9ecef;border-radius: 5px;padding: 15px;margin: 20px 0;font-size: 14px;}.info-box h3 {color: #495057;margin-bottom: 10px;font-size: 16px;}.info-item {margin: 8px 0;color: #666;}.info-label {font-weight: bold;color: #495057;}.footer {text-align: center;padding-top: 20px;border-top: 2px solid #f0f0f0;color: #888;font-size: 14px;}.warning {margin-top: 20px;font-size: 13px;color: #666;padding: 15px;background-color: #fff4e5;border-radius: 5px;}@media only screen and (max-width: 600px) {.email-container {margin: 10px;width: auto;}.content {padding: 20px 15px;}.reset-button {display: block;text-align: center;}}
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">🔐 {{ env('APP_NAME') }}</div>
        </div>
        <div class="content">
            <h2>Xin chào,</h2>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
            
            <a href="{{ $resetUrl }}" class="reset-button">
                Đặt Lại Mật Khẩu
            </a>
            
            <p>Email này được gửi đến: <strong>{{ $email  }}</strong></p>

            <div class="info-box">
                <h3>Chi tiết yêu cầu đặt lại mật khẩu:</h3>
                <div class="info-item">
                    <span class="info-label">Thời gian yêu cầu:</span> 
                    <span>{{ $requestTime ?? 'Không có thông tin' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Thiết bị:</span> 
                    <span>{{ $userDevice ?? 'Không có thông tin' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Trình duyệt:</span> 
                    <span>{{ $userAgent ?? 'Không có thông tin' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Địa chỉ IP:</span> 
                    <span>{{ $userIpAddress ?? 'Không có thông tin' }}</span>
                </div>
            </div>
            
            <div class="warning">
                <p>⚠️ Nếu bạn không yêu cầu đặt lại mật khẩu hoặc không nhận ra thông tin trên, vui lòng:</p>
                <p>1. Bỏ qua email này</p>
                <p>2. Thay đổi mật khẩu ngay lập tức</p>
                <p>3. Liên hệ bộ phận hỗ trợ của chúng tôi</p>
                <p style="margin-top: 10px;">Liên kết đặt lại mật khẩu sẽ hết hạn sau 24 giờ.</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2024 ZZZ. All rights reserved.</p>
            <p>1234 HCMC, VN, EARTH</p>
            <p>Email: {{ env('MAIL_FROM_ADDRESS') }} | Hotline: (84) 123-456-789</p>
        </div>
    </div>
</body>
</html>