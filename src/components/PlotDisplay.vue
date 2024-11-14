<script setup>
import {usePlotStore} from "@/stores/plot.js";
import {storeToRefs} from "pinia";
import {computed, reactive, ref, watch} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import requestEmbedding from "@/utility/embedding.js";
import {default as embedData} from "@/assets/embed-data.json";
import {z} from "zod";
import chatInference from "@/utility/chatInference.js";

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
      return
    }
    if (item.subtype === 'free-type') {
      try {
        answerModel[index].gradeResult = await gradeUserAnswer(item.question, answerModel[index].rawAnswer)
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

// Function to calculate cosine similarity
function cosineSimilarity(embedding1, embedding2) {
  const dotProduct = embedding1.reduce((sum, val, index) => sum + val * embedding2[index], 0);
  const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

// Function to rank embeddings based on similarity
function rankEmbeddings(targetEmbedding, embeddings) {
  console.log(embeddings)
  return Object.entries(embeddings)
      .map(([fileName, {embedding}]) => {
        return {
          fileName,
          similarity: cosineSimilarity(targetEmbedding, embedding)
        }
      })
      .sort((a, b) => b.similarity - a.similarity); // Sort in descending order of similarity
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
watch(() => plotContent.value, (newValue) => {
  if (Object.keys(newValue).length > 0) {
    getImage(0)
    imageUsedFileNames = []
    activeName.value = 0
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

const getFinalResultImageSrc = (averageScore) => {
  const basePath = Object.keys(embedData)[0]
  console.log(basePath)
  return basePath.split('/').slice(0, -1).join('/') + '/' + (averageScore > 70 ? 'success.webp' : 'failed.webp')
}
</script>

<template>
  <div
      style="height: 50vh;"
      v-if="plotContent?.scenario?.length > 0"
  >
    <el-tabs
        stretch
        v-model="activeName"
        @tab-click="()=>{}"
        v-loading="isTabElementLoading"
    >
      <el-tab-pane

          v-for="(item, index) in plotContent.scenario"
          :key="index"
          :label="index.toString()"
          :name="index"
      >
        <span v-if="item.type === 'plot'">
          <span>{{ item.content }}</span>
          <img v-if="imageChosen[index]" :src="imageChosen[index]" alt="plot" style="width: 100%; height: 100%"/>
        </span>
        <span v-else-if="item.type === 'questions'">
          <div v-if="item.subtype === 'free-type'">
            <span>{{ item.question }}</span>
            <ElInput
                v-model="answerModel[index].rawAnswer"
                placeholder="Please input"
                type="textarea"
                :rows="6"
            />
          </div>
          <div v-else>
            <span>{{ item.question }}</span>
            <div>
              <ElRadioGroup v-model="answerModel[index].rawAnswer">
              <ElRadio
                  v-for="(content, optionKey)  in item.content"
                  :key='optionKey'
                  :value='optionKey'
              >{{ content }}</ElRadio>
            </ElRadioGroup>
            </div>
          </div>
          <div class="align-right">
            <ElButton type="success" @click="gradeThis(index, item)">
              批改
            </ElButton>
          </div>
          <div>
              <ElAlert
                  show-icon
                  v-if="isNumeric(answerModel[index]?.gradeResult?.score)"
                  :title="answerModel[index].gradeResult.score >= 80 ? '正確' : '錯誤'"
                  :type="answerModel[index].gradeResult.score >= 80 ? 'success' : 'error'"
                  :description="answerModel[index].gradeResult.comment"
              />
          </div>
        </span>

        <div class="align-right"
             v-show="item.type !== 'questions' || (item.type === 'questions' && isNumeric(answerModel[index]?.gradeResult?.score))">
          <ElButton type="primary" @click="nextTab(index)">
            Next
          </ElButton>
        </div>
      </el-tab-pane>
      <el-tab-pane
          disabled
          label="總結"
          :name="plotContent.scenario.length"
          lazy
      >
        平均分數：{{ averageScore.toFixed(2) }}
        <br>
        應變結果：{{ averageScore > 70 ? '成功' : '失敗' }}
        <img
            :src="getFinalResultImageSrc(averageScore)"
            alt="final-result" style="width: 100%; height: 100%"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.align-right {
  text-align: right;
  margin-top: 10px;
}
</style>