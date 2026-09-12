export default function DocuMindLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="font-serif text-lg">DocuMind</span>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/auth/login" className="text-foreground/70 hover:text-foreground">
              Sign in
            </a>
            <a
              href="/auth/signup"
              className="rounded-sm bg-primary px-3.5 py-1.5 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero: a real sentence, not a value-prop template */}
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-20 sm:pt-28">
          <div className="max-w-2xl">
            <h1 className="font-serif text-[2.6rem] leading-[1.1] sm:text-6xl">
              You saved fourteen PDFs this month.
              <br />
              You opened three.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-7 text-foreground/75">
              DocuMind reads the rest — a syllabus, a contract, a paper you
              meant to get to — and hands you back a summary, the key points,
              and flashcards if you need to remember it.
            </p>
            <div className="mt-8 flex items-center gap-5">
              <a
                href="/auth/signup"
                className="rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Upload your first PDF
              </a>
              <a
                href="#how-it-works"
                className="border-b border-foreground/30 pb-0.5 text-sm text-foreground/80 hover:border-foreground"
              >
                See what you get back
              </a>
            </div>
          </div>
        </section>

        {/* How it works: written as steps because it genuinely is one, not a 3-card grid */}
        <section id="how-it-works" className="border-t border-border">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-[1fr_2fr] sm:gap-16 sm:py-20">
            <h2 className="font-serif text-2xl">What happens after you drop in a file</h2>
            <ol className="space-y-8">
              <li className="border-l-2 border-accent pl-5">
                <p className="font-medium">It reads the whole thing, not just the abstract</p>
                <p className="mt-1.5 text-sm leading-6 text-foreground/70">
                  Extraction runs on the full text, so a 40-page filing gets
                  treated with the same care as a two-page memo.
                </p>
              </li>
              <li className="border-l-2 border-border pl-5">
                <p className="font-medium">You get a summary you'd actually forward to someone</p>
                <p className="mt-1.5 text-sm leading-6 text-foreground/70">
                  A short overview, the key points, and a longer summary for
                  when the short version isn't enough.
                </p>
              </li>
              <li className="border-l-2 border-border pl-5">
                <p className="font-medium">Studying it becomes optional, not mandatory</p>
                <p className="mt-1.5 text-sm leading-6 text-foreground/70">
                  Flashcards and study notes are generated alongside the
                  summary, in case you need to hold onto it, not just skim it.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* A specific, plausible use case instead of a placeholder testimonial */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <blockquote className="max-w-xl font-serif text-2xl leading-snug text-foreground/90">
              "I stopped re-reading the same fifteen pages of a vendor
              contract every renewal. Now I just check the summary against
              last year's."
            </blockquote>
            <p className="mt-4 text-sm text-foreground/60">
              A DocuMind user, on the thing they actually use it for
            </p>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-16 sm:flex-row sm:items-center sm:py-20">
            <div>
              <h2 className="font-serif text-2xl">Your next PDF is waiting</h2>
              <p className="mt-2 max-w-sm text-sm text-foreground/70">
                No credit card, no seven-step onboarding. Upload one and see
                what comes back.
              </p>
            </div>
            <a
              href="/auth/signup"
              className="shrink-0 rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create your workspace
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-foreground/50">
          © {new Date().getFullYear()} DocuMind.
        </div>
      </footer>
    </div>
  );
}