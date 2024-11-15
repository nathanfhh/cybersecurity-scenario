<script setup>
import {ref} from "vue";
import requestEmbedding from "@/utility/embedding.js";

const isLoading = ref(false)
const textToEmbed = ref("")
const embedResult = ref("")

const makeEmbedding = async () => {
  isLoading.value = true
  const embeddingResult = await requestEmbedding(textToEmbed.value)
  embedResult.value = JSON.stringify(
      {
        embedding: embeddingResult['data'][0].embedding
      }, null, 2
  )
  isLoading.value = false
}
</script>

<template>
  <div v-loading="isLoading">
    <h1>Embedding ToolBox</h1>
    <ElInput
        v-model="textToEmbed"
        :rows="5"
        type="textarea"
        placeholder="Please input"
    />
    <ElButton @click="makeEmbedding" type="success" :disabled="!textToEmbed">計算 Embedding</ElButton>
    <ElInput
        v-model="embedResult"
        :rows="10"
        type="textarea"
        placeholder="Embedding result"
    />
  </div>
</template>

<style scoped>

</style>
