"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  formClass,
  boxClass,
  inputClass,
  labelClass,
  errorClass,
} from "@ui/form-class";
import { FormButton } from "@ui/button";
import showToast from "@ui/toast";
import { resetPasswordScheme } from "@/schemas";
import { z } from "zod";
import Loading from "@ui/loading";
import { FaXmark } from "react-icons/fa6";
import NotFound from "@/app/not-found";
import { handleTokenVerification } from "@lib/utils";
import Title from "@ui/account/title";

type PasswordFormData = z.infer<typeof resetPasswordScheme>;

export default function ResetPassword({
  token,
  email,
}: {
  token: string | undefined;
  email: string | undefined;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(resetPasswordScheme),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    handleTokenVerification(
      "find-token",
      setStatus,
      setMessage,
      setLoading,
      token,
      email,
    );
  }, [token, email]);

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const res = await fetch(
        `/api/reset-password?email=${email}&token=${token}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const message = await res.json();

      if (res.ok) {
        showToast(message, "success");
        reset();
      } else {
        showToast(message, "warning");
      }
    } catch (error) {
      console.error("Reset password Error: ", error);
      showToast("Something went wrong! Please try again.", "warning");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {status === "success" ? (
        <>
          <Title title="RESET YOUR PASSWORD" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${formClass} my-5`}
          >
            <div className={boxClass}>
              <input
                className={inputClass}
                id="Password"
                type="password"
                placeholder="New password"
                {...register("password")}
                disabled={isSubmitting}
              />
              <label className={labelClass} htmlFor="Password">
                New password
              </label>
              {errors.password && (
                <p className={errorClass}>{errors.password.message}</p>
              )}
            </div>
            <div className={boxClass}>
              <input
                className={inputClass}
                id="ConfirmNewPassword"
                type="password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                disabled={isSubmitting}
              />
              <label className={labelClass} htmlFor="ConfirmNewPassword">
                Confirm new password
              </label>
              {errors.confirmPassword && (
                <p className={errorClass}>{errors.confirmPassword.message}</p>
              )}
            </div>
            <FormButton
              isValid={isValid}
              isSubmitting={isSubmitting}
              buttonText="Change"
            />
          </form>
        </>
      ) : status === "error" ? (
        <>
          <Title title={<FaXmark size={30} />} />
          {message}
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
}
