import OpenAI from 'openai';

const configuration = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

const createEmbedding = async (text: string): Promise<number[] | undefined> => {
  try {
    const request = {
      model: 'text-embedding-3-small',
      input: text,
    };

    const embeddingResponse = await configuration.embeddings.create(request);
    const embedding = embeddingResponse.data[0].embedding;

    if (embedding) {
      console.log('embedding', embedding);
      return embedding;
    } else {
      throw new Error('Failed to retrieve embedding.');
    }
  } catch (error) {
    console.error('Error creating embedding:', error);
    return undefined;
  }
};

export { createEmbedding };
