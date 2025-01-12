"use client";

import Wrapper from "@ui/account/wrapper";
import showToast from "@ui/toast";
import { FormButton } from "@ui/button";
import { useState } from "react";
import {
  formClass,
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

type EmailFormData = z.infer<typeof emailScheme>;

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
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailScheme),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormData) => {
    if (!showCaptcha && !recaptchaToken) {
      setShowCaptcha(true);
      return;
    }

    try {
      const res = await fetch(enpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, recaptchaToken }),
      });

      const message = await res.json();

      if (res.ok) {
        showToast(message, "success");
        reset();
      } else {
        showToast(message, "warning");
      }
    } catch (error) {
      console.error("Email Form Error: ", error);
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
      <Wrapper title={title}>
        <form onSubmit={handleSubmit(onSubmit)} className={`${formClass} my-5`}>
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
          <FormButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            buttonText={buttonText}
          />
        </form>
        <Link className={linkClass} href="/user/signin">
          Back to Sign In
        </Link>
      </Wrapper>
    </>
  );
}
