# Portfolio

以 Next.js、Prisma、Supabase 建構嘅 AI 開支追蹤應用程式。專案進行中。

## 技術選型

| 類別 | 技術 |
|------|------|
| **框架** | Next.js 16 (Pages Router) |
| **UI** | React 19、Radix UI、Tailwind CSS 4 |
| **資料庫** | PostgreSQL (Supabase) |
| **ORM** | Prisma 7 |
| **國際化** | next-intl（en、zh、zh_HK） |
| **表單** | React Hook Form、Zod |
| **圖表** | Recharts |
| **圖示** | Lucide React、React Icons |
| **日期** | date-fns、dayjs、react-day-picker |
| **Toast** | Sonner |
| **建置** | React Compiler (Babel) |

## 功能

- 📄 開支管理（建立、列表、詳情、編輯、刪除）
- 📊 開支統計與圖表
- 🖼️ 收據檢視（圖片 + PDF）
- 📤 收據上傳
- 🌐 多語系：English、簡體中文、繁體中文（香港）
- 📱 響應式版面（手機與桌面）

## 快速開始

### 環境需求

- Node.js 18+
- PostgreSQL（或 Supabase 專案）
- pnpm / npm / yarn / bun


## 開發流程

> 專案尚未完成。以下為規劃嘅開發順序與步驟。

### 現況

- ✅ UI 基本完成，使用 `lib/api-stubs.ts` 作為 API 佔位
- ⏳ 尚未接駁真實 API、認證與權限

### 第一步：UI 測試

**目標**：確保喺冇真實 API 嘅情況下，UI 仍然正常運作。

- 撰寫 UI / 元件測試（例如 Jest + React Testing Library）
- 用 mock 或 stub 覆蓋 API 呼叫
- 覆蓋主要流程：開支列表、詳情、新增、編輯、刪除、統計圖表
- 確保無 API 時頁面唔會崩潰，錯誤處理合理

### 第二步：實作 API

**目標**：將 `api-stubs.ts` 換成真實 API 呼叫。

- 建立 Next.js API routes 或接駁後端服務
- 使用 Prisma 操作 PostgreSQL（Supabase）
- 實作開支 CRUD、統計、搜尋等 API
- 串接 Supabase Storage 處理收據圖片上傳

### 第三步：認證（Clerk）

**目標**：加入登入／註冊，保護需登入嘅頁面。

- 整合 [Clerk](https://clerk.com) 做 authentication
- 設定 middleware 或 HOC，保護 `/apps/ai-expense/*` 等路由
- 將目前嘅匿名操作改為與使用者綁定
- 更新 Prisma schema：例如加入 `User`、`userId` 關聯

### 第四步：角色權限（Role-based Access）

**目標**：限制非 admin 使用者，唔可以睇到所有開支。

- 在 Clerk 或 Prisma 中定義角色：`admin`、`user` 等
- Admin：可查看全部開支、管理全部資料
- 非 Admin：只可查看自己所建立嘅開支
- 在 API 與 UI 層一齊做權限檢查，避免越權存取

### 流程概覽

```
[第一步] UI 測試（mock API） → [第二步] 實作 API → [第三步] Clerk 認證 → [第四步] 角色權限
```

## 部署

推薦使用 [Vercel](https://vercel.com) 部署 Next.js。部署時需設定 `DATABASE_URL`，以及 Clerk、Supabase 等相關環境變數。

## License

Private.
