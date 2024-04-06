import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAiService {
  static async summarize(conversation: string) {
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
      temperature: 0.5,
    });

    return stream.choices[0].message.content;
  }
}

export default OpenAiService;
