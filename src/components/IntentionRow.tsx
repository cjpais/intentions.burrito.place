import React from "react";

const IntentionRow = ({
  intention,
}: {
  intention: { text: string; id: number };
}) => {
  return (
    <div className="flex flex-col gap-2">
      <a href={`/intention/${intention.id}`}>{intention.text}</a>
    </div>
  );
};

export default IntentionRow;
