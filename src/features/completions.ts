import OpenAI from "openai";

const together = new OpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: "https://api.together.xyz/v1",
});

// export type TogetherCompletionParams = {
//     systemPrompt: string;
//     message: string;
//     model?: string;
// }

export const generateTogetherCompletion = async (
  message: string,
  systemPrompt: string = "You are a helpful assistant.",
  model: string = "mistralai/Mixtral-8x7B-Instruct-v0.1"
) => {
  const result = await together.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    temperature: 0.7,
    top_p: 0.7,
  });

  const response = result.choices[0].message.content;

  return response;
};
