import { useState } from "react";
import Button from "../UI/Button";
import { FormField } from "../UI/FormField";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword, ChangePasswordData } from "../../lib/api";
import { useToast } from "../UI/Toast";
import { ChangePasswordFormProps, ChangePasswordSchema } from "../../types/Types";

const ChangePasswordForm = ({
  onSuccess,
  onCancel,
}: ChangePasswordFormProps) => {
  const { addToast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const { mutate: changePasswordMutation, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      addToast({
        type: "success",
        title: "Success",
        message: "Password changed successfully",
      });
      reset();
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      setErrorMessage(error.message);
      addToast({
        type: "error",
        title: "Error",
        message: error.message || "Failed to change password",
      });
    },
  });

  const onSubmit = (data: ChangePasswordData) => {
    setErrorMessage("");
    changePasswordMutation(data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <FormField
        type="password"
        label="Current Password"
        name="oldPassword"
        register={register}
        error={errors.oldPassword}
        required={true}
        placeholder="Enter your current password"
      />

      <FormField
        type="password"
        label="New Password"
        name="newPassword"
        register={register}
        error={errors.newPassword}
        required={true}
        placeholder="Enter new password"
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

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Changing..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
