<script setup>
import ResultItem from '../components/ResultItem.vue';
import { useGlobalStore } from '~/store/global.js'
import throttle from 'lodash/throttle'
import { useToast } from 'vue-toastification'

const store = useGlobalStore();

const toast = useToast();
const selectFolder = (e) => {
  window.ocr.selectFolder();
}

const initOcr = () => {
  window.ocr.initOcr(JSON.parse(JSON.stringify(store.ocr.fileTree)))
}

window.ocr.onDirs((tree) => {
  store.setFileTree(tree)
})

// window.ocr.onIndexed((node) => {
//   console.log(node);
// })

const search = throttle((e) => {
  const term = e.target.value
  store.msg = "Searching..."
  window.search.find(term);
}, 200)


window.search.onResult((results) => {
  store.msg = `Total records found: ${results.length}`
  store.searchResults = results;
  console.log(results);
})

const openFile = (path) => {
  toast(`Opening file ${path.replace(/^.*[\\\/]/, '')}`);
  window.search.openFile(path);
}


</script>


<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-start items-center">
    <div class="relative p-12 pb-2 w-full sm:max-w-2xl sm:mx-auto">
      <h1
        class="max-w-5xl text-2xl font-bold leading-none tracking-tighter text-center text-neutral-600 md:text-5xl lg:text-6xl lg:max-w-7xl">
        Sifter
      </h1>
      <div class="overflow-hidden z-0 rounded-full relative p-3">
        <form role="form" @submit.prevent="() => { }" class="relative flex z-50 bg-white rounded-full">
          <input type="text" placeholder="Enter your search here" @change="search"
            class="rounded-full flex-1 px-6 py-4 text-gray-700 focus:outline-none" />
          <button type="submit"
            class="bg-indigo-500 text-white rounded-full font-semibold px-8 py-4 hover:bg-indigo-400 focus:bg-indigo-600 focus:outline-none">Search</button>
        </form>
      </div>
    </div>
    <small class="mb-2">{{ store.msg }}</small>
    <div>
      <article class="bg-white" v-for="result in store.searchResults" :key="result.key">
        <ResultItem @click.once="openFile(result.path)" :term="result.term" :text="result.text" :path="result.path" />
      </article>

    </div>
  </div>

</template>

<style scoped>

</style>
