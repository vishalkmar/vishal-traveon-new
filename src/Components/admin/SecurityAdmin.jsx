import React, { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Mail,
  Info,
  Star,
  X,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { getApiV1Base } from "../../utils/apiUrl.js";

const AUTH_API = `${getApiV1Base()}/auth`;
const SERIF = { fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" };

// The serif heading font is only needed here, so load it on demand.
function useSerifFont() {
  useEffect(() => {
    const id = "font-playfair-display";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

async function api(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${AUTH_API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    if (response.status === 401 || response.status === 403) {
      if (!body || !("password" in body || "code" in body)) {
        throw new Error("Your session has expired. Please log out and sign in again.");
      }
    }
    throw new Error(data.message || "Something went wrong");
  }
  return data;
}

/* ───────────────────────── small pieces ───────────────────────── */

function StatusPill({ on }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide border ${
        on ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"
      }`}
    >
      {on ? "ON" : "OFF"}
    </span>
  );
}

function PhoneArt() {
  return (
    <svg viewBox="0 0 150 130" className="w-full h-full" aria-hidden="true">
      <path d="M0 110 C40 80 90 120 150 85 L150 130 L0 130 Z" fill="#e6f0ec" />
      <rect x="45" y="12" width="56" height="100" rx="10" transform="rotate(-14 73 62)" fill="#fff" stroke="#b8d3c9" strokeWidth="2.5" />
      <g transform="rotate(-14 73 62)" fill="#9bbfb2">
        <rect x="58" y="34" width="9" height="9" rx="1.5" />
        <rect x="79" y="34" width="9" height="9" rx="1.5" />
        <rect x="58" y="55" width="9" height="9" rx="1.5" />
        <rect x="71" y="48" width="4" height="4" />
        <rect x="80" y="57" width="6" height="6" />
        <text x="73" y="84" textAnchor="middle" fontSize="9" fill="#9bbfb2" letterSpacing="2">*****</text>
      </g>
    </svg>
  );
}

function EnvelopeArt() {
  return (
    <svg viewBox="0 0 150 130" className="w-full h-full" aria-hidden="true">
      <path d="M0 112 C40 84 95 124 150 92 L150 130 L0 130 Z" fill="#e6f0ec" />
      <rect x="40" y="18" width="70" height="28" rx="4" fill="#fff" stroke="#b8d3c9" strokeWidth="2" />
      <text x="75" y="37" textAnchor="middle" fontSize="11" fill="#7aa596" letterSpacing="3">******</text>
      <path d="M28 52 L75 84 L122 52 L122 112 L28 112 Z" fill="#fff" stroke="#b8d3c9" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M28 112 L64 80 M122 112 L86 80" stroke="#b8d3c9" strokeWidth="2.5" />
    </svg>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <h3 className="text-2xl font-bold text-[#163c36]" style={SERIF}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputClass =
  "block w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-gray-800 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10";
const primaryBtn =
  "w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0f4c45] text-white font-semibold hover:bg-[#0b3c36] disabled:opacity-60 transition-colors";

function CodeInput({ value, onChange }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={7}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^\d ]/g, ""))}
      placeholder="000000"
      aria-label="6-digit code"
      className={`${inputClass} text-center text-2xl tracking-[0.5em] font-semibold`}
    />
  );
}

/* ───────────────────────── flows ───────────────────────── */

function TotpSetupModal({ onClose, onDone }) {
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api("/2fa/totp/setup", { method: "POST" })
      .then((res) => setSetup(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api("/2fa/totp/enable", { method: "POST", body: { code: code.replace(/\s+/g, "") } });
      toast.success("Authenticator app turned on");
      onDone(res.data);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(setup.secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the key is still visible to copy by hand */
    }
  };

  return (
    <Modal title="Set up authenticator app" onClose={onClose}>
      {!setup && !error && (
        <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-emerald-700" /></div>
      )}
      {setup && (
        <form onSubmit={submit} className="space-y-5">
          <ol className="text-sm text-gray-600 space-y-1 list-decimal pl-5">
            <li>Open Google Authenticator, Authy or any TOTP app.</li>
            <li>Scan this QR code (or type the key below).</li>
            <li>Enter the 6-digit code the app shows.</li>
          </ol>
          <div className="flex justify-center p-4 bg-white border border-gray-100 rounded-xl">
            <QRCodeSVG value={setup.otpauthUrl} size={180} level="M" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Setup key</p>
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
              <code className="flex-1 text-xs sm:text-sm font-mono break-all text-gray-700">
                {setup.secret.match(/.{1,4}/g).join(" ")}
              </code>
              <button type="button" onClick={copySecret} className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200" aria-label="Copy key">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <CodeInput value={code} onChange={setCode} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy || code.replace(/\s+/g, "").length !== 6} className={primaryBtn}>
            {busy && <Loader2 className="w-4 h-4 animate-spin" />} Verify and turn on
          </button>
        </form>
      )}
      {!setup && error && <p className="text-sm text-red-600">{error}</p>}
    </Modal>
  );
}

function EmailSetupModal({ defaultEmail, onClose, onDone }) {
  const [email, setEmail] = useState(defaultEmail || "");
  const [sentTo, setSentTo] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const sendCode = async (e) => {
    e?.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api("/2fa/email/setup", { method: "POST", body: { email } });
      setSentTo(email.trim());
      toast.success(res.message || "Code sent");
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  const confirm = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api("/2fa/email/enable", { method: "POST", body: { code: code.replace(/\s+/g, "") } });
      toast.success("Email verification turned on");
      onDone(res.data);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  return (
    <Modal title="Set up email verification" onClose={onClose}>
      {!sentTo ? (
        <form onSubmit={sendCode} className="space-y-4">
          <p className="text-sm text-gray-600">
            Sign-in codes will be sent to this inbox. We'll send a code now to confirm it's yours.
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            aria-label="Email address for sign-in codes"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy || !email.trim()} className={primaryBtn}>
            {busy && <Loader2 className="w-4 h-4 animate-spin" />} Send code
          </button>
        </form>
      ) : (
        <form onSubmit={confirm} className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the 6-digit code sent to <span className="font-semibold text-gray-800">{sentTo}</span>.
          </p>
          <CodeInput value={code} onChange={setCode} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={busy || code.replace(/\s+/g, "").length !== 6} className={primaryBtn}>
            {busy && <Loader2 className="w-4 h-4 animate-spin" />} Verify and turn on
          </button>
          <div className="flex justify-between text-sm">
            <button type="button" onClick={() => { setSentTo(""); setCode(""); setError(""); }} className="text-gray-500 hover:text-gray-700">
              Change email
            </button>
            <button type="button" onClick={sendCode} disabled={busy} className="font-semibold text-emerald-700 hover:text-emerald-800">
              Resend code
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function DisableModal({ kind, status, onClose, onDone }) {
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const label = kind === "totp" ? "authenticator app" : "email verification";

  // You confirm with a code from a factor you currently hold.
  const totpOn = status?.totpEnabled;
  const emailOn = status?.emailOtpEnabled;
  const codeHint = totpOn
    ? "Enter the current 6-digit code from your authenticator app."
    : `Enter the 6-digit code emailed to ${status?.emailOtpAddress || "your inbox"}.`;

  const sendEmailCode = async () => {
    setSending(true);
    setError("");
    try {
      const res = await api("/2fa/stepup/email", { method: "POST" });
      setSent(true);
      toast.success(res.message || "Code sent");
    } catch (err) {
      setError(err.message);
    }
    setSending(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await api(`/2fa/${kind}/disable`, {
        method: "POST",
        body: { password, code: code.replace(/\s+/g, "") },
      });
      toast.success(res.message || "Turned off");
      onDone(res.data);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  return (
    <Modal title={`Turn off ${label}?`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-gray-600">
          Confirm with your password and a verification code, so only you can turn this off.
        </p>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className={inputClass}
          aria-label="Admin password"
        />
        <div>
          <p className="text-xs text-gray-500 mb-1.5">{codeHint}</p>
          <CodeInput value={code} onChange={setCode} />
          {/* If email is the only factor (or you prefer it), send a code. */}
          {emailOn && (
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={sendEmailCode}
                disabled={sending}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 disabled:text-gray-400"
              >
                {sending ? "Sending..." : sent ? "Resend email code" : "Email me a code"}
              </button>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password || code.replace(/\s+/g, "").length !== 6}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-60"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />} Turn off
        </button>
      </form>
    </Modal>
  );
}

/* ───────────────────────── method card ───────────────────────── */

function MethodCard({ icon, title, description, on, recommended, art, detail, learnMore, onTurnOn, onTurnOff }) {
  const Icon = icon;
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-[#efe6d8] rounded-2xl shadow-[0_2px_12px_rgba(15,76,69,0.04)] overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center gap-5 p-5 sm:p-7">
        <div className="flex items-start gap-5 flex-1 min-w-0">
          <div className="shrink-0 w-14 h-14 rounded-xl bg-[#e6f0ec] text-[#0f4c45] flex items-center justify-center">
            <Icon className="w-6 h-6" />
          </div>
          <div className="min-w-0 border-l border-[#e9dfcf] pl-5">
            <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
              <h3 className="text-xl sm:text-2xl font-bold text-[#163c36]" style={SERIF}>{title}</h3>
              <StatusPill on={on} />
              {recommended && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6f0ec] text-[#0f4c45]">
                  <Star className="w-3 h-3" /> Recommended
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{description}</p>
            {detail && <p className="text-sm text-[#0f4c45] font-medium mt-1 break-all">{detail}</p>}
          </div>
        </div>

        <div className="hidden lg:block w-40 h-28 shrink-0">{art}</div>

        <div className="flex flex-col items-stretch md:items-center gap-2 md:w-40 shrink-0">
          {on ? (
            <button
              onClick={onTurnOff}
              className="px-6 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
            >
              Turn off
            </button>
          ) : (
            <button
              onClick={onTurnOn}
              className="px-6 py-3 rounded-xl bg-gradient-to-b from-[#14594f] to-[#0b3f38] text-white font-semibold shadow-md hover:from-[#0f4c45] hover:to-[#082f2a] transition-colors"
            >
              Turn on
            </button>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center justify-center gap-1.5 text-sm text-gray-600 hover:text-gray-800"
          >
            <Info className="w-4 h-4" /> Learn more
          </button>
        </div>
      </div>
      {open && (
        <div className="px-5 sm:px-7 pb-6 -mt-1 text-sm text-gray-600 leading-relaxed border-t border-[#f3ece1] pt-4 bg-[#fcfaf6]">
          {learnMore}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function SecurityAdmin() {
  useSerifFont();
  const [status, setStatus] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [modal, setModal] = useState(null); // "totp-on" | "email-on" | "totp-off" | "email-off"

  const load = useCallback(async () => {
    setLoadError("");
    try {
      const res = await api("/2fa/status");
      setStatus(res.data);
    } catch (err) {
      setLoadError(err.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const done = (next) => {
    if (next) setStatus(next);
    setModal(null);
  };

  const anyOn = status && (status.totpEnabled || status.emailOtpEnabled);
  const both = status && status.totpEnabled && status.emailOtpEnabled;
  const defaultEmail =
    status?.emailOtpAddress || (status?.username && status.username.includes("@") ? status.username : "");

  return (
    <div className="max-w-6xl bg-[#faf6f0] p-4 sm:p-8 rounded-2xl">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl mb-6">
        <img
          src="/oman/banner.jpg"
          alt=""
          className="absolute right-0 top-0 h-full w-full md:w-[55%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf6f0] via-[#faf6f0]/95 md:via-[#faf6f0] to-[#faf6f0]/30 md:to-transparent" />
        <svg className="absolute bottom-0 right-0 w-[60%] h-10" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 C200 38 380 10 600 0 L600 40 Z" fill="#faf6f0" />
          <path d="M0 39 C200 37 380 9 600 -1" fill="none" stroke="#c9a45c" strokeWidth="2" />
        </svg>
        <div className="relative px-1 sm:px-2 pt-6 pb-10 max-w-2xl">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-10 h-10 text-[#0f4c45] shrink-0" strokeWidth={1.75} />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#163c36] leading-tight" style={SERIF}>
              Two-Factor Authentication
            </h1>
          </div>
          <p className="mt-3 text-gray-600 sm:pl-14">
            Add a second step after your password. Once turned on, signing in to the admin console also
            needs a 6-digit code — from an authenticator app or emailed to the inbox you set here. With both
            on, either one works.
          </p>
          <div className="mt-6 h-[3px] w-16 bg-[#c9a45c] rounded-full" />
        </div>
      </div>

      {loadError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 flex items-center justify-between gap-4">
          <span>{loadError}</span>
          <button onClick={load} className="font-semibold underline">Retry</button>
        </div>
      )}

      {!status && !loadError && (
        <div className="py-16 flex justify-center"><Loader2 className="w-7 h-7 animate-spin text-[#0f4c45]" /></div>
      )}

      {status && (
        <div className="space-y-5">
          {/* Status */}
          <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-5 sm:p-6 rounded-2xl bg-[#eaf2ee] border border-[#d5e6de]">
            <div className="flex items-center gap-4 md:pr-6 md:border-r md:border-[#c9ddd3]">
              <Lock className="w-6 h-6 text-[#0f4c45]" />
              <span className="text-lg font-bold text-[#163c36]" style={SERIF}>Security Status</span>
            </div>
            <span
              className={`self-start md:self-auto px-3.5 py-1 rounded-full text-sm font-medium ${
                anyOn ? "bg-emerald-600 text-white" : "bg-[#fbe7c6] text-[#8a5a12]"
              }`}
            >
              {anyOn ? "Enabled" : "Not enabled"}
            </span>
            <p className="text-sm text-gray-700 flex-1">
              {!anyOn &&
                "Two-factor authentication is currently off. Turn on at least one method to add an extra layer of security to your admin account."}
              {anyOn && both && "Both methods are on. At sign-in you can use either the authenticator app or an emailed code."}
              {anyOn && !both && status.totpEnabled && "Sign-in needs a code from your authenticator app."}
              {anyOn && !both && status.emailOtpEnabled && `Sign-in needs a code emailed to ${status.emailOtpAddress}.`}
            </p>
          </div>

          <MethodCard
            icon={KeyRound}
            title="Authenticator app (MFA)"
            description="Use Google Authenticator, Authy, or any TOTP app for a 6-digit code."
            on={status.totpEnabled}
            recommended
            art={<PhoneArt />}
            onTurnOn={() => setModal("totp-on")}
            onTurnOff={() => setModal("totp-off")}
            learnMore={
              <>
                The app makes a new 6-digit code every 30 seconds, even without internet, so it keeps working
                if email is slow or down. Keep the setup key somewhere safe — if you lose your phone you'll need it,
                or the email method, to get back in.
              </>
            }
          />

          <MethodCard
            icon={Mail}
            title="Email verification"
            description="A 6-digit code emailed at each admin sign-in, to an inbox you choose."
            on={status.emailOtpEnabled}
            detail={status.emailOtpEnabled ? `Codes go to ${status.emailOtpAddress}` : ""}
            art={<EnvelopeArt />}
            onTurnOn={() => setModal("email-on")}
            onTurnOff={() => setModal("email-off")}
            learnMore={
              <>
                Each code works once and expires after 10 minutes; after 5 wrong tries you'll need a new one. Use an
                inbox only you can open — anyone who can read that email could pass this step.
              </>
            }
          />
        </div>
      )}

      {modal === "totp-on" && <TotpSetupModal onClose={() => setModal(null)} onDone={done} />}
      {modal === "email-on" && (
        <EmailSetupModal defaultEmail={defaultEmail} onClose={() => setModal(null)} onDone={done} />
      )}
      {modal === "totp-off" && <DisableModal kind="totp" status={status} onClose={() => setModal(null)} onDone={done} />}
      {modal === "email-off" && <DisableModal kind="email" status={status} onClose={() => setModal(null)} onDone={done} />}
    </div>
  );
}
