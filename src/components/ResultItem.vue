<template>
    <section @click="openFile">
        <div class="flex flex-col items-center px-5 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 shadow-md mb-2 rounded-md">
            <div class="flex flex-col w-full max-w-3xl mx-auto prose text-left prose-blue">
                <div class="w-full mx-auto">
                    <!-- <h2>A small headline to switch your visitors into users.</h2> -->
                    <p v-html="parsedText"></p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { getIndicesOf } from '../utils';

export default {
    props: ['text', 'term'],
    computed: {
        parsedText() {
            const searchMask = this.term;
            const regEx = new RegExp(searchMask, "ig");
            const replaceMask = `<mark class="bg-indigo-500">${this.term}</mark>`;
            return this.text.replaceAll(regEx, replaceMask);
        }
    }
}
</script>

<style>

</style>