import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

async function hitOpenAiApi(prompt: string): Promise<string | undefined> {
  try {
    const response = await openai.chat.completions.create({
      //model: 'gpt-3.5-turbo-16k',
      model:"text-embedding-3-small",
      stream: false,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content: string | undefined = response.choices[0]?.message?.content ?? undefined;
    // console.log('response', content);
    return content;
  } catch (error) {
    console.error('Error hitting OpenAI API:', error);
    return undefined;
  }
}

export { hitOpenAiApi };
