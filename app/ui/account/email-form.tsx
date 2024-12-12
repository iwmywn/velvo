"use client";

import Wrapper from "@ui/account/wrapper";
import { toast } from "react-toastify";
import Button from "@ui/button";
import { useEffect, useState } from "react";
import {
  boxClass,
  inputClass,
  labelClass,
  errorClass,
  linkClass,
} from "@ui/form-class";
import { emailScheme } from "@/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import ReCaptchaPopup from "@ui/recaptcha";

type EmailData = z.infer<typeof emailScheme>;

interface EmailFormProps {
  title: string;
  enpoint: string;
  buttonText: string;
}

export default function EmailForm({
  title,
  enpoint,
  buttonText,
}: EmailFormProps) {
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [captchaVerified, setCaptchaVerified] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailData>({
    resolver: zodResolver(emailScheme),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailData) => {
    if (!showCaptcha && !captchaVerified) {
      setShowCaptcha(true);
      return;
    }

    try {
      const res = await fetch(enpoint, {
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
      <Wrapper title={title}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-5 mt-5 flex w-full flex-col gap-1 text-black/65"
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
          <Button
            disabled={!isValid || isSubmitting}
            className="h-10"
            type="submit"
          >
            {isSubmitting ? (
              <div className="mx-auto h-5 w-5 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            ) : (
              buttonText
            )}
          </Button>
        </form>
        <Link className={linkClass} href="/user/signin">
          Back to Sign In
        </Link>
      </Wrapper>
    </>
  );
}
