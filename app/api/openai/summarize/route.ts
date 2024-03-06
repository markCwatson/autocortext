import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { conversation } = await request.json();
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are a tool for summarizing conversations. Briefly summarize the following conversation into a few sentences. Split it up into the following sections, each on a new line: Date, Time, Name, Description, Actions, Conclusion, and Recommendations.',
      },
      { role: 'user', content: `${conversation}` },
    ],
    temperature: 0.6,
  });

  return new NextResponse(
    JSON.stringify({ summary: stream.choices[0].message.content }),
  );
}
