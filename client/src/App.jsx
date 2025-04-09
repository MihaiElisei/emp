import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "./components/layout/AppLayout";
import Spinner from "./components/ui/Spinner";
import useAuthentication from "./lib/hooks/useAuthentication";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ArticlesPage = lazy(() => import("./pages/ArticlesPage"));
const AuthenticationPage = lazy(() => import("./pages/AuthenticationPage"));
const GoogleRedirectHandler = lazy(() =>
  import("./lib/hooks/GoogleRedirectHandler")
);

function App() {
  const { isAuthorized } = useAuthentication();

  const ProtectedLogin = () => {
    return isAuthorized ? (
      <Navigate to="/" />
    ) : (
      <AuthenticationPage initialMethod="login" />
    );
  };

  const ProtectedRegister = () => {
    return isAuthorized ? (
      <Navigate to="/" />
    ) : (
      <AuthenticationPage initialMethod="register" />
    );
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<ProtectedLogin />} />
            <Route path="/register" element={<ProtectedRegister />} />
            <Route path="/login/callback" element={<GoogleRedirectHandler />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
