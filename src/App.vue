<script setup>
import EmbeddingToolBox from "@/components/EmbeddingToolBox.vue";
import PlotGenerator from "@/components/PlotGenerator.vue";
</script>
<template>
  <div class="container">
    <div>
      <EmbeddingToolBox/>
    </div>
    <div>
      <PlotGenerator/>
    </div>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  gap: 15px;
}
</style>