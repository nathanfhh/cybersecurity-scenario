<script setup>
import {onMounted, ref} from "vue";
import {useOpenAPIKeyStore} from "@/stores/apikey.js";
import {storeToRefs} from "pinia";

const apiKey = ref("")
const OpenAPIKeyStore = useOpenAPIKeyStore()
const {openaiAPIKey} = storeToRefs(OpenAPIKeyStore)

const syncToLocalStorage = () => {
  openaiAPIKey.value = apiKey.value
}
onMounted(() => {
  apiKey.value = openaiAPIKey.value || ""
})
</script>

<template>
  <h1>OpenAI API Key</h1>
  <ElInput
      v-model="apiKey"
      @change="syncToLocalStorage"
      show-password
      placeholder="OpenAI API Key"
  />
</template>

<style scoped>

</style>