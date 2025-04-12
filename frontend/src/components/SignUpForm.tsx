import Button from "./Button";
import { FormField } from "./FormField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerApi, SignUpData } from "../lib/api";
import GoogleButton from "./GoogleButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, SignUpFormData } from "../types/Types";
import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";
import { useToast } from "./Toast";

const SignUpForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { addToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const {
    mutate: signUp,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (data: SignUpData) => registerApi(data),
    onSuccess: () => {
      addToast({
        type: "success",
        title: "Success",
        message: "Account Created Successfully, Redirecting to Signin ...",
      });
      navigate("/signin", {
        replace: true,
      });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Registration failed");
    },
  });

  const onSubmit = (data: SignUpData) => {
    setErrorMessage("");
    signUp(data);
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
          type="text"
          label="First Name"
          name="firstName"
          register={register}
          error={errors.firstName}
          required={true}
          placeholder="First Name"
        />

        <FormField
          type="text"
          label="Last Name"
          name="lastName"
          register={register}
          error={errors.lastName}
          required={true}
          placeholder="Last Name"
        />

        <FormField
          type="email"
          label="Email address"
          name="email"
          register={register}
          error={errors.email}
          required={true}
          placeholder="Email address"
        />

        <FormField
          type="password"
          label="Password"
          name="password"
          register={register}
          error={errors.password}
          required={true}
          placeholder="Password"
        />

        <FormField
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
          required={true}
          placeholder="Confirm Password"
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Signing up..." : "Sign up"}
        </Button>

        <GoogleButton className="w-full" />
        <Link
          to="/signin"
          className="!bg-transparent font-medium text-sm self-center mt-2 text-indigo-500 dark:hover:text-indigo-300"
        >
          Already have an account?
          <span className="text-gray-500 dark:text-gray-300"> Sign in </span>
        </Link>
      </form>
    </>
  );
};

export default SignUpForm;
