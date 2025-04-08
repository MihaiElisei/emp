/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const AppLayout = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("dark") === "true";
  });

  const handleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("dark", darkMode ? "true" : "false");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <main
      className={`${
        darkMode ? "dark" : ""
      } w-full min-h-[100vh] bg-zinc-100 dark:bg-zinc-900`}
    >
      <Header darkMode={darkMode} handleDarkMode={handleDarkMode} />
      <Outlet />
      <Footer />
    </main>
  );
};

export default AppLayout;
