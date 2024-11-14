import {defineStore} from "pinia";

export const usePlotStore = defineStore("Plot", {
    state: () => ({
        plotContent: {},
    }),
    persist: true
});
