"use client";

import { useState, ReactNode } from "react";
import Button, { FormButton } from "@ui/button";
import Backdrop from "@ui/overlays/backdrop";
import useOverflow from "@ui/hooks/overflow";
import {
  changePasswordScheme,
  changeEmailScheme,
  deleteAccountScheme,
} from "@/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BreadCrumbs from "@ui/breadcrumbs";
import {
  formClass,
  boxClass,
  inputClass,
  labelClass,
  errorClass,
} from "@ui/form-class";
import { toast } from "react-toastify";
import { useAuthContext } from "@ui/hooks/auth";
import useAnimation from "@ui/hooks/animation";

interface SettingsProps {
  userId: string | undefined;
  handleClose: () => void;
}

export default function AccountSettings() {
  const { isAnimating, triggerAnimation } = useAnimation();
  const [isOpen, setIsOpen] = useState<
    "change-password" | "change-email" | "delete-account" | null
  >(null);
  const handleClose = () => triggerAnimation(() => setIsOpen(null));
  const { userId } = useAuthContext();

  useOverflow(!!isOpen);

  return (
    <>
      {!!isOpen && (
        <Backdrop isAnimating={isAnimating} onMouseDown={handleClose}>
          <div
            className={`mx-6 w-full max-w-[30rem] overflow-y-auto rounded-lg bg-white p-8 text-sm ${
              isAnimating ? "animate-zoomOut" : "animate-zoomIn"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isOpen === "change-password" && (
              <ChangePassword userId={userId} handleClose={handleClose} />
            )}
            {isOpen === "change-email" && (
              <ChangeEmail userId={userId} handleClose={handleClose} />
            )}
            {isOpen === "delete-account" && (
              <DeleteAccount userId={userId} handleClose={handleClose} />
            )}
          </div>
        </Backdrop>
      )}
      <BreadCrumbs
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account Settings" },
        ]}
      />
      <div className="mt-5 flex min-h-screen flex-col gap-y-2 text-sm md:gap-y-10">
        <Row>
          <span className="flex-[2]">Change your password.</span>
          <Button
            className="flex-shrink-0 md:w-56"
            onClick={() => setIsOpen("change-password")}
          >
            Change Password
          </Button>
        </Row>

        <Row>
          <span className="flex-[2]">Change your email.</span>
          <Button
            className="flex-shrink-0 md:w-56"
            onClick={() => setIsOpen("change-email")}
          >
            Change Email
          </Button>
        </Row>

        <Row>
          <div>
            <p>Deletes your account and all data connected to it.</p>
            <p className="text-red-600">You can not undo this action!</p>
          </div>
          <Button
            className="flex-shrink-0 md:w-56"
            onClick={() => setIsOpen("delete-account")}
          >
            Delete Account
          </Button>
        </Row>
      </div>
    </>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded border p-4 text-center md:flex-row md:items-center md:border-0 md:p-0 md:text-left">
      {children}
    </div>
  );
}

type ChangePasswordFormData = z.infer<typeof changePasswordScheme>;

function ChangePassword({ userId, handleClose }: SettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordScheme),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const requestData = { ...data, userId };
      const res = await fetch(`/api/user/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        handleClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Change password Error: ", error);
      toast.error("Something went wrong! Try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formClass}>
      <div className={boxClass}>
        <input
          className={inputClass}
          id="CurrentPassword"
          type="password"
          placeholder="Current password"
          {...register("currentPassword")}
          autoComplete="off"
        />
        <label className={labelClass} htmlFor="CurrentPassword">
          Current password
        </label>
        {errors.currentPassword && (
          <p className={errorClass}>{errors.currentPassword.message}</p>
        )}
      </div>
      <div className={boxClass}>
        <input
          className={inputClass}
          id="NewPassword"
          type="password"
          placeholder="New password"
          {...register("password")}
          autoComplete="off"
          maxLength={200}
        />
        <label className={labelClass} htmlFor="NewPassword">
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
          autoComplete="off"
          maxLength={200}
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
  );
}

type ChangeEmailFormData = z.infer<typeof changeEmailScheme>;

function ChangeEmail({ userId, handleClose }: SettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailScheme),
    mode: "onChange",
    defaultValues: {
      password: "",
      email: "",
      confirmEmail: "",
    },
  });

  const onSubmit = async (data: ChangeEmailFormData) => {
    try {
      const requestData = { ...data, userId };
      const res = await fetch(`/api/user/change-email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        handleClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Change email Error: ", error);
      toast.error("Something went wrong! Try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formClass}>
      <div className={boxClass}>
        <input
          className={inputClass}
          id="Password"
          type="password"
          placeholder="Password"
          {...register("password")}
          autoComplete="off"
          maxLength={200}
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
          id="Email"
          type="email"
          placeholder="Email"
          {...register("email")}
          autoComplete="off"
        />
        <label className={labelClass} htmlFor="Email">
          Email
        </label>
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>
      <div className={boxClass}>
        <input
          className={inputClass}
          id="ConfirmNewEmail"
          type="email"
          placeholder="Confirm new email"
          {...register("confirmEmail")}
          autoComplete="off"
        />
        <label className={labelClass} htmlFor="ConfirmNewEmail">
          Confirm new email
        </label>
        {errors.confirmEmail && (
          <p className={errorClass}>{errors.confirmEmail.message}</p>
        )}
      </div>
      <FormButton
        isValid={isValid}
        isSubmitting={isSubmitting}
        buttonText="Change"
      />
    </form>
  );
}

type DeleteAccountFormData = z.infer<typeof deleteAccountScheme>;

function DeleteAccount({ userId, handleClose }: SettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountScheme),
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: DeleteAccountFormData) => {
    toast.success("Deleting your account...");
    toast.success("Thank you for using our website <3");
    try {
      const requestData = { ...data, userId };
      const res = await fetch(`/api/user/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        handleClose();
        await fetch("/api/auth/signout", { method: "POST" });
        window.location.href = "/user/signin";
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Delete account Error: ", error);
      toast.error("Something went wrong! Try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formClass}>
      <div className="mb-6 text-center text-red-600">
        This is the last time you can change your mind. After pressing the
        button everything is gone.
      </div>
      <div className={boxClass}>
        <input
          className={inputClass}
          id="Password"
          type="password"
          placeholder="Password"
          {...register("password")}
          autoComplete="off"
          maxLength={200}
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
        buttonText="Delete"
      />
    </form>
  );
}
