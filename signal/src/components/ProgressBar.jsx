export function ProgressBar({ currentIndex, total }) {
  const pct = total > 0 ? Math.min(100, ((currentIndex + 1) / total) * 100) : 0
  return (
    <div className="h-px w-full overflow-hidden rounded-full bg-bg-tertiary">
      <div
        className="h-full bg-accent-gold transition-[width] duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
