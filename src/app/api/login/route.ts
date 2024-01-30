import { z } from "zod";
import fetch from "node-fetch";

export const LoginRequestSchema = z.object({
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

  return new Response(JSON.stringify({ peer: response }), {
    status: 200,
  });
}
