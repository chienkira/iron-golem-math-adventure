# Tài liệu yêu cầu — Người Sắt: Phiêu Lưu Học Tập

## 1. Tổng quan

| Hạng mục | Mô tả |
|----------|--------|
| **Thể loại** | Edutainment — khám phá + chiến đấu turn-based bằng toán cộng/trừ |
| **Đối tượng** | Trẻ em; UI to, rõ, tiếng Việt |
| **Nền tảng** | Web (iPad touch, PC click) |
| **Công nghệ** | React + TypeScript + Zustand + Three.js (R3F) + Vite |
| **Điều khiển** | Chỉ chạm/click qua UI — **không** dùng bàn phím hệ thống |

## 2. Cốt lõi gameplay

### Góc nhìn & nhân vật

- Camera top-down hơi nghiêng trên bản đồ explore; zoom *Gần* / *Toàn bản đồ*.
- Nhân vật chính: **Iron Golem** voxel (Minecraft-style), có animation đi bộ.
- **Lên cấp:** mỗi 100 xu trong cấp → +1 level; Golem scale lớn hơn và nhận trang bị theo cấp (mũ, vai, giáp, kiếm, vương miện…).

### Vòng lặp chính

```
Menu → Khám phá → (gặp quái) → VS Intro → Combat → Victory/Level-up → Khám phá
```

### Trạng thái game (`GamePhase`)

| Phase | Mô tả |
|-------|--------|
| `menu` | Màn hình bắt đầu |
| `explore` | Di chuyển trên map, tương tác quái |
| `vs-intro` | Hoạt cảnh VS (~3.2s) |
| `combat` | Giải toán, Numpad |
| `victory` | Animation thắng, hiện thưởng |
| `level-up` | Thông báo lên cấp rồi về explore |

## 3. Hệ thống quái vật

Quái spawn ngẫu nhiên trên map. Mỗi loại có **giới hạn số lớn nhất** trong phép cộng/trừ và **phần thưởng xu** riêng. Kích thước & màu voxel gợi nhớ Minecraft.

| Quái | Tên hiển thị | Nhãn độ khó | Max phép tính | Thưởng | Ghi chú hình ảnh |
|------|--------------|-------------|---------------|--------|------------------|
| **Creeper** | Creeper | Dễ | 30 | 20 xu | Xanh lá, mặt creeper, 4 chân |
| **Bee** | Ong Vàng | Trung bình | 100 | 30 xu | Vàng/sọc đen, cánh, bay lơ lửng |
| **Zombie** | Thây Ma | Khó | 200 | 50 xu | Mặt/tay xanh lá, áo xanh dương, quần tím |
| **Enderman** | Enderman | Khó | 300 | 70 xu | Thân đen ngắn, chân/tay mảnh dài, mắt tím |
| **Ghast** | Ghast | Rất khó | 1000 | 100 xu | Khối trắng xám, mặt khóc, 9 xúc tu, bay |

**Nguồn cấu hình:** `src/types/game.ts` → `MONSTER_CONFIGS`

**Spawn:** ~20 quái ban đầu; sau mỗi trận thắng nếu còn `< 14` quái thì spawn thêm 1 con ngẫu nhiên.

## 4. Trải nghiệm chiến đấu

### 4.1 Màn VS (`vs-intro`)

- Map explore vẫn hiển thị phía sau, phủ overlay xám mờ.
- Iron Golem (trái) vs quái (phải); chữ **VS** animation giữa màn.
- Tên người chơi / quái cùng hàng với VS (không hiển thị nhãn độ khó).
- Quái trên map **dừng di chuyển** trong các phase chiến đấu.

### 4.2 Combat (`combat`)

- Arena riêng: nền cỏ tối, **2 đuốc Minecraft** trước mỗi bên, bầu trời bão (mây thấp, sét).
- Hai nhân vật đặt xa hai bên trái/phải; camera zoom vào.
- **Không** hiển thị tên trên đầu nhân vật trong combat.
- Giữa màn: phép toán lớn (`a + b = ?` hoặc trừ).
- Dưới cùng: **Numpad** 0–9, Xóa, ✓; nút Thoát combat.
- Trả lời sai: rung câu hỏi, xóa đáp án (không thoát combat).
- Trả lời đúng: chuyển `victory` hoặc `level-up`.

### 4.3 Kết thúc trận

- Golem tấn công; quái nổ/t thu nhỏ rồi biến mất (một lần).
- Banner thưởng `+X xu` (sau ~450ms).
- Tự quay explore sau `VICTORY_DISPLAY_MS` (**3.5 giây** — `src/components/ui/CombatUI.tsx`).

## 5. Khám phá & UI

| Thành phần | Mô tả |
|------------|--------|
| **HUD** | Cấp hiện tại + thanh tiến độ xu trong cấp (`coinsInLevel / 100`) |
| **Nhãn quái** | Hiển thị `{reward} xu` phía trên đầu quái trên map |
| **Move hint** | Gợi ý chạm map / chạm quái |
| **Zoom** | Chuyển camera gần ↔ toàn map |
| **Âm thanh** | BGM explore / combat / VS; hiệu ứng digit, đúng/sai, UI; nút mute |

## 6. Đồ họa & môi trường

- **Art style:** Voxel Minecraft — màu đặc trưng từng quái, không cần texture chi tiết.
- **Map explore:** cỏ, cây, nước, dung nham, mây; quái **lang thang** (`WanderGroup`), ong/ghast bay.
- **Combat arena:** sky + ground + đuốc; sương mù/ánh sáng đã chỉnh sáng hơn bản đầu.
- **VFX:** sét combat, explosion khi thắng, flash VS.

## 7. Chế độ Tập đọc

- Menu có toggle **Toán | Tập đọc**; progress level/xu dùng chung.
- Vòng lặp explore → VS → combat giữ nguyên; combat thay numpad bằng:
  - **MCQ vần** (Creeper dễ, Bee khó hơn): 4 lựa chọn, chạm chọn + ✓
  - **Word bank** (Zombie: điền 1 từ; Enderman/Ghast: ghép câu): chạm từ, Xóa/✓
- Nội dung đọc trong `src/content/reading/*.json`; sinh thêm bằng `npm run gen:reading-content` (cần `GEMINI_API_KEY` trong `.env.local`, chỉ chạy lúc dev).
