import OpenAI from "openai";
import {useOpenAPIKeyStore} from "@/stores/apikey.js";
import {usePriceStore} from "@/stores/price.js";
import {storeToRefs} from "pinia";
import {oneUsdToNtd} from "@/utility/pricing.js";


const calculatePrice = (model, tokens) => {
    const mapper = {
        "text-embedding-3-small": 0.02 / 1e6
    }
    return mapper[model] * tokens * oneUsdToNtd
}
const cachedEmbeddings = {}
export default async function requestEmbedding(text) {
    text = text.trim()
    if (cachedEmbeddings[text]) {
        console.log("Using cached embedding for", text)
        return cachedEmbeddings[text]
    }
    const OpenAPIKeyStore = useOpenAPIKeyStore()
    const {openaiAPIKey} = storeToRefs(OpenAPIKeyStore)
    const PriceStore = usePriceStore()
    const {priceTotal} = storeToRefs(PriceStore)
    try {
        const client = new OpenAI({
            apiKey: openaiAPIKey.value,
            dangerouslyAllowBrowser: true
        });
        let useEmbedModel = "text-embedding-3-small";
        const embeddingResult = await client.embeddings.create({
            model: useEmbedModel,
            input: text,
            encoding_format: "float",
        });
        console.log(embeddingResult);
        priceTotal.value += calculatePrice(useEmbedModel, embeddingResult.usage.total_tokens)
        cachedEmbeddings[text] = embeddingResult
        return embeddingResult
    } catch (error) {
        console.error(error)
    }
}