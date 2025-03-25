<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
<div class="email-layout">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="backgroundTable main-temp my-5"
        style="background-color: #d5d5d5;">
        <tbody>
            <tr>
                <td>
                    <table width="600" align="center" cellpadding="15" cellspacing="0" border="0" class="devicewidth"
                        style="background-color: #ffffff;">
                        <tbody>
                            <!-- Start header Section -->
                            <tr>
                                <td style="padding-top: 30px;">
                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0"
                                        class="devicewidthinner"
                                        style="border-bottom: 1px solid #eeeeee; text-align: center;">
                                        <tbody>
                                            <tr>
                                                <td style="padding-bottom: 10px;">
                                                    <a href="{{ config('app.frontend_url')}}">
                                                        <!-- Nhúng logo vào layout email qua cid -->
                                                        <img style="height: 200px;" src="cid:logo.png" alt="Logo ZBeauty" />
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                    {{ config('app.name')}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                   Việt Nam
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                    Phone: 377 461 482 | Email: zbeauty@example.com
                                                </td>
                                            </tr>
                                            <tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <div class="content">
                                @yield('content')
                            </div>
                            <tr>
                                <td colspan="2"
                                    style="width: 100%; text-align: center; font-style: italic; font-size: 13px; font-weight: 600; color: #666666; padding: 15px 0; border-top: 1px solid #eeeeee;">
                                    <b style="font-size: 14px;">Copyright © ZBeaut</b>
                                </td>
                            </tr>
                            <!-- End payment method Section -->
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</div>

</body>

</html>
