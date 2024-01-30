"use client";

import { useEffect, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";

// TODO populate intention from SSR?
const IntentionInput = () => {
  const [intention, setIntention] = useState("");

  const logIntention = () => {
    // fetch()
    console.log(intention);
  };

  return (
    <div className="flex flex-col gap-4">
      <ReactTextareaAutosize
        className="rounded-xl border-2 border-fuchsia-300 bg-fuchsia-200 p-2 font-bold focus:border-fuchsia-500 focus:outline-none"
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
        minRows={1}
        maxRows={3}
      />
      <button
        onClick={logIntention}
        className="ml-auto rounded-xl bg-fuchsia-600 px-4 py-2"
      >
        update
      </button>
    </div>
  );
};

export default IntentionInput;
