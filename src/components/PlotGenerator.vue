<script setup>
import {storeToRefs} from "pinia";
import {nextTick, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {z} from "zod";
import {usePlotStore} from "@/stores/plot.js";
import chatInference from "@/utility/chatInference.js";

const isLoading = ref(false)
const plotStore = usePlotStore()
const {plotContent} = storeToRefs(plotStore)
const outputResult = ref("")
const basicPlot = ref("")


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

const generatePlot = async () => {
  isLoading.value = true
  const useModel = 'gpt-4o-mini'
  try {
    const {chatCompletion, price} = await chatInference(
        window.atob("Q3JlYXRlIGFuIGVkdWNhdGlvbmFsIGN5YmVyc2VjdXJpdHkgc2NlbmFyaW8gYnkgZXhwYW5kaW5nIGEgYmFzaWMgZXZlbnQgaW50byBhIGNvaGVzaXZlIHNlcXVlbmNlIG9mIGVpZ2h0IGNoZWNrcG9pbnRzLiBFYWNoIGNoZWNrcG9pbnQgc2hvdWxkIGhhdmUgYSBwbG90IHNlZ21lbnQgZm9sbG93ZWQgYnkgZW5nYWdpbmcgY3liZXJzZWN1cml0eSBxdWVzdGlvbnMgdGhhdCB0ZXN0IGtub3dsZWRnZSwgY3JpdGljYWwgdGhpbmtpbmcsIGFuZCBza2lsbHMuCgpFeHBhbmQgb24gdGhlIHByb3ZpZGVkIHNjZW5hcmlvLCBlbnN1cmluZyByZWFsaXNtIGFuZCByZWxldmFuY2UgdG8gY3liZXJzZWN1cml0eSwgYW5kIG1ha2UgdGhlIGVkdWNhdGlvbmFsIGZsb3cgaW50ZXJhY3RpdmUgYW5kIGluZm9ybWF0aXZlLiBFYWNoIHBsb3Qgc2VnbWVudCBhbmQgcXVlc3Rpb24gc2hvdWxkIGJ1aWxkIHVwb24gdGhlIHByZXZpb3VzIG9uZSwgZHJpdmluZyB0aGUgc3RvcnlsaW5lIGZvcndhcmQuCgoqKk91dHB1dCBTdHJ1Y3R1cmUqKjogUHJvdmlkZSB0aGUgY29udGVudCBhcyBhbiBhcnJheSB1c2luZyB0aGlzIEpTT04gc3RydWN0dXJlOgoKYGBganNvbgp7CiAgInNjZW5hcmlvIjogWwogICAgewogICAgICAidHlwZSI6ICJwbG90IiwKICAgICAgInN1YnR5cGUiOiBudWxsLAogICAgICAiY29udGVudCI6ICJEZXNjcmlwdGlvbiBvZiB0aGUgY3VycmVudCBzY2VuYXJpbyBzdGFnZS4iCiAgICB9LAogICAgewogICAgICAidHlwZSI6ICJxdWVzdGlvbnMiLAogICAgICAic3VidHlwZSI6ICJ0cnVlLWZhbHNlIiwKICAgICAgInF1ZXN0aW9uIjogIkEgY3liZXJzZWN1cml0eSBxdWVzdGlvbiBhYm91dCB0aGUgc2NlbmFyaW8uIiwKICAgICAgImNvbnRlbnQiOiB7CiAgICAgICAgIkEiOiAiVHJ1ZSIsCiAgICAgICAgIkIiOiAiRmFsc2UiCiAgICAgIH0sCiAgICAgICJhbnN3ZXIiOiAiQSIsICAvLyBvciAiQiIgZGVwZW5kaW5nIG9uIHRoZSBjb3JyZWN0IGFuc3dlcgogICAgICAicmVhc29uIjogIlRoZSByZWFzb24gd2h5IHRvIGNob29zZSBBIGluc3RlYWQgb2YgQiIKICAgIH0sCiAgICB7CiAgICAgICJ0eXBlIjogInF1ZXN0aW9ucyIsCiAgICAgICJzdWJ0eXBlIjogIm11bHRpcGxlLWNob2ljZSIsCiAgICAgICJxdWVzdGlvbiI6ICJBIG11bHRpcGxlLWNob2ljZSBxdWVzdGlvbiBiYXNlZCBvbiB0aGUgc2NlbmFyaW8uIiwKICAgICAgImNvbnRlbnQiOiB7CiAgICAgICAgIkEiOiAiT3B0aW9uIEEgY29udGVudCIsCiAgICAgICAgIkIiOiAiT3B0aW9uIEIgY29udGVudCIsCiAgICAgICAgIkMiOiAiT3B0aW9uIEMgY29udGVudCIsCiAgICAgICAgIkQiOiAiT3B0aW9uIEQgY29udGVudCIKICAgICAgfSwKICAgICAgImFuc3dlciI6ICJBIiwgIC8vIGtleSBvZiB0aGUgY29ycmVjdCBjaG9pY2UKICAgICAgInJlYXNvbiI6ICJUaGUgcmVhc29uIHdoeSB0byBjaG9vc2UgQSBpbnN0ZWFkIG9mIG90aGVyIGNob2ljZSIKICAgIH0sCiAgICB7CiAgICAgICJ0eXBlIjogInF1ZXN0aW9ucyIsCiAgICAgICJzdWJ0eXBlIjogImZyZWUtdHlwZSIsCiAgICAgICJxdWVzdGlvbiI6ICJBIGZyZWUtcmVzcG9uc2UgcXVlc3Rpb24gdGhhdCByZXF1aXJlcyBhIGNyaXRpY2FsIGFuc3dlci4iLAogICAgICAiY29udGVudCI6IG51bGwsCiAgICAgICJhbnN3ZXIiOiAiIiAgLy8gbGVmdCBibGFuayBmb3IgZnJlZS10eXBlIHJlc3BvbnNlcwogICAgfQogIF0KfQpgYGA=")
        + "\nMust generate at least one code review questions in Python by giving a code snippet and ask the user to point out the issues in the code implementations."
        + "\nMust Use 正體中文 with 台灣用語習慣 to answer, 如果存在專有名詞，請保留原文。",
        basicPlot.value,
        useModel,
        ScenarioSchema,
        "scenario"
    )
    outputResult.value = JSON.stringify(chatCompletion, null, 2)
    ElMessage.success('生成劇情成功，花費 ' + price + ' 元')
    plotStore.$reset()
    plotContent.value = JSON.parse(chatCompletion.choices[0].message.content)
    await nextTick()
    document.getElementById("mainPlot").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
  } catch (error) {
    console.error(error)
    ElMessageBox.alert('生成劇情失敗', '錯誤')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div v-loading="isLoading">
    <h1>Plot Generator</h1>
    <ElInput
        v-model="basicPlot"
        :rows="5"
        type="textarea"
        placeholder="Please input basic plot"/>
    <ElButton @click="generatePlot" type="success" :disabled="!basicPlot">產生劇情</ElButton>
    <ElButton v-if="plotContent?.scenario?.length > 0" @click="plotStore.$reset()" type="danger">清空劇情</ElButton>
    <ElInput
        v-model="outputResult"
        :rows="10"
        type="textarea"
        placeholder="Output result"/>
  </div>
</template>

<style scoped>

</style>