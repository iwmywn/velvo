"use client";

import { useState } from "react";
import Button, { FormButton } from "@ui/button";
import Backdrop from "@ui/overlays/backdrop";
import {
  formClass,
  boxClass,
  inputClass,
  labelClass,
  errorClass,
} from "@ui/form-class";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useOverflow from "@ui/hooks/overflow";

const placeOrderSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  phone: z
    .string()
    .min(10, "Phone must have at least 10 digits")
    .max(11, "Phone must have at most 11 digits")
    .regex(/^(0)[1-9][0-9]{8,9}$/, "Phone must be a valid number"),
  address: z.string().min(1, "Address is required"),
});

type PlaceOrderFormData = z.infer<typeof placeOrderSchema>;

export default function Checkout() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsOpen(false);
    }, 250);
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PlaceOrderFormData>({
    resolver: zodResolver(placeOrderSchema),
    mode: "onChange",
  });

  const onSubmit = (data: PlaceOrderFormData) => {
    console.log(data);
  };

  useOverflow(isOpen);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Checkout</Button>
      {isOpen && (
        <Backdrop isAnimating={isAnimating} onClick={handleClose}>
          <div
            className={`mx-6 w-full max-w-[30rem] overflow-y-auto rounded-lg bg-white p-8 text-sm ${
              isAnimating ? "animate-zoomOut" : "animate-zoomIn"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit(onSubmit)} className={formClass}>
              <div className={boxClass}>
                <input
                  className={inputClass}
                  id="FullName"
                  type="text"
                  placeholder="Full name"
                  {...register("fullName")}
                />
                <label className={labelClass} htmlFor="FullName">
                  Full name
                </label>
                {errors.fullName && (
                  <p className={errorClass}>{errors.fullName.message}</p>
                )}
              </div>
              <div className={boxClass}>
                <input
                  className={inputClass}
                  id="Phone"
                  type="text"
                  placeholder="Phone"
                  {...register("phone")}
                  maxLength={11}
                />
                <label className={labelClass} htmlFor="Phone">
                  Phone
                </label>
                {errors.phone && (
                  <p className={errorClass}>{errors.phone.message}</p>
                )}
              </div>
              <div className={boxClass}>
                <input
                  className={inputClass}
                  id="Address"
                  type="text"
                  placeholder="Address"
                  {...register("address")}
                />
                <label className={labelClass} htmlFor="Address">
                  Address
                </label>
                {errors.address && (
                  <p className={errorClass}>{errors.address.message}</p>
                )}
              </div>
              <FormButton
                isValid={isValid}
                isSubmitting={isSubmitting}
                buttonText="Place Order"
              />
            </form>
          </div>
        </Backdrop>
      )}
    </>
  );
}
