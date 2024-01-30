import React, { ReactNode } from "react";

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-fuchsia-200 min-h-screen">
      <div className="flex flex-col items-center self-cente w-full">
        <div className="flex w-full max-w-[500px] flex-col gap-16 self-center p-8">
          {children}
        </div>
      </div>
    </main>
  );
};

export default PageContainer;
