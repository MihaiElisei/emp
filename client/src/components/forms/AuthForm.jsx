/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { EyeClosedIcon, Eye } from "lucide-react";
import api, { apiUrl } from "@/lib/hooks/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants/token";

const AuthForm = ({ route, method }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onSubmit = async (data) => {
    setError(null);
    setSuccess(null);

    if (method === "register" && data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const requestData =
        method === "register"
          ? {
              username: data.username,
              password: data.password,
              email: data.email,
              first_name: data.firstName,
              last_name: data.lastName,
            }
          : { username: data.username, password: data.password };

      const res = await api.post(route, requestData);

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
        window.location.reload();
      } else {
        setSuccess("Registration successful. Please login.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const errorMessages = Object.values(error.response.data).flat();
        setError(errorMessages);
      } else {
        setError(["Something went wrong. Please try again!"]);
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}/accounts/google/login/`;
  };

  return (
    <Card className="shadow-lg dark:bg-zinc-900 mb-20 md:w-[50%]">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-zinc-900 dark:text-zinc-100">
          {method === "register" ? "Register" : "Login"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {error?.length > 0 && (
            <ul className="text-red-500 text-sm">
              {error.map((err, index) => (
                <li key={index}>
                  <span>-&nbsp;</span>
                  {err}
                </li>
              ))}
            </ul>
          )}
          {success && <div className="text-green-500 text-sm">{success}</div>}

          {method === "login" && (
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Username
              </label>
              <Input
                className="ring-1 !placeholder-zinc-900 ring-zinc-900 bg-zinc-200 text-zinc-800 focus:bg-zinc-300 dark:bg-zinc-200 dark:text-zinc-900 dark:focus:bg-zinc-300 transition-colors"
                type="text"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <span className="text-red-500 text-xs">
                  {errors.username.message}
                </span>
              )}
            </div>
          )}

          {method === "login" && (
            <div className="relative">
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Password
              </label>
              <Input
                className="ring-1 !placeholder-zinc-900 ring-zinc-900 bg-zinc-200 text-zinc-800 focus:bg-zinc-300 dark:bg-zinc-200 dark:text-zinc-900 dark:focus:bg-zinc-300 transition-colors"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 text-zinc-900 mt-5"
              >
                {showPassword ? <Eye /> : <EyeClosedIcon />}
              </button>

              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>
          )}

          {method === "register" && (
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Username
              </label>
              <Input
                className="ring-1 !placeholder-zinc-900 ring-zinc-900 bg-zinc-200 text-zinc-800 focus:bg-zinc-300 dark:bg-zinc-200 dark:text-zinc-900 dark:focus:bg-zinc-300 transition-colors"
                type="text"
                placeholder="Enter your username"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && (
                <span className="text-red-500 text-xs">
                  {errors.username.message}
                </span>
              )}
            </div>
          )}

          {method === "register" && (
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                First Name
              </label>
              <Input
                className="ring-1 !placeholder-zinc-900 ring-zinc-900 bg-zinc-200 text-zinc-800 focus:bg-zinc-300 dark:bg-zinc-200 dark:text-zinc-900 dark:focus:bg-zinc-300 transition-colors"
                type="text"
                placeholder="Enter your first name"
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs">
                  {errors.firstName.message}
                </span>
              )}
            </div>
          )}

          {method === "register" && (
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Last Name
              </label>
              <Input
                className="ring-1 !placeholder-zinc-900 ring-zinc-900 bg-zinc-200 text-zinc-800 focus:bg-zinc-300 dark:bg-zinc-200 dark:text-zinc-900 dark:focus:bg-zinc-300 transition-colors"
                type="text"
                placeholder="Enter your last name"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          )}

          {method === "register" && (
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Email
              </label>
              <Input
                className="ring-1 !placeholder-zinc-900 ring-zinc-900 bg-zinc-200 text-zinc-800 focus:bg-zinc-300 dark:bg-zinc-200 dark:text-zinc-900 dark:focus:bg-zinc-300 transition-colors"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
          )}

          {method === "register" && (
            <div className="relative">
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Password
              </label>
              <Input
                className="ring-1 !placeholder-zinc-900 ring-zinc-900 bg-zinc-200 text-zinc-800 focus:bg-zinc-300 dark:bg-zinc-200 dark:text-zinc-900 dark:focus:bg-zinc-300 transition-colors"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 text-zinc-900 mt-5"
              >
                {showPassword ? <Eye /> : <EyeClosedIcon />}
              </button>

              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </div>
          )}
          {method === "register" && (
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Confirm Password
              </label>
              <Input
                className="ring-1 !placeholder-zinc-900 ring-zinc-900 bg-zinc-200 text-zinc-800 focus:bg-zinc-300 dark:bg-zinc-200 dark:text-zinc-900 dark:focus:bg-zinc-300 transition-colors"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col gap-y-4 border-t border-zinc-900 dark:border-zinc-100 py-5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 flex items-center justify-center gap-x-2 bg-zinc-900 text-zinc-100 hover:bg-zinc-100 hover:text-zinc-900 hover:ring-1 hover:ring-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 dark:hover:ring-1 dark:hover:ring-zinc-100 transition-colors cursor-pointer"
            >
              {isSubmitting
                ? "Processing..."
                : method === "register"
                ? "Register"
                : "Login"}
            </Button>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-2 flex items-center justify-center gap-x-2 bg-zinc-900 text-zinc-100 hover:bg-zinc-100 hover:text-zinc-900 hover:ring-1 hover:ring-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 dark:hover:ring-1 dark:hover:ring-zinc-100 transition-colors cursor-pointer"
            >
              <img
                src="/images/google.png"
                alt="Google Icon"
                className="w-5 h-5"
              />
              {method === "register"
                ? "Register with Google"
                : "Sign in with Google"}
            </Button>
          </div>

          {method === "login" && (
            <p className="text-zinc-900 dark:text-zinc-100">
              Don't have an account?
              <span
                className="hover:underline text-blue-800 dark:text-blue-400 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                &nbsp;Register
              </span>
            </p>
          )}
          {method === "register" && (
            <p className="text-zinc-900 dark:text-zinc-100">
              Already have an account?
              <span
                className="hover:underline text-blue-800 dark:text-blue-400 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                &nbsp;Login
              </span>
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
