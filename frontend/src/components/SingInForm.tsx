import Button from "./Button";
import { FormField } from "./FormField";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login, SignInData } from "../lib/api";
import GoogleButton from "./GoogleButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "../types/Types";
import ThemeToggle from "./ThemeToggle";

const SignInForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit, 
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
  });

  const {
    mutate: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (data: SignInData) => login(data),
    onSuccess: () => {
      navigate("/", {
        replace: true,
      });
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Invalid credentials");
    },
  });

  const onSubmit = (data: SignInData) => {
    setErrorMessage("");
    signIn(data);
  };

  return (
    <>
      <form
        className="mt-8 flex flex-col p-6 gap-2 rounded-md shadow-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="self-end">
          <ThemeToggle />
        </div>
        {isError && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-md relative">
            <p className="text-sm">{errorMessage || "Invalid credentials"}</p>
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

        <FormField
          type="password"
          label="Password"
          name="password"
          register={register}
          error={errors.password}
          required={true}
          placeholder="Password"
        />

        <Link
          to="/forgot-password"
          className="text-sm self-end text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Forgot your password?
        </Link>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>

        <GoogleButton className="w-full" />

        <Link
            to="/signup"
            className="!bg-transparent font-medium text-sm self-center mt-2 text-indigo-500 dark:hover:text-indigo-300"
          >
            Don't have an account?
            <span className="text-gray-500 dark:text-gray-300"> Sign up </span>
        </Link>
      </form>
    </>
  );
};

export default SignInForm;
