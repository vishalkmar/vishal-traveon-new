// @ts-nocheck
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Globe, Loader2, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react";
import { getApiV1Base } from "../../utils/apiUrl.js";

const AUTH_API = `${getApiV1Base()}/auth`;

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok && data.success, data };
}

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

  // Second step (two-factor): set when the password is right but a code is needed
  const [challenge, setChallenge] = useState(null); // { challengeToken, methods, emailHint }
  const [method, setMethod] = useState("totp");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeInfo, setCodeInfo] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);

  const completeLogin = (payload) => {
    // The session now lives in an httpOnly cookie the backend set — we do NOT
    // store the token in localStorage (so it can't be stolen and reused).
    localStorage.setItem("isAdminLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(payload.user));
    setTimeout(() => {
      navigate("/admin-dashboard", { replace: true });
      setIsLoading(false);
    }, 500);
  };

  const backToPassword = () => {
    setChallenge(null);
    setCode("");
    setCodeError("");
    setCodeInfo("");
    setFormData((prev) => ({ ...prev, password: "" }));
  };

  const sendEmailCode = async (token = challenge?.challengeToken) => {
    setIsSendingCode(true);
    setCodeError("");
    try {
      const { ok, data } = await postJson(`${AUTH_API}/login/email-code`, { challengeToken: token });
      if (ok) setCodeInfo(data.message || "Code sent to your email.");
      else setCodeError(data.message || "Could not send the code.");
    } catch {
      setCodeError("Server error. Please try again.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const chooseMethod = (next) => {
    setMethod(next);
    setCode("");
    setCodeError("");
    setCodeInfo("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const clean = code.replace(/\s+/g, "");
    if (!/^\d{6}$/.test(clean)) {
      setCodeError("Enter the 6-digit code.");
      return;
    }
    setIsLoading(true);
    setCodeError("");
    try {
      const { ok, data } = await postJson(`${AUTH_API}/login/verify`, {
        challengeToken: challenge.challengeToken,
        method,
        code: clean,
      });
      if (ok) {
        completeLogin(data.data);
        return;
      }
      if (data.message && data.message.toLowerCase().includes("expired") && data.message.includes("log in")) {
        backToPassword();
        setErrors((prev) => ({ ...prev, form: data.message }));
      } else {
        setCodeError(data.message || "Incorrect code.");
      }
    } catch {
      setCodeError("Server error. Please try again.");
    }
    setIsLoading(false);
  };

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
      const { ok, data } = await postJson(`${AUTH_API}/login`, {
        username: formData.username.trim(),
        password: formData.password,
      });

      if (ok && data.data?.requires2FA) {
        // Password accepted; ask for the second factor.
        const methods = data.data.methods || [];
        setChallenge(data.data);
        setMethod(methods.includes("totp") ? "totp" : "email");
        setCode("");
        setCodeError("");
        setCodeInfo(
          data.data.emailSent ? `We emailed a 6-digit code to ${data.data.emailHint}.` : ""
        );
        if (methods.length === 1 && methods[0] === "email" && !data.data.emailSent) {
          setCodeError("Could not send the email code. Use \"Resend code\".");
        }
        setIsLoading(false);
      } else if (ok) {
        completeLogin(data.data);
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

  const methods = challenge?.methods || [];
  const verifyStep = challenge && (
    <div>
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Two-step verification</h2>
        <p className="text-gray-500 text-sm">
          {method === "totp"
            ? "Enter the 6-digit code from your authenticator app."
            : `Enter the 6-digit code we emailed to ${challenge.emailHint || "your inbox"}.`}
        </p>
      </div>

      {methods.length > 1 && (
        <div className="grid grid-cols-2 gap-2 p-1 mb-6 bg-slate-100 rounded-xl">
          {[
            { id: "totp", label: "Authenticator app", icon: KeyRound },
            { id: "email", label: "Email code", icon: Mail },
          ].map(({ id, label, icon }) => {
            const MethodIcon = icon;
            return (
            <button
              key={id}
              type="button"
              onClick={() => chooseMethod(id)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                method === id ? "bg-white text-blue-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MethodIcon className="w-4 h-4" />
              {label}
            </button>
            );
          })}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-5">
        {codeError && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 text-center">
            {codeError}
          </div>
        )}
        {codeInfo && !codeError && (
          <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-lg border border-emerald-100 text-center">
            {codeInfo}
          </div>
        )}

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          maxLength={7}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/[^\d ]/g, ""));
            if (codeError) setCodeError("");
          }}
          placeholder="000000"
          aria-label="6-digit verification code"
          className="block w-full py-3.5 text-center text-2xl tracking-[0.5em] font-semibold bg-blue-50/50 border border-blue-100 rounded-xl outline-none text-gray-800 placeholder:text-gray-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 focus:bg-white"
        />

        {method === "email" && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => sendEmailCode()}
              disabled={isSendingCode}
              className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 disabled:text-gray-400"
            >
              {isSendingCode ? "Sending..." : codeInfo ? "Resend code" : "Send code to my email"}
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold text-base transition-all duration-300 shadow-md ${
            isLoading
              ? "bg-cyan-300 cursor-not-allowed"
              : "bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 active:scale-[0.98]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            "Verify & Sign In"
          )}
        </button>

        <button
          type="button"
          onClick={backToPassword}
          className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </button>
      </form>
    </div>
  );

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

          {challenge ? (
            verifyStep
          ) : (
          <>
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
                  placeholder="Email address"
                  autoComplete="username"
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
          </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
