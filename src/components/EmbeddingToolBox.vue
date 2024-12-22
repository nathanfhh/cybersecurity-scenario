<script setup>
import {ref} from "vue";
import requestEmbedding from "@/utility/embedding.js";
import {default as embedData} from "@/assets/embed-data.json";
import rankEmbeddings from "@/utility/vector.js";
import DisplayMedia from "@/components/DisplayMedia.vue";

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
