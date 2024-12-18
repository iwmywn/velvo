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
import { placeOrderSchema } from "@/schemas";
import addresses from "@ui/data/addresses";

type PlaceOrderFormData = z.infer<typeof placeOrderSchema>;

export default function Checkout() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

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
    setValue,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PlaceOrderFormData>({
    resolver: zodResolver(placeOrderSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
    },
  });

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedCity(city);
    setDistricts(city ? Object.keys(addresses[city]) : []);
    setWards([]);
    setSelectedDistrict("");
    setValue("city", city);
    setValue("district", "");
    setValue("ward", "");

    clearErrors("city");
    clearErrors("district");
    clearErrors("ward");
  };

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const district = event.target.value;
    setSelectedDistrict(district);
    setWards(district ? addresses[selectedCity][district] : []);
    setValue("district", district);
    setValue("ward", "");

    clearErrors("district");
    clearErrors("ward");
  };

  const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("ward", event.target.value);

    clearErrors("ward");
  };

  const onSubmit = (data: PlaceOrderFormData) => {
    console.log(data);
  };

  useOverflow(isOpen);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Checkout</Button>
      {isOpen && (
        <Backdrop isAnimating={isAnimating} onMouseDown={handleClose}>
          <div
            className={`mx-6 w-full max-w-[30rem] overflow-y-auto rounded-lg bg-white p-8 text-sm ${
              isAnimating ? "animate-zoomOut" : "animate-zoomIn"
            }`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit(onSubmit)} className={formClass}>
              <div className={boxClass}>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="Full name"
                  {...register("fullName")}
                />
                <label className={labelClass}>Full name</label>
                {errors.fullName && (
                  <p className={errorClass}>{errors.fullName.message}</p>
                )}
              </div>
              <div className={boxClass}>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="Phone"
                  {...register("phone")}
                  maxLength={11}
                />
                <label className={labelClass}>Phone Number</label>
                {errors.phone && (
                  <p className={errorClass}>{errors.phone.message}</p>
                )}
              </div>
              <div className={boxClass}>
                <select
                  className={inputClass}
                  {...register("city")}
                  onChange={handleCityChange}
                >
                  <option value="">Select city</option>
                  {Object.keys(addresses).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <label className={labelClass}>City</label>
                {errors.city && (
                  <p className={errorClass}>{errors.city.message}</p>
                )}
              </div>

              {selectedCity && (
                <div className={boxClass}>
                  <select
                    className={inputClass}
                    {...register("district")}
                    onChange={handleDistrictChange}
                  >
                    <option value="">Select district</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <label className={labelClass}>District</label>
                  {errors.district && (
                    <p className={errorClass}>{errors.district.message}</p>
                  )}
                </div>
              )}

              {selectedDistrict && (
                <div className={boxClass}>
                  <select
                    className={`${inputClass} max-h-48 overflow-y-auto`}
                    {...register("ward")}
                    onChange={handleWardChange}
                  >
                    <option value="">Select ward</option>
                    {wards.map((ward) => (
                      <option key={ward} value={ward}>
                        {ward}
                      </option>
                    ))}
                  </select>
                  <label className={labelClass}>Ward</label>
                  {errors.ward && (
                    <p className={errorClass}>{errors.ward.message}</p>
                  )}
                </div>
              )}
              <FormButton
                isValid={true}
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
