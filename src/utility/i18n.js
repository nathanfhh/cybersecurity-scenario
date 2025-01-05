import {storeToRefs} from "pinia";
import {computed} from "vue";
import {useLanguageStore} from "@/stores/language.js";

const en = {
    "resetMoney": "Reset",
    "openAIAPIKey": "OpenAI API Key",
    "openAIAPIKeyInLocalStorageWarning": "The OpenAI API key is stored in the local storage of the browser, remember to clear the key after use if you are using a public computer.",
    "embeddingToolBox": "Embedding Tool Box",
    "plotGenerator": "Plot Generator",
    "enterBasicPlot": "Please enter Basic Plot",
    "generatePlot": "Generate Plot",
    "clearPlot": "Clear Plot",
    "plotOutput": "Plot Output",
    "enterTextToEmbed": "Enter a sentence to calculate the embedding",
    "calcEmbedding": "Calculate Embedding",
    "embeddingResult": "Embedding Result",
    "top5ResultInLibrary": "Top 5 Results in Library",
    "warning": "Warning",
    "confirm": "Confirm",
    "pleaseEnterQuestion": "Please enter the question",
    "gradingFailed": "Grading failed, please try again",
    "gradeDone": "Done grading",
    "start": "Start",
    "correct": "Correct",
    "incorrect": "Incorrect",
    "provideYourThought": "Please provide your thought",
    "checkAnswer": "Check Answer",
    "nextPage": "Next Page",
    "summary": "Summary",
    "success": "Success",
    "error": "Error",
    "failed": "Failed",
    "score": "Score",
    "browserNotSupportVideo": "Your browser does not support the video tag.",
    "listIndex": "Index",
    "plotQuestion": "Question / Plot",
    "yourAnswer": "Your Answer",
    "gradeComment": "Comment",
    "referenceAnswer": "Reference Answer",
    "costAmountXToGeneratePlot": "Cost $ {price} for generating plot",
    "failToGeneratePlot": "Fail to generate plot",
}
const zhTw = {
    "resetMoney": "歸零",
    "openAIAPIKey": "OpenAI API 金鑰",
    "openAIAPIKeyInLocalStorageWarning": "OpenAI API 金鑰儲存在瀏覽器的本地儲存中，如果您使用的是公共電腦，請記得在使用後清除金鑰。",
    "embeddingToolBox": "Embedding 工具箱",
    "plotGenerator": "劇情產生器",
    "enterBasicPlot": "請輸入基本劇情",
    "generatePlot": "產生劇情",
    "clearPlot": "清除劇情",
    "plotOutput": "輸出的劇情",
    "enterTextToEmbed": "輸入句子以計算 Embedding",
    "calcEmbedding": "計算 Embedding",
    "embeddingResult": "Embedding 結果",
    "top5ResultInLibrary": "媒體庫中的前五名相近結果",
    "warning": "警告",
    "confirm": "確認",
    "pleaseEnterQuestion": "請回答問題",
    "gradingFailed": "批改失敗，請再試一次",
    "gradeDone": "批改完成",
    "start": "開始",
    "correct": "正確",
    "incorrect": "錯誤",
    "provideYourThought": "請提供您的想法",
    "checkAnswer": "批改",
    "nextPage": "下一頁",
    "summary": "結果",
    "success": "成功",
    "failed": "失敗",
    "score": "分數",
    "browserNotSupportVideo": "您的瀏覽器不支援影片播放。",
    "listIndex": "題號",
    "plotQuestion": "問題 / 劇情",
    "yourAnswer": "您的答案",
    "gradeComment": "評語",
    "referenceAnswer": "參考答案",
    "costAmountXToGeneratePlot": "花費 $ {price} 生成劇情",
    "failToGeneratePlot": "無法產生劇情",
    "error": "錯誤",
}


export default function i18n(key, params) {
    const LanguageStore = useLanguageStore();
    const {useZhTw} = storeToRefs(LanguageStore);

    const lang = computed(() => (useZhTw.value ? 'zh-tw' : 'en'));

    let langObj = computed(() => {
        switch (lang.value) {
            case 'zh-tw':
                return zhTw;
            case 'en':
            default:
                return en;
        }
    });

    let text = langObj.value[key] || key;
    if (params) {
        Object.keys(params).forEach((key) => {
            text = text.replace(`{${key}}`, params[key]);
        });
    }
    return text;
}