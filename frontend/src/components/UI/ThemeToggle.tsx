import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { selectEffectiveTheme, setTheme } from "../../store/slices/themeSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { updatePWATheme } from "../../utils/pwaTheme";

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const effectiveTheme = useAppSelector(selectEffectiveTheme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(effectiveTheme);
    updatePWATheme(effectiveTheme);
  }, [effectiveTheme]);

  const toggleTheme = () => {
    const newTheme = effectiveTheme === "dark" ? "light" : "dark";
    dispatch(setTheme(newTheme));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-1.5 rounded-lg bg-gray-100 dark:bg-zinc-700 aspect-square  hover:bg-gray-200 dark:hover:bg-zinc-600 transition-all duration-200 w-10 h-10 flex justify-center items-center focus:outline-none"
      aria-label={`Switch to ${
        effectiveTheme === "dark" ? "light" : "dark"
      } mode`}
    >
      {effectiveTheme === "dark" ? (
        <FontAwesomeIcon
          icon={faSun}
          className=" text-amber-500 transition-transform duration-200 hover:rotate-45"
        />
      ) : (
        <FontAwesomeIcon
          icon={faMoon}
          className="w-4 h-4 text-indigo-600 transition-transform duration-200 hover:-rotate-12"
        />
      )}
    </button>
  );
};

export default ThemeToggle;
