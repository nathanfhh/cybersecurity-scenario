import {defineStore} from "pinia";

export const useOpenAPIKeyStore = defineStore("OpenAPIKey", {
    state: () => ({
        openaiAPIKey: null,
    }),
    persist: true
});
