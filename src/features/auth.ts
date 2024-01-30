import { z } from "zod";
import fetch from "node-fetch";

const ValidateAuthResponseSchema = z.object({
  peer: z
    .object({
      name: z.string(),
      display: z.string(),
      url: z.string(),
    })
    .or(z.undefined()),
});

export const fetchAuthPeer = async ({ token }: { token: string }) => {
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

  return response;
};
