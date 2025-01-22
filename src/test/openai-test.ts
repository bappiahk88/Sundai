import OpenAI from 'openai';

async function testOpenAI() {
  try {
    console.log('Starting Azure OpenAI API test...');
    
    if (!process.env.AZURE_OPENAI_KEY) {
      throw new Error('Azure OpenAI API key not configured');
    }

    if (!process.env.AZURE_OPENAI_ENDPOINT) {
      throw new Error('Azure OpenAI endpoint not configured');
    }

    console.log('API Key found, initializing Azure OpenAI...');
    
    const openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      baseURL: process.env.AZURE_OPENAI_ENDPOINT,
      defaultQuery: { "api-version": "2024-02-15-preview" },
      defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY }
    });

    console.log('Making API call...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",  // This should match your Azure OpenAI deployment name
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "Say hello!"
        }
      ],
    });

    console.log('API Response:', completion.choices[0]?.message?.content);

  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testOpenAI(); 