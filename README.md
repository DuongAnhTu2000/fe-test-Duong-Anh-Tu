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

**Thống Kê Tổng Quan:**

- 4 thẻ thống kê (Ant Design Statistic + Card):
  - Tổng số task
  - Số task "To Do"
  - Số task "In Progress"
  - Số task "Done"

**Biểu Đồ Trạng Thái:**

- Thanh Progress hoặc biểu đồ thể hiện tỷ lệ công việc theo trạng thái
- Giúp người dùng nắm bắt nhanh tiến độ công việc

**Danh Sách Task Gần Đây:**

- Hiển thị 5 task được tạo gần nhất
- Dữ liệu lấy từ Redux selector

**Layout:**

- Sử dụng Tailwind grid để bố trí các phần tử
- Responsive design, thích hợp cho mọi kích thước màn hình

### 2.3 Trang Danh Sách Task

#### Bảng Danh Sách Task

**Cơ Chế Phân Trang:**

- Sử dụng Ant Design Table
- Mỗi trang hiển thị 10 items
- Hiển thị tổng số bản ghi

**Các Cột Hiển Thị:**

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

- Sắp xếp được theo: Tiêu đề, Hạn chót, Độ ưu tiên
- Hỗ trợ sắp xếp tăng dần (Ascend) và giảm dần (Descend)

#### Thêm Mới / Chỉnh Sửa (Modal Form)

**Mở Modal:**

- Nút "Thêm mới" ở đầu bảng → tạo task mới
- Nút Edit trên từng dòng → chỉnh sửa task

**Validation:**

- Sử dụng Ant Design Form rules
- Hiển thị lỗi rõ ràng dưới từng trường
- Submit button được disable khi form có lỗi

**Loading State:**

- Spinner trên nút OK khi thêm/sửa
- Đóng modal tự động sau 300ms khi thành công

#### Xoá Task

**Xoá Task Đơn:**

- Nút Delete trên từng dòng → hiện Confirm modal trước khi xoá
- Sau khi xoá → hiển thị thông báo "Đã xóa task"

**Xoá Hàng Loạt:**

- Hỗ trợ chọn nhiều dòng bằng checkbox
- Nút "Xóa đã chọn" hiển thị số lượng task được chọn
- Confirm modal trước khi xoá hàng loạt

**Loading State:**

- Spinner khi xoá, reset sau 300ms

#### Đổi Trạng Thái Nhanh

- Không cần mở Modal
- Thay đổi trạng thái ngay khi chọn từ dropdown

### 2.4 Tìm Kiếm và Lọc

#### Thanh Tìm Kiếm

- Nút tìm kiếm theo tiêu đề (title)
- Hỗ trợ clear dữ liệu

#### Các Bộ Lọc

**1. Lọc Trạng Thái:**

- Hỗ trợ chọn nhiều trạng thái cùng lúc
- Hỗ trợ clear lựa chọn

**2. Lọc Độ Ưu Tiên:**

- Hỗ trợ chọn nhiều mức độ ưu tiên
- Hỗ trợ clear lựa chọn

**3. Lọc Khoảng Hạn Chót:**

- DatePicker.RangePicker
- Chọn từ ngày đến ngày
- Định dạng DD/MM/YYYY

**4. Nút Reset:**

- Xoá toàn bộ bộ lọc
- Reset trang danh sách về trang 1
- Reset sắp xếp về mặc định

**Loading State:**

- Spinner hiển thị khi lọc/tìm kiếm
- Duration: 300ms

#### Architecture Filter

**Redux Selector:**

- Toàn bộ logic lọc nằm trong Redux selector (`selectFilteredTasks`)
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
