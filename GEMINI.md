# Gemini 技術架構師 (代號：Mentor) - SACKbot 專案手冊

## 專案狀態 (截至 2026年3月5日)

**核心功能**：具備 GitHub Actions 支援的 Solana 監控引擎。

### 最新重大更新 (v2.1 - 極簡化與雲端原生)
*   **[配置分離]** 引進 `config.js`。所有監控任務與美金門檻現在只需在單一檔案修改。
*   **[GitHub Actions 相容]** `monitor.js` 現在支援「長駐模式」與「Actions 模式」。
*   **[智能過濾]** 在 Actions 模式下自動應用「時間視窗過濾器 (10分鐘)」，解決無狀態 (Stateless) 環境下的重複通知問題。
*   **[自動化工作流]** 新增 `.github/workflows/monitor.yml`，實現每 5 分鐘自動執行，達成零預算部署。

## 部署說明

### 方案 A：GitHub Actions (零預算，5-10分鐘延遲)
1.  上傳代碼至 GitHub。
2.  在 Repo 設定 `TG_BOT_TOKEN`, `TG_CHAT_ID`, `RPC_URL` 的 Secrets。
3.  Actions 會自動根據 Cron 排程執行。

### 方案 B：Koyeb / VPS (有成本，秒級延遲)
1.  直接運行 `node monitor.js`。
2.  程式會進入「長駐模式」，實現即時監控。

## Todolist / 下一步

*   [x] **配置分離**：已完成。
*   [x] **GitHub Actions 整合**：已完成。
*   [ ] **多 RPC 備援**：讓 Actions 在 RPC 失敗時自動重試不同的節點。
*   [ ] **錯誤告警**：如果 Actions 執行失敗（例如 RPC 被封），發送通知給開發者。

---