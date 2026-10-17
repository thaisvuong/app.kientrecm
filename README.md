# Tên miền riêng — kientre-internal.click

Apps Script không gắn thẳng được tên miền riêng. Tên miền trỏ tới một **trang vỏ** tĩnh (thư mục này) chạy trên **GitHub Pages**.
Trang vỏ mở web app trong khung toàn màn hình, giữ hộ phiên đăng nhập, nhận thông báo đẩy, và cho **thêm vào màn hình chính có logo** (manifest + icons).
Đây chính là trang vỏ đang chạy ở `thaisvuong.github.io/app.kientrecm`, chỉ đổi tên thành “Kiến Trẻ” và gửi kèm `?so=&su=` để app biết đang chạy dưới tên miền mới.

| Tệp | Vai trò |
|---|---|
| `index.html` | trang vỏ: khung app, giữ mã đăng nhập, vùng an toàn iPhone, hỏi bật thông báo |
| `sw.js` | service worker nhận thông báo đẩy |
| `manifest.webmanifest`, `icons/` | tên + logo khi “Thêm vào màn hình chính” |
| `CNAME` | `kientre-internal.click` — GitHub Pages đọc tệp này để gắn tên miền |
| `404.html` | link sai đường dẫn → về trang chính (giữ `?page=`) |
| `task/index.html` | link cũ `/task/` → `/?page=tasks` |

`https://kientre-internal.click/?page=tasks` mở thẳng Kiến Task; `?page=file/<mã>` mở thẳng một tài liệu.

## 1. Đưa thư mục này lên GitHub Pages

Dùng lại repo trang vỏ đang chạy (`thaisvuong/app.kientrecm`):
1. ✅ (17-10-2026, commit `fb351b5`) Đã đưa trang vỏ mới lên repo — **trừ tệp `CNAME`**, vì DNS ở Mắt Bão chưa có bản ghi: gắn tên miền lúc này thì link
   github.io cũ tự chuyển sang một địa chỉ chưa mở được.
2. Khi `dig kientre-internal.click +short` đã ra 4 địa chỉ ở bước 2: thêm tệp `CNAME` vào repo (hoặc Repo › **Settings › Pages** › **Custom domain** =
   `kientre-internal.click` › Save).
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
