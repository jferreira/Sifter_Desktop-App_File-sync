<template>
    <h1>Hemlo</h1>
    <ol class="file-tree prose prose-ul:marker:red" v-html="fileStructure">
    </ol>
</template>

<script setup>
import { computed } from "@vue/runtime-core"

const props = defineProps(['tree'])

const getUlTemplate = (ele) => {
    let template = '<ul class="folder">';
    ele?.children?.forEach(ele => {
        if (ele && ele.type == "folder") {
            template += '<ul>'
            template += `<li class="folder">${ele.name}</li>`
            template += getUlTemplate(ele)
            template += '</ul>'
        } else {
            template += `<li class="file ml-4">${ele.name}</li>`
        }
    })

    template += '</ul>'

    return template;
}


const fileStructure = computed(() => {
    let template = '';
    props.tree.reverse().forEach(ele => {
        if (ele && ele.type == "folder") {
            template += '<ul>'
            template += `<li class="folder">${ele.name}</li>`
            template += getUlTemplate(ele)
            template += '</ul>'
        } else {
            template += `<li class="file ml-4">${ele.name}</li>`
        }
    })
    return template
})



</script>

<style>

</style>