import { Outlet, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { navigationItems } from "../utils/list";
import ChatBot from "./ChatBot";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-white dark:bg-zinc-900">
      <ChatBot/>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3
        flex items-center justify-center
        bg-white dark:bg-zinc-800
        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        border border-gray-200/50 dark:border-zinc-700/50
        rounded-xl
        hover:bg-gray-50 dark:hover:bg-zinc-700
        active:scale-95
        transition-all duration-200"
        aria-label="Toggle menu"
      >
        <FontAwesomeIcon
          icon={isMobileMenuOpen ? faXmark : faBars}
          className={`w-6 h-6 text-gray-700 dark:text-zinc-300 transition-transform duration-200 ${
            isMobileMenuOpen ? "rotate-90 scale-110" : ""
          }`}
        />
      </button>

      <div className="flex flex-1 overflow-hidden">
        {/* Floating Sidebar */}
        <aside
          className={`
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          fixed lg:static
          inset-y-0 left-0
          h-[100dvh] lg:h-[calc(100vh-3rem)]
          my-0 lg:my-6 mx-0 lg:ml-6
          w-[85vw] lg:w-80
          flex-shrink-0
          bg-white dark:bg-zinc-800 
          border border-gray-200/50 dark:border-zinc-700/50 
          flex flex-col 
          shadow-[0_8px_32px_rgba(0,0,0,0.12)] 
          rounded-r-2xl lg:rounded-2xl
          z-40 lg:z-auto
          transition-transform duration-300 lg:transform-none
        `}
        >
          <div className="p-6 flex-grow overflow-y-auto rounded-t-2xl">
            <div className="space-y-2">
              {navigationItems.map(({ path, icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center px-5 py-4 text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={icon} className="w-5 h-5 mr-4" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200/50 dark:border-zinc-700/50 flex items-center justify-between rounded-b-2xl">
            <UserMenu />
            <ThemeToggle />
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <main className="flex-grow p-4 lg:p-6 overflow-auto bg-gray-50 dark:bg-zinc-900 lg:ml-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
