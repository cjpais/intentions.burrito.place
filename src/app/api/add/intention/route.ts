import { z } from "zod";
import { prisma } from "../../../../../prisma/client";
import fetch from "node-fetch";

const IntentionRequestSchema = z.object({
  text: z.string(),
  userId: z.number(),
});

const ValidateAuthResponseSchema = z.object({
  peer: z
    .object({
      name: z.string(),
      display: z.string(),
      url: z.string(),
    })
    .or(z.undefined()),
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
  const response = await fetch("https://burrito.place/api/validateAuth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  })
    .then((res) => res.json())
    .then((d) => ValidateAuthResponseSchema.parse(d))
    .then((d) => d.peer);

  if (!response || response.name !== user.name) {
    return new Response(null, {
      status: 401,
    });
  }

  const intention = await prisma.intentions.create({
    data: {
      text,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return new Response(JSON.stringify(intention), {
    status: 200,
  });
}
