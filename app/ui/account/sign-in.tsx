"use client";

import { boxClass, inputClass, labelClass, buttonClass } from "./class";

export default function SignIn() {
  return (
    <div className="flex w-full flex-col items-center px-5">
      <h3 className="mb-2 mt-5 text-left font-medium text-black/75">
        WELCOME BACK
      </h3>
      <span className="mb-8 text-black/70">
        Sign in with your email end password.
      </span>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex w-full flex-col gap-1 text-black/65"
      >
        <div className={boxClass}>
          <input
            className={inputClass}
            id="Email"
            type="email"
            placeholder="Email"
          />
          <label className={labelClass} htmlFor="Email">
            Email
          </label>
        </div>
        <div className={boxClass}>
          <input
            className={inputClass}
            id="Password"
            type="password"
            placeholder="Password"
          />
          <label className={labelClass} htmlFor="Password">
            Password
          </label>
        </div>
        <button className={buttonClass} type="submit">
          SIGN IN
        </button>
      </form>
    </div>
  );
}
