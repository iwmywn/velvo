"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boxClass, inputClass, labelClass, errorClass } from "@ui/form-class";
import Button from "@ui/button";
import { signIn } from "@/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createPortal } from "react-dom";
import { signInSchema } from "@/schemas";
import { z } from "zod";
import { useEffect, useState } from "react";
import { AuthError } from "next-auth";
// import { useSearchParams } from "next/navigation";
// import { CustomAuthError } from "@/app/lib/auth-errors";

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const [isClient, setIsClient] = useState<boolean>(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        // redirectTo: callbackUrl || "/",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return "Invalid email or password.";
          // case "UnverifiedAccount":
          //   return "Your account is not verified.";
          default:
            return "Something went wrong.";
        }
      }
      throw error;
    }
  };

  return (
    <>
      {isClient &&
        createPortal(
          <ToastContainer
            closeButton={false}
            icon={false}
            hideProgressBar
            closeOnClick
            pauseOnFocusLoss
          />,
          document.getElementById("popups")!,
        )}
      <div className="flex w-full flex-col items-center px-5">
        <h3 className="mb-2 mt-5 text-left font-medium text-black/75">
          WELCOME BACK
        </h3>
        <span className="mb-8 text-center text-black/70">
          Sign in with your email and password.
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-1 text-black/65"
        >
          <div className={boxClass}>
            <input
              className={inputClass}
              id="Email"
              type="email"
              placeholder="Email"
              {...register("email")}
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
            />
            <label className={labelClass} htmlFor="Password">
              Password
            </label>
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>
          <Button
            disabled={!isValid || isSubmitting}
            className="h-10"
            type="submit"
          >
            {isSubmitting ? (
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            ) : (
              "SIGN IN"
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
