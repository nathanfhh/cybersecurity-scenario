<script setup>
import {onMounted, ref} from "vue";
import {useOpenAPIKeyStore} from "@/stores/apikey.js";
import {storeToRefs} from "pinia";
import i18n from "@/utility/i18n.js";

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
  <h1>{{ i18n('openAIAPIKey') }}<br>
  <span class="warning">{{ i18n('openAIAPIKeyInLocalStorageWarning') }}</span>
  </h1>
  <ElInput
      v-model="apiKey"
      @change="syncToLocalStorage"
      show-password
      :placeholder="i18n('openAIAPIKey')"
  />
</template>

<style scoped>
.warning {
  color: yellow;
  font-size: 0.6em;
}
</style>