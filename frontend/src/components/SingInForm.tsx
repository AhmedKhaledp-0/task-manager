import Button from "./Button";
import { FormField } from "./FormField";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login, SignInData, checkGoogleAuthStatus } from "../lib/api";
import GoogleButton from "./GoogleButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "../types/Types";

const SignInForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
  });

  useEffect(() => {
    if (location.search.includes("googleAuth=success")) {
      const verifyGoogleAuth = async () => {
        try {
          await checkGoogleAuthStatus();
          navigate("/dashboard", { replace: true });
        } catch (error: any) {
          setErrorMessage(error.message || "Google authentication failed");
        }
      };
      verifyGoogleAuth();
    }
  }, [location, navigate]);

  const {
    mutate: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (data: SignInData) => login(data),
    onSuccess: () => {
      navigate("/dashboard", {
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
        className="mt-8 flex flex-col p-6 gap-2 rounded-md shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        {isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative">
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
          className="text-sm self-end text-indigo-600 hover:text-indigo-500"
        >
          Forgot your password?
        </Link>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>

        <GoogleButton className="w-full" />

        <Link
          to="/signup"
          className="font-medium text-sm self-center mt-2 text-indigo-600 hover:text-indigo-500"
        >
          Don't have an account? Sign up
        </Link>
      </form>
    </>
  );
};

export default SignInForm;
