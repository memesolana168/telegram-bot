# 🚀 SACKbot - Solana 智能監控機器人 (v2.2)

[English Version](./README.en.md) | 繁體中文

SACKbot 是一個強大且易用的 Solana 區塊鏈監控工具。它可以追蹤特定錢包地址的 SOL 異動、代幣分發及 DEX 買賣行為，並即時推送到您的 Telegram 頻道。

## ✨ 核心特色

- 🛠️ **極簡配置**：只需在 `config.js` 一個地方設定所有監控任務。
- 💰 **價值過濾**：支援自定義美金 (USD) 門檻，小額噪音自動過濾，大額轉帳精準捕捉。
- ☁️ **零成本部署**：完美整合 GitHub Actions，無需伺服器即可 24/7 自動運行。
- 🧠 **自動記憶**：利用 Git-as-DB 技術，Bot 會自動記錄監控進度，不漏報、不重複。
- 📈 **多模式支援**：支援 SOL 轉帳、代幣發放、以及 Raydium/DEX 交易監控。

---

## 🛠️ 快速開始 (GitHub Actions 部署)

這是最推薦的部署方式，完全免費且無需維護伺服器。

### 第一步：Fork 或下載本專案
將本專案 Fork 到您的 GitHub 帳號下。

### 第二步：設定監控目標 (`config.js`)
在 `config.js` 中填入您想監控的地址與美金門檻：

```javascript
tasks: [
  {
    name: '🐋 巨鯨監控',
    address: '錢包地址',
    type: 'SOL_TRANSFER',
    minUSD: 500, // 超過 500 美金才通知
  }
]
```

### 第三步：設定 Telegram 與 RPC (Secrets)
前往您的 GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**，新增以下三個 **Repository secrets**：

1.  `TG_BOT_TOKEN`: 您的 Telegram 機器人 Token。
2.  `TG_CHAT_ID`: 接收通知的頻道或個人 ID。
3.  `RPC_URL`: 建議使用 [Helius](https://www.helius.dev/) 或 [QuickNode](https://www.quicknode.com/) 的免費私有節點（公共節點易被擋）。

### 第四步：開啟寫入權限 (重要！)
為了讓 Bot 能記錄進度，請務必：
1. 前往 **Settings** -> **Actions** -> **General**。
2. 滾動到最下方的 **Workflow permissions**。
3. 勾選 **Read and write permissions** 並點擊 **Save**。

---

## 🤖 如何取得 Telegram 設定？

### 1. 取得 `TG_BOT_TOKEN`
- 在 Telegram 搜尋並私訊 [@BotFather](https://t.me/botfather)。
- 輸入 `/newbot`，按照指令設定名稱。
- 完成後，您會得到一串像是 `123456:ABC-DEF...` 的字串，這就是您的 Token。

### 2. 取得 `TG_CHAT_ID`
- 將您的機器人加入一個群組或頻道，並設定為管理員。
- 發送一則訊息。
- 搜尋並私訊 [@userinfobot](https://t.me/userinfobot) 或前往 `https://api.telegram.org/bot<您的TOKEN>/getUpdates` 尋找 `chat.id`。

---

## 💻 本地端執行 (Long-running)

如果您希望獲得毫秒級的即時監控（而非 Actions 的 5 分鐘一次），可以在伺服器上長駐執行：

1. 安裝環境：`npm install`
2. 複製 `.env.example` 為 `.env` 並填入資料。
3. 啟動機器人：`npm start`

---

## 📜 授權協議
本專案基於 MIT 協議開源。

---
*由 Gemini 技術架構師 (Mentor) 精心設計*
