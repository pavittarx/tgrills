"use client";
import type { FC } from "react";
import { motion } from "motion/react";
import { UseFormRegister } from "react-hook-form";
import classNames from "classnames";

export type AddressInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

type LoginFormProps = {
  register: UseFormRegister<AddressInput>;
};

export const LoginForm: FC<LoginFormProps> = ({ register }) => {
  const inputClasses = "w-[90vw] border p-1 m-1 text-sm focus:outline-none";
  const textareaClass = classNames(inputClasses, "h-[80px]");

  return (
    <motion.section
      initial={{opacity: 0}}
      animate={{opacity: [0, 1]}}
      className={classNames("pt-5 pl-2 mb-2")}
      >
      <form className="flex flex-col items-start gap-2">
        <input
          type="text"
          placeholder="Name*"
          className={inputClasses}
          {...register("name", { minLength: 4, maxLength: 30 })}
        />
        <input
          type="text"
          placeholder="Phone*"
          className={inputClasses}
          {...register("phone", { minLength: 10, maxLength: 10 })}
        />
        <input
          type="text"
          placeholder="Email"
          className={inputClasses}
          {...register("email")}
        />
        <textarea
          className={textareaClass}
          placeholder="Address*"
          {...register("address", { minLength: 10, maxLength: 500 })}
        ></textarea>
      </form>
    </motion.section>
  );
};
