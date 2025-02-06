# Phát triển website bán mỹ phẩm làm đẹp ZBeauty

Được thực hiện bởi team 5 của ZBeauty với Dự án tốt nghiệp

## Authors

- [@Đinh Trọng Phúc](https://github.com/phuc1903)
- [@Trần Hữu Hiệp](https://github.com/HHiepz)
- [@Phạm Văn Hoàng](https://github.com/MarxVn09)
- [@Nguyễn Thanh Bình](https://github.com/nguyenthanhbinhps28654)
- [@Trần Nhất Đông](https://github.com/DongTran00)

## 🛠 Skills

Dự án được xây dựng bởi các công nghệ:

- **Laravel 10**: A PHP framework for building robust web applications.
- **NextJS**: A framework that allows you to create modern single-page applications (SPAs) using classic server-side routing and controllers.
- **TailwindCSS**: A utility-first CSS framework that enables fast styling of user interfaces with a highly customizable design system.

## Requirements

- Generated ssh key

- PHP min v.8.2

- DB server (Recommended:MySQL)

- [composer min v.2](https://getcomposer.org/download/)

- [nodejs min v.20](https://nodejs.org/en/download/prebuilt-installer)

## Run Locally

Clone the project

```bash
git clone git@github.com:phuc1903/datn.git
```

Go to the project directory

```bash
cd datn
```

## Run Backend

Go to the backend's directory

```bash
cd server
```

```bash
composer install
npm install
```

Add .env

```bash
cp .env.example .env
php artisan key:generate
```

Run Migrate

```bash
php artisan migrate --seed
```

Run the backend project

```bash
php artisan serve
```

```bash
npm run dev
```

## Run FrontEnd

Go to the frontend's directory

```bash
cd client
```

```bash
npm install
```

```bash
npm run dev
```
