"use client";

import { useLoginStore } from "@/features/LoginStore";
import { useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

// TODO populate intention from SSR?
const IntentionInput = () => {
  const { user, token } = useLoginStore();
  const [intention, setIntention] = useState("");

  const logIntention = () => {
    if (!intention || !user || !token) {
      return;
    }

    fetch("/api/add/intention", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: intention, userId: user.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("intention added", data);
      });
  };

  return (
    <div className="flex flex-col gap-4 pl-3">
      <ReactTextareaAutosize
        className="rounded-xl border-2 border-fuchsia-300 bg-fuchsia-200 p-2 font-bold focus:border-fuchsia-500 focus:outline-none"
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
        minRows={1}
        maxRows={3}
      />
      <button
        onClick={logIntention}
        className="ml-auto rounded-xl bg-fuchsia-600 px-4 py-2 text-fuchsia-200"
      >
        add
      </button>
    </div>
  );
};

export default IntentionInput;
