import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: Request) {
  try {
    const { panels } = await request.json();

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Generate images for all panels in parallel
    const imagePromises = panels.map(async (panel: { imagePrompt: string }) => {
      const output = await replicate.run(
        "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        {
          input: {
            prompt: panel.imagePrompt,
            negative_prompt: "low quality, blurry, distorted, text, words, letters",
            width: 768,
            height: 768,
          }
        }
      );

      if (!Array.isArray(output) || !output[0] || typeof output[0] !== 'string') {
        throw new Error('Invalid response format from Replicate');
      }

      return output[0];
    });

    const imageUrls = await Promise.all(imagePromises);

    // Return array of image URLs
    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    );
  }
} 