"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  boxClass,
  inputClass,
  labelClass,
  errorClass,
  linkClass,
} from "@ui/form-class";
import Button from "@ui/button";
import { toast } from "react-toastify";
import { registerSchema } from "@/schemas";
import Link from "next/link";
import ReCaptchaPopup from "@ui/recaptcha";
import { useState } from "react";
import useOverflow from "@ui/hooks/overflow";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  useOverflow(showCaptcha);

  const onSubmit = async (data: RegisterFormData) => {
    if (!showCaptcha && !captchaVerified) {
      setShowCaptcha(true);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setCaptchaVerified(false);
      setShowCaptcha(false);
    }
  };

  return (
    <>
      {showCaptcha && (
        <ReCaptchaPopup
          onVerify={() => setCaptchaVerified(true)}
          onClose={() => setShowCaptcha(false)}
        />
      )}
      <div className="flex w-full flex-col items-center px-5">
        <span className="mb-2 mt-5 text-center text-black/70">
          Create an account and benefit from a more personal shopping
          experience, and quicker online checkout.
        </span>
        <span className="mb-8 text-black/70">All fields are mandatory.</span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-5 flex w-full flex-col gap-1 text-black/65"
        >
          <div className={boxClass}>
            <input
              className={inputClass}
              id="FirstName"
              type="text"
              placeholder="First Name"
              {...register("firstName")}
              disabled={isSubmitting}
            />
            <label className={labelClass} htmlFor="FirstName">
              First Name
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
              placeholder="Last Name"
              {...register("lastName")}
              disabled={isSubmitting}
            />
            <label className={labelClass} htmlFor="LastName">
              Last Name
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
              "CONTINUE"
            )}
          </Button>
        </form>
        <Link className={linkClass} href="/user/resend-verification-email">
          Resend verification email?
        </Link>
      </div>
    </>
  );
}
