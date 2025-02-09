import classNames from "classnames";
import { motion } from "motion/react";

import type { FC } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { AddressInput } from "@/_types/Address";

type OrderInputProps = {
  register: UseFormRegister<AddressInput>;
  errors: FieldErrors<AddressInput>;
};

const getInputClasses = (error?: boolean) => 
  classNames(
    "w-[90vw] border text-sm transition-all duration-200",
    "px-4 py-2.5 rounded-lg",
    "bg-white/80 backdrop-blur-sm",
    "placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-opacity-50",
    error 
      ? "border-red-300 hover:border-red-400 focus:border-red-500 focus:ring-red-200" 
      : "border-gray-200 hover:border-gray-300 focus:border-yellow-500 focus:ring-yellow-200"
  );
const getTextareaClasses = (error?: boolean) => 
  classNames(
    getInputClasses(error),
    "h-[100px] resize-none leading-relaxed"
  );
const labelClasses = "text-sm font-medium text-gray-700 flex items-center gap-1";
const requiredStar = <span className="text-red-500 text-xs">*</span>;
const errorClasses = "text-red-500 text-xs min-h-[16px] mt-0.5";

export const OrderInputs: FC<OrderInputProps> = ({ register, errors }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-2 px-2"
    >
      <div className="space-y-1">
        <label className={labelClasses}>
          Full Name {requiredStar}
        </label>
        <input
          type="text"
          placeholder="John Doe"
          className={getInputClasses(!!errors.name)}
          {...register("name", {
            required: "Please enter your name",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters"
            },
            maxLength: {
              value: 50,
              message: "Name must be less than 50 characters"
            },
            pattern: {
              value: /^[a-zA-Z\s]*$/,
              message: "Name can only contain letters and spaces"
            }
          })}
        />
        <div className={errorClasses}>{errors.name?.message}</div>
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>
          Phone Number {requiredStar}
        </label>
        <input
          type="tel"
          placeholder="1234567890"
          className={getInputClasses(!!errors.phone)}
          {...register("phone", {
            required: "Please enter your phone number",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number"
            }
          })}
        />
        <div className={errorClasses}>{errors.phone?.message}</div>
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>
          Email Address
        </label>
        <input
          type="email"
          placeholder="john@example.com"
          className={getInputClasses(!!errors.email)}
          {...register("email", {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address"
            }
          })}
        />
        <div className={errorClasses}>{errors.email?.message}</div>
      </div>

      <div className="space-y-1">
        <label className={labelClasses}>
          Delivery Address {requiredStar}
        </label>
        <textarea
          className={getTextareaClasses(!!errors.address)}
          placeholder="Enter your complete delivery address"
          {...register("address", {
            required: "Please enter your delivery address",
            minLength: {
              value: 10,
              message: "Address must be at least 10 characters"
            },
            maxLength: {
              value: 200,
              message: "Address must be less than 200 characters"
            }
          })}
        ></textarea>
        <div className={errorClasses}>{errors.address?.message}</div>
      </div>
    </motion.section>
  );
};
