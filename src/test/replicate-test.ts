import Replicate from 'replicate';

async function testReplicateAPI() {
  try {
    console.log('Starting Replicate API test...');
    
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    console.log('Making API call...');
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: "A superhero flying through a futuristic city at night",
          negative_prompt: "low quality, blurry, distorted",
          width: 768,
          height: 768,
        }
      }
    );

    console.log('API Response Type:', typeof output);
    console.log('Is Array?', Array.isArray(output));
    console.log('Raw output:', JSON.stringify(output, null, 2));

    if (Array.isArray(output)) {
      console.log('First element type:', typeof output[0]);
      console.log('First element:', output[0]);
    }

  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testReplicateAPI(); 