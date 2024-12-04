"use client";

import { useState } from "react";
import Button from "../button";
import Backdrop from "@ui/overlays/backdrop";
import { boxClass, inputClass, labelClass, errorClass } from "../form-class";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const placeOrderSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\d+$/, "Phone must be a valid number"),
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
    formState: { errors, isValid },
  } = useForm<PlaceOrderFormData>({
    resolver: zodResolver(placeOrderSchema),
    mode: "onChange",
  });

  const onSubmit = (data: PlaceOrderFormData) => {
    console.log(data);
  };

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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-1 text-black/65"
            >
              <div className={boxClass}>
                <input
                  className={inputClass}
                  id="FullName"
                  type="text"
                  placeholder="FullName"
                  {...register("fullName")}
                />
                <label className={labelClass} htmlFor="FullName">
                  Full Name
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
                  type="email"
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
              <Button disabled={!isValid} type="submit">
                Place Order
              </Button>
            </form>
          </div>
        </Backdrop>
      )}
    </>
  );
}
