import Link from "next/link";

const sections = {
  hero: {
    eyebrow: "Retainer Tracker up front. Jarvis under the hood.",
    headline: "Stop losing money on retainers you can't see.",
    subheadline:
      "HowlerAI ships small, sharp tools for operators. Start with a retainer tracker that shows where your margin actually goes—then let the ops layer underneath keep everything coordinated.",
    primaryCta: "Get the Retainer Tracker",
    secondaryCta: "See what's coming",
  },
  productsIntro: {
    title: "The HowlerAI toolset",
    body: "Opinionated tools for agencies and solo operators. The visible layer tracks retainers and clients. The invisible layer (Jarvis) coordinates tasks, metrics, and signals so you don't have to.",
  },
};

const products = [
  {
    id: "retainer-tracker",
    label: "Codebase",
    title: "HowlerAI Retainer Tracker",
    blurb:
      "Dark-mode React Native/Expo codebase for tracking client retainers, hours, and effective rates without another SaaS.",
    href: "https://howler4388.gumroad.com/l/retainer-tracker",
    cta: "View on Gumroad",
  },
  {
    id: "ai-prompt-pack",
    label: "Prompt Pack",
    title: "The Ultimate AI Prompt Pack",
    blurb:
      "200+ battle-tested prompts for ChatGPT, Claude, and Midjourney across content, ops, coding, and more.",
    href: "https://howler4388.gumroad.com/l/ai-prompt-pack",
    cta: "View on Gumroad",
  },
  {
    id: "freelancer-command-center",
    label: "Notion Template",
    title: "Freelancer Command Center",
    blurb:
      "All-in-one Notion system to track clients, projects, invoices, and income so your freelance business runs like a real operation.",
    href: "https://befitting-son-2e4.notion.site/Freelancer-Command-Center-3119cdba34e081189139f2577b24e660",
    cta: "Open Notion Template",
  },
  {
    id: "real-estate-ops-copilot",
    label: "Notion Template",
    title: "Real Estate Ops Copilot",
    blurb:
      "Ops dashboard for real estate: leads, showings, pipeline, and approvals in one Notion workspace.",
    href: "https://howler4388.gumroad.com/l/rtwjsz",
    cta: "View on Gumroad",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <header className="border-b border-zinc-800 bg-gradient-to-b from-black via-black/70 to-black/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 shadow-lg shadow-amber-500/40" />
            <div className="text-sm font-semibold tracking-[0.18em] text-zinc-300">
              HOWLERAI
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <Link href="#products" className="hover:text-zinc-50">
              Products
            </Link>
            <Link href="#agencies" className="hover:text-zinc-50">
              For agencies
            </Link>
            <Link href="#solo" className="hover:text-zinc-50">
              For solo operators
            </Link>
            <Link href="#about" className="hover:text-zinc-50">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="#retainer-tracker"
              className="hidden rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-amber-200 shadow-sm shadow-amber-400/30 hover:bg-amber-500/20 md:inline-flex"
            >
              Get the Retainer Tracker
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-10 md:px-10 md:py-16">
        {/* Hero */}
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-300/80">
              {sections.hero.eyebrow}
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-tight tracking-tight text-zinc-50 md:text-5xl">
              {sections.hero.headline}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-300 md:text-base">
              {sections.hero.subheadline}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#retainer-tracker"
                className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-amber-400/40 transition hover:bg-amber-300"
              >
                {sections.hero.primaryCta}
              </Link>
              <Link
                href="#products"
                className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-100 hover:border-zinc-500 hover:bg-zinc-900"
              >
                {sections.hero.secondaryCta}
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Jarvis runs underneath—a local control tower that ties retainers, tasks, and signals into one view.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-5 shadow-[0_0_40px_rgba(250,204,21,0.15)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/80">
              TODAY&apos;S TOOL
            </p>
            <h2
              id="retainer-tracker"
              className="mt-3 text-lg font-semibold text-zinc-50"
            >
              HowlerAI Retainer Tracker
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Hours, caps, and effective rates—no spreadsheets. See where
              you&apos;re over-servicing and which clients quietly eat your
              capacity.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li>• Per-client monthly hours and caps</li>
              <li>• Billable vs non-billable split</li>
              <li>• Effective hourly rate per client</li>
              <li>• Dark, focused UI tuned for operators</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://howler4388.gumroad.com/l/retainer-tracker"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black shadow shadow-amber-400/40 hover:bg-amber-300"
              >
                View on Gumroad
              </a>
              <p className="text-xs text-zinc-500">
                Local-first today. Hosted version coming.
              </p>
            </div>
          </div>
        </section>

        {/* Products overview */}
        <section id="products" className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Products
            </h2>
            <p className="text-xs text-zinc-500">More tools plug in over time.</p>
          </div>
          <p className="max-w-xl text-sm text-zinc-300">
            {sections.productsIntro.body}
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300">
                TODAY
              </p>
              <h3 className="mt-2 text-sm font-semibold text-zinc-50">
                Retainer Tracker
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Keep retainers profitable by seeing hours, caps, and effective
                rates at a glance.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                UNDER THE HOOD
              </p>
              <h3 className="mt-2 text-sm font-semibold text-zinc-50">
                Jarvis Ops Control Tower
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                The local ops layer: tasks, metrics, and decisions in one place.
                Coordinates your tools without adding another SaaS dependency.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                NEXT
              </p>
              <h3 className="mt-2 text-sm font-semibold text-zinc-50">
                Future tools
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Utilities that plug into the same control tower: agency ops,
                finance, and a few toys.
              </p>
            </div>
          </div>

          {/* Live products shelf (Gumroad + Notion) */}
          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 md:p-5">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-baseline">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  LIVE PRODUCTS
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Simple cards that point straight at the current Notion and Gumroad products.
                </p>
              </div>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-600">
                No embeds, no Notion API  just links out.
              </p>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col justify-between rounded-lg border border-zinc-800/80 bg-zinc-950/70 p-4"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300/80">
                      {product.label}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-zinc-50">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      {product.blurb}
                    </p>
                  </div>
                  <div className="mt-3">
                    <a
                      href={product.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300 hover:text-amber-200"
                    >
                      {product.cta}
                      <span className="ml-1 text-xs">↗</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For agencies */}
        <section id="agencies" className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
              For agencies
            </h2>
            <h3 className="mt-3 text-xl font-semibold text-zinc-50">
              Retainers need visibility. Yours probably don&apos;t have it.
            </h3>
            <p className="mt-3 text-sm text-zinc-300">
              Scope creep and over-servicing hide in people&apos;s heads. The
              Retainer Tracker makes the numbers visible so you can have calmer,
              factual conversations instead of guessing.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li>• Track hours vs. caps across clients without spreadsheets.</li>
            <li>• See which clients eat your senior time vs junior time.</li>
            <li>• Turn nebulous extra work into clear, negotiated scope.</li>
          </ul>
        </section>

        {/* For solo operators */}
        <section id="solo" className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
              For solo operators
            </h2>
            <h3 className="mt-3 text-xl font-semibold text-zinc-50">
              If it&apos;s in your head, it&apos;s costing you money.
            </h3>
            <p className="mt-3 text-sm text-zinc-300">
              Fewer tabs, better signals. See where your time and retainers
              actually go, then layer in more tools as you need them.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-zinc-300">
            <li>• A single place to see retainer health and effective rates.</li>
            <li>• Local-first by default; cloud control tower when it&apos;s useful.</li>
            <li>• Tools you can actually own and understand.</li>
          </ul>
        </section>

        {/* About / philosophy */}
        <section id="about" className="border-t border-zinc-800 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            About HowlerAI
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
            HowlerAI is a small, operator-first studio.
            <span className="text-zinc-100">
              {" "}
              AI agents should report to you, not the other way around.
            </span>{" "}
            Local-first, file-backed, understandable. Cloud shows up when
            it&apos;s genuinely useful—not as a default tax.
          </p>
          <p className="mt-3 text-xs text-zinc-500">
            Today: Retainer Tracker. Under the hood: Jarvis. Next: a hosted
            control tower for operators.
          </p>
        </section>
      </main>

      <footer className="border-t border-zinc-900 bg-black/80 py-6 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} HowlerAI. All rights reserved.</p>
      </footer>
    </div>
  );
}
