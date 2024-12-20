<script setup>
import {usePlotStore} from "@/stores/plot.js";
import {storeToRefs} from "pinia";
import {computed, reactive, ref, watch} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import requestEmbedding from "@/utility/embedding.js";
import {default as embedData} from "@/assets/embed-data.json";
import {z} from "zod";
import chatInference from "@/utility/chatInference.js";
import rankEmbeddings from "@/utility/vector.js";
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/monokai-sublime.css';
import AnswerResultSummary from "@/components/AnswerResultSummary.vue";
import DisplayMedia from "@/components/DisplayMedia.vue";

hljs.registerLanguage('python', python);

const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, {language: lang}).value;
      } catch (__) {
      }
    }

    return ''; // use external default escaping
  }
});
const plotStore = usePlotStore()
const {plotContent} = storeToRefs(plotStore)
const answerModel = reactive({})
const activeName = ref(0)
const imageChosen = reactive({})
let imageUsedFileNames = [];
const isTabElementLoading = ref(false)

const gradeThis = async (index, item) => {
  isTabElementLoading.value = true
  if (item.type === 'questions') {
    if (!answerModel[index].rawAnswer) {
      ElMessageBox.alert('請回答問題', '提示', {
        confirmButtonText: '確定',
        type: 'warning'
      });
      isTabElementLoading.value = false
      return
    }
    if (item.subtype === 'free-type') {
      try {
        answerModel[index].gradeResult = await gradeUserAnswer(item.question, answerModel[index].rawAnswer.trim())
      } catch (error) {
        console.error(error)
        ElMessage.error('批改失敗')
        return
      }
    } else {
      answerModel[index].gradeResult = {
        score: answerModel[index].rawAnswer === item.answer ? 100 : 0,
        comment: item.reason || ''
      }
    }
    ElMessage.success('批改完成')
    isTabElementLoading.value = false
  }
}

const nextTab = async (index) => {
  try {
    isTabElementLoading.value = true
    await getImage(index + 1)
  } catch (error) {
    console.error(error)
  } finally {
    isTabElementLoading.value = false
  }
  activeName.value = index + 1
}


const assignUniqueImage = (index, imageCosineResult) => {
  for (let i = 0; i < imageCosineResult.length; i++) {
    if (!imageUsedFileNames.includes(imageCosineResult[i].fileName)) {
      imageUsedFileNames.push(imageCosineResult[i].fileName)
      imageChosen[index] = imageCosineResult[i].fileName
      return
    }
  }
  imageChosen[index] = imageCosineResult[0].fileName
}
const getImage = async (index) => {
  const target = plotContent.value.scenario?.[index]
  if (!target || target.type !== 'plot') return
  const response = await requestEmbedding(target.content)
  const plotEmbedding = response.data[0].embedding
  console.log("Embedding for plot", plotEmbedding)
  const result = rankEmbeddings(plotEmbedding, embedData)
  assignUniqueImage(index, result)
}

const GradingSchema = z.object({
  score: z.number(),
  comment: z.string().describe("A concise and precise evaluation of the user's answer."),
});
const gradeUserAnswer = async (question, userAnswer) => {
  const systemPrompt = `You are evaluating a user's answer to a cybersecurity question. The answer should be graded based on relevance, and accuracy.
The user may provide a short answer to the question, which is acceptable.

Provide the evaluation in JSON format with:
- score: a value between 0 and 100, with 80 being the passing score.
- comment: a concise and precise evaluation, around 150 words.
Use 正體中文 and 台灣用語習慣 to answer.`
  const userPrompt = `Here is the question and the user's answer:
Question: "${question}"
User's Answer: "${userAnswer}"
`
  const useModel = 'gpt-4o-mini'
  const {chatCompletion} = await chatInference(
      systemPrompt,
      userPrompt,
      useModel,
      GradingSchema,
      "grading"
  )
  console.log(chatCompletion.choices[0].message.content)
  return JSON.parse(chatCompletion.choices[0].message.content)
}

const averageScore = computed(() => {
  const totalScore = Object.values(answerModel).reduce((sum, item) => sum + item.gradeResult.score, 0)
  return totalScore / Object.keys(answerModel).length
})
const clearAnswerModel = () => {
  for (const key in answerModel) {
    delete answerModel[key];
  }
}
watch(() => plotContent.value, (newValue) => {
  if (Object.keys(newValue).length > 0) {
    // 重設
    getImage(0)
    imageUsedFileNames = []
    activeName.value = 0
    clearAnswerModel()
    newValue.scenario.forEach((item, index) => {
      if (item.type === 'questions') {
        answerModel[index] = {
          rawAnswer: '',
          gradeResult: {
            score: null,
            comment: ''
          }
        }
      }
    })
  }
}, {immediate: true})

function isNumeric(str) {
  if (typeof str === 'number') return true
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const getFinalImageByScore = (score) => {
  if (score >= 70) {
    return 'success.webp'
  } else if (score >= 40) {
    return 'failed.webp'
  }
  return 'failed-40.webp'
}
const getFinalResultImageSrc = (averageScore) => {
  const basePath = Object.keys(embedData)[0]
  return basePath.split('/').slice(0, -1).join('/') + '/' + getFinalImageByScore(averageScore)
}
const chooseIconForTab = (index) => {
  if (index === 0) {
    return '🏁'
  }
  const relevantPlot = plotContent.value?.scenario?.[index]
  if (index < activeName.value) {
    if (relevantPlot?.type === 'questions') {
      const relevantAnswer = answerModel[index]
      if (relevantAnswer?.gradeResult?.score >= 80) return '✅'
      return '🙅🏻‍♀️'
    }
    if (relevantPlot?.type === 'plot') return '📖'
  }

  return ''
}
</script>

<template>
  <div
      style="height: 100vh;"
      v-if="plotContent?.scenario?.length > 0"
  >
    <el-text size="large" style="font-size: 2rem !important;">
      <el-tabs
          stretch
          v-model="activeName"
          @tab-click="()=>{}"
          v-loading="isTabElementLoading"
          :style="plotContent.scenario.length !== activeName ? 'height: 100%' : ''"
      >
        <el-tab-pane
            v-for="(item, index) in plotContent.scenario"
            :key="index"
            :name="index"
            style="overflow: auto; height: 100%"
        >
          <template #label>
            <span class="custom-tabs-label">
              <span>{{ index !== 0 ? index.toString() : '開始' }} {{ chooseIconForTab(index) }}</span>
            </span>
          </template>
          <div v-if="item.type === 'plot'">
            <ElRow>
              <ElCol :span="12" style="padding: 10px">
                <DisplayMedia :file-name="imageChosen[index]"/>
              </ElCol>
              <ElCol :span="12" style="padding: 10px">
                <span v-html="md.render(item.content)"/>
              </ElCol>
            </ElRow>
          </div>
          <div v-else-if="item.type === 'questions'">
            <div style="margin-bottom: 10px">
              <ElAlert
                  :closable="false"
                  show-icon
                  v-if="isNumeric(answerModel[index]?.gradeResult?.score)"
                  :title="answerModel[index].gradeResult.score >= 80 ? '正確' : '錯誤'"
                  :type="answerModel[index].gradeResult.score >= 80 ? 'success' : 'error'"
                  :description="answerModel[index].gradeResult.comment"
              />
            </div>
            <div v-html="md.render(item.question)"/>
            <div v-if="item.subtype === 'free-type'">
              <ElInput
                  v-model="answerModel[index].rawAnswer"
                  placeholder="請提供您的看法"
                  type="textarea"
                  :rows="6"
              />
            </div>
            <div v-else>
              <div>
                <ElRadioGroup v-model="answerModel[index].rawAnswer" style="width: 100%">
                  <ElRadio
                      size="large"
                      border
                      v-for="(content, optionKey)  in item.content"
                      :key='optionKey'
                      :value='optionKey'
                      style="width: 100%; margin-top: 10px; margin-right: 0"
                  >{{ content }}
                  </ElRadio>
                </ElRadioGroup>
              </div>
            </div>
            <div class="align-right">
              <ElButton type="success" @click="gradeThis(index, item)">
                批改
              </ElButton>
            </div>
          </div>
          <div class="align-right"
               v-show="item.type !== 'questions' || (item.type === 'questions' && isNumeric(answerModel[index]?.gradeResult?.score))">
            <ElButton type="primary" @click="nextTab(index)">
              下一頁
            </ElButton>
          </div>
        </el-tab-pane>
        <el-tab-pane
            label="總結"
            :name="plotContent.scenario.length"
            lazy
        >
          <el-result
              :icon="averageScore >= 70 ? 'success' : 'error'"
              :title="averageScore >= 70 ? '成功' : '失敗'"
              :sub-title="`分數： ${averageScore.toFixed(2) }`"
          >
            <template #extra>
              <img
                  :src="getFinalResultImageSrc(averageScore)"
                  alt="final-result" style="width: 100%; height: 100%"
              />
            </template>
          </el-result>
          <AnswerResultSummary :plot-content="plotContent" :answer-result="answerModel"/>
        </el-tab-pane>
      </el-tabs>
    </el-text>
  </div>
</template>

<style scoped>
.align-right {
  text-align: right;
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
<style>
pre > code.language-python {
  background-color: #282C34;
  padding: 15px;
  border-radius: 10px;
  width: 100%;
  display: block;
}
</style>