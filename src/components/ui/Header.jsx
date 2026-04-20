import { Menu } from "lucide-react";

export default function Header({ onMenuClick, title = "Teaching Hours Calculator" }) {
  return (
    <header className="app-header">
      <div className="app-header-logo">
        <img src="/image/LOGO NEW.png" alt="Logo" />
        <h1 className="app-header-title hidden sm:block">{title}</h1>
        <h1 className="app-header-title sm:hidden">TH Calculator</h1>
      </div>
      <button
        type="button"
        onClick={onMenuClick}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
    </header>
  );
}
