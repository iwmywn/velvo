"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  formClass,
  boxClass,
  inputClass,
  labelClass,
  errorClass,
  linkClass,
} from "@ui/form-class";
import { FormButton } from "@ui/button";
import showToast from "@ui/toast";
import { signInSchema } from "@/schemas";
import { z } from "zod";
import Link from "next/link";

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const message = await res.json();

      if (res.ok) {
        const searchParams = new URLSearchParams(window.location.search);
        const callbackUrl = searchParams.get("next") || "/";

        window.location.href = callbackUrl;
      } else {
        showToast(message, "warning");
      }
    } catch (error) {
      console.error("Sign in Error: ", error);
      showToast("Something went wrong! Please try again.", "warning");
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-center px-5">
        <h3 className="mb-2 mt-5 text-left font-medium text-black/75">
          WELCOME BACK
        </h3>
        <span className="mb-8 text-center text-black/70">
          Sign in with your email and password.
        </span>
        <form onSubmit={handleSubmit(onSubmit)} className={`${formClass} mb-5`}>
          <div className={boxClass}>
            <input
              className={inputClass}
              id="Email"
              type="email"
              placeholder="Email"
              {...register("email")}
              disabled={isSubmitting}
            />
            <label className={labelClass} htmlFor="Email">
              Email
            </label>
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          <div className={boxClass}>
            <input
              className={inputClass}
              id="Password"
              type="password"
              placeholder="Password"
              {...register("password")}
              disabled={isSubmitting}
            />
            <label className={labelClass} htmlFor="Password">
              Password
            </label>
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>
          <FormButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            buttonText="SIGN IN"
          />
        </form>
        <Link className={linkClass} href="/forgotten-password">
          Forgot password?
        </Link>
      </div>
    </>
  );
}
