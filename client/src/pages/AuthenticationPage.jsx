/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import AuthForm from "@/components/forms/AuthForm";
import { useEffect, useState } from "react";

const AuthenticationPage = ({ initialMethod }) => {
  const [method, setMethod] = useState(initialMethod);

  useEffect(() => {
    setMethod(initialMethod);
  }, [initialMethod]);

  const route = method === "login" ? "/token/" : "/user/register/";

  return (
    <div className="section">
      <div className="container flex items-center justify-center">
        <AuthForm route={route} method={method} />
      </div>
    </div>
  );
};

export default AuthenticationPage;
