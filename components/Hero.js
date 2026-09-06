import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#3B2417] text-white">
      <div className="max-w-6xl mx-auto px-5 py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block text-xs font-bold tracking-widest text-accent mb-4">
            SIH 2026 &middot; SIH26091
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Business advice built for the village, not the boardroom.
          </h1>
          <p className="text-[#D8C9B8] text-lg leading-relaxed mb-8">
            Evaluate a business idea, understand your local market, and get a
            right-sized loan plan &mdash; all in one place, in your own
            language.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/idea-check"
              className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Check My Business Idea
            </Link>
            <a
              href="#how-it-works"
              className="border border-white/30 hover:border-white text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { n: "3x", l: "Higher idea-viability accuracy" },
            { n: "60%", l: "Faster access to the right loan scheme" },
            { n: "5", l: "Languages supported at launch" },
            { n: "100%", l: "Voice-first & offline-friendly" },
          ].map((s) => (
            <div
              key={s.l}
              className="bg-white/5 border border-white/10 rounded-xl2 p-5"
            >
              <div className="text-3xl font-bold text-accent mb-1">
                {s.n}
              </div>
              <div className="text-sm text-[#D8C9B8]">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
