import classNames from "classnames";
import { motion } from "motion/react";

import type { FC } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { AddressInput } from "@/_types/Address";

type OrderInputProps = {
  register: UseFormRegister<AddressInput>;
  errors: FieldErrors<AddressInput>;
};

const inputClasses = "w-[90vw] border p-1 m-1 text-sm focus:outline-none";
const textareaClass = classNames(inputClasses, "h-[80px]");
const errorClasses = "text-red-500 text-xs ml-2";

export const OrderInputs: FC<OrderInputProps> = ({ register, errors }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1] }}
      className={classNames("pt-5 pl-2 mb-2")}
    >
      <input
        type="text"
        placeholder="Name*"
        className={inputClasses}
        {...register("name", {
          required: "Name is required.",
          minLength: 4,
          maxLength: 30,
        })}
      />
      <div className={errorClasses}> {errors.name?.message}</div>

      <input
        type="text"
        placeholder="Phone*"
        className={inputClasses}
        {...register("phone", {
          required: "Phone Number is required.",
          minLength: 10,
          maxLength: 10,
        })}
      />
      <div className={errorClasses}> {errors.phone?.message}</div>

      <input
        type="text"
        placeholder="Email"
        className={inputClasses}
        {...register("email")}
      />
      <div className={errorClasses}> {errors.email?.message}</div>

      <textarea
        className={textareaClass}
        placeholder="Address*"
        {...register("address", {
          required: "Address is needed to process your order.",
          minLength: 10,
          maxLength: 500,
        })}
      ></textarea>
      <div className={errorClasses}> {errors.address?.message}</div>
    </motion.section>
  );
};
