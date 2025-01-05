<script setup>
import {storeToRefs} from "pinia";
import {nextTick, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {z} from "zod";
import {usePlotStore} from "@/stores/plot.js";
import chatInference from "@/utility/chatInference.js";
import i18n from "@/utility/i18n.js";
import {useLanguageStore} from "@/stores/language.js";

const isLoading = ref(false)
const plotStore = usePlotStore()
const {plotContent} = storeToRefs(plotStore)
const outputResult = ref("")
const basicPlot = ref("")
const LanguageStore = useLanguageStore()
const {useZhTw} = storeToRefs(LanguageStore)

// Define the JSON schema for the structured scenario response
const PlotSchema = z.object({
  type: z.literal("plot"),
  subtype: z.nullable(z.string()),
  content: z.string(),
});

const QuestionSchema = z.object({
  type: z.literal("questions"),
  subtype: z.enum(["true-false", "multiple-choice", "free-type"]),
  question: z.string(), // Added question text field
  content: z.union([
    z.record(z.string(), z.string()),  // For "true-false" and "multiple-choice" options as { "A": "Option A", "B": "Option B", ... }
    z.null()  // For "free-type" questions where content is null
  ]),
  answer: z.union([z.string(), z.null()]), // Answer is the key of the correct option, or null for "free-type"
  reason: z.union([z.string(), z.null()])
});

// Encapsulate the array of plot and questions into an object
const ScenarioSchema = z.object({
  scenario: z.array(z.union([PlotSchema, QuestionSchema]))
});
const systemPrompt = `
Create an educational cybersecurity scenario by expanding a basic event into a cohesive sequence of eight checkpoints. Each checkpoint should have a plot segment followed by engaging cybersecurity questions that test knowledge, critical thinking, and skills.

Expand on the provided scenario, ensuring realism and relevance to cybersecurity, and make the educational flow interactive and informative. Each plot segment and question should build upon the previous one, driving the storyline forward.

**Output Structure**: Provide the content as an array using this JSON structure:

\`\`\`json
{
  "scenario": [
    {
      "type": "plot",
      "subtype": null,
      "content": "Description of the current scenario stage."
    },
    {
      "type": "questions",
      "subtype": "true-false",
      "question": "A cybersecurity question about the scenario.",
      "content": {
        "A": "True",
        "B": "False"
      },
      "answer": "A",  // or "B" depending on the correct answer
      "reason": "The reason why to choose A instead of B"
    },
    {
      "type": "questions",
      "subtype": "multiple-choice",
      "question": "A multiple-choice question based on the scenario.",
      "content": {
        "A": "Option A content",
        "B": "Option B content",
        "C": "Option C content",
        "D": "Option D content"
      },
      "answer": "A",  // key of the correct choice
      "reason": "The reason why to choose A instead of other choice"
    },
    {
      "type": "questions",
      "subtype": "free-type",
      "question": "A free-response question that requires a critical answer.",
      "content": null,
      "answer": ""  // left blank for free-type responses
    }
  ]
}
\`\`\`

Must generate at least one code review questions in Python by giving a code snippet and ask the user to point out the issues in the code implementations.
It is okay for user to provide non-cybersecurity related scenario.

`
const generatePlot = async () => {
  isLoading.value = true
  const useModel = 'gpt-4o-mini'
  try {
    const {chatCompletion, price} = await chatInference(
        systemPrompt + `\nMust Use ${useZhTw.value ? "正體中文 and 台灣用語習慣" : "english"} to answer, 如果存在專有名詞，請保留原文。`,
        basicPlot.value,
        useModel,
        ScenarioSchema,
        "scenario"
    )
    outputResult.value = JSON.stringify(chatCompletion, null, 2)
    ElMessage.success(i18n('costAmountXToGeneratePlot', {price}))
    plotStore.$reset()
    plotContent.value = JSON.parse(chatCompletion.choices[0].message.content)
    await nextTick()
    document.getElementById("mainPlot").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
  } catch (error) {
    console.error(error)
    ElMessageBox.alert(i18n('failToGeneratePlot'), i18n('error'))
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div v-loading="isLoading">
    <h1>{{ i18n('plotGenerator') }}</h1>
    <ElInput
        v-model="basicPlot"
        :rows="5"
        type="textarea"
        :placeholder="i18n('enterBasicPlot')"/>
    <ElButton @click="generatePlot" type="success" :disabled="!basicPlot">{{ i18n('generatePlot') }}</ElButton>
    <ElButton v-if="plotContent?.scenario?.length > 0" @click="plotStore.$reset()" type="danger">{{
        i18n('clearPlot')
      }}
    </ElButton>
    <ElInput
        v-model="outputResult"
        :rows="10"
        type="textarea"
        :placeholder="i18n('plotOutput')"/>
  </div>
</template>

<style scoped>

</style>