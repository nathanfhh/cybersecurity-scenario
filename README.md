# LLM CyberSec Learning

This project is a web application based on Vue 3 and Vite, used to generate and display cybersecurity learning scenarios. Users can generate scenarios and answer related cybersecurity questions. The system will automatically score and provide feedback.

## Main Features

- Scenario Generation: Use OpenAI's GPT model to generate cybersecurity learning scenarios.
- Answer Scoring: Automatically score based on user answers and provide feedback.
- Multi-language Support: Supports English and Traditional Chinese.

## Configuration

Please refer to [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

### Install Dependencies

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Docker

### Build Docker Image

```sh
docker build -t llm-cybersec-learning .
```

### Run Docker Container

```sh
docker run -p 80:80 llm-cybersec-learning
```

## Directory Structure

- `src/`: Source code directory
  - `components/`: Vue components
    - `PlotDisplay.vue`: Displays generated scenarios and questions
    - `PlotGenerator.vue`: Scenario generator
    - `AnswerResultSummary.vue`: Displays answer scoring results
  - `utility/`: Utility functions
    - `embedding.js`: Embedding calculations
    - `chatInference.js`: Chat inference
    - `i18n.js`: Multi-language support
  - `stores/`: Pinia state management
  - `assets/`: Static assets
    - `embed-data.json`: Embedding data
  - `App.vue`: Main application component
  - `main.js`: Entry file

---

# LLM CyberSec Learning

這個專案是一個基於 Vue 3 和 Vite 的網頁應用程式，用於生成和展示網路安全學習場景。使用者可以生成劇情並回答相關的網路安全問題，系統會自動評分並提供反饋。

## 主要功能

- 劇情生成：使用 OpenAI 的 GPT 模型生成網路安全學習場景。
- 答案評分：根據使用者的回答自動評分並提供反饋。
- 多語言支持：支持英文和正體中文。

## 配置

請參考 [Vite 配置參考](https://vite.dev/config/).

## 專案設置

### 安裝依賴

```sh
npm install
```

### 開發環境編譯和熱重載

```sh
npm run dev
```

### 生產環境編譯和壓縮

```sh
npm run build
```

## Docker

### 構建 Docker 映像

```sh
docker build -t llm-cybersec-learning .
```

### 運行 Docker 容器

```sh
docker run -p 80:80 llm-cybersec-learning
```

## 目錄結構

- `src/`: 源代碼目錄
  - `components/`: Vue 組件
    - `PlotDisplay.vue`: 顯示生成的劇情和問題
    - `PlotGenerator.vue`: 劇情生成器
    - `AnswerResultSummary.vue`: 顯示答案評分結果
  - `utility/`: 工具函數
    - `embedding.js`: 嵌入計算
    - `chatInference.js`: 聊天推理
    - `i18n.js`: 多語言支持
  - `stores/`: Pinia 狀態管理
  - `assets/`: 靜態資源
    - `embed-data.json`: 嵌入數據
  - `App.vue`: 主應用組件
  - `main.js`: 入口文件
