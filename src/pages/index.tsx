import IntentionInput from "@/components/IntentionInput";
import Intentions from "@/components/Intentions";
import Login from "@/components/LoginForm";
import PageContainer from "@/components/PageContainer";
import { useLoginStore } from "@/features/LoginStore";
import useSWR from "swr";

const Home = () => {
  const { user } = useLoginStore();
  const isLoggedIn = !!user;

  if (!isLoggedIn) return <Login />;

  return (
    <PageContainer>
      <h1 className="self-center text-2xl font-bold">
        {user.name}'s intentions
      </h1>
      <div className="flex flex-col gap-8">
        <Intentions />

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">I also intend to:</h2>
          <IntentionInput />
        </div>
      </div>
    </PageContainer>
  );
};

export default Home;
