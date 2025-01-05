import {defineStore} from "pinia";

export const useLanguageStore = defineStore("Language", {
    state: () => ({
        useZhTw: false,
    }),
    persist: true
});
