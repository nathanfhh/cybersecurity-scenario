<script setup>
import EmbeddingToolBox from "@/components/EmbeddingToolBox.vue";
import PlotGenerator from "@/components/PlotGenerator.vue";
import OpenAPIKey from "@/components/OpenAPIKey.vue";

import {storeToRefs} from "pinia";
import {useOpenAPIKeyStore} from "@/stores/apikey.js";
import PlotDisplay from "@/components/PlotDisplay.vue";
import {usePlotStore} from "@/stores/plot.js";
import {usePriceStore} from "@/stores/price.js";
import {useLanguageStore} from "@/stores/language.js";
import i18n from "@/utility/i18n.js";
import {oneUsdToNtd} from "./utility/pricing.js";

const OpenAPIKeyStore = useOpenAPIKeyStore()
const {openaiAPIKey} = storeToRefs(OpenAPIKeyStore)
const plotStore = usePlotStore()
const {plotContent} = storeToRefs(plotStore)
const PriceStore = usePriceStore()
const {priceTotal} = storeToRefs(PriceStore)
const LanguageStore = useLanguageStore()
const {useZhTw} = storeToRefs(LanguageStore)
</script>
<template>
  <div style="position: relative">
    <div style="position: absolute; top: 1px; right: 1px">
      <el-switch v-model="useZhTw" active-text="繁體中文（台灣）" inactive-text="English"/>
      <span style="margin-left: 5px;">
      {{ useZhTw ? "🇹🇼 NT" : '🇺🇸 USD'}}  $: {{ priceTotal * (useZhTw ? oneUsdToNtd : 1) }}
      <ElButton v-show="priceTotal > 0" type="danger" @click="PriceStore.$reset()" size="small"
                style="padding: 8px 16px !important;">{{ i18n('resetMoney') }}
      </ElButton>
      </span>
    </div>
  </div>
  <OpenAPIKey/>
  <div class="container" v-show="openaiAPIKey">
    <div>
      <EmbeddingToolBox style="width: calc(50vw - 30px);"/>
    </div>
    <div>
      <PlotGenerator style="width: calc(50vw - 30px);"/>
    </div>
  </div>
  <PlotDisplay v-show="plotContent"/>
</template>
<style scoped>
.container {
  display: flex;
  gap: 15px;
  justify-content: space-around;
}
</style>