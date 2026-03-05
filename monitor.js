/**
 * SACKbot - Solana 監控機器人 (重構版)
 * Mentor 觀點：簡潔、通用、可擴充
 */

const { Connection, PublicKey } = require('@solana/web3.js');
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
require('dotenv').config();

// ================= 配置區 =================

const CONFIG = {
    rpcUrl: process.env.RPC_URL || 'https://api.mainnet-beta.solana.com',
    tgToken: process.env.TG_BOT_TOKEN,
    tgChatId: process.env.TG_CHAT_ID,
    interval: parseInt(process.env.POLLING_INTERVAL || '60000', 10),
    
    // 內部地址 (用於過濾或標記)
    internalAddresses: {
        'SACKKQcRPAVAMVXZNLyH9avG9sdfYW2iE3Nw2te7Lj7': '金庫 (Treasury)',
        'SACKsfkq2BoUELVv8PZ8LhnMfQ4rorFAJbCZWi6eVLQ': '發幣器 (Minter)',
        'Sack7bZAMtwVU1ceMwV6V293GXCyBtkhQNYYUGAWMqu': 'SACK 代幣'
    },

    // 監控任務設定
    tasks: [
        {
            name: '💰 金庫監控',
            address: 'SACKKQcRPAVAMVXZNLyH9avG9sdfYW2iE3Nw2te7Lj7',
            type: 'SOL_INFLOW', // 只監控轉入
            minUSD: 0,          // 0 = 全部監控
        },
        {
            name: '🖨️ 發幣器動作',
            address: 'SACKsfkq2BoUELVv8PZ8LhnMfQ4rorFAJbCZWi6eVLQ',
            type: 'TOKEN_OUTFLOW', // 監控代幣發出
            minUSD: 0,
        },
        {
            name: '📈 SACK 交易 (大額)',
            address: 'Sack7bZAMtwVU1ceMwV6V293GXCyBtkhQNYYUGAWMqu',
            type: 'SWAP',
            minUSD: 100,        // 超過 100 美金才通知
        }
    ]
};

// ================= 服務模組 =================

const tgBot = new TelegramBot(CONFIG.tgToken);
const connection = new Connection(CONFIG.rpcUrl, 'confirmed');

// 價格服務 (簡單快取)
const PriceService = {
    solPrice: 0,
    lastUpdate: 0,
    async updatePrice() {
        const now = Date.now();
        if (now - this.lastUpdate < 300000 && this.solPrice > 0) return this.solPrice; // 5分鐘更新一次
        try {
            const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            this.solPrice = data.solana.usd;
            this.lastUpdate = now;
            console.log(`[Price] 當前 SOL 價格: $${this.solPrice}`);
            return this.solPrice;
        } catch (e) {
            console.error('[Price] 獲取價格失敗', e.message);
            return this.solPrice || 150; // 發生錯誤時使用最後一次價格或預設
        }
    }
};

// 通知服務
const NotifyService = {
    async send(htmlMessage) {
        try {
            await tgBot.sendMessage(CONFIG.tgChatId, htmlMessage, { 
                parse_mode: 'HTML', 
                disable_web_page_preview: true 
            });
        } catch (e) {
            console.error('[Notify] 發送失敗', e.message);
        }
    }
};

// ================= 核心引擎 =================

class MonitorEngine {
    constructor() {
        this.signatures = new Map(); // 存儲每個任務的最後一個簽名
    }

    async init() {
        console.log('🚀 SACKbot 引擎啟動中...');
        await PriceService.updatePrice();
        
        for (const task of CONFIG.tasks) {
            try {
                const sigs = await connection.getSignaturesForAddress(new PublicKey(task.address), { limit: 1 });
                if (sigs.length > 0) {
                    this.signatures.set(task.address, sigs[0].signature);
                    console.log(`[Init] ${task.name} 初始簽名已設定: ${sigs[0].signature.slice(0, 8)}...`);
                }
            } catch (e) {
                console.error(`[Init] ${task.name} 初始化失敗`, e.message);
            }
        }
    }

    async run() {
        console.log(`\n--- 輪詢開始 (${new Date().toLocaleTimeString()}) ---`);
        await PriceService.updatePrice();

        for (const task of CONFIG.tasks) {
            await this.processTask(task);
        }
    }

    async processTask(task) {
        try {
            const pubKey = new PublicKey(task.address);
            const lastSig = this.signatures.get(task.address);
            
            const signatures = await connection.getSignaturesForAddress(pubKey, { 
                limit: 10,
                until: lastSig
            });

            if (signatures.length === 0) return;

            // 更新最後處理的簽名
            this.signatures.set(task.address, signatures[0].signature);

            // 從舊到新處理
            for (const sigInfo of signatures.reverse()) {
                await this.handleTransaction(task, sigInfo.signature);
            }
        } catch (e) {
            console.error(`[Task] ${task.name} 執行錯誤:`, e.message);
        }
    }

    async handleTransaction(task, signature) {
        const tx = await connection.getParsedTransaction(signature, {
            maxSupportedTransactionVersion: 0
        });

        if (!tx || !tx.meta) return;

        const payer = tx.transaction.message.accountKeys[0].pubkey.toBase58();
        
        // 過濾內部地址發起的非必要交易
        if (task.type === 'SWAP' && CONFIG.internalAddresses[payer]) {
            return; 
        }

        const solPrice = PriceService.solPrice;

        // 根據任務類型進行解析
        if (task.type === 'SOL_INFLOW' || task.type === 'SOL_TRANSFER') {
            await this.processSolTransfer(task, tx, signature, solPrice);
        } else if (task.type === 'TOKEN_OUTFLOW') {
            await this.processTokenOutflow(task, tx, signature);
        } else if (task.type === 'SWAP') {
            await this.processSwap(task, tx, signature, solPrice);
        }
    }

    // 1. 處理 SOL 轉帳
    async processSolTransfer(task, tx, signature, solPrice) {
        const accountIndex = tx.transaction.message.accountKeys.findIndex(
            k => k.pubkey.toBase58() === task.address
        );

        if (accountIndex === -1) return;

        const diff = (tx.meta.postBalances[accountIndex] - tx.meta.preBalances[accountIndex]) / 1e9;
        
        // 判斷是否符合條件
        if (task.type === 'SOL_INFLOW' && diff <= 0) return;
        if (Math.abs(diff) < 0.001) return; // 忽略過小金額

        const usdValue = Math.abs(diff) * solPrice;
        if (task.minUSD > 0 && usdValue < task.minUSD) return;

        const isIn = diff > 0;
        const sender = tx.transaction.message.accountKeys[0].pubkey.toBase58();

        const msg = `
<b>${task.name}</b>
━━━━━━━━━━━━━━━━━━
<b>類型:</b> ${isIn ? '📥 收到款項' : '📤 支出款項'}
<b>金額:</b> ${Math.abs(diff).toFixed(4)} SOL (~$${usdValue.toFixed(2)})
<b>對手方:</b> <code>${sender.slice(0, 4)}...${sender.slice(-4)}</code>
<b>交易:</b> <a href="https://solscan.io/tx/${signature}">查看詳情</a>
`;
        await NotifyService.send(msg);
    }

    // 2. 處理代幣發出 (Minter)
    async processTokenOutflow(task, tx, signature) {
        const preTokenBalances = tx.meta.preTokenBalances || [];
        const postTokenBalances = tx.meta.postTokenBalances || [];

        for (const post of postTokenBalances) {
            if (post.owner === task.address) continue; // 排除自己

            const pre = preTokenBalances.find(p => p.accountIndex === post.accountIndex);
            const preAmt = pre ? pre.uiTokenAmount.uiAmount : 0;
            const postAmt = post.uiTokenAmount.uiAmount;

            if (postAmt > preAmt) {
                const amount = postAmt - preAmt;
                const msg = `
<b>${task.name}</b>
━━━━━━━━━━━━━━━━━━
<b>行為:</b> 🏗️ 發放代幣
<b>數量:</b> ${amount.toLocaleString()} ${post.mint.slice(0, 4)}...
<b>接收者:</b> <code>${post.owner.slice(0, 4)}...${post.owner.slice(-4)}</code>
<b>交易:</b> <a href="https://solscan.io/tx/${signature}">查看詳情</a>
`;
                await NotifyService.send(msg);
            }
        }
    }

    // 3. 處理 Swap (SACK 交易)
    async processSwap(task, tx, signature, solPrice) {
        const payer = tx.transaction.message.accountKeys[0].pubkey.toBase58();
        
        // 分析 SOL 變化
        const solDiff = (tx.meta.postBalances[0] - tx.meta.preBalances[0]) / 1e9;
        
        // 分析 SACK 變化 (task.address 就是代幣地址)
        const sackAccount = tx.meta.postTokenBalances.find(tb => tb.owner === payer && tb.mint === task.address);
        if (!sackAccount) return;

        const preSack = tx.meta.preTokenBalances.find(tb => tb.accountIndex === sackAccount.accountIndex);
        const preAmt = preSack ? preSack.uiTokenAmount.uiAmount : 0;
        const postAmt = sackAccount.uiTokenAmount.uiAmount;
        const sackDiff = postAmt - preAmt;

        if (sackDiff === 0 || solDiff === 0) return;

        const usdValue = Math.abs(solDiff) * solPrice;
        if (task.minUSD > 0 && usdValue < task.minUSD) return;

        const isBuy = sackDiff > 0;
        const msg = `
<b>${isBuy ? '📈 SACK 買入' : '📉 SACK 賣出'}</b>
━━━━━━━━━━━━━━━━━━
<b>玩家:</b> <code>${payer.slice(0, 4)}...${payer.slice(-4)}</code>
<b>數量:</b> ${Math.abs(sackDiff).toLocaleString()} SACK
<b>價值:</b> ${Math.abs(solDiff).toFixed(3)} SOL (~$${usdValue.toFixed(2)})
<b>交易:</b> <a href="https://solscan.io/tx/${signature}">查看詳情</a>
`;
        await NotifyService.send(msg);
    }
}

// ================= 執行啟動 =================

async function main() {
    const engine = new MonitorEngine();
    await engine.init();

    // 設置循環
    setInterval(() => engine.run(), CONFIG.interval);
}

main();