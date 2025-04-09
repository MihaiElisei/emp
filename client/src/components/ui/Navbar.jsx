/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import useAuthentication from "@/lib/hooks/useAuthentication";
import { useEffect, useRef, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ navOpen }) => {
  const activeBox = useRef(null);
  const location = useLocation();
  const { isAuthorized, loading, logout } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    const updateActiveBox = () => {
      requestAnimationFrame(() => {
        const currentActive = document.querySelector(".nav-link.active");
        if (currentActive && activeBox.current) {
          Object.assign(activeBox.current.style, {
            top: `${currentActive.offsetTop}px`,
            left: `${currentActive.offsetLeft}px`,
            width: `${currentActive.offsetWidth}px`,
            height: `${currentActive.offsetHeight}px`,
            opacity: "1",
          });
        }
      });
    };

    updateActiveBox();
    window.addEventListener("resize", updateActiveBox);
    return () => window.removeEventListener("resize", updateActiveBox);
  }, [location.pathname]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Articles", path: "/articles" },
    { label: "Contact", path: "/contact" },
  ];

  const activePaths = useMemo(
    () => ({
      "/portfolio": [],
      "/articles": [],
      "/login": ["/login", "/auth", "/register"],
      "/": [],
    }),
    []
  );

  const isPathActive = (path) =>
    activePaths[path]?.some((p) => location.pathname.startsWith(p));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`navbar ${navOpen ? "active" : ""}`}>
      {navItems.map(({ label, path, extraClass }, key) => (
        <NavLink
          key={key}
          to={path}
          className={({ isActive }) =>
            `nav-link ${isActive || isPathActive(path) ? "active" : ""} ${
              extraClass || ""
            }`
          }
        >
          {label}
        </NavLink>
      ))}

      {!loading &&
        (isAuthorized ? (
          <NavLink
            to="/"
            onClick={handleLogout}
            className="nav-link !text-zinc-100 dark:!text-zinc-900"
          >
            Logout
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `nav-link ${
                isActive || isPathActive("/login") || isPathActive("/register")
                  ? "active"
                  : ""
              } md:ml-auto`
            }
          >
            Login
          </NavLink>
        ))}
      <div className="active-box" ref={activeBox}></div>
    </nav>
  );
};

export default Navbar;
