# app.kientrecm

Trang vỏ để cài **Kiến Trẻ CM** lên màn hình chính điện thoại (biểu tượng + tên riêng, mở toàn màn hình).
App thật chạy trên Google Apps Script, được nhúng trong khung của `index.html` — repo này không chứa dữ liệu hay mã máy chủ.

- Đổi biểu tượng: thay các file trong `icons/` (giữ đúng tên & kích thước: 512, 192, 180 = apple-touch-icon, 32).
- Đổi tên dưới biểu tượng: `manifest.webmanifest` (`name`, `short_name`) và thẻ `apple-mobile-web-app-title` trong `index.html`.
