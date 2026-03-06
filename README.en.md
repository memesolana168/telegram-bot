# 🚀 SACKbot - Universal Solana Monitor Engine (v2.4)

English | [繁體中文](./README.md)

SACKbot is a **universal** Solana blockchain monitoring tool. It is no longer limited to specific tokens. You can track Buy/Sell activities for **ANY** token or monitor fund movements for **ANY** wallet address with simple configurations.

## ✨ Core Features

- 🌍 **Universal Monitoring**: Supports all SPL Tokens and wallet addresses on the Solana blockchain.
- 🛠️ **Unified Configuration**: Manage all targets, names, and thresholds in a single file: `config.js`.
- 📖 **Smart Labeling**: Built-in "Address Book" to identify friends, internal wallets, or whales automatically.
- 💰 **Value Filtering**: Set custom USD thresholds to filter out dust and focus on high-value transfers.
- ☁️ **Zero-Cost Deployment**: Fully integrated with GitHub Actions—run 24/7 for free.

---

## 🛠️ Quick Start (GitHub Actions)

### Step 1: Fork this Repository
Fork this project to your GitHub account.

### Step 2: Configure Targets (`config.js`)
Open `config.js` and add any token or wallet you want to monitor:

```javascript
tasks: [
  {
    name: '📈 My Token',      // Name to display in alerts
    address: 'Mint_Address', // Token contract address
    type: 'SWAP',            // Mode: DEX Trades
    minUSD: 100,             // Threshold: Notify if > $100
  },
  {
    name: '🐋 Whale Wallet', // Name to display
    address: 'Wallet_Address', // Wallet address
    type: 'SOL_TRANSFER',    // Mode: Monitor SOL movements
    minUSD: 500,
  }
]
```

#### 📌 Monitor Modes Explained:
| Mode | Address Type Required | Description |
| :--- | :--- | :--- |
| `SWAP` | **Token Mint Address** | Tracks Buy/Sell on DEXs (Raydium, Jupiter, etc.). |
| `SOL_TRANSFER`| **Wallet Address** | Tracks all incoming and outgoing SOL movements. |
| `SOL_INFLOW` | **Wallet Address** | Tracks only incoming SOL (e.g., Treasury monitor). |
| `TOKEN_OUTFLOW`| **Wallet Address** | Tracks any outgoing tokens (e.g., Minter monitor). |

### Step 3: Set GitHub Secrets
Go to Repository **Settings** -> **Secrets and variables** -> **Actions**, add:
- `TG_BOT_TOKEN`: Your Telegram Bot Token.
- `TG_CHAT_ID`: Your Chat or Channel ID.
- `RPC_URL`: Your Solana RPC URL (Helius/QuickNode recommended).

### Step 4: Enable Write Permissions (CRITICAL!)
1. Go to **Settings** -> **Actions** -> **General**.
2. Scroll to **Workflow permissions**.
3. Select **Read and write permissions** and click **Save**.

---

## 🤖 How to get Telegram Settings?
1. Message [@BotFather](https://t.me/botfather) and type `/newbot` to get your **Token**.
2. Add the bot to your channel, send a message, then use [@userinfobot](https://t.me/userinfobot) to find your **Chat ID**.

---

## 📜 License
This project is open-source under the MIT License.

---
*Designed by Gemini Technical Architect (Mentor)*
