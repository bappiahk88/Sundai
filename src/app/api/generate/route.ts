import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Create a prediction
    const prediction = await replicate.predictions.create({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt,
        negative_prompt: "low quality, blurry, distorted",
        width: 768,
        height: 768,
      }
    });

    // Wait for the prediction to complete
    let result = await replicate.predictions.get(prediction.id);
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
      console.log('Prediction status:', result.status);
    }

    if (result.status === "failed") {
      throw new Error('Image generation failed');
    }

    if (!result.output || !result.output[0]) {
      throw new Error('No output received from the model');
    }

    const imageUrl = result.output[0];
    console.log('Generated image URL:', imageUrl);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 