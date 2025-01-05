<script setup>
import i18n from "@/utility/i18n.js";

const props = defineProps({
  fileName: {
    type: String,
    required: true
  }
})
</script>

<template>
  <template v-if="props.fileName">
    <ElImage :src="props.fileName" v-if="props.fileName.endsWith('webp')" fit="contain" />
    <video loop autoplay muted playsinline
           v-else-if="props.fileName.endsWith('webm')" style="width: 100%">
      <source :src="props.fileName" type="video/webm">
      {{ i18n("browserNotSupportVideo") }}
    </video>
  </template>
</template>

<style scoped>

</style>