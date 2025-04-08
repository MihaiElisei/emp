/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Footer = ({ darkMode }) => {
  return (
    <div className="container mt-10">
      <footer className="w-full border-t border-zinc-900 dark:border-zinc-100 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-5 text-center md:text-left">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-center md:justify-start gap-3">
              Mihai Elisei
              <figure className="w-10 h-10">
                <img
                  className="rounded-full"
                  src={darkMode ? "/images/logo.png" : "/images/logo_bg.png"}
                  width={40}
                  height={40}
                  alt="Mihai Elisei Logo"
                />
              </figure>
            </h1>
            <p className="text-sm text-zinc-900 dark:text-zinc-100">
              Unlock the power of creativity and innovation! Get expert
              insights, industry trends, and growth strategies.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-center md:text-left">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-3 text-zinc-900 dark:text-zinc-100 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:bg-zinc-900 hover:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 rounded-lg px-3 py-1 "
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:bg-zinc-900 hover:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 rounded-lg px-3 py-1 "
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="hover:bg-zinc-900 hover:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 rounded-lg px-3 py-1 "
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className="hover:bg-zinc-900 hover:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 rounded-lg px-3 py-1 "
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:bg-zinc-900 hover:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 rounded-lg px-3 py-1 "
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="hover:bg-zinc-900 hover:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 rounded-lg px-3 py-1 "
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <Card className="bg-zinc-900 dark:bg-zinc-100 p-5 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-zinc-100 dark:text-zinc-900">
              📩 Join Our Newsletter!
            </h3>
            <p className="text-sm text-zinc-100 dark:text-zinc-900 mt-1">
              Get the latest insights, trends, and updates directly in your
              inbox.
            </p>
            <div className="mt-4">
              <Input type="email" placeholder="Enter your email" />
              <Button className="w-full mt-3 text-zinc-900 bg-zinc-100 hover:bg-zinc-900 hover:border-2 hover:border-zinc-100 hover:text-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 dark:hover:border-2 dark:hover:border-zinc-900 cursor-pointer">
                Subscribe Now
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-zinc-900 dark:text-zinc-100">
          &copy; {new Date().getFullYear()} Mihai Elisei. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
