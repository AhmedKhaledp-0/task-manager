import Button from "./Button";
import { FormField } from "./FormField";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerApi, SignUpData } from "../lib/api";
import GoogleButton from "./GoogleButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, SignUpFormData } from "../types/Types";

const SignUpForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
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
        className="mt-8 flex flex-col p-6 gap-2 rounded-md shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative">
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

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Signing up..." : "Sign up"}
        </Button>

        <GoogleButton className="w-full" />

        <Link
          to="/signin"
          className="font-medium text-sm self-center mt-2 text-indigo-600 hover:text-indigo-500"
        >
          Already have an account? Sign in
        </Link>
      </form>
    </>
  );
};

export default SignUpForm;
