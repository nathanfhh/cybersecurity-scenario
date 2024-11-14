import {defineStore} from "pinia";

export const usePriceStore = defineStore("Price", {
    state: () => ({
        priceTotal: 0,
    }),
    persist: true
});
