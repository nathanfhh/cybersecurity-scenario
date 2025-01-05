# LLM CyberSec Learning

This project is a web application based on Vue 3 and Vite, used to generate and display cybersecurity learning scenarios. Users can generate scenarios and answer related cybersecurity questions. The system will automatically score and provide feedback.

## Main Features

- Scenario Generation: Use OpenAI's GPT model to generate cybersecurity learning scenarios.
- Answer Scoring: Automatically score based on user answers and provide feedback.
- Multi-language Support: Supports English and Traditional Chinese.

- [POC Video](https://youtu.be/mBxa85ZHAy0)
<br> ![Youtube Thumbnail](http://img.youtube.com/vi/mBxa85ZHAy0/0.jpg)
- [🚀Try it out](https://nathanfhh.github.io/cybersecurity-scenario/)
  - Step 1: Generate OpenAI API key and paste it into the input box.
  - Step 2: Provide basic plot and click "Generate Plot" button.
  - Step 3: Within 15 seconds or so, the generated multi-stage plots along with the questions will be displayed.
  - Step 4: Read the plots and answer the questions.
  - Step 5: Get the feedback from the LLM model everytime you submit your answers.

> [!TIP]
> You can enter not Cybersecurity-related text to generate a scenario. The model will try to generate a scenario based on the input text. 
> <br> For example, tell it to teach you photosynthesis, and it will try to generate a scenario about photosynthesis.

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
- [POC 錄影](https://youtu.be/mBxa85ZHAy0)
<br> ![Youtube Thumbnail](http://img.youtube.com/vi/mBxa85ZHAy0/0.jpg)
- [🚀 前往試用](https://nathanfhh.github.io/cybersecurity-scenario/)
  - 步驟 1: 產生 OpenAI API 金鑰並貼上網頁輸入框
  - 步驟 2: 提供基礎劇情，並按下「產生劇情」的按鈕
  - 步驟 3: 劇情會在 15 秒左右完成生成，並於網頁最下方呈現「多階段劇情」和「互動式作答」
  - 步驟 4: 閱讀劇情並回答問題
  - 步驟 5: 在每次提交答案後，都會得到 LLM 模型提供的回饋
  

> [!TIP]
> 你可以輸入非網路安全相關的文字來生成劇情，模型會嘗試根據輸入的文字生成劇情。
> <br> 例如，告訴它教你光合作用，它會嘗試生成一個關於光合作用的劇情。

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
