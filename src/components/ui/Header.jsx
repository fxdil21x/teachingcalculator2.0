import { Menu, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function Header({ onMenuClick, title = "Teaching Hours Calculator" }) {
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = () => {
    setIsReloading(true);
    window.location.reload();
  };

  return (
    <header className="app-header">
      <div className="app-header-logo">
        <img src="/image/LOGO NEW.png" alt="Logo" />
        <h1 className="app-header-title">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleReload}
          disabled={isReloading}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Reload page"
          title="Reload page"
        >
          <RefreshCw size={20} className={isReloading ? "animate-spin" : ""} />
        </button>
        <button
          type="button"
          onClick={onMenuClick}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
