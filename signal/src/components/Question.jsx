export function Question({ text }) {
  return (
    <h2 className="text-center font-display text-[clamp(1.35rem,4.5vw,2rem)] leading-snug text-text-primary">
      {text}
    </h2>
  )
}
