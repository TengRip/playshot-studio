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
- **文字對齊**：自動（依排版樣式）/ 靠左 / 置中 / 靠右
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
- 一鍵自動翻譯：有填 OpenAI API Key 時用 gpt-4o-mini 翻譯；沒填則依序改用 Google 翻譯免費線路 → MyMemory（免費線路常被限流，品質與穩定度較差）
- 「翻譯」分頁對照編輯器，翻譯後可直接手動修改，畫布即時更新

### AI 生圖（混合模式 / 全 AI 模式）

- 使用 OpenAI `gpt-image-2`，帳號沒有權限時自動改用 `gpt-image-2.5-flare`（`app.js` 的 `IMAGE_MODELS`）
- 舊的 `dall-e-3` 已於 2026-05-12 被 OpenAI 下架
- 生圖尺寸依各裝置實際長寬比換算（總像素約 200 萬，長寬為 16 的倍數），再由畫布裁切成正式尺寸
- API Key 只存在使用者自己的瀏覽器 localStorage，直接送到 OpenAI，不經過任何伺服器
- 錯誤訊息白話化：Key 無效 / 額度用完 / 內容被擋 / 帳號未驗證會直接停止並說明原因

### 設定管理

- **自動儲存**：所有設定、截圖、AI 圖自動存在瀏覽器（localStorage）
- **下載 / 讀取設定檔**：Header 的 💾 / 📂 按鈕，存成 `.json` 可換電腦或日後還原
- **恢復預設樣式**：🖌 按鈕，只重設排版/背景/字型/顏色，截圖與文字內容保留
- **清空全部**：🗑 按鈕，API Key 保留

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
| 圖示 | Lucide Icons 1.55.0（CDN，鎖定版本） |
| PDF 解析 | PDF.js 3.4.120（匯入 PDF 時才動態載入） |
| 字型 | Google Fonts（Inter / Noto Sans TC/JP/KR / Outfit） |
| 部署 | Vercel（靜態站） |

---

## 本地開發

啟動簡易 HTTP Server（主頁檔名是 `playshot-studio.html`）：

```bash
cd "d:\Gemini Antigravity Project\playshot-studio"
python -m http.server 8000
# 開啟 http://localhost:8000/playshot-studio.html
```

---

## 部署更新

GitHub（TengRip/playshot-studio）已連結 Vercel，`git push` 到 main 會自動部署正式站。
改了 `app.js` / `styles.css` 記得同步更新 `playshot-studio.html` 裡的 `?v=` 版本號，避免瀏覽器吃到舊快取。

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
├── favicon.svg            # 網站小圖示
├── apple-touch-icon.png   # iPhone 加到主畫面的圖示（180×180）
├── og-image.png           # 分享到 LINE/FB 時的預覽圖（1200×630）
├── robots.txt             # 搜尋引擎爬蟲規則
└── README.md              # 本文件
```

---

## 待改進事項

> 以下為開發過程中記錄的改進方向，後續修改時請在此更新。

### UI / 操作體驗

- [x] **預設值重設按鈕**：Header 🖌「恢復預設樣式」，見 v2.6
- [x] **設定存檔 / 讀取**：Header 💾 / 📂 下載與讀取 `.json` 設定檔，見 v2.6
- [x] **手機版面**：900px 以下改上下堆疊、自動縮放，見 v2.6
- [x] **縮圖即時預覽速度**：改用 `requestAnimationFrame` 合併同一畫面內的多次重繪呼叫，拖曳滑桿/文字時不再每次事件都重繪 4 張全解析度 Canvas

### 功能擴充

- [x] **App Store 規格支援**：新增 iOS App Store 所需尺寸（iPhone 6.9"、iPad 13"），見 v2.4
- [ ] **Logo 浮水印**：支援在畫面角落放置 App icon 或品牌 Logo
- [x] **文字對齊方式**：自動 / 靠左 / 置中 / 靠右，見 v2.6
- [ ] **免費翻譯線路不穩**：沒填 API Key 時走 Google 翻譯非公開網址，2026-10-12 實測回 429（請求過多）；長期解法是架 proxy 或改用正式翻譯 API
- [ ] **更多字型**：增加英文手寫體或日文明朝體選項

### 背景裝飾

- [ ] **裝飾圖案顏色控制**：目前裝飾圖案顏色由背景色自動衍生，未來可讓使用者自訂裝飾線條的不透明度或顏色

### 技術負債

- [ ] `playshot-studio.html` 內 `app.js?v=` / `styles.css?v=` 的版本號為手動管理，改檔時記得一起更新
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
| v2.6 | 2026-10-12 | **全面優化**：① AI 生圖從已下架的 `dall-e-3` 換成 `gpt-image-2`（沒權限自動改 `gpt-image-2.5-flare`，並記住可用模型），尺寸依裝置比例換算，錯誤訊息白話化（Key 無效／額度用完／內容被擋會立即停止）；移除新模型不支援的 Seed 欄位。② 手機版面：900px 以下上下堆疊、預覽卡片不超出螢幕、自動調整縮放。③ 新增文字對齊（自動/靠左/置中/靠右）、恢復預設樣式、下載/讀取設定檔。④ 效能：Lucide 鎖 1.55.0、外部腳本改 defer、PDF.js 改匯入 PDF 時才載入、字型下載完自動重繪畫布。⑤ 門面：favicon、apple-touch-icon、og:image 分享預覽圖。⑥ 小修：Feature Graphic 專屬 Prompt 原本沒存檔、ZIP 下載在部分瀏覽器失敗（過早釋放網址）、AI Prompt 助手結果改用純文字顯示避免夾帶 HTML、免費翻譯線路加 8 秒逾時。 |
