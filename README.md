
# 🧧 Xổ Số Kim Tiền - Tài Lộc Gõ Cửa

Ứng dụng tra cứu kết quả xổ số 3 miền (Bắc - Trung - Nam) nhanh nhất, tích hợp công nghệ AI để dự đoán và phân tích con số may mắn.

## ✨ Tính năng nổi bật

- **Kết quả trực tiếp:** Cập nhật kết quả xổ số 3 miền theo thời gian thực.
- **Quay thử đa đài:** Giả lập lồng cầu quay số cho tất cả các tỉnh thành trong ngày.
- **Soi cầu AI:** Trợ lý ảo sử dụng Gemini API để phân tích xác suất và gợi ý cặp số đẹp.
- **Phong thủy cải vận:** Xin quẻ may mắn dựa trên ngày sinh và thuật số học.
- **Bảng thảo luận:** Cộng đồng giao lưu, chia sẻ kinh nghiệm soi cầu giữa các thành viên.

## 🚀 Tự động hóa CI/CD với Codemagic

Ứng dụng đã được cấu hình sẵn tệp `codemagic.yaml`. Để kích hoạt thành công:

1. Đăng nhập vào [Codemagic.io](https://codemagic.io/).
2. Kết nối với Repository GitHub của bạn.
3. Trong phần **Environment Variables**:
   - Tạo một **Variable group** tên là `api_keys`.
   - Thêm biến `API_KEY` với giá trị là khóa Gemini API của bạn.
   - Chọn group này trong cài đặt Workflow.
4. Nhấn **Start New Build**. Hệ thống sẽ tự động build và thông báo qua email khi hoàn thành.

## 🛠 Hướng dẫn cài đặt thủ công

1. **Khởi tạo repository:**
   ```bash
   git init
   git add .
   git commit -m "Fix: Update codemagic config"
   ```

2. **Đẩy code lên GitHub:**
   ```bash
   git push origin main
   ```

## 🛠 Công nghệ sử dụng

- **Frontend:** React 19, Tailwind CSS.
- **AI Engine:** Google Gemini SDK (`@google/genai`).
- **CI/CD:** Codemagic.

## 📞 Liên hệ
Hotline hỗ trợ: **0927.099.940** (Tony Hoài Vũ)

---
*Lưu ý: Ứng dụng này chỉ mang tính chất tham khảo và giải trí.*
