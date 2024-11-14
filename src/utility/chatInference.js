import OpenAI from "openai";
import {usePriceStore} from "@/stores/price.js";
import {storeToRefs} from "pinia";
import {useOpenAPIKeyStore} from "@/stores/apikey.js";
import {zodResponseFormat} from "openai/helpers/zod";


const calculatePrice = (model, usage) => {
    const mapper = {
        "gpt-4o-mini": {
            "prompt_tokens": 0.15 / 1e6,
            "completion_tokens": 0.600 / 1e6
        }
    }
    const price = mapper[model]
    return (price.prompt_tokens * usage.prompt_tokens + price.completion_tokens * usage.completion_tokens) * 31
}


export default async function chatInference(systemPrompt, userPrompt, useModel = "gpt-4o-mini", response_schema = null, response_schema_name = null) {
    const OpenAPIKeyStore = useOpenAPIKeyStore()
    const {openaiAPIKey} = storeToRefs(OpenAPIKeyStore)
    const client = new OpenAI({
        apiKey: openaiAPIKey.value,
        dangerouslyAllowBrowser: true
    });
    const payload = {
        messages: [
            {
                role: 'system',
                content: systemPrompt
            },
            {role: 'user', content: userPrompt}
        ],
        model: useModel,
    }
    if (response_schema && response_schema_name) {
        payload.response_format = zodResponseFormat(response_schema, response_schema_name)
    }

    const chatCompletion = await client.chat.completions.create(payload);
    // Update the price
    const PriceStore = usePriceStore()
    const {priceTotal} = storeToRefs(PriceStore)
    const price = calculatePrice(useModel, chatCompletion.usage)
    priceTotal.value += price
    return {chatCompletion, price}
}