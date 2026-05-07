import Link from "next/link";

const supportedGames = [
  "Path of Exile 1 & 2",
  "Diablo 4",
  "Last Epoch",
  "Hero Siege",
  "Torchlight Infinite",
] as const;

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative isolate overflow-hidden border-b border-zinc-800/80 bg-zinc-950"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(168,85,247,0.22),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_50%,rgba(234,179,8,0.12),transparent_50%),radial-gradient(ellipse_60%_40%_at_0%_80%,rgba(59,130,246,0.14),transparent_45%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" aria-hidden />

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="max-w-3xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
            ARPG virtual goods
          </p>
          <h1
            id="home-hero-heading"
            className="text-balance font-semibold tracking-tight text-zinc-50 text-4xl sm:text-5xl lg:text-6xl"
          >
            Trade-ready loot for the games you grind
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-relaxed text-zinc-400 sm:text-xl">
            A focused storefront for Path of Exile, Diablo 4, Last Epoch, and more—built for clarity,
            speed, and a professional delivery experience.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="#supported-games"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_-4px_rgba(251,191,36,0.55)] transition hover:from-amber-400 hover:to-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              Browse supported games
            </Link>
            <Link
              href="#trust"
              className="text-sm font-medium text-zinc-300 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              Why shop here
            </Link>
          </div>
        </div>

        <div id="supported-games" className="space-y-4 scroll-mt-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Supported titles
          </p>
          <ul className="flex flex-wrap gap-2">
            {supportedGames.map((name) => (
              <li key={name}>
                <span className="inline-flex items-center rounded-full border border-zinc-700/80 bg-zinc-900/60 px-3 py-1 text-sm text-zinc-200 backdrop-blur-sm">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          id="trust"
          className="grid gap-4 rounded-xl border border-zinc-800/90 bg-zinc-900/40 p-6 backdrop-blur-sm sm:grid-cols-3 scroll-mt-24"
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold text-violet-300">Clear catalog</p>
            <p className="text-sm text-zinc-400">
              Organised by game—not noisy marketplace clutter.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-300">Built for ARPG economies</p>
            <p className="text-sm text-zinc-400">
              Pricing and stock workflows tuned for volatile in-game markets.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-300">Delivery-minded UX</p>
            <p className="text-sm text-zinc-400">
              Guides and flows that respect how trades actually happen in-game.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
