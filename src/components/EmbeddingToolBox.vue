<script setup>
import {onMounted, ref} from "vue";
import OpenAI from 'openai';
import {useOpenAPIKeyStore} from "@/stores/apikey.js";
import {storeToRefs} from "pinia";

const apiKey = ref("")
const textToEmbed = ref("")
const embedResult = ref("")
const OpenAPIKeyStore = useOpenAPIKeyStore()
const {openaiAPIKey} = storeToRefs(OpenAPIKeyStore)

const makeEmbedding = async () => {
  const client = new OpenAI({
    apiKey: apiKey.value,
    dangerouslyAllowBrowser: true
  });
  const embedding = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: textToEmbed.value,
    encoding_format: "float",
  });
  console.log(embedding);
  embedResult.value = JSON.stringify(embedding, null, 2)
}

const syncToLocalStorage = () => {
  openaiAPIKey.value = apiKey.value
}
onMounted(() => {
  apiKey.value = openaiAPIKey.value || ""
})

</script>

<template>
  <div>
    <h1>Embedding ToolBox</h1>
    <ElInput
        v-model="apiKey"
        @change="syncToLocalStorage"
        show-password
        placeholder="OpenAI API Key"
    />
    <ElInput
        v-model="textToEmbed"
        :rows="5"
        type="textarea"
        placeholder="Please input"
    />
    <ElButton @click="makeEmbedding" type="success">計算 Embedding</ElButton>
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
