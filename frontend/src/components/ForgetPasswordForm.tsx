import Button from "./Button";
import { FormField } from "./FormField";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgetPassword } from "../lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgetPasswordData, forgetPasswordSchema } from "../types/Types";
import ThemeToggle from "./ThemeToggle";

// Still will create the reset password page (ToDo)
const ForgetPasswordForm = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordData>({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const {
    mutate: ForgetPassword,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (data: ForgetPasswordData) => forgetPassword(data),
    onSuccess: () => {
      console.log("password reset sent");
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Failed to send the Email");
    },
  });

  const onSubmit = (data: ForgetPasswordData) => {
    setErrorMessage("");
    ForgetPassword(data);
  };

  return (
    <>
      <form
        className="mt-8 flex flex-col p-6 gap-2 rounded-md shadow-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="self-end">
          <ThemeToggle />
        </div>
        {isError && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-md relative">
            <p className="text-sm">{errorMessage || "Registration failed"}</p>
          </div>
        )}

        <FormField
          type="email"
          label="Email address"
          name="email"
          register={register}
          error={errors.email}
          required={true}
          placeholder="Email address"
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Sending email ..." : "Send Email"}
        </Button>
      </form>
    </>
  );
};

export default ForgetPasswordForm;
