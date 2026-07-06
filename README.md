# Iron Golem Math Adventure

<img width="1190" height="749" alt="Screenshot 2026-07-07 at 0 55 37" src="https://github.com/user-attachments/assets/424c7ed5-5fa7-46d0-a662-8358d6535055" />


Game giáo dục kết hợp giải trí (Edutainment) cho trẻ em — điều khiển Iron Golem khám phá bản đồ, chiến đấu quái vật bằng cách giải phép toán cộng/trừ.

## Công nghệ

- **React** + **TypeScript** — UI & state
- **Three.js** + **React Three Fiber** — đồ họa 3D voxel
- **Zustand** — quản lý game state

## Cách chạy

```bash
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173` (tối ưu cho iPad và PC).

## Gameplay

1. **Chạm / click** vào bản đồ để Iron Golem di chuyển tới vị trí đó
2. **Chạm/click** vào quái vật để bắt đầu chiến đấu
3. Giải phép toán bằng **bảng số Numpad** (0–9)
4. Thắng để nhận xu — **100 xu = lên 1 cấp** (to hơn + trang bị mới)

## Quái vật

| Quái | Độ khó | Phép tính | Thưởng |
|------|--------|-----------|--------|
| Creeper | Dễ | < 30 | 20 xu |
| Bee | Dễ–TB | < 100 | 50 xu |
| Zombie | Trung bình | < 200 | 70 xu |
| Enderman | Khó | < 1000 | 100 xu |

## Build production

```bash
npm run build
npm run preview
```
