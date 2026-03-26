# Hướng dẫn Cập nhật Code lên Server

Tài liệu này hướng dẫn cách đẩy code từ môi trường local lên server và thực hiện các bước cập nhật cần thiết cho 3 thành phần của dự án: **Backend**, **Admin**, và **Subdomain**.


git pull;
cd backend;
composer install --no-dev;
php artisan migrate --force;
php artisan optimize:clear;
php artisan optimize;

cd ../admin;
npm run build;
cd ../subdomain;
npm run build;
pm2 restart all;

---

## 1. Tại máy Local (Máy đang phát triển)

Trước khi cập nhật lên server, bạn cần đẩy code mới nhất lên GitHub:

```bash
# Đứng tại thư mục gốc dự án: c:\OSPanel\home\bds-clickhome
git add .
git commit -m "Mô tả các thay đổi vừa thực hiện"
git push origin main
```

---

## 2. Tại Server (Máy chủ chạy dự án)

Truy cập vào server thông qua SSH, sau đó di chuyển vào thư mục dự án.

### A. Cập nhật Backend (Laravel)
Di chuyển vào thư mục `backend`:

```bash
cd backend
# 1. Kéo code mới nhất
git pull origin main

# 2. Cập nhật thư viện (nếu có thay đổi composer.json)
C:\OSPanel\modules\PHP-8.2\php.exe C:\OSPanel\modules\PHP-8.2\composer.phar install --no-dev

# 3. Chạy migration (cập nhật database)
C:\OSPanel\modules\PHP-8.2\php.exe artisan migrate --force

# 4. Xóa và làm mới cache
C:\OSPanel\modules\PHP-8.2\php.exe artisan optimize:clear
C:\OSPanel\modules\PHP-8.2\php.exe artisan optimize
```

### B. Cập nhật Admin (Next.js)
Di chuyển vào thư mục `admin`:

```bash
cd ../admin
# 1. Kéo code mới nhất
git pull origin main

# 2. Cập nhật thư viện
npm install

# 3. Build lại ứng dụng
npm run build

# 4. Restart ứng dụng (nếu dùng PM2)
pm2 restart all # hoặc pm2 restart admin
```

### C. Cập nhật Subdomain (Next.js)
Di chuyển vào thư mục `subdomain`:

```bash
cd ../subdomain
# 1. Kéo code mới nhất
git pull origin main

# 2. Cập nhật thư viện
npm install

# 3. Build lại ứng dụng
npm run build

# 4. Restart ứng dụng (nếu dùng PM2)
pm2 restart subdomain
```

---

## Một số lưu ý quan trọng:
- **Biến môi trường (.env)**: Nếu bạn có thêm biến mới trong file `.env` ở local, hãy nhớ cập nhật tương ứng vào file `.env` trên server.
- **Quyền hạn file (Permissions)**: Sau khi pull code, nếu gặp lỗi 500 trên backend, hãy kiểm tra quyền ghi cho thư mục `storage` và `bootstrap/cache`.
- **PHP Version**: Luôn đảm bảo sử dụng đường dẫn PHP 8.2 chính xác trên server (tương tự như cách dùng `C:\OSPanel\modules\PHP-8.2\php.exe`).

---
*Lưu ý: Nếu server của bạn cấu hình khác (như dùng Linux thay vì OSPanel trên Windows), hãy thay đổi đường dẫn `php.exe` và `composer` cho phù hợp.*
