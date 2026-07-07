# Iron Golem Math Adventure

<img width="1192" height="557" alt="Screenshot 2026-07-07 at 17 42 06" src="https://github.com/user-attachments/assets/e1837262-be9b-4c45-aaa2-2d286599a93c" />
<img width="1201" height="560" alt="Screenshot 2026-07-07 at 17 41 08" src="https://github.com/user-attachments/assets/7198cffc-2700-40c5-8f4f-d2c595e37fee" />
<img width="1194" height="558" alt="Screenshot 2026-07-07 at 17 42 47" src="https://github.com/user-attachments/assets/cf511842-7eda-4130-9162-4f38c056c6c7" />

Game giáo dục kết hợp giải trí (Edutainment) cho trẻ em. Điều khiển Iron Golem khám phá bản đồ 3D, gặp quái vật Minecraft và chiến đấu bằng cách giải phép toán cộng/trừ. Giao diện tiếng Việt, tối ưu chạm trên iPad và click trên PC — không dùng bàn phím.

## Công nghệ

| Thành phần | Công nghệ |
|------------|-----------|
| UI & state | React 18, TypeScript, Zustand |
| Đồ họa 3D | Three.js, React Three Fiber, Drei |
| Build | Vite 5 (`base: './'` — deploy static được) |
| Âm thanh | Web Audio API |

## Cách chạy

```bash
npm install
npm run dev
```

Mở `http://localhost:5173`.

Build production:

```bash
npm run build
npm run preview   # xem thử bản build
```

Deploy (ví dụ):

```bash
npm run build && scp -r dist/* chienkira.a1-flex-01:~/public/iron-golem-math-adventure/
```
