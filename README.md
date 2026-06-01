# PlayShot Studio

**Google Play 商店展示圖一鍵生成工具**

純前端靜態網頁，無需後端、無需安裝，瀏覽器直接使用。

**線上版本：** https://playshot-studio.vercel.app

---

## 功能總覽

### 裝置規格支援

| 裝置 | 直式解析度 | 橫式解析度 |
|------|-----------|-----------|
| 手機 (Phone) | 1080 × 2280 | 2280 × 1080 |
| 7 吋平板 (7" Tablet) | 1200 × 1920 | 1920 × 1200 |
| 10 吋平板 (10" Tablet) | 1600 × 2560 | 2560 × 1600 |

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
├── index.html   # 主頁面與所有 UI 元件
├── styles.css   # 全域樣式與 CSS 變數系統
├── app.js       # 核心邏輯（Canvas 渲染、狀態管理、匯出）
└── README.md    # 本文件
```

---

## 待改進事項

> 以下為開發過程中記錄的改進方向，後續修改時請在此更新。

### UI / 操作體驗

- [ ] **預設值重設按鈕**：新增一鍵「恢復預設設定」，避免調亂後找不回來
- [ ] **設定存檔 / 讀取**：將目前狀態儲存為 JSON，下次開啟可還原（localStorage 或下載檔案）
- [ ] **縮圖即時預覽速度**：目前每次調整任何參數都會重繪全部三個 Canvas，可考慮 debounce 節流

### 功能擴充

- [ ] **App Store 規格支援**：新增 iOS App Store 所需尺寸（iPhone 6.9"、iPad 13"）
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
