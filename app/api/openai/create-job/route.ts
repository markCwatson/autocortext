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
        content: `Take the following conversation and create a brief job title, description, and severity.
          The title should be just a jew words and the description just one or two sentences.
          The severity can be either one of Severe, High, Medium, or Low, exactly as shown.`,
      },
      {
        role: 'user',
        content: `Auto Cortext: Hello mark.
          I am ready to assist you in troubleshooting problems with your equipment. If you explain the issue, I will suggest a solution.
          What machine are you having trouble with?
          mark selected the Lathe
          Auto Cortext: Great! What system in the Lathe are you having issues with?
          mark selected the Mechanical system.
          Auto Cortext: OK, tell me about the problem you are experiencing with the Mechanical system
          User: the shaft is wobbling
          Auto Cortext: It sounds like the issue with the shaft wobbling could be related to the alignment and bearings of the spindle system. Here's what you can do to address this problem:
          1. **Spindle Alignment**: Check if the spindle rotates off-axis. This misalignment can cause wobbling.
            - Loosen the bearing lock nut.
            - Tighten the bearing adjustment nut to adjust the bearing that supports the spindle.
            - Rotate the spindle to test, and ensure it rotates perfectly using a comparator to check its alignment.
            - Re-tighten the bearing locking nut after adjustment.
          2. **Inspect Bearings**: Damaged or improperly adjusted bearings can also lead to wobbling.
            - Inspect the bearings for any signs of damage or wear.
            - Ensure the bearings are properly lubricated.
          3. **Check for Loose Components**: Ensure that all components connected to the shaft and spindle assembly are securely tightened. Loose components can contribute to wobbling.
          If these steps do not resolve the issue, it may be necessary to consult with a specialist or seek professional repair services, as the problem might be more complex or involve parts that require precise adjustment or replacement.
          User: yes it's a Spindle Alignment issue. how do i adjust it?
          Auto Cortext: To adjust the spindle alignment due to its wobbling issue, follow these steps closely:
          1. **Loosen the Bearing Lock Nut**: Start by loosening the lock nut that secures the bearing. This nut is crucial for maintaining the bearing's position, and loosening it will allow you to adjust the bearing's tightness, which in turn affects the spindle's alignment.
          2. **Tighten the Bearing Adjustment Nut**: After loosening the lock nut, proceed to tighten the adjustment nut. This nut adjusts the pressure on the tapered bearings that support the spindle. Tightening this nut will adjust the position of the spindle, aiming to correct any off-axis rotation. Do this carefully to avoid over-tightening, which could cause excessive wear or damage.
          3. **Test the Spindle Rotation**: Once you have adjusted the nut, manually rotate the spindle to test its movement. It is important that the spindle turns smoothly and without wobbling. For a more precise check, use a comparator to ensure the spindle rotates perfectly on its axis. This step is crucial to confirm that the adjustment has corrected the misalignment.
          4. **Re-tighten the Bearing Lock Nut**: After confirming that the spindle rotates correctly and the wobbling has been addressed, re-tighten the bearing lock nut to secure the bearing in its newly adjusted position. This ensures that the adjustment remains stable and prevents the spindle from becoming misaligned again.`,
      },
      {
        role: 'system',
        content: `Job Title: Align Spindle
          Description: Adjust the spindle alignment to resolve wobbling issues. Loosen the bearing lock nut, tighten the bearing adjustment nut, and test the spindle rotation. Re-tighten the bearing lock nut to secure the adjustment.
          Severity: Severe`,
      },
      { role: 'user', content: `${conversation}` },
    ],
    temperature: 0.6,
  });

  return new NextResponse(
    JSON.stringify({ job: stream.choices[0].message.content }),
  );
}
