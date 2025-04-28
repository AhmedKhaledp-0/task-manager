import ResetPasswordForm from "../components/Auth/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Please enter your new password to complete the reset process
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;
