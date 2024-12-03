"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  boxClass,
  inputClass,
  labelClass,
  errorClass,
} from "@ui/account/class";
import Button from "@ui/button";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    console.log(data);
  };

  return (
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
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
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
        <Button className="h-10" type="submit">
          SIGN IN
        </Button>
      </form>
    </div>
  );
}
