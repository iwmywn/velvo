"use client";

import { z } from "zod";
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
import { registerSchema } from "@/schemas";
import Link from "next/link";
import ReCaptchaPopup from "@ui/recaptcha";
import { useState } from "react";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async () => {
    if (!showCaptcha && !recaptchaToken) {
      setShowCaptcha(true);
      return;
    }

    try {
      // reminder: accept registration
      showToast("Temporarily unable to register!", "warning");
      // const res = await fetch("/api/auth/register", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ ...data, recaptchaToken }),
      // });

      // const message = await res.json();

      // if (res.ok) {
      //   showToast(message, "success");
      //   reset();
      // } else {
      //   showToast(message, "warning");
      // }
    } catch (error) {
      console.error("Register Error: ", error);
      showToast("Something went wrong! Please try again.", "warning");
    } finally {
      setRecaptchaToken(null);
      setShowCaptcha(false);
    }
  };

  return (
    <>
      {showCaptcha && (
        <ReCaptchaPopup
          onClose={() => setShowCaptcha(false)}
          setRecaptchaToken={(token) => setRecaptchaToken(token)}
        />
      )}
      <div className="flex w-full flex-col items-center px-5">
        <span className="mb-2 mt-5 text-center text-black/70">
          Create an account and benefit from a more personal shopping
          experience, and quicker online checkout.
        </span>
        <span className="mb-8 text-black/70">All fields are mandatory.</span>
        <form onSubmit={handleSubmit(onSubmit)} className={`${formClass} mb-5`}>
          <div className={boxClass}>
            <input
              className={inputClass}
              id="FirstName"
              type="text"
              placeholder="First name"
              {...register("firstName")}
              disabled={isSubmitting}
            />
            <label className={labelClass} htmlFor="FirstName">
              First name
            </label>
            {errors.firstName && (
              <p className={errorClass}>{errors.firstName.message}</p>
            )}
          </div>
          <div className={boxClass}>
            <input
              className={inputClass}
              id="LastName"
              type="text"
              placeholder="Last name"
              {...register("lastName")}
              disabled={isSubmitting}
            />
            <label className={labelClass} htmlFor="LastName">
              Last name
            </label>
            {errors.lastName && (
              <p className={errorClass}>{errors.lastName.message}</p>
            )}
          </div>
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
              maxLength={200}
              autoComplete="off"
            />
            <label className={labelClass} htmlFor="Password">
              Password
            </label>
            {errors.password && (
              <p className={errorClass}>{errors.password.message}</p>
            )}
          </div>
          <div className={boxClass}>
            <input
              className={inputClass}
              id="ConfirmPassword"
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              disabled={isSubmitting}
              maxLength={200}
              autoComplete="off"
            />
            <label className={labelClass} htmlFor="ConfirmPassword">
              Confirm password
            </label>
            {errors.confirmPassword && (
              <p className={errorClass}>{errors.confirmPassword.message}</p>
            )}
          </div>
          <FormButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            buttonText="CONTINUE"
          />
        </form>
        <Link className={linkClass} href="/resend-verification-email">
          Resend verification email?
        </Link>
      </div>
    </>
  );
}
