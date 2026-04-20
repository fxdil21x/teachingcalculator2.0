import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function AuthSection({ onLogin, onSignup, onAdminLogin, onForgotPassword, onInstall, adminOnly = false, adminEmail = "admin@gmail.com" }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tcAccepted, setTcAccepted] = useState(false);
  const tcRef = useRef(null);

  useEffect(() => {
    if (adminOnly) setMode("admin");
  }, [adminOnly]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (mode === "admin") {
      if (!password) return;
    } else if (!email || !password) return;
    if (mode === "signup" && (!name.trim() || !tcAccepted)) {
      window.alert("Please enter your name and accept the terms and conditions.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") await onLogin(email.trim(), password);
      else if (mode === "signup") {
        Swal.fire({
          title: "Sign up submitted",
          text: "Your request has been submitted. Please wait for admin approval.",
          icon: "success",
          timer: 1800,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        await onSignup(email.trim(), password, name.trim());
      } else await onAdminLogin(password);
      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  function handleTcScroll() {
    if (!tcRef.current) return;
    const { scrollHeight, scrollTop, clientHeight } = tcRef.current;
    if (Math.abs(scrollHeight - scrollTop - clientHeight) < 10) {
      setTcAccepted("scrolled");
    }
  }

  async function handleReset() {
    if (!email) {
      window.alert("Enter your email first");
      return;
    }
    setLoading(true);
    try {
      await onForgotPassword(email.trim());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!adminOnly ? (
          <div className="flex gap-2 rounded-lg bg-slate-800/80 p-1">
            <Button
              type="button"
              variant={mode === "login" ? "default" : "secondary"}
              className="h-9 w-1/2"
              onClick={() => setMode("login")}
            >
              User Login
            </Button>

            <Button
              type="button"
              variant={mode === "signup" ? "default" : "secondary"}
              className="h-9 w-1/2"
              onClick={() => setMode("signup")}
            >
              Sign Up
            </Button>
          </div>
        ) : (
          <div className="rounded-lg bg-slate-800/80 p-4 text-sm text-slate-300">
            Admin login only
          </div>
        )}

        {mode !== "admin" ? (
          <>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-200">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                required
              />
            </div>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-200">Full Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
            )}
          </>
        ) : (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-200">Admin Email</label>
            <Input type="email" value={adminEmail} readOnly />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-200">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full pr-10"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent p-0 text-slate-400 hover:text-slate-200 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {mode === "signup" && (
          <div className="space-y-3 rounded-lg bg-slate-800/50 p-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-300">Terms & Conditions</p>
              <div
                ref={tcRef}
                onScroll={handleTcScroll}
                className="h-40 overflow-y-auto rounded border border-slate-600 bg-slate-950/50 p-3 text-xs text-slate-400"
              >
                <p className="mb-3 font-semibold text-slate-300">Teaching Hours Calculator - Terms & Conditions</p>
                <p className="mb-2"><strong>1. Acceptance of Terms</strong></p>
                <p className="mb-2">By using this Teaching Hours Calculator application, you agree to comply with and be bound by these terms and conditions.</p>
                <p className="mb-2"><strong>2. User Responsibilities</strong></p>
                <p className="mb-2">You are responsible for maintaining the confidentiality of your login credentials and password. You agree to accept responsibility for all activities that occur under your account.</p>
                <p className="mb-2"><strong>3. Permitted Use</strong></p>
                <p className="mb-2">This application is for personal tracking of teaching hours and salary calculations. Commercial redistribution or unauthorized access is prohibited.</p>
                <p className="mb-2"><strong>4. Data Privacy</strong></p>
                <p className="mb-2">Your data is stored securely and will not be shared with third parties without your explicit consent, except as required by law.</p>
                <p className="mb-2"><strong>5. Limitation of Liability</strong></p>
                <p className="mb-2">This application is provided "as is" without warranties. We are not liable for any errors or omissions in salary calculations or data loss.</p>
                <p className="mb-2"><strong>6. Termination</strong></p>
                <p className="mb-2">We reserve the right to terminate accounts that violate these terms or are inactive for extended periods.</p>
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tcAccepted === true}
                onChange={(e) => setTcAccepted(e.target.checked)}
                disabled={tcAccepted !== "scrolled"}
                className="h-4 w-4 cursor-pointer rounded border-slate-600 bg-slate-700"
              />
              <span className="text-xs text-slate-300">
                {tcAccepted === "scrolled" ? "I accept the terms and conditions" : "Please scroll to read the full terms"}
              </span>
            </label>
          </div>
        )}

        <Button type="submit" className="mt-1" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : mode === "signup" ? "Create account" : "Admin Login"}
        </Button>

        <div className="flex flex-wrap justify-between gap-2">
          {mode !== "admin" && (
            <Button type="button" variant="secondary" className="h-9 w-auto px-3" onClick={handleReset} disabled={loading}>
              Forgot password
            </Button>
          )}
          <Button type="button" variant="secondary" className="h-9 w-auto px-3" onClick={onInstall}>
            Install App
          </Button>
        </div>
      </form>
    </div>
  );
}
