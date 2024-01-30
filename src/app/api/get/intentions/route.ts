import { z } from "zod";
import { prisma } from "../../../../../prisma/client";

const GetIntentionsSchema = z.object({
  userId: z.number(),
});

export async function POST(request: Request) {
  const data = await request.json();
  const { userId } = GetIntentionsSchema.parse(data);

  const intentions = await prisma.intentions.findMany({
    where: {
      userId,
    },
  });

  return new Response(JSON.stringify(intentions), {
    status: 200,
  });
}
