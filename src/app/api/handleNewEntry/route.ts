import { fetchAuthPeer } from "@/features/auth";
import { z } from "zod";
import { prisma } from "../../../../prisma/client";
import { generateTogetherCompletion } from "@/features/completions";
import { EntrySchema, determinePartOfIntention } from "@/features/entry";

type DBEntry = {
  id: number;
  hash: string;
  type: string;
  created: Date;
  text: string;
  userId: number;
};
type DBIntention = {
  id: number;
  text: string;
  title: string | null;
  created: Date;
  ended: Date | null;
  userId: number;
};

const HandleNewEntryRequestSchema = z.object({
  peer: z.object({
    name: z.string(),
    url: z.string(),
  }),
  entry: EntrySchema,
});

// TODO really would want to register for a particular schema on the webhook
export async function POST(request: Request) {
  // get bearer token from request
  const rawToken = request.headers.get("Authorization");
  const token = rawToken?.split("Bearer ")[1];

  // if token is not present, return 401
  if (!token) {
    return new Response(null, {
      status: 401,
    });
  }

  const data = await request.json();
  const { peer, entry } = HandleNewEntryRequestSchema.passthrough().parse(data);

  // if the peer returned is not the same as the one we have for the token, fail
  const response = await fetchAuthPeer({ token });
  if (response?.name !== peer.name) {
    return new Response(null, {
      status: 401,
    });
  }

  // add this entry to the db
  const text = entry.summary ? entry.summary : entry.description;
  if (!text) {
    return new Response(null, {
      status: 400,
    });
  }

  const dbEntry = await prisma.entries.upsert({
    where: {
      hash: entry.hash,
    },
    create: {
      hash: entry.hash,
      type: entry.type,
      created: new Date(entry.created * 1000),
      text: text,
      User: {
        connect: {
          name: peer.name,
        },
      },
    },
    update: {},
  });

  const activeIntentions = await prisma.user.findUnique({
    where: {
      name: peer.name,
    },
    include: {
      Intentions: {
        where: {
          ended: null,
        },
      },
    },
  });

  if (activeIntentions && activeIntentions.Intentions.length > 0) {
    // async run completions over each intention for the user
    activeIntentions.Intentions.forEach((intention) => {
      console.log(`Intention: ${intention.text}`);
      determinePartOfIntention(dbEntry, intention);
    });
  }

  return new Response(null, {
    status: 200,
  });
}
