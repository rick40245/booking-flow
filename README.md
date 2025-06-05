# 預約系統 (Booking Flow)

一個現代化的線上預約系統，使用 Vue 3 + TypeScript + Element Plus 構建，提供完整的服務預約流程管理。

## ✨ 功能特色

### 🎯 核心功能
- **服務選擇**：瀏覽和選擇不同類型的服務項目
- **多人預約**：支援主要預約人 + 額外預約人的多人預約模式
- **智能排程**：根據服務人員和日期動態顯示可用時段
- **即時驗證**：完整的表單驗證，確保資料正確性
- **預約管理**：查看、編輯、刪除預約記錄

### 🔧 進階功能
- **狀態持久化**：使用 Pinia 進行狀態管理，支援頁面重新整理
- **路由守衛**：防止用戶意外離開導致資料遺失
- **響應式設計**：適配不同螢幕尺寸的設備
- **TypeScript 支援**：完整的類型定義，提升開發體驗
- **ESLint + Prettier**：程式碼品質保證

## 🛠 技術棧

- **前端框架**：Vue 3 (Composition API)
- **開發語言**：TypeScript
- **UI 框架**：Element Plus
- **狀態管理**：Pinia + 持久化插件
- **路由管理**：Vue Router 4
- **CSS 框架**：UnoCSS
- **建置工具**：Vite
- **測試框架**：Vitest
- **程式碼品質**：ESLint + Prettier

## 📁 專案結構

```
src/
├── components/          # 可重用組件
│   ├── ConfirmDialog.vue   # 確認對話框
│   └── PageContainer.vue  # 頁面容器
├── constants/           # 常數定義
│   └── booking.ts          # 預約相關常數
├── router/              # 路由配置
│   └── index.ts            # 路由定義
├── stores/              # Pinia 狀態管理
│   ├── bookingStore.ts     # 預約狀態
│   ├── servicesStore.ts    # 服務狀態
│   └── uiStore.ts          # UI 狀態
├── types/               # TypeScript 類型定義
│   ├── booking.ts          # 預約相關類型
│   └── form-validation.ts  # 表單驗證類型
├── utils/               # 工具函數
│   ├── date.ts             # 日期處理
│   └── validation.ts       # 表單驗證
├── views/               # 頁面組件
│   ├── PageServiceList.vue # 服務選擇頁面
│   ├── PageBookingForm.vue # 預約表單頁面
│   └── PageBookingSummary.vue # 預約摘要頁面
├── App.vue              # 根組件
└── main.ts              # 應用程式入口
```

## 🚀 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

啟動後訪問 [http://localhost:5173](http://localhost:5173)

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 🧪 測試與品質

### 運行單元測試

```bash
npm run test:unit
```

### 程式碼檢查

```bash
npm run lint
```

### 程式碼格式化

```bash
npm run format
```

### 類型檢查

```bash
npm run type-check
```

## 📱 使用流程

1. **選擇服務**：從服務列表中選擇需要的服務項目
2. **填寫資訊**：輸入預約人數、個人資訊、選擇服務人員
3. **選擇時間**：挑選合適的預約日期和時段
4. **確認預約**：檢查預約詳情並提交
5. **管理預約**：在摘要頁面查看、編輯或刪除預約

## 🎨 開發規範

### 程式碼風格
- 使用 TypeScript 進行開發
- 遵循 ESLint 和 Prettier 規範
- 採用 Composition API 風格
- 組件使用 `<script setup>` 語法

### 命名規範
- 組件：PascalCase (例：`PageContainer.vue`)
- 文件/目錄：kebab-case (例：`booking-form`)
- 變數/函數：camelCase (例：`isLoading`)
- 常數：UPPER_SNAKE_CASE (例：`MAX_PEOPLE`)
