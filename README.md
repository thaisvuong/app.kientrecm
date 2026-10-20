# Tên miền riêng — https://kientre-internal.click

Từ bản 1.26 **app chạy thẳng trên tên miền** (GitHub Pages), không còn mở trong khung Apps Script:
- `index.html` / `404.html` là **chính giao diện app**, dựng từ `src/` bằng `node tools/build-static.js` (đừng sửa tay — sửa `src/` rồi dựng lại).
  Mọi lệnh gọi máy chủ đi bằng `fetch` POST vào link /exec (`doPost` → `api()` trong `Code.gs`: cùng mã phiên, cùng kiểm quyền).
- `sw.js`: lần mở sau lấy giao diện **ngay từ máy** (bản mới tải ngầm cho lần sau) + thông báo đẩy.
- `share.html`: link tạm `/s/<mã>` — từ 1.31 là trang xem chạy thẳng trên tên miền (dựng từ `src/Share.html`, gọi `shareOpen · shareFile` bằng fetch): ai có link là xem được, không cần tài khoản.
- Đường dẫn tiếng Anh: `/tasks`, `/tasks/plan`, `/tasks/item/<mã>`, `/file/<mã>`, `/library/…`, `/dashboard`… (bảng đổi ở `tools/static/head.js`).
- Nguồn: `tools/static/` (head.js · runtime.js · share.html · sw.js · push.css). Bản trang vỏ cũ (mở app trong khung): `tools/static/frame-shell.html`.
- **Deploy**: `tools/deploy.sh` đẩy Apps Script rồi gọi `tools/publish-domain.sh` (dựng + đẩy lên repo `thaisvuong/app.kientrecm`, giữ ở `webapp/.pages`).
- **Đăng nhập Google** trên tên miền: trong Google Cloud Console › Credentials › OAuth Client ID đang dùng (Cài đặt › Chung), thêm
  `https://kientre-internal.click` vào *Authorized JavaScript origins*. Chưa thêm thì vẫn đăng nhập bằng mã email.

## 1. Đưa thư mục này lên GitHub Pages

Dùng lại repo trang vỏ đang chạy (`thaisvuong/app.kientrecm`):
1. ✅ (17-10-2026, commit `fb351b5`) Đã đưa trang vỏ mới lên repo — **trừ tệp `CNAME`**, vì DNS ở Mắt Bão chưa có bản ghi: gắn tên miền lúc này thì link
   github.io cũ tự chuyển sang một địa chỉ chưa mở được.
2. ✅ (17-10-2026) DNS đã ra 4 địa chỉ GitHub → đã thêm tệp `CNAME` vào repo (tương đương Repo › **Settings › Pages** › **Custom domain**).
3. Đợi GitHub cấp chứng chỉ (vài phút – 1 giờ), rồi tick **Enforce HTTPS**.

Khi repo có tên miền riêng, link cũ `thaisvuong.github.io/app.kientrecm/…` **tự chuyển** sang `kientre-internal.click/…`.

## 2. Gửi cho người quản lý tên miền (Mắt Bão)

> Tên miền: **kientre-internal.click** · Giữ Name Server mặc định của Mắt Bão (ns1/ns2.matbao.com).
> Vào **Bản ghi DNS › Tạo bản ghi**, thêm:
>
> | Host | Loại | Giá trị | TTL |
> |---|---|---|---|
> | `@` | A | `185.199.108.153` | 3600 |
> | `@` | A | `185.199.109.153` | 3600 |
> | `@` | A | `185.199.110.153` | 3600 |
> | `@` | A | `185.199.111.153` | 3600 |
> | `www` | CNAME | `thaisvuong.github.io.` | 3600 |
>
> (Không bắt buộc, cho mạng IPv6: `@` AAAA `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.)
> Không xoá bản ghi NS đang có. Nếu đã có bản ghi A / CNAME khác cho `@` hoặc `www` (VD trỏ về hosting mặc định của Mắt Bão) thì **xoá** chúng.

Dấu **!** đỏ cạnh tên miền ở trang quản lý Mắt Bão thường là nhắc **xác thực thông tin chủ thể tên miền**. Cần làm xong, nếu không tên miền
có thể bị tạm ngưng phân giải (DNS đúng mà vẫn không mở được).

Kiểm tra sau 5 phút – vài giờ:
```
dig kientre-internal.click +short
```
phải ra đủ 4 địa chỉ `185.199.10x.153`.

## 3. Sau khi tên miền chạy

- Gửi mọi người `https://kientre-internal.click/`. Trên điện thoại: mở bằng Safari / Chrome › Chia sẻ › **Thêm vào MH chính** → biểu tượng cánh diều, tên “Kiến Trẻ”.
- Đây là địa chỉ mới với trình duyệt: mỗi người **đăng nhập lại một lần**, **bật lại thông báo** (Cài đặt › Thông báo), và nên xoá biểu tượng cũ trên màn hình chính rồi thêm biểu tượng mới.
- App đã nhận trang vỏ trên tên miền này (`CFG.SHELL_ORIGINS` trong `src/Code.gs`).

## Đổi link /exec

Link /exec nằm trong `index.html` (biến `APP`) và `sw.js`. Deploy bằng `tools/deploy.sh` giữ nguyên link → không phải sửa.
