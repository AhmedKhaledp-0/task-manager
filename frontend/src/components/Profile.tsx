import useAuth from "../hooks/useAuth";
import { User } from "../types/Types";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const { data } = useAuth();
  // @ts-ignore - We know response has a user property
  const user = data?.user as User;
  const { firstName, lastName, email } = user;

  const initials =
    firstName && lastName
      ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      : "??";

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-zinc-800 border-4 border-white dark:border-zinc-800 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
              {initials}
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {firstName} {lastName}
              </h1>
            </div>
            <Button variant="outline" className="cursor-not-allowed" disabled>
              Edit Profile
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-700 dark:text-zinc-300">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="w-5 h-5 text-blue-500 dark:text-blue-400"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                    Email
                  </p>
                  <p className="text-gray-900 dark:text-white">{email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-700 dark:text-zinc-300">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="w-5 h-5 text-blue-500 dark:text-blue-400"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                    Full Name
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {firstName} {lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
