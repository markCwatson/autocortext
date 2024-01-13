import { Configuration, OpenAIApi } from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import { Person } from '@/types';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const completion = await openai.createCompletion({
    model: 'gpt-3.5-turbo-instruct',
    prompt: reviewPrompt(req.body.person),
    max_tokens: 1000,
    temperature: 0.8,
  });
  res
    .status(200)
    .json({ person: req.body.person, obit: completion.data.choices[0].text });
}

function reviewPrompt({
  name,
  age,
  bp,
  pod,
  dob,
  dod,
  parents,
  survived,
  predeceased,
  grandParents,
  grandKids,
  funeral,
  about,
}: Person) {
  return `You are writing an obituary for ${name}. The obituary should be factual and accurate. You cannot add any new, incorrect, or missleading information.
  The example below should be used as a guide, but you should not simply replace names, details, etc., rather, you should make an entirely new obituary, using different 
  adjectives, sentences, and phrasing. It is critical that your obituary for ${name} remains based on the submitted data, and that you do not add any
  new information. For example, if no grandkids are provided, no not assume any. If no funeral service time or place are provided, do not assume any. Be creative, and make the 
  obituary sound plesant yet professional. Here is an example.

  Deceased name: Julia Jane Smith
  Age: 80
  Birth Place: Halifax
  Place of Death: High Crest Nursing Home
  Date of Death: Sunday,March 26,2023
  Parents: Bernie Walton, Norma (Marchand) Walton
  Survived: daughter Mandy Hunter(Jason), sons Alan(Cheryl) and Robert(Tracy)
  Predeceased by: husband Donald; sisters Karen, Edith and Marilyn; brothers David and Harry and brother in laws Doug and Jim.
  Grand Parents: none
  Grand Children: yes
  Funeral details: A. H. Brown Funeral Home, 5 McFarlane Street, Halifax, (902 597 2361) visitation onThursday, March 30, 2023 from 2 PM until 3 PM followed by service at 3 PM. live stream of funeral available at www.brownsfuneralhome.com.
  About: enjoyed writing poetry, watching her Toronto Raptors and Toronto Blue Jays, and going to church.
  Obituary: It is with deep sadness we announce the passing of Julia Jane Smith, age 80, of Halifax. Julia passed away peacefully with her family by her side at High Crest Nursing Home on Sunday,March 26,2023.
  Born in Halifax, NS, she was a daughter of the late Bernie and Norma (Marchand) Walton.
  In her younger years she enjoyed writing poetry, watching her Toronto Raptors and Toronto Blue Jays. She enjoyed spending time with her grand children and looked forward to the Holiday gatherings so she could prepare a huge feast for her family. She also loved going to church.
  She will be dearly missed by daughter Mandy Hunter(Jason), sons Alan(Cheryl) and Robert(Tracy) all of Halifax; sisters Beverly MacLeod of Ontario, Marion Beaton(Kirk) of Amherst, Nancy James(Harold) of Nanaimo BC; brothers Billy(Carol), Buddy of Montreal and Tommy(Patty) of Ontario; her 7 grandchildren Brandon, Bryce, Taylor, Tori, AJ, Chad and Frank as well as her 4 great grandchildren.
  Besides her parents she was predeceased by her husband Donald; sisters Karen, Edith and Marilyn; brothers David and Harry and brother in laws Doug and Jim.
  Arrangements are under the direction of the A. H. Brown Funeral Home, 5 McFarlane Street, Halifax, (902 597 2361) where visitation will take place Thursday, March 30, 2023 from 2 PM until 3 PM followed immediately by the funeral service at 3 PM. A live stream of the funeral will be available at www.brownsfuneralhome.com.
  Donations in memory of Julia may be made to the Cancer Society or High Crest Nursing Home.
  Sharing of memories and condolences may be sent to the family by visiting Julia's online memorial at www.brownsfuneralhome.com or through the A H Brown Funeral Home Facebook page.

  Here is your data for ${name}.

  Deceased name: ${name}
  Age: ${age}
  Birth Place: ${bp}
  Place of Death: ${pod}
  Date of Death: ${dod}
  Parents: ${parents}
  Survived: ${survived}
  Predeceased by: ${predeceased}
  Grand Parents: ${grandParents}
  Grand Children: ${grandKids}
  Funeral details: ${funeral}
  About: ${about}
  Obituary:`;
}
