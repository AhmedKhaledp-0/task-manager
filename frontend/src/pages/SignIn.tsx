import SingInForm from "../components/SingInForm";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Welcome Back
        </h3>
        <SingInForm />
      </div>
    </div>
  );
};

export default SignIn;
