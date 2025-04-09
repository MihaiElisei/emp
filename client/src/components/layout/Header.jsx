/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../ui/Navbar";
import { Switch } from "../ui/switch";
import useAuthentication from "@/lib/hooks/useAuthentication";

const Header = ({ darkMode, handleDarkMode }) => {
  const [navOpen, setNavOpen] = useState(false);
  const { isAuthorized, user } = useAuthentication();
  return (
    <header className="fixed top-0 left-0 w-full h-20 flex items-center z-40 bg-zinc-100 dark:bg-zinc-900 shadow-md shadow-zinc-300 dark:shadow-zinc-700">
      <div className="md:[grid-template-columns:1fr_3fr_1fr] max-w-screen-2xl w-full mx-auto px-4 flex justify-between items-center md:px-6 md:grid">
        <Link to="/">
          <img
            className="rounded-sm"
            src={darkMode ? "/images/logo.png" : "/images/logo_bg.png"}
            alt="Logo"
            width={80}
            height={80}
          />
        </Link>
        <div className="relative md:justify-self-center">
          <button
            className="menu-btn md:!hidden"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            <span className="material-symbols-rounded md:!hidden text-zinc-900 dark:text-zinc-100 cursor-pointer">
              {navOpen ? "close" : "menu"}
            </span>
          </button>
          <Navbar navOpen={navOpen} />
        </div>

        <div className="flex flex-row items-center justify-around gap-2 md:gap-4">
          {isAuthorized && (
            <>
              <div className="text-center">
                <small className="block text-zinc-900 dark:text-zinc-100 font-semibold">
                  Welcome
                </small>
                <strong className="block">
                  {user?.full_name ? user.full_name : "Guest"}
                </strong>
              </div>
            </>
          )}
          <Switch
            className="justify-self-end"
            onCheckedChange={handleDarkMode}
            checked={darkMode}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
