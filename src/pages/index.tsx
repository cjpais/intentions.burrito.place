import IntentionInput from "@/components/IntentionInput";
import Login from "@/components/Login";
import { useLoginStore } from "@/features/LoginStore";

const Home = () => {
  const { user } = useLoginStore();
  const isLoggedIn = user !== null;

  return (
    <main className="bg-fuchsia-200 h-screen">
      <div className="flex flex-col items-center self-cente w-fullr">
        <div className="flex w-full max-w-[500px] flex-col gap-16 self-center p-8">
          <h1 className="self-center text-2xl font-bold">Intentions</h1>
          {isLoggedIn ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">
                My intention this week is to:
              </h2>
              <IntentionInput />
            </div>
          ) : (
            <Login />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
