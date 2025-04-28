import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FormField } from "../UI//FormField";
import Button from "../UI/Button";
import { ResetPasswordData, ResetPasswordSchema } from "../../types/Types";
import { resetPassword } from "../../lib/api";
import ThemeToggle from "../UI/ThemeToggle";

const ResetPasswordForm = () => {
  const { token = "" } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const {
    mutate: resetPasswordMutation,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (data: ResetPasswordData) => resetPassword(token, data),
    onSuccess: () => {
      setErrorMessage("");
      setSuccessMessage("Password reset successful! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/signin", { replace: true });
      }, 3000);
    },
    onError: (error: Error) => {
      setSuccessMessage("");
      setErrorMessage(error.message || "Failed to reset password");
    },
  });

  const onSubmit = (data: ResetPasswordData) => {
    setErrorMessage("");
    resetPasswordMutation(data);
  };

  if (!token) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-md relative">
        <p className="text-sm font-medium">Invalid reset token</p>
        <p className="text-xs mt-1">
          The password reset link is invalid or has expired. Please request a
          new password reset link.
        </p>
      </div>
    );
  }

  return (
    <form
      className="mt-8 flex flex-col p-6 gap-4 rounded-md shadow-md bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="self-end">
        <ThemeToggle />
      </div>

      {isError && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-md relative">
          <p className="text-sm">
            {errorMessage || "Failed to reset password"}
          </p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-500 text-green-700 dark:text-green-400 px-4 py-3 rounded-md relative">
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      <FormField
        type="password"
        label="New Password"
        name="newPassword"
        register={register}
        error={errors.newPassword}
        required={true}
        placeholder="New password"
      />

      <FormField
        type="password"
        label="Confirm New Password"
        name="confirmPassword"
        register={register}
        error={errors.confirmPassword}
        required={true}
        placeholder="Confirm new password"
      />

      <Button type="submit" disabled={isPending} className="w-full mt-2">
        {isPending ? "Resetting Password..." : "Reset Password"}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
