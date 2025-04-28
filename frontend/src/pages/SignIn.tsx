import SingInForm from "../components/Auth/SingInForm";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <h3 className="text-xl font-medium mt-2 text-center text-gray-600 dark:text-gray-300">
            Welcome Back
          </h3>
        </div>
        <SingInForm />
      </div>
    </div>
  );
};

export default SignIn;
