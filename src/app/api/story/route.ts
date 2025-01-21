import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface Panel {
  imagePrompt: string;
  caption: string;
}

interface StoryResponse {
  panels: Panel[];
}

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
  defaultQuery: { "api-version": "2024-02-15-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY }
});

export async function POST(request: Request) {
  try {
    const { theme } = await request.json();

    if (!process.env.AZURE_OPENAI_KEY) {
      return NextResponse.json(
        { error: 'Azure OpenAI API key not configured' },
        { status: 500 }
      );
    }

    if (!process.env.AZURE_OPENAI_ENDPOINT) {
      return NextResponse.json(
        { error: 'Azure OpenAI endpoint not configured' },
        { status: 500 }
      );
    }

    const prompt = `Create a 3-panel comic story about ${theme}. For each panel, provide:
    1. A description of what should be in the image
    2. The caption or dialogue for that panel
    Make it engaging and suitable for a comic format.
    Return it in the following JSON format:
    {
      "panels": [
        {
          "imagePrompt": "detailed description for image generation",
          "caption": "text that will appear below the panel"
        }
      ]
    }`;

    console.log('Sending prompt to Azure OpenAI:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",  // Using the same model name as in the test
      messages: [
        {
          role: "system",
          content: "You are a creative comic book writer who specializes in creating engaging 3-panel stories. Focus on visual storytelling and clear, concise descriptions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      console.error('No content received from Azure OpenAI');
      throw new Error('No content received from Azure OpenAI');
    }

    console.log('Azure OpenAI Response:', content);

    try {
      const story = JSON.parse(content) as StoryResponse;
      
      // Validate the story structure
      if (!story.panels || !Array.isArray(story.panels) || story.panels.length !== 3) {
        throw new Error('Invalid story format: Expected 3 panels');
      }

      // Validate each panel
      story.panels.forEach((panel: Panel, index: number) => {
        if (!panel.imagePrompt || !panel.caption) {
          throw new Error(`Invalid panel ${index + 1}: Missing imagePrompt or caption`);
        }
      });

      return NextResponse.json(story);
    } catch (parseError) {
      console.error('Error parsing Azure OpenAI response:', parseError);
      throw new Error('Failed to parse story format');
    }
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    );
  }
} 