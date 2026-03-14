# 🚀 SACKbot - Solana 智能監控引擎 (v2.6 終極版)

[English Version](./README.en.md) | 繁體中文

SACKbot 是一個**具備全域追蹤能力**的 Solana 區塊鏈監控工具。透過 v2.6 的核心升級，它能精準捕捉任何代幣在全網的買賣動態，並具備智能價值檢測與極高的運行穩定性。

## ✨ 核心特色 (v2.6 升級)

- 🌍 **全域 Mint 監控**：只需填寫代幣 Mint 地址，即可自動追蹤其在 Raydium、Jupiter、Pump.fun 等所有 DEX 的交易。
- 💎 **多幣種價值檢測**：自動識別 WSOL、USDC、USDT 及原生 SOL 的變動，精準計算每一筆交易的 USD 價值。
- 🎯 **Payer 定向鎖定**：透過鎖定交易發起者的帳戶變動，精準判定「買入」或「賣出」行為，不再被池子餘額混淆。
- 🛠️ **智能地址簿**：內建地址標籤系統，自動識別內部錢包、巨鯨或特殊帳戶。
- 🛡️ **強健運行環境**：自動偵測並跳過無效的 Base58 地址，具備完善的錯誤容錯機制，確保監控 24/7 不中斷。

---

## 🛠️ 快速開始 (GitHub Actions 部署)

### 第一步：Fork 本專案
將本專案 Fork 到您的 GitHub 帳號。

### 第二步：設定監控目標 (`config.js`)
在 `config.js` 中配置您感興趣的代幣或錢包：

```javascript
tasks: [
  {
    name: '📈 SACK 代幣',       // 您想顯示的名字
    address: 'Mint_Address',  // 代幣的 Mint 合約地址 (全域監控)
    type: 'SWAP',             // 模式：買賣交易偵測
    minUSD: 100,              // 超過 100 美金才通知
  },
  {
    name: '🏦 金庫監控',       // 您想顯示的名字
    address: 'Wallet_Address',// 錢包地址
    type: 'SOL_INFLOW',       // 模式：只監控收到 SOL
    minUSD: 10,               // 門檻過濾
  }
]
```

#### 📌 監控模式說明：
| 模式 | 推薦地址類型 | 說明 |
| :--- | :--- | :--- |
| **`SWAP`** | **代幣 Mint 地址** | **[強烈推薦]** 監控該幣在全網的所有 DEX 買賣行為。 |
| **`SOL_TRANSFER`**| **錢包地址** | 監控該錢包的所有 SOL 進出異動 (含買賣手續費)。 |
| **`SOL_INFLOW`** | **錢包地址** | 專注於錢包「收到」SOL 的行為。 |
| **`TOKEN_OUTFLOW`**| **錢包地址** | 監控錢包「發出」代幣的行為 (適用於發幣器/團隊錢包)。 |

### 第三步：設定 GitHub Secrets
前往 Repository **Settings** -> **Secrets and variables** -> **Actions**，新增：
- `TG_BOT_TOKEN`: Telegram 機器人 Token。
- `TG_CHAT_ID`: 接收通知的 ID。
- `RPC_URL`: 您的 Solana RPC URL (推薦 Helius/QuickNode/Triton)。

### 第四步：開啟寫入權限 (重要！)
1. 前往 **Settings** -> **Actions** -> **General**。
2. 滾動到下方 **Workflow permissions**。
3. 勾選 **Read and write permissions** 並點擊 **Save**。

---

## 🤖 常見問題
- **Q: 為什麼沒有收到通知？**  
  請檢查 `minUSD` 設定是否過高，或 RPC 節點是否有延遲。
- **Q: 地址填寫錯誤會怎樣？**  
  v2.6 會在啟動時自動檢測並跳過無效地址，並在日誌中輸出警告，不會導致程式崩潰。

---

## 📜 授權協議
本專案基於 MIT 協議開源。

---
*由 Gemini 技術架構師 (Mentor) 傾力打磨*
