import React from "react";
import { prisma } from "../../../../prisma/client";

const relatedEntries = async (id: number) => {
  const entries = await prisma.entries.findMany({
    where: {
      Intentions: {
        some: {
          Intention: {
            id,
          },
        },
      },
    },
    include: {
      Completions: {
        where: {
          intentionId: id,
        },
      },
    },
  });

  if (!entries) {
    return [];
  }

  return entries;
};

const Page = async ({ params }: { params: { id: string } }) => {
  const entries = await relatedEntries(parseInt(params.id));

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold"></h1>
      {entries.map((entry) => (
        <div key={entry.id}>
          <h3>{entry.hash}</h3>
          <p>{entry.text}</p>
          <div>
            {entry.Completions.map((completion) => (
              <div key={completion.id}>
                <p>{completion.why}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
