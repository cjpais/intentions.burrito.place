import { z } from "zod";
import { prisma } from "../../../../../prisma/client";
import { fetchAuthPeer } from "@/features/auth";
import { determinePartOfIntention } from "@/features/entry";

const IntentionRequestSchema = z.object({
  text: z.string(),
  userId: z.number(),
});

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
  const { text, userId } = IntentionRequestSchema.parse(data);

  // get user from id
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return new Response(null, {
      status: 401,
    });
  }

  // validate the auth matches the user
  const response = await fetchAuthPeer({ token });

  if (!response || response.name !== user.name) {
    return new Response(null, {
      status: 401,
    });
  }

  const intention = await prisma.intentions.create({
    data: {
      text,
      User: {
        connect: {
          id: userId,
        },
      },
    },
  });

  // fetch all existing entries and process them for this intention
  const allEntries = await prisma.entries.findMany({
    where: {
      userId,
    },
  });

  // batch process each set of intentions
  for (const entry of allEntries) {
    setTimeout(() => {
      determinePartOfIntention(
        {
          id: entry.id,
          hash: entry.hash,
          text: entry.text,
        },
        intention
      );
    }, Math.random() * 10000);
  }

  return new Response(JSON.stringify(intention), {
    status: 200,
  });
}
