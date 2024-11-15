<script setup>
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/monokai-sublime.css';
import {computed, ref, watch} from "vue";

hljs.registerLanguage('python', python);

const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, {language: lang}).value;
      } catch (__) {
      }
    }

    return ''; // use external default escaping
  }
});
const props = defineProps({
  answerResult: {
    type: Object,
    required: true
  },
  plotContent: {
    type: Object,
    required: true
  }
})
let windowWidth = window.innerWidth;
window.addEventListener('resize', () => {
  windowWidth = window.innerWidth;
})
const columns = computed(() => [
  {
    key: 'index',
    title: '項目',
    dataKey: 'index',
    width: windowWidth / 11
  },
  {
    key: 'content',
    title: '指示',
    dataKey: 'content',
    width: windowWidth / 11 * 3
  },
  {
    key: 'answer',
    title: '您的回答',
    dataKey: 'answer',
    width: windowWidth / 11 * 3
  },
  {
    key: 'comment',
    title: '解析',
    dataKey: 'comment',
    width: windowWidth / 11 * 3
  },
  {
    key: 'score',
    title: '分數',
    dataKey: 'score',
    width: windowWidth / 11
  },
])
const tableData = ref([])
watch(
    () => props.answerResult,
    () => {
      console.log("Gather data for tableData")
      tableData.value = props.plotContent.scenario.map((item, index) => {
        if (item.type === 'questions') {
          let recommendAnswer = ''
          if (item.answer) {
            recommendAnswer = item.answer
          }
          return {
            id: `question-${index}`,
            content: (item.question || '') + (item.content && item.subtype !== 'free-type' ? Object.entries(item.content).map(([key, value]) => `\n${key}: ${value}`).join(' ') : ''),
            answer: props.answerResult?.[index]?.rawAnswer || '',
            comment: (recommendAnswer ? `參考答案：${recommendAnswer}\n` : '') + (props.answerResult?.[index]?.gradeResult?.comment || ''),
            score: props.answerResult?.[index]?.gradeResult?.score,
            type: 'questions',
            index: index
          }
        } else if (item.type === 'plot') {
          return {
            id: `plot-${index}`,
            content: item.content || '',
            answer: '',
            comment: '',
            score: '',
            type: 'plot',
            index: index
          }
        }
      })
    },
    {immediate: true, deep: true}
)
</script>

<template>
  <div style="width: 100vw; height: 100vh">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
            :columns="columns"
            :data="tableData"
            :width="width"
            :height="height"
            :fixed="true"
            :estimated-row-height="50"
        >
          <template #cell="{ column, rowData }">
            <span v-if="!['index', 'score'].includes(column.dataKey)"
                  v-html="md.render(rowData[column.dataKey] || '').replaceAll('\n', '<br>')"
            />
            <span v-else>{{ rowData[column.dataKey] }}</span>
          </template>
        </el-table-v2>
      </template>
    </el-auto-resizer>
  </div>
</template>

<style scoped>

</style>