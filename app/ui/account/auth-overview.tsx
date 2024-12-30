"use client";

import { useState } from "react";
import SignIn from "@ui/account/sign-in";
import Register from "@ui/account/register";
import Wrapper from "@ui/account/wrapper";

const tabs = [
  {
    name: "SIGN IN",
    isActive: true,
  },
  {
    name: "REGISTER",
    isActive: false,
  },
] as const;

export default function AuthOverview() {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);

  return (
    <Wrapper title="ACCOUNT">
      <div className="mb-3 flex w-full text-xs font-medium">
        {tabs.map(({ name, isActive }, index) => (
          <div
            key={index}
            className={`relative flex w-[50%] cursor-pointer items-center justify-center py-3 ${isSignIn === isActive && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black"}`}
            onClick={() => setIsSignIn(isActive)}
          >
            {name}
          </div>
        ))}
      </div>
      {isSignIn ? <SignIn /> : <Register />}
    </Wrapper>
  );
}
