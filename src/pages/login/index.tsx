import LoginForm from "@/components/LoginForm";
import PageContainer from "@/components/PageContainer";
import React from "react";

const Index = () => {
  return (
    <PageContainer>
      <h1 className="self-center text-2xl font-bold">Intentions</h1>
      <LoginForm />
    </PageContainer>
  );
};

export default Index;
