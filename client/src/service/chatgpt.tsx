import OpenAI from "openai";
import { OPENAI_SETTINGS } from "../constant";

const openai = new OpenAI({apiKey: OPENAI_SETTINGS.KEY, dangerouslyAllowBrowser: true});
const getChatGPT = async (text: string) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": text
              }
            ]
          }
        ]
      });
    return response.choices[0].message.content
}

export {getChatGPT};