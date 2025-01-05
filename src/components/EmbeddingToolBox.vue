<script setup>
import {ref} from "vue";
import requestEmbedding from "@/utility/embedding.js";
import {default as embedData} from "@/assets/embed-data.json";
import rankEmbeddings from "@/utility/vector.js";
import DisplayMedia from "@/components/DisplayMedia.vue";
import i18n from "@/utility/i18n.js";

const isLoading = ref(false)
const textToEmbed = ref("")
const embedResult = ref("")
const imgURLList = ref([])

const makeEmbedding = async () => {
  isLoading.value = true
  const embeddingResult = await requestEmbedding(textToEmbed.value)
  embedResult.value = JSON.stringify(
      {
        embedding: embeddingResult['data'][0].embedding
      }, null, 2
  )
  isLoading.value = false
  imgURLList.value = rankEmbeddings(
      embeddingResult['data'][0].embedding, embedData
  ).slice(0, 5).map(
      (item) => item['fileName']
  )
}
</script>

<template>
  <div v-loading="isLoading">
    <h1>{{ i18n('embeddingToolBox') }}</h1>
    <ElInput
        v-model="textToEmbed"
        :rows="5"
        type="textarea"
        :placeholder="i18n('enterTextToEmbed')"
    />
    <ElButton @click="makeEmbedding" type="success" :disabled="!textToEmbed">{{ i18n('calcEmbedding') }}</ElButton>
    <ElInput
        v-model="embedResult"
        :rows="10"
        type="textarea"
        :placeholder="i18n('embeddingResult')"
    />
    <h3 v-show="imgURLList.length > 0">{{ i18n('top5ResultInLibrary')}}</h3>
    <el-carousel :interval="4000" type="card" height="200" v-show="imgURLList.length > 0">
      <el-carousel-item :key="src" v-for="(src, index) in imgURLList">
        {{ index + 1 }}. {{ src.split("/").pop() }}
        <br>
        <DisplayMedia :file-name="src"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<style scoped>

</style>
