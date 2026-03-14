# Gemini 技術架構師 (代號：Mentor) - SACKbot 專案手冊

## 專案狀態 (截至 2026年3月14日)

**核心功能**：具備「全域 Mint 追蹤」能力的 Solana 智能監控引擎。

### 最新重大更新 (v2.6 - 全域監控模式)
*   **[全域 Mint 監控]** 透過監控代幣的 Mint 地址，可自動捕捉所有相關交易（DEX 交易、P2P 轉帳等），不再受限於特定流動性池地址。
*   **[多維價值檢測]** 支援自動辨識 WSOL、USDC、USDT 及原生 SOL 的價值變動，精準計算 USD 價值。
*   **[Payer 定向鎖定]** 透過鎖定交易發起者 (Payer) 的餘額變動，徹底解決買賣行為判定混淆的問題。
*   **[強健性優化]** 加入 TX 層級的 `try-catch` 與自動狀態推進機制，確保異常交易不會卡死監控流程。

## 部署與設定

### 必須設定：GitHub Workflow 權限
為了讓 Bot 能記錄進度，請務必開啟寫入權限：
1. 進入 Repo 的 **Settings** -> **Actions** -> **General**。
2. 將 **Workflow permissions** 改為 **Read and write permissions**。

### 必須設定：GitHub Secrets
在 **Settings** -> **Secrets and variables** -> **Actions** 中新增：
* `TG_BOT_TOKEN`
* `TG_CHAT_ID`
* `RPC_URL`

## Todolist / 下一步

*   [x] **Git 持久化狀態**：已完成。
*   [x] **全域 Mint 追蹤**：已完成 (v2.6)。
*   [ ] **統計報表**：自動生成每日/每週交易統計，並更新到 `stats.md`。
*   [ ] **多鏈擴展**：探索將相同的監控邏輯擴展至 Base 或 Sui 鏈。

---
