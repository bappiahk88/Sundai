'use client';

import { useState } from 'react';
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateComic = async () => {
    try {
      setLoading(true);
      setError('');
      setImageUrl(''); // Clear previous image
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (!data.imageUrl) {
        throw new Error('No image URL received');
      }

      setImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  console.log('Current imageUrl:', imageUrl);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300">
          Comic Book Generator
        </h1>
        
        <p className="text-lg text-center max-w-2xl">
          Create your own comic book adventures with our AI-powered generator! 
          Design unique characters, craft engaging storylines, and bring your imagination to life.
        </p>

        <div className="w-full max-w-2xl flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your comic scene... (e.g., 'A superhero flying through a futuristic city at night')"
            className="w-full p-4 rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 min-h-[100px]"
            disabled={loading}
          />
          
          <button
            onClick={generateComic}
            disabled={loading || !prompt.trim()}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white gap-2 text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Generate Comic Panel'}
          </button>

          {error && (
            <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              {error}
            </div>
          )}

          {imageUrl && (
            <div className="mt-8">
              <Image
                src={imageUrl}
                alt="Generated comic panel"
                width={512}
                height={512}
                className="w-full rounded-xl shadow-lg"
                unoptimized
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="font-bold mb-2">1. Design Characters</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Create unique heroes and villains for your story</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="font-bold mb-2">2. Write Story</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Craft an engaging plot with AI assistance</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="font-bold mb-2">3. Generate Panels</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Transform your story into visual comic panels</p>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-300">
        <a
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          href="#"
        >
          About
        </a>
        <a
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          href="#"
        >
          Help
        </a>
        <a
          className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          href="#"
        >
          Terms
        </a>
      </footer>
    </div>
  );
}
