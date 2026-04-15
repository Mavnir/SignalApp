export function Landing({ onBegin }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 flex justify-center"
        aria-hidden
      >
        <div className="mt-[12vh] h-[min(420px,55vw)] w-[min(420px,55vw)] max-w-[90vw] rounded-full bg-accent-gold/10 blur-[100px]" />
      </div>
      <div className="relative z-[1] flex max-w-lg flex-col items-center text-center">
        <h1 className="font-display text-[clamp(3rem,12vw,5.5rem)] font-semibold tracking-[0.35em] text-text-primary">
          SIGNAL
        </h1>
        <p className="mt-6 font-display text-2xl text-accent-gold md:text-3xl">Read your signal.</p>
        <p className="mt-8 max-w-sm text-sm leading-relaxed text-text-secondary">
          20 questions. 5 minutes. A reading that knows you.
        </p>
        <button
          type="button"
          onClick={onBegin}
          className="mt-14 w-full max-w-xs border border-accent-gold/40 bg-accent-gold/10 px-8 py-3.5 font-sans text-sm font-medium tracking-wide text-accent-gold transition hover:border-accent-gold hover:bg-accent-gold/20"
        >
          Begin
        </button>
      </div>
    </div>
  )
}
