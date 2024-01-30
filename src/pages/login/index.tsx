import LoginForm from "@/components/LoginForm";
import PageContainer from "@/components/PageContainer";
import { useLoginStore } from "@/features/LoginStore";
import React, { use } from "react";

const Index = () => {
  const { user } = useLoginStore();
  const isLoggedIn = !!user;

  return (
    <PageContainer>
      <h1 className="self-center text-2xl font-bold">Intentions</h1>
      {isLoggedIn ? <LogoutButton /> : <LoginForm />}
    </PageContainer>
  );
};

const LogoutButton = () => {
  const { logout } = useLoginStore();

  return (
    <button className="self-center" onClick={logout}>
      <img src="/logout.svg" className="w-32" />
    </button>
  );
};

export default Index;
