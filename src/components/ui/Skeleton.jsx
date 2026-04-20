export function SkeletonText({ className = "", width = "w-full" }) {
  return <div className={`skeleton-text ${width} ${className}`} />;
}

export function SkeletonCard({ className = "" }) {
  return <div className={`skeleton-card ${className}`} />;
}

export function SkeletonList({ count = 3, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonForm({ className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="h-32 w-full rounded-2xl bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" style={{ backgroundSize: '200% 100%' }} />
      </div>
      <div className="h-24 w-full rounded-2xl bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" style={{ backgroundSize: '200% 100%' }} />
      </div>
      <div className="h-12 w-full rounded-xl bg-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite]" style={{ backgroundSize: '200% 100%' }} />
      </div>
    </div>
  );
}
