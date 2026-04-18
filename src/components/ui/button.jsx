export function Button({ className = "", variant = "default", type = "button", ...props }) {
  const baseClass =
    "inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70 disabled:pointer-events-none disabled:opacity-50";

  const variantClass =
    variant === "secondary"
      ? "border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
      : "bg-blue-600 text-white hover:bg-blue-500";

  return <button type={type} className={`${baseClass} ${variantClass} ${className}`} {...props} />;
}
