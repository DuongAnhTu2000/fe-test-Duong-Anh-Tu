# Task Board Application

Ứng dụng quản lý công việc (Task Management) được xây dựng với React, Redux Toolkit, TypeScript và Ant Design.

## 📋 Mục Lục

- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt](#cài-đặt)
- [Chạy Dự Án](#chạy-dự-án)
- [Các Tính Năng](#các-tính-năng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)

## 📦 Yêu Cầu Hệ Thống

- **Node.js**: v16.0.0 hoặc cao hơn
- **npm**: v7.0.0 hoặc cao hơn (hoặc yarn, pnpm)

## 🚀 Cài Đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd fe-test-Duong-Anh-Tu
```

### 2. Cài Đặt Dependencies

```bash
npm install
```

## 🏃 Chạy Dự Án

### Chế Độ Development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build cho Production

```bash
npm run build
```

### Preview Build Production

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## ✨ Các Tính Năng

### 2.2 Trang Dashboard

<img width="1124" height="1357" alt="image" src="https://github.com/user-attachments/assets/13b98c61-9f73-4b05-8c31-8b3e7c5f06e4" />

**Thống Kê Tổng Quan:**

<img width="1121" height="241" alt="image" src="https://github.com/user-attachments/assets/47335269-0f36-48fc-81a9-0a9bac294148" />

- 4 thẻ thống kê (Ant Design Statistic + Card):
  - Tổng số task
  - Số task "To Do"
  - Số task "In Progress"
  - Số task "Done"

**Biểu Đồ Trạng Thái:**

<img width="1123" height="226" alt="image" src="https://github.com/user-attachments/assets/a0c96905-8c9b-4b88-8770-7f397a6f8ca8" />

- Thanh Progress hoặc biểu đồ thể hiện tỷ lệ công việc theo trạng thái
- Giúp người dùng nắm bắt nhanh tiến độ công việc

**Danh Sách Task Gần Đây:**

<img width="1118" height="807" alt="image" src="https://github.com/user-attachments/assets/2b2312e6-9780-4b62-884f-721136660036" />

- Hiển thị 5 task được tạo gần nhất
- Dữ liệu lấy từ Redux selector

**Layout:**

Layout mobile:
<img width="593" height="1774" alt="image" src="https://github.com/user-attachments/assets/a2c100c1-c1f8-4c0e-b7d5-1c21b96da823" />

Layout desktop:
<img width="1794" height="1307" alt="image" src="https://github.com/user-attachments/assets/6e18baaf-de39-416f-b7fe-b6b29d8a89e3" />


- Sử dụng Tailwind grid để bố trí các phần tử
- Responsive design, thích hợp cho mọi kích thước màn hình

### 2.3 Trang Danh Sách Task

#### Bảng Danh Sách Task

<img width="1122" height="1038" alt="image" src="https://github.com/user-attachments/assets/bb9e81ff-a216-4b31-b61c-811d41893922" />


**Phân Trang:**

<img width="1050" height="903" alt="image" src="https://github.com/user-attachments/assets/4de43b47-73b8-4d15-a2f5-cfe1c4f50557" />

- Sử dụng Ant Design Table
- Mỗi trang hiển thị 10 items
- Hiển thị tổng số bản ghi

**Các Cột Hiển Thị:**

<img width="1046" height="894" alt="image" src="https://github.com/user-attachments/assets/aec2580b-e0f8-4059-a753-067dca7660b8" />

- **Tiêu Đề**: Tên của task
- **Trạng Thái**: Dùng Ant Design Tag
  - `todo` → màu mặc định
  - `in_progress` → processing (màu xanh dương)
  - `done` → success (màu xanh lá)
- **Độ Ưu Tiên**: Dùng Ant Design Tag
  - `high` → error (màu đỏ)
  - `medium` → warning (màu vàng)
  - `low` → success (màu xanh lá)
- **Người Được Giao**: Tên người được giao task
- **Hạn Chót**: Ngày hạn chót (định dạng DD/MM/YYYY)
- **Hành Động**: Nút Sửa và Xoá

**Sắp Xếp (Sorting):**

<img width="1043" height="841" alt="image" src="https://github.com/user-attachments/assets/0c695b85-56e6-4a56-91af-738a49b7fdba" />

- Sắp xếp được theo: Tiêu đề, Hạn chót, Độ ưu tiên
- Hỗ trợ sắp xếp tăng dần (Ascend) và giảm dần (Descend)

#### Thêm Mới / Chỉnh Sửa (Modal Form)

**Mở Modal:**

Thêm mới task:
<img width="722" height="769" alt="image" src="https://github.com/user-attachments/assets/10b0b9ea-e885-44f0-8da2-866ccb9d5b8b" />

Chỉnh sửa task:

<img width="722" height="767" alt="{D3E76486-E7A1-4068-9EF5-18183C9CB652}" src="https://github.com/user-attachments/assets/f760bee1-c10f-45b6-99ae-d1c96d386265" />


- Nút "Thêm mới" ở đầu bảng → tạo task mới
- Nút Edit trên từng dòng → chỉnh sửa task

**Validation:**

<img width="722" height="771" alt="{0BB7ED1C-AA7A-4F26-880E-EFC078D270C4}" src="https://github.com/user-attachments/assets/97c79074-d023-4526-bb55-96f85b124a8a" />

- Sử dụng Ant Design Form rules
- Hiển thị lỗi rõ ràng dưới từng trường
- Submit button được disable khi form có lỗi

**Loading State:**

- Spinner trên nút OK khi thêm/sửa
- Đóng modal tự động sau 300ms khi thành công

#### Xoá Task

**Xoá Task Đơn:**

<img width="418" height="157" alt="image" src="https://github.com/user-attachments/assets/9ebce9b3-f8f5-4bef-b5ff-906d99ca06c8" />

- Nút Delete trên từng dòng → hiện Confirm modal trước khi xoá
- Sau khi xoá → hiển thị thông báo "Đã xóa task"

**Xoá Hàng Loạt:**

<img width="1126" height="917" alt="image" src="https://github.com/user-attachments/assets/31eb5f6d-c340-49b5-b29a-e5d61e987c4d" />

- Hỗ trợ chọn nhiều dòng bằng checkbox
- Nút "Xóa đã chọn" hiển thị số lượng task được chọn
- Confirm modal trước khi xoá hàng loạt

**Loading State:**
<img width="1126" height="358" alt="{26D5CF45-57D5-4BFC-A5A4-7FED9E85C9CE}" src="https://github.com/user-attachments/assets/dc40235b-b4a0-4000-8b23-eab2878cb1ab" />

- Spinner khi xoá, reset sau 300ms

#### Đổi Trạng Thái Nhanh

<img width="844" height="226" alt="{41EE1692-D0A2-4BE6-8206-C5E2BBA8B18D}" src="https://github.com/user-attachments/assets/10bf79e6-f17b-4d84-bee0-2d7e2deac4d3" />

- Không cần mở Modal
- Thay đổi trạng thái ngay khi chọn từ dropdown

### 2.4 Tìm Kiếm và Lọc

<img width="1098" height="72" alt="image" src="https://github.com/user-attachments/assets/02a294fa-9c64-4268-9af2-9bad5f5ce4fc" />

#### Thanh Tìm Kiếm

<img width="1123" height="315" alt="{0AD1D94F-3617-4C1D-93F5-3C9D1B4DE86B}" src="https://github.com/user-attachments/assets/5bb96d20-9728-4471-b870-0b2d81e89bbc" />

- Nút tìm kiếm theo tiêu đề (title)
- Hỗ trợ clear dữ liệu

#### Các Bộ Lọc

**1. Lọc Trạng Thái:**

<img width="268" height="139" alt="{CF73AAB7-B069-4526-869C-48358F6F7357}" src="https://github.com/user-attachments/assets/dec445af-3e2a-47ee-911f-0445525b022c" />

- Hỗ trợ chọn nhiều trạng thái cùng lúc
- Hỗ trợ clear tất cả lựa chọn

**2. Lọc Độ Ưu Tiên:**

<img width="157" height="144" alt="{00FA1621-15FC-4EA2-B205-D64502EFBA88}" src="https://github.com/user-attachments/assets/fa82f691-fc35-4735-96b7-e329af885152" />

- Hỗ trợ chọn nhiều mức độ ưu tiên
- Hỗ trợ clear tất cả lựa chọn

**3. Lọc Khoảng Hạn Chót:**

<img width="574" height="313" alt="{EC87CD56-DD53-4BFF-A0CD-7D51287A0DA5}" src="https://github.com/user-attachments/assets/2ab9ac7c-70ef-4017-9d55-f87a633e4ae8" />

- DatePicker.RangePicker
- Chọn từ ngày đến ngày
- Định dạng DD/MM/YYYY

**4. Nút Reset:**

- Xoá toàn bộ bộ lọc
- Reset trang danh sách về trang 1
- Reset sắp xếp về mặc định

**Loading State:**

<img width="1090" height="699" alt="{4794A7AC-9CB9-4A75-9A3C-1528DC179BF2}" src="https://github.com/user-attachments/assets/16766a1c-2c15-41e6-9a7e-f3964783047d" />

- Spinner hiển thị khi lọc/tìm kiếm
- Duration: 300ms

#### Architecture Filter

**Redux Selector:**

- Toàn bộ logic lọc nằm trong Redux selector
- Tăng performance và tái sử dụng logic

## 📁 Cấu Trúc Dự Án

```
src/
├── component/
│   └── modal.tsx                 # Modal form thêm/sửa task
├── data/
│   └── tasks.ts                  # Mock data
├── features/
│   ├── dashboard/
│   │   └── dashboard.tsx         # Trang dashboard
│   └── tasks/
│       └── listTasks.tsx         # Trang danh sách task
├── layout/
│   └── layout.tsx                # Layout chính
├── store/
│   ├── hooks.ts                  # Redux hooks
│   ├── store.ts                  # Redux store configuration
│   ├── selector/
│   │   └── tasksSelectors.ts    # Redux selectors
│   └── slices/
│       └── taskSlice.ts          # Redux slice (reducers, actions)
├── types/
│   └── task.ts                   # Type definitions
├── utils/
├── App.tsx                       # Main App component
├── App.css
├── index.css                     # Tailwind CSS imports
├── main.tsx                      # Entry point
└── vite-env.d.ts
```

## 🛠 Công Nghệ Sử Dụng

### Frontend Framework & Library

- **React** 18.x - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool và dev server
- **Redux Toolkit** - State management
- **React-Redux** - Redux bindings for React

### UI Components & Styling

- **Ant Design (antd)** - Component library
- **Tailwind CSS** - Utility-first CSS framework

## 📝 Ghi Chú

### Local Storage

- Tất cả dữ liệu task được lưu vào `localStorage` với key `taskboard.items`
- Khi reload page, dữ liệu vẫn được bảo toàn

### Redux Persist

- Sử dụng `localStorage` để persist task data
- Khi app khởi động, kiểm tra `localStorage` trước, nếu không có data thì dùng mock data

### Performance Optimization

- Sử dụng Redux selector (`createSelector`) để memoize dữ liệu
- Sử dụng `useCallback` để tránh tạo hàm gọi lại không cần thiết
- Sử dụng `useMemo` để tính toán dữ liệu phân trang, sắp xếp

### Debounce Search & Filter

- Tìm kiếm được debounce 300ms
- Lọc được debounce 300ms
- Loading spin hiển thị trong khoảng thời gian chờ

### Build Errors

Nếu gặp lỗi khi build:

```bash
# Clear node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Build lại dự án
npm run build
```
