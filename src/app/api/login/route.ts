import { z } from "zod";
import fetch from "node-fetch";
import { prisma } from "../../../../prisma/client";

const LoginRequestSchema = z.object({
  token: z.string(),
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
  const data = await request.json();
  const { token } = LoginRequestSchema.parse(data);

  const body = JSON.stringify({ token });

  const response = await fetch("https://burrito.place/api/validateAuth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
    .then((res) => res.json())
    .then((d) => ValidateAuthResponseSchema.parse(d))
    .then((d) => d.peer);

  if (response) {
    // also store in db
    const upsertResult = await prisma.user.upsert({
      where: { name: response.name },
      update: {
        name: response.name,
        // url: response.url,
      },
      create: {
        name: response.name,
      },
    });
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
