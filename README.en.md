# 🚀 SACKbot - Ultimate Solana Monitor Engine (v2.6)

English | [繁體中文](./README.md)

SACKbot is a **global tracking-capable** Solana blockchain monitoring tool. With the v2.6 core upgrade, it accurately captures trading activities for any token across the entire network, featuring intelligent value detection and high operational stability.

## ✨ Core Features (v2.6 Upgrade)

- 🌍 **Global Mint Monitoring**: Just provide the Token Mint Address to automatically track trades on all DEXs including Raydium, Jupiter, Pump.fun, and more.
- 💎 **Multi-Asset Detection**: Automatically identifies changes in WSOL, USDC, USDT, and native SOL to precisely calculate the USD value of every transaction.
- 🎯 **Payer-Oriented Locking**: By tracking the balance changes of the transaction initiator (Payer), it accurately determines "Buy" or "Sell" actions, avoiding confusion from pool balance shifts.
- 🛠️ **Smart Address Book**: Built-in labeling system to identify internal wallets, whales, or special accounts automatically.
- 🛡️ **Robust Runtime**: Automatically detects and skips invalid Base58 addresses with comprehensive error handling to ensure 24/7 uninterrupted monitoring.

---

## 🛠️ Quick Start (GitHub Actions)

### Step 1: Fork this Repository
Fork this project to your GitHub account.

### Step 2: Configure Targets (`config.js`)
Configure tokens or wallets you want to monitor in `config.js`:

```javascript
tasks: [
  {
    name: '📈 SACK Token',     // Display name for alerts
    address: 'Mint_Address',  // Token Mint Address (Global tracking)
    type: 'SWAP',             // Mode: DEX Trade Detection
    minUSD: 100,              // Threshold: Notify if > $100
  },
  {
    name: '🏦 Treasury',       // Display name
    address: 'Wallet_Address',// Wallet address
    type: 'SOL_INFLOW',       // Mode: Monitor incoming SOL only
    minUSD: 10,               // USD filter
  }
]
```

#### 📌 Monitor Modes Explained:
| Mode | Recommended Address Type | Description |
| :--- | :--- | :--- |
| **`SWAP`** | **Token Mint Address** | **[Highly Recommended]** Tracks all Buy/Sell activities for this token across the entire network. |
| **`SOL_TRANSFER`**| **Wallet Address** | Tracks all incoming and outgoing SOL movements (including fees). |
| **`SOL_INFLOW`** | **Wallet Address** | Focuses on when the wallet **receives** SOL. |
| **`TOKEN_OUTFLOW`**| **Wallet Address** | Tracks when the wallet **sends** tokens (useful for minters/team wallets). |

### Step 3: Set GitHub Secrets
Go to Repository **Settings** -> **Secrets and variables** -> **Actions**, add:
- `TG_BOT_TOKEN`: Your Telegram Bot Token.
- `TG_CHAT_ID`: Your Chat or Channel ID.
- `RPC_URL`: Your Solana RPC URL (Helius/QuickNode/Triton recommended).

### Step 4: Enable Write Permissions (CRITICAL!)
1. Go to **Settings** -> **Actions** -> **General**.
2. Scroll to **Workflow permissions**.
3. Select **Read and write permissions** and click **Save**.

---

## 🤖 FAQ
- **Q: Why am I not receiving notifications?**  
  Check if `minUSD` is set too high or if your RPC node is experiencing lag.
- **Q: What happens if I enter an incorrect address?**  
  v2.6 automatically detects and skips invalid addresses during startup and logs a warning, preventing the bot from crashing.

---

## 📜 License
This project is open-source under the MIT License.

---
*Designed by Gemini Technical Architect (Mentor)*
