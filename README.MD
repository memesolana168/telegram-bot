# 🚀 SACKbot - Solana 智能監控引擎 (v2.4)

[English Version](./README.en.md) | 繁體中文

SACKbot 是一個**通用型**的 Solana 區塊鏈監控工具。它不再僅限於特定的代幣，您可以透過簡單的設定來追蹤 **任何** 代幣的買賣行為，或監控 **任何** 錢包地址的資金動向。

## ✨ 核心特色

- 🌍 **通用監控**：支援 Solana 鏈上所有代幣 (SPL Tokens) 與錢包地址。
- 🛠️ **一鍵配置**：所有的監控對象、名稱、過濾門檻都在 `config.js` 統一管理。
- 📖 **智能標籤**：內建「地址簿」系統，自動識別熟人、內部錢包或巨鯨。
- 💰 **價值過濾**：支援自定義美金 (USD) 門檻，過濾掉瑣碎交易。
- ☁️ **零成本部署**：完美整合 GitHub Actions，24/7 自動運行且完全免費。

---

## 🛠️ 快速開始 (GitHub Actions 部署)

### 第一步：Fork 本專案
將本專案 Fork 到您的 GitHub 帳號。

### 第二步：設定監控目標 (`config.js`)
打開 `config.js`，您可以添加任何想監控的對象：

```javascript
tasks: [
  {
    name: '📈 我的代幣',      // 您想顯示的名字
    address: 'Mint_Address', // 代幣的合約地址
    type: 'SWAP',            // 模式：買賣交易
    minUSD: 100,             // 高於 100 美金才通知
  },
  {
    name: '🐋 某個大錢包',    // 您想顯示的名字
    address: 'Wallet_Address', // 錢包地址
    type: 'SOL_TRANSFER',    // 模式：監控 SOL 進出
    minUSD: 500,
  }
]
```

#### 📌 監控模式說明：
| 模式 | 填寫地址類型 | 說明 |
| :--- | :--- | :--- |
| `SWAP` | **代幣合約地址** | 監控該代幣在 DEX 上的買賣行為 (Raydium, Jupiter 等)。 |
| `SOL_TRANSFER`| **錢包地址** | 監控該錢包的所有 SOL 進出異動。 |
| `SOL_INFLOW` | **錢包地址** | 只監控該錢包「收到」SOL 的行為 (如：金庫)。 |
| `TOKEN_OUTFLOW`| **錢包地址** | 監控該錢包「發出」任何代幣的行為 (如：發幣器)。 |

### 第三步：設定 GitHub Secrets
前往 Repository **Settings** -> **Secrets and variables** -> **Actions**，新增：
- `TG_BOT_TOKEN`: Telegram 機器人 Token。
- `TG_CHAT_ID`: 接收通知的 ID。
- `RPC_URL`: 您的 Solana RPC URL (推薦 Helius/QuickNode)。

### 第四步：開啟寫入權限 (重要！)
1. 前往 **Settings** -> **Actions** -> **General**。
2. 滾動到下方 **Workflow permissions**。
3. 勾選 **Read and write permissions** 並點擊 **Save**。

---

## 🤖 如何取得 Telegram 設定？
1. 私訊 [@BotFather](https://t.me/botfather) 輸入 `/newbot` 取得 **Token**。
2. 將機器人加入頻道，發送測試訊息後，透過 [@userinfobot](https://t.me/userinfobot) 取得 **Chat ID**。

---

## 📜 授權協議
本專案基於 MIT 協議開源。

---
*由 Gemini 技術架構師 (Mentor) 精心設計*
