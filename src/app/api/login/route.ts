import { z } from "zod";
import fetch from "node-fetch";
import { prisma } from "../../../../prisma/client";
import { fetchAuthPeer } from "@/features/auth";
import {
  DBIntention,
  EntrySchema,
  determinePartOfIntention,
} from "@/features/entry";

const LoginRequestSchema = z.object({
  token: z.string(),
});

type Peer = {
  id: number;
  name: string;
  url: string;
  token: string;
};

const fetchAndProcessAllExistingEntries = async (
  peer: Peer,
  intentions: DBIntention[]
) => {
  // fetch all entries from peer
  const allEntries = await fetch(`${peer.url}/query/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${peer.token}`,
    },
    body: JSON.stringify({
      query:
        "Get me all of the entries, with their hash, created date, type, description, summary, and title",
    }),
  })
    .then((res) => res.json())
    .then((d) => z.array(EntrySchema).parse(d))
    .then((entries) =>
      entries.filter((entry) => entry.description || entry.summary)
    );

  // add all entries to db
  const dbEntries = await prisma.entries.createMany({
    data: allEntries.map((entry) => ({
      hash: entry.hash,
      type: entry.type,
      created: new Date(entry.created * 1000),
      text: entry.summary ? entry.summary! : entry.description!,
      userId: peer.id,
    })),
  });

  // batch process each set of intentions
  for (const intention of intentions) {
    allEntries.map(async (entry) => {
      const start = Date.now();
      setTimeout(() => {
        console.log(`running ${Date.now() - start}ms after start`);
        determinePartOfIntention(
          {
            hash: entry.hash,
            text: entry.summary ? entry.summary! : entry.description!,
          },
          intention
        );
      }, Math.random() * 50000);
    });
  }
};

export async function POST(request: Request) {
  const data = await request.json();
  const { token } = LoginRequestSchema.parse(data);

  const body = JSON.stringify({ token });

  const response = await fetchAuthPeer({ token });

  if (response) {
    // also store in db
    const upsertResult = await prisma.user.upsert({
      where: { name: response.name },
      update: {
        name: response.name,
        url: response.url,
      },
      create: {
        name: response.name,
        url: response.url,
      },
      include: {
        Entries: true,
        Intentions: {
          where: {
            ended: null,
          },
        },
      },
    });

    if (upsertResult.Entries.length === 0) {
      fetchAndProcessAllExistingEntries(
        {
          id: upsertResult.id,
          url: response.url,
          token,
          name: response.name,
        },
        upsertResult.Intentions
      );
    }

    return new Response(
      JSON.stringify({ peer: { ...response, id: upsertResult.id } }),
      {
        status: 200,
      }
    );
  }

  return new Response(JSON.stringify({}), {
    status: 401,
  });
}
