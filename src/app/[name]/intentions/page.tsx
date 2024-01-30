import React from "react";
import { prisma } from "../../../../prisma/client";

const fetchUserIntentions = async (name: string) => {
  const intentions = await prisma.intentions.findMany({
    where: {
      User: {
        name,
      },
    },
  });

  return intentions;
};

const Page = async ({ params }: { params: { name: string } }) => {
  const intentions = await fetchUserIntentions(params.name);

  return (
    <>
      <h1 className="self-center text-2xl font-bold">
        {params.name}'s intentions
      </h1>

      <div className="flex flex-col gap-2">
        {intentions.map((intention) => (
          <a key={intention.id} href={`/intention/${intention.id}`}>
            {intention.text}
          </a>
        ))}
      </div>
    </>
  );
};

export default Page;
