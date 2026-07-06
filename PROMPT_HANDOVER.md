# 專案交接規劃書：個人全能 AI 代理指揮中心 (Omni-Pulse)

## 1. 專案願景 (Project Vision)
本專案旨在建構一個高適應性、具備主動執行力的全能 AI Agent 平台（啟發自 Vaylo Pulse）。
此系統將作為使用者的「數位萬能特助/真人同事」，核心特點為：
*   **任何計畫的執行者：** 負責拆解、執行各種生活或工作流程，並能自動、定時回報進度。
*   **極致的擬真互動：** 在電腦前能以極低延遲進行全雙工語音/文字對話，語氣幽默風趣、具備主動性（如：主動比對歷史檔案並給出人性化建議）。
*   **行動端遠端指揮：** 整合 LINE 與 Instagram 帳號，讓使用者能透過手機隨時下達任務並接收即時進度回報。
*   **Vaylo 級視覺衝擊 UI：** 打造極具未來感、高密度資訊流、帶有動態發光與絲滑物理動畫的實時網頁指揮中心。

---

## 2. 技術棧規格 (Technical Stack)
*   **後端與編排 (Backend & Orchestration):** Python (FastAPI) 或 Node.js (TypeScript)。
*   **Agent 核心框架 (Agentic Framework):** LangGraph (用於管理複雜、具備長期記憶與可中斷/狀態恢復的計畫執行流程)。
*   **即時語音對話 (Real-time Voice):** OpenAI Realtime API 或 Gemini Multimodal Live API (達成 <1秒延遲的真人對話感)。
*   **通訊閘道 (Messaging Gateway):** LINE Messaging API + Instagram Graph API Webhooks。
*   **跨系統連接 (Integrations):** Claude MCP Client (用於連接各類 MCP Servers，如檔案、瀏覽器、GitHub 等)。
*   **資料庫與記憶 (Database & Memory):** PostgreSQL (搭配 pgvector) + Redis。
*   **前端與頂級動效 (Frontend & Motion):** 
    *   Next.js 14+ (App Router) + TailwindCSS + Shadcn/ui。
    *   **Framer Motion** (強制使用，用於實作無縫、具備物理彈簧效果的 UI 動畫)。
    *   **Lucide React** (高科技感圖標庫)。

---

## 3. 核心模組與視覺設計規範 (Core Modules & UI Specs)

### 模組 A：計畫拆解與實時事件流 (Plan-Execution & Live Event Stream)
*   **功能需求：** 處理使用者的任何計畫。使用 LangGraph 將大目標拆解為 Task Tree。
*   **UI/UX 視覺規範 (比照 Vaylo 衝擊感)：**
    *   **高密度暗黑風：** 整體色調採用純黑/極深灰（例如 `bg-zinc-950`），搭配微弱的漸層細邊框與毛玻璃效果（`backdrop-blur`）。
    *   **物理彈簧動效：** 當 WebSockets 推送新事件或日誌時，組件必須使用 Framer Motion 的 `<AnimatePresence>` 與 `layout` 屬性。新增日誌時，舊日誌必須以「物理彈簧曲線（Spring Physics）」絲滑地被往下推開，嚴禁生硬跳動。
    *   **狀態呼吸燈：** 執行中的任務卡片，邊框需有漸層跑馬燈動畫，並帶有微弱的 `drop-shadow` 霓虹呼吸燈效果。

### 模組 B：全雙工真人感知引擎 (Human-like Interaction Engine)
*   **功能需求：** 整合低延遲語音串流，支援隨時打斷（Barge-in）。
*   **UI/UX 視覺規範：**
    *   **液態字體串流：** 文字輸出不可整塊跳出，亦不可使用傳統死板的均速打字機。必須結合 WebSocket Token 串流，讓字元帶有微幅的 Y 軸位移與淡入（Fade-in），呈現如同液體般流出的科技感。
    *   **思維動態波形：** 當 AI 正在思考（Thinking Process）或掃描 MCP 既有檔案時，UI 必須呈現動態的量子波形或數據流閃爍，讓使用者感受到 Agent 正在「深度運作」。
    *   **幽默人格：** 拒絕 AI 腔。若發現新任務，會主動以真人同事口吻興奮提問。

### 模組 C：行動指揮官閘道 (Mobile Command Gateway)
*   **功能需求：** 串接 LINE/IG Webhook。使用者可透過手機下指令或接收主動進度推送、重大卡關決策（Human-in-the-loop）。

---

## 4. Claude Code 開發策略與指導原則
Claude Code，你是本專案的主架構師，請嚴格執行以下開發步驟：

1.  **第一階段：環境、MCP 與資料庫初始化**
    *   配置 TypeScript/Python 環境，設計 `Plans`、`Tasks`、`EventStreams` 的 PostgreSQL 綱要。
2.  **第二階段：LangGraph 狀態機與行動端 Webhook**
    *   實作完整的核心大腦邏輯，並打通 LINE/IG 的訊息解析與主動回報管道。
3.  **第三階段：前端 WebSocket API 與 Framer Motion 組件結構**
    *   請在 Next.js 中寫好實時數據的 API 端點。
    *   **建構高規格的前端組件骨架：** 預先配置好 `framer-motion` 的動畫常數（如 `stiffness: 100, damping: 15`）與 Tailwind 發光樣式類別（Classes）。

*協同開發備註：*
請專注於「後端核心、LangGraph 狀態控制、MCP 協議對接與前端動畫架構（Motion Architecture）的搭建」。具体的個別 UI 元件微調、按鈕排版、非核心小工具，將交由使用者的 IDE Codex/Copilot 依據你鋪設的動畫規格與 Type 定義進行自動補全。