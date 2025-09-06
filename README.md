# Mijia API Integration - Next.js

## Tổng quan

Dự án này đã được chuyển đổi hoàn toàn từ Python sang Next.js với TypeScript, tích hợp đầy đủ API Xiaomi Mijia để điều khiển thiết bị thông minh.

## Cấu trúc dự án

### Thư viện Mijia TypeScript (`src/lib/mijia/`)

- **`types.ts`** - Định nghĩa các interface và type cho Mijia API
- **`auth.ts`** - Xử lý đăng nhập (QR code và tài khoản/mật khẩu)
- **`api.ts`** - API chính để giao tiếp với Mijia services
- **`device.ts`** - Wrapper class để điều khiển thiết bị dễ dàng
- **`index.ts`** - Export tất cả modules

### API Routes (`src/app/api/`)

- **`/api/devices`** - Lấy danh sách thiết bị
- **`/api/devices/[id]`** - Cập nhật và điều khiển thiết bị
- **`/api/homes`** - Lấy danh sách nhà/phòng
- **`/api/scenes/[homeId]`** - Lấy danh sách kịch bản
- **`/api/scenes/[sceneId]/run`** - Thực thi kịch bản

## Tính năng chính

### 1. Đăng nhập
- **QR Code**: Quét mã QR bằng ứng dụng Mi Home
- **Tài khoản/Mật khẩu**: Đăng nhập trực tiếp với thông tin Mi Home

### 2. Quản lý thiết bị
- Xem danh sách thiết bị thực tế từ Mi Home
- Điều khiển thiết bị (bật/tắt, điều chỉnh độ sáng, màu sắc, v.v.)
- Cập nhật thuộc tính thiết bị real-time

### 3. Quản lý kịch bản
- Xem danh sách kịch bản từ Mi Home
- Thực thi kịch bản tự động
- Quản lý trạng thái kịch bản

### 4. Giao diện người dùng
- Sử dụng Shadcn UI và Tailwind CSS
- Responsive design
- Dark/Light mode support
- Real-time updates

## Cách sử dụng

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy ứng dụng
```bash
npm run dev
```

### 3. Truy cập ứng dụng
- Mở trình duyệt tại `http://localhost:3001`
- Đăng nhập bằng QR code hoặc tài khoản Mi Home
- Bắt đầu điều khiển thiết bị

## API Usage Examples

### Đăng nhập
```typescript
import { mijiaAuth } from '@/lib/mijia';

// Đăng nhập bằng tài khoản
const session = await mijiaAuth.login('username', 'password');

// Đăng nhập bằng QR
const session = await mijiaAuth.QRlogin();
```

### Điều khiển thiết bị
```typescript
import { mijiaAPI, createMijiaDevice } from '@/lib/mijia';

// Lấy danh sách thiết bị
const devices = await mijiaAPI.get_devices_list();

// Tạo device wrapper
const device = await createMijiaDeviceByName(mijiaAPI, 'Đèn phòng khách');

// Điều khiển thiết bị
await device.turnOn();
await device.setBrightness(80);
await device.setColor('#ff0000');
```

### Quản lý kịch bản
```typescript
// Lấy danh sách kịch bản
const scenes = await mijiaAPI.get_scenes_list('home_id');

// Thực thi kịch bản
await mijiaAPI.run_scene('scene_id');
```

## Cấu hình

### Environment Variables
Tạo file `.env.local`:
```env
# Mijia API Configuration
MIJIA_API_BASE_URL=https://api.io.mi.com/app
MIJIA_AUTH_BASE_URL=https://account.xiaomi.com

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Lưu ý quan trọng

1. **Bảo mật**: Không lưu trữ thông tin đăng nhập trong localStorage
2. **Rate Limiting**: API Mijia có giới hạn request, cần implement caching
3. **Error Handling**: Luôn xử lý lỗi khi gọi API
4. **Authentication**: Cần refresh token định kỳ

## Troubleshooting

### Lỗi đăng nhập
- Kiểm tra tài khoản Mi Home có hợp lệ
- Đảm bảo thiết bị có kết nối internet
- Thử đăng nhập bằng QR code thay vì tài khoản

### Lỗi điều khiển thiết bị
- Kiểm tra thiết bị có online không
- Đảm bảo thiết bị được kết nối với Mi Home
- Kiểm tra quyền truy cập thiết bị

### Lỗi API
- Kiểm tra kết nối internet
- Xem console log để debug
- Thử refresh trang

## Phát triển thêm

### Thêm loại thiết bị mới
1. Cập nhật interface trong `types.ts`
2. Thêm properties trong `device.ts`
3. Cập nhật UI components

### Thêm tính năng automation
1. Tạo scheduler service
2. Implement rule engine
3. Thêm UI để tạo rules

### Thêm notification
1. Tích hợp WebSocket cho real-time updates
2. Thêm push notification
3. Implement email alerts

## Liên hệ

- **Developer**: ScodeVN
- **Phone/Zalo**: 0582392345
- **GitHub**: https://github.com/scodevn2025/mijia-api

## License

GPL-3.0 License
