import { useLoginStore } from "@/features/LoginStore";
import React from "react";
import { useEffect } from "react";
import useSWR from "swr";
import IntentionRow from "./IntentionRow";

const Intentions = () => {
  const { user } = useLoginStore();
  const { data, error, isLoading } = useSWR("/api/get/intentions", (url) => {
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user!.id }),
    }).then((res) => res.json());
  });

  console.log({ data, error, isLoading });

  if (isLoading) return <div></div>;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">
        {data.length > 1 ? `My intentions are to:` : "My intention is to:"}
      </h2>
      <div className="flex flex-col gap-4 pl-3">
        {data &&
          data.map((intention: any) => (
            <IntentionRow intention={intention} key={intention.id} />
          ))}
      </div>
    </div>
  );
};

export default Intentions;
