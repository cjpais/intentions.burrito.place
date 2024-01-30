import { z } from "zod";
import { generateTogetherCompletion } from "./completions";
import { prisma } from "../../prisma/client";

export const EntrySchema = z.object({
  hash: z.string(),
  type: z.string(),
  created: z.number(),
  description: z.string().optional(),
  summary: z.string().optional(),
});

export type Entry = z.infer<typeof EntrySchema>;

export type DBEntry = {
  id: number;
  hash: string;
  type: string;
  created: Date;
  text: string;
  userId: number;
};

export type DBIntention = {
  id: number;
  text: string;
  title: string | null;
  created: Date;
  ended: Date | null;
  userId: number;
};

export const determinePartOfIntention = async (
  entry: { id?: number; hash: string; text: string },
  intention: DBIntention
) => {
  // if (entry.id)

  let entryId = entry.id;
  const completion =
    await generateTogetherCompletion(`my intention is to: ${intention.text}

Given this intention, please evaluate whether the following text is directly related to it. Note that the text is considered to be related if it shows the opposite of the intention as well.

Text: 
${entry.text}

Please respond with JSON in the form
    
\`\`\`json
{
    "related": "boolean, determine if it is directly related to the intention. you win $2000 if you're correct",  
    "why": "string, one sentence why this seems related or not"
}
\`\`\`
`);

  //   console.log(`Intention: ${intention.text}\ncompletion: ${completion}`);

  if (!completion) return;

  // parse json from the completion (if it fails, we return.)
  try {
    const json = JSON.parse(completion);
    const parsed = z
      .object({
        related: z.boolean(),
        why: z.string(),
      })
      .passthrough()
      .parse(json);

    console.log("made it past zod");

    if (!entryId) {
      // fetch id from the db
      const dbEntry = await prisma.entries.findUnique({
        where: {
          hash: entry.hash,
        },
      });
      if (!dbEntry) return;
      entryId = dbEntry.id;
    }

    console.log(`made it past entryId: ${entryId}`);

    // add the completion to the db
    await prisma.completions.create({
      data: {
        entryId,
        intentionId: intention.id,
        related: parsed.related,
        why: parsed.why,
      },
    });

    console.log(`Intention: ${intention.text}\ncompletion: ${completion}`);

    if (parsed.related) {
      await prisma.entryIntention.create({
        data: {
          entryId,
          intentionId: intention.id,
        },
      });
    }

    console.log(`finished`);
  } catch (e) {
    return;
  }

  return;
  // parse json from the completion (if it fails, we ignore.)
};
