"use client";

import { useState, useEffect } from "react";
import Wrapper from "@ui/account/wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boxClass, inputClass, labelClass, errorClass } from "@ui/form-class";
import Button from "@ui/button";
import { toast } from "react-toastify";
import { passwordScheme } from "@/schemas";
import { z } from "zod";
import Loading from "@ui/loading";
import { FaXmark } from "react-icons/fa6";
import NotFound from "@app/not-found";
import { handleTokenVerification } from "@lib/utils";

type PasswordData = z.infer<typeof passwordScheme>;

export default function ResetPassword({
  token,
}: {
  token: string | undefined;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState<string>("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PasswordData>({
    resolver: zodResolver(passwordScheme),
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
    );
  }, []);

  const onSubmit = async (data: PasswordData) => {
    try {
      const res = await fetch(`/api/auth/reset-password?token=${token}`, {
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
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {status === "success" ? (
        <>
          <Wrapper title="RESET YOUR PASSWORD">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-5 mt-5 flex w-full flex-col gap-1 text-black/65"
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
                  id="ConfirmPassword"
                  type="password"
                  placeholder="New password"
                  {...register("confirmPassword")}
                  disabled={isSubmitting}
                />
                <label className={labelClass} htmlFor="ConfirmPassword">
                  Confirm new password
                </label>
                {errors.confirmPassword && (
                  <p className={errorClass}>{errors.confirmPassword.message}</p>
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
                  "Change"
                )}
              </Button>
            </form>
          </Wrapper>
        </>
      ) : status === "error" ? (
        <main className="mt-44">
          <Wrapper title={<FaXmark size={30} />}>{message}</Wrapper>
        </main>
      ) : (
        <NotFound />
      )}
      ;
    </>
  );
}
