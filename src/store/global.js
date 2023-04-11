import { defineStore } from "pinia"

export const useGlobalStore = defineStore('global-store', {
    state: () => ({
        ocr: {
            currentItem: "",
            fileTree: []
        },
        msg: "",
        searchResults: []
    }),
    getters: {
        currentOcrItem: (state) => state.ocr.currentItem
    },
    actions: {
        setCurrentOcrItem(item) {
            this.ocr.currentItem = item
        },
        setFileTree(tree) {
            this.ocr.fileTree = tree
        },
        setMsg(msg) {
            this.msg = msg;
        }
    }
})