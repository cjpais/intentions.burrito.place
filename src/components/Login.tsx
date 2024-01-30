"use client";

import { useLoginStore } from "@/features/LoginStore";

const Login = () => {
  const { token, setToken, setUser } = useLoginStore();

  const login = () => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.peer) {
          setUser(data.peer);
        } else {
          console.error("login failed", data);
        }
      });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* <input
        type="text"
        placeholder="username"
        className="rounded-xl border-2 border-fuchsia-300 bg-fuchsia-200 p-2 font-bold focus:border-fuchsia-500 focus:outline-none"
      /> */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-fuchsia-700">
          password (ask cj for yours)
        </label>
        <input
          type="password"
          placeholder="password"
          className="rounded-xl border-2 border-fuchsia-300 bg-fuchsia-200 p-2 font-bold focus:border-fuchsia-500 focus:outline-none"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>
      <button
        className="self-center hover:bg-red-400"
        onClick={login}
        disabled={!token}
      >
        <img src="/login.svg" className="w-32" />
      </button>
    </div>
  );
};

export default Login;
