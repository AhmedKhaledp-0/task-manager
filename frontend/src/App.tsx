import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import Profile from "./components/Layout/Profile";
import Projects from "./components/project/Projects";
import Tasks from "./pages/Tasks";
import Error from "./pages/Error";
import GoogleCallback from "./pages/GoogleCallback";
import { useAppSelector } from "./store/store";
import { selectEffectiveTheme } from "./store/slices/themeSlice";
import { useEffect } from "react";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const effectiveTheme = useAppSelector(selectEffectiveTheme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(effectiveTheme);
  }, [effectiveTheme]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 dark:text-white">
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route index element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/tasks" element={<Tasks />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgetPassword />} />
          <Route
            path="/user/resetpassword/:token"
            element={<ResetPassword />}
          />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
