"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boxClass, inputClass, labelClass, errorClass } from "@ui/form-class";
import Button from "@ui/button";
import { ToastContainer, toast } from "react-toastify";
import { createPortal } from "react-dom";
import { signInSchema } from "@/schemas";
import { z } from "zod";
import { useEffect, useState } from "react";

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

  const [isClient, setIsClient] = useState<boolean>(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data: SignInFormData) => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        // toast.success(result.message);

        const searchParams = new URLSearchParams(window.location.search);
        const callbackUrl = searchParams.get("callback") || "/";

        window.location.href = callbackUrl;
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
