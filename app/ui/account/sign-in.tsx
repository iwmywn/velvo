"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boxClass, inputClass, labelClass, errorClass } from "@ui/form-class";
import Button from "@ui/button";
import { signIn } from "@/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createPortal } from "react-dom";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result?.ok) {
        switch (result?.error) {
          case "Invalid credentials.":
            toast.error("Email or password is incorrect.");
            break;
          case "Account not verified.":
            toast.error(
              "Your account is not verified. Please check your email for verification instructions.",
            );
            break;
          default:
            toast.error("An unexpected error occurred.");
        }
        return;
      }

      window.location.href = "/";
    } catch (e) {
      console.error("Sign-in error:", e);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      {createPortal(
        <ToastContainer
          closeButton={false}
          icon={false}
          hideProgressBar
          closeOnClick
          pauseOnFocusLoss
        />,
        document.body,
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
