import React from "react";
import { prisma } from "../../../../prisma/client";
import Link from "next/link";

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

const getIntention = async (id: number) => {
  const intention = await prisma.intentions.findUnique({
    where: {
      id,
    },
    include: {
      User: true,
    },
  });

  return intention;
};

const Page = async ({ params }: { params: { id: string } }) => {
  const entries = await relatedEntries(parseInt(params.id));
  const intention = await getIntention(parseInt(params.id));

  const user = intention?.User.name;

  return (
    <div className="flex flex-col gap-4">
      <Link
        className="text-2xl font-bold self-center"
        href={`/${user}/intentions`}
      >
        {user}
      </Link>
      <h2 className="text-xl font-bold">{intention?.text}</h2>
      <div className="flex flex-col gap-6">
        {entries.map((entry) => (
          <div key={entry.id}>
            {/* <h3>{entry.hash}</h3> */}
            <p>{entry.text}</p>
            <div>
              {entry.Completions.map((completion) => (
                <div key={completion.id} className="text-xs italic">
                  <p>why llm thinks this fits: {completion.why}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
