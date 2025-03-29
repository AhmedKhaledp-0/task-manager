import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { logout } from "../lib/api";
import { useMutation } from "@tanstack/react-query";

const UserMenu = () => {
  const { data } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // @ts-ignore - We know response has a user property

  const { firstName, lastName, email } = data?.user || {};
  const navigate = useNavigate();
  const { mutate: handleLogout, isPending, isError, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear user data and redirect to login page
      setIsOpen(false);
      navigate("/login", { replace: true });
    },
    onError: (error: Error) => {
      console.error("Logout failed:", error.message);
    },
  });
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials =
    firstName && lastName ? `${firstName.charAt(0)}`.toUpperCase() : "??";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
          {initials}
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {firstName} {lastName}
          </div>
          <div className="text-xs text-gray-500 dark:text-zinc-400">
            {email}
          </div>
        </div>
      </button>

      <div
        className={`absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-1">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-3" />
            Your Profile
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-3" />
            Settings
          </Link>
          <div className="h-px bg-gray-200 dark:bg-zinc-700 my-1" />
          <button
            
            className="flex grow items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            onClick={() => handleLogout()}
            disabled={isPending} // Disable button while logging out
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3" />
            {isPending ? "Signing out..." : "Sign out"}
          </button>
          {isError && (
            <p className="text-red-500 text-sm mt-2">
              {error?.message || "Logout failed. Please try again."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
