import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { conversation } = await request.json();
  const stream = await openai.completions.create({
    model: 'gpt-3.5-turbo-instruct', // todo: use newer model?
    prompt: generatePrompt(conversation),
    max_tokens: 1000,
    temperature: 0.8,
  });

  return new NextResponse(JSON.stringify({ summary: stream.choices[0].text }));
}

function generatePrompt(conversation: string): string {
  return `Summarize the following conversation into a few sentences. Split it up into the following sections, each on a new line: \n\n
  Date, Time, Name, Description, Actions, Conclusion, Recommendations, \n\n
  Here is the conversation: ${conversation}`;
}
