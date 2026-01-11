// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Globe, Loader2 } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    form: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") === "true") {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", password: "", form: "" };

    if (!formData.username.trim()) {
      newErrors.username = "Email Address is required";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, form: "" }));

    if (!validateForm()) return;

    setIsLoading(true);

    // API Login
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user)); // Optional: store user info

        // Small delay for UX transition
        setTimeout(() => {
          navigate("/admin-dashboard", { replace: true });
          setIsLoading(false);
        }, 500);
      } else {
        setErrors((prev) => ({
          ...prev,
          form: data.message || "Invalid username or password",
        }));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Server error. Please try again.",
      }));
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Header */}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-12 bg-gradient-to-b from-white to-blue-50/30">
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-12">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-200">
              <Globe className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to your Traveon account to continue your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 text-center animate-in fade-in slide-in-from-top-1">
                {errors.form}
              </div>
            )}

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-cyan-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-3.5 bg-blue-50/50 border border-blue-100 rounded-xl outline-none transition-all duration-200 text-gray-700 placeholder:text-gray-400
                    ${
                      errors.username
                        ? "border-red-300 focus:ring-2 focus:ring-red-100"
                        : "focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 focus:bg-white"
                    }
                  `}
                  placeholder="info@evrenglobalsolutions.com"
                />
              </div>
              {errors.username && (
                <p className="text-[11px] text-red-500 font-medium ml-2">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-cyan-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-12 py-3.5 bg-blue-50/50 border border-blue-100 rounded-xl outline-none transition-all duration-200 text-gray-700 placeholder:text-gray-400
                    ${
                      errors.password
                        ? "border-red-300 focus:ring-2 focus:ring-red-100"
                        : "focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 focus:bg-white"
                    }
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-medium ml-2">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold text-base transition-all duration-300 shadow-md
                ${
                  isLoading
                    ? "bg-cyan-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 active:scale-[0.98]"
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
