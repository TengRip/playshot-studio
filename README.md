# PlayShot Studio

**Android／iOS 商店截圖一鍵生成工具**

純前端靜態網頁，無需後端、無需安裝，瀏覽器直接使用。

**線上版本：** https://playshotstudio.maxteng.org

---

## 功能總覽

### 裝置規格支援

依「平台」切換鈕分兩組，切換後預覽卡片、AI 生成、ZIP 匯出皆自動連動：

**Android（Google Play）**

| 裝置 | 直式解析度 | 橫式解析度 |
|------|-----------|-----------|
| 手機 (Phone) | 1080 × 2280 | 2280 × 1080 |
| 7 吋平板 (7" Tablet) | 1200 × 1920 | 1920 × 1200 |
| 10 吋平板 (10" Tablet) | 1600 × 2560 | 2560 × 1600 |
| 主視覺橫幅 (Feature Graphic) | 1024 × 500 | 1024 × 500 |

**iOS（App Store，Apple 現行規定只需最大尺寸一種，其餘機型自動縮放）**

| 裝置 | 直式解析度 | 橫式解析度 |
|------|-----------|-----------|
| iPhone (6.9") | 1320 × 2868 | 2868 × 1320 |
| iPad (13") | 2064 × 2752 | 2752 × 2064 |

### 排版與設計

- **畫布方向**：直式 / 橫式切換
- **排版樣式**：上下加註（垂直居中）/ 左側加註 / 右側加註
- **截圖適配**：Contain（完整包含）/ Cover（填滿）/ Stretch（拉伸）
- **手機外框**：可開關顯示

### 背景設計

- **背景類型**：漸層色（含 6 組預設色票）/ 單色 / 自訂背景圖
- **背景裝飾圖案**（共 9 種）：
  - 霓虹光暈 (Mesh Blobs)
  - 科技網格 (Cyber Grid)
  - 斜紋線條 (Stripes)
  - 抽象波浪 (Layered Waves)
  - 科技點矩陣 (Dotted Matrix)
  - 放射向心圓 (Radial Rings)
  - 星座幾何網格 (Constellation Network)
  - 工作室對角光束 (Spotlight Beam)
  - 霓虹背光源 (Backing Glow)

### 文字設定（上方 / 下方各自獨立）

- 文字內容輸入
- 字型選擇：Noto Sans TC（繁中）/ Inter / Outfit
- 字級、行高、邊距調整
- 文字顏色選取
- 文字陰影開關

### 多語系支援

- 支援語言：繁體中文、English、日本語、한국어
- 一鍵自動翻譯（呼叫翻譯 API）
- 右側對照編輯器，翻譯後可直接手動修改，畫布即時更新

### 匯出

- **單張下載**：每個裝置卡片右上角的下載按鈕
- **批次 ZIP 匯出**：一鍵導出所有規格 × 所有語言的圖片

---

## 技術架構

| 項目 | 說明 |
|------|------|
| 語言 | 純 HTML + CSS + JavaScript（無框架） |
| 圖片渲染 | HTML5 Canvas API |
| ZIP 打包 | JSZip 3.10.1 |
| 圖示 | Lucide Icons（CDN） |
| 字型 | Google Fonts（Inter / Noto Sans TC/JP/KR / Outfit） |
| 部署 | Vercel（靜態站） |

---

## 本地開發

直接開啟 `index.html` 即可，或啟動簡易 HTTP Server：

```bash
cd "d:\Gemini Antigravity Project\playshot-studio"
python -m http.server 8000
# 開啟 http://localhost:8000
```

---

## 部署更新

```bash
cd "d:\Gemini Antigravity Project\playshot-studio"
vercel --prod
```

---

## 檔案結構

```
playshot-studio/
├── playshot-studio.html   # 主頁面與所有 UI 元件
├── styles.css             # 全域樣式與 CSS 變數系統
├── app.js                 # 核心邏輯（Canvas 渲染、狀態管理、匯出）
├── ads-config.js          # AdSense 客戶 ID／廣告版位設定（安全預設，未填不啟用）
├── ads.js                 # 讀取 ads-config.js 並插入廣告標籤
├── ads.txt                # AdSense 收益驗證用
├── robots.txt             # 搜尋引擎爬蟲規則
└── README.md              # 本文件
```

---

## 待改進事項

> 以下為開發過程中記錄的改進方向，後續修改時請在此更新。

### UI / 操作體驗

- [ ] **預設值重設按鈕**：新增一鍵「恢復預設設定」，避免調亂後找不回來
- [ ] **設定存檔 / 讀取**：將目前狀態儲存為 JSON，下次開啟可還原（localStorage 或下載檔案）
- [x] **縮圖即時預覽速度**：改用 `requestAnimationFrame` 合併同一畫面內的多次重繪呼叫，拖曳滑桿/文字時不再每次事件都重繪 4 張全解析度 Canvas

### 功能擴充

- [x] **App Store 規格支援**：新增 iOS App Store 所需尺寸（iPhone 6.9"、iPad 13"），見 v2.4
- [ ] **Logo 浮水印**：支援在畫面角落放置 App icon 或品牌 Logo
- [ ] **文字對齊方式**：目前固定居中，可新增左對齊 / 右對齊選項
- [ ] **多語言自動翻譯 API key**：目前翻譯功能若失效，需確認 API 串接是否正常
- [ ] **更多字型**：增加英文手寫體或日文明朝體選項

### 背景裝飾

- [ ] **裝飾圖案顏色控制**：目前裝飾圖案顏色由背景色自動衍生，未來可讓使用者自訂裝飾線條的不透明度或顏色

### 技術負債

- [ ] `index.html` 內 `<script src="app.js?v=3">` 的版本號為手動管理，部署時記得更新（目前 Vercel 會自動快取破除，影響不大）
- [ ] CSS 與 JS 未做 minify，若效能有需求可加入簡單的 build 流程

---

## 版本紀錄

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0 | 2026-05 | 初版：手機 + 平板三規格、漸層背景、雙行文字、多語系翻譯、ZIP 批次匯出 |
| v1.1 | 2026-05 | 新增 4 種背景類型（Mesh / Grid / Stripes / Waves）+ 背景圖上傳 + 橫式支援 |
| v1.2 | 2026-06-01 | 新增 5 種背景裝飾（Dots / Rings / Network / Spotlight / Glow）；佈署至 Vercel |
| v2.0 | 2026-06-07 | 介面大改版：Tab 分頁側欄、亮色主題、翻譯功能移入 Tab、AI Prompt 清空鍵 |
| v2.1 | 2026-06-12 | **Bug fix**：修復「🌐 全語言」預覽模式未顯示四種語言的問題（`app.js` `renderAllLangText` / `calcAllLangTextHeight` 加入 ZH fallback，確保未翻譯語系也能佔位顯示） |
| v2.2 | 2026-08-26 | **品牌重新設計＋廣告 scaffold**：全站主色從 indigo/purple（#6366f1）換成 orange/rose（#F97316/#F43F5E），跟 RoadGuard／SlimDrop／Living Portrait 區隔出獨立識別，只換 UI chrome 顏色，畫布內容用的漸層色選項不動；新增 `ads-config.js`/`ads.js`，比照 SlimDrop 的安全預設模式，沒填 AdSense 客戶 ID 完全不會插入廣告或佔版面。 |
| v2.3 | 2026-08-26 | **接自訂網域＋SEO/GA4**：接上 `playshotstudio.maxteng.org`（原 `playshot-studio.vercel.app`），新增 SEO meta／OG／Twitter 標籤、`ads.txt`、`robots.txt`，GA4 資源「PlayShot Studio」（Measurement ID `G-EE3EHJ0DK3`），Search Console 已用 HTML 標記驗證擁有權並要求建立索引。 |
| v2.4 | 2026-08-26 | **新增 iOS App Store 尺寸支援＋平台切換**：`DEVICE_SPECS` 新增 iPhone（1320×2868）／iPad（2064×2752），新增「平台」切換鈕（Android/iOS），切換後預覽卡片、解析度標籤、AI 生成、ZIP 匯出、裝置外框樣式（iPhone 用瀏海、iPad 用平板圓點鏡頭）全部連動；iOS 無 Feature Graphic 概念，切 iOS 時該卡片與其 AI prompt 欄位自動隱藏；混合模式在 iOS 對應改為「iPhone 上傳＋iPad AI 生成」；`state.platform` 存入 localStorage，重新整理保留選擇。網站標題／meta／header 文案同步改為 Android + iOS 並列，不再寫死 Google Play。修正一個 TDZ bug（`CANVAS_BY_DEVICE` 宣告在 `init()` 呼叫之後導致 `ReferenceError`）。 |
| v2.5 | 2026-08-26 | **混合模式說明文字改白話**：原文案「iPhone 格使用上傳截圖，iPad 格由 AI 生成」使用者反映看不懂，改成完整句子說明「哪張圖是你上傳的、哪張是 AI 生成的」及其原因。 |
