import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function AuthSection({ onLogin, onSignup, onAdminLogin, onForgotPassword, onInstall, adminOnly = false, adminEmail = "admin@gmail.com" }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminOnly) setMode("admin");
  }, [adminOnly]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (mode === "admin") {
      if (!password) return;
    } else if (!email || !password) return;
    setLoading(true);
    try {
      if (mode === "login") await onLogin(email.trim(), password);
      else if (mode === "signup") await onSignup(email.trim(), password);
      else await onAdminLogin(password);
      setPassword("");
    } finally {
      setLoading(false);
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
