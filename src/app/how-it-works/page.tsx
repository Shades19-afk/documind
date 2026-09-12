export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="font-serif text-lg font-semibold">DocuMind</a>
        <div className="mt-16 max-w-3xl">
          <p className="text-sm font-medium text-accent">Workflow overview</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold">How it works</h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            Take a closer look at how DocuMind turns a document into a searchable, useful reference.
            Each step keeps the source material connected to the output you need.
          </p>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-[0.55fr,0.45fr] lg:items-start">
          <div>
            <h2 className="font-serif text-3xl font-semibold leading-tight">From upload to useful answers.</h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
              DocuMind handles the repetitive first pass so you can move from a raw file to clear facts and next steps.
            </p>
          </div>
          <div className="border-t border-border">
            <div className="grid gap-2 border-b border-l-2 border-transparent py-8 transition-colors hover:border-l-destructive sm:grid-cols-[2rem,minmax(10rem,0.4fr),1fr] sm:gap-4">
              <p className="font-mono text-xs text-destructive">01</p>
              <p className="text-base font-medium">Ingest</p>
              <p className="text-sm leading-6 text-muted-foreground">
                Extract text, tables, and structure from PDFs and scanned documents.
              </p>
            </div>
            <div className="grid gap-2 border-b border-l-2 border-transparent py-8 transition-colors hover:border-l-destructive sm:grid-cols-[2rem,minmax(10rem,0.4fr),1fr] sm:gap-4">
              <p className="font-mono text-xs text-destructive">02</p>
              <p className="text-base font-medium">Process</p>
              <p className="text-sm leading-6 text-muted-foreground">
                Generate a polished summary bundle and index every sentence.
              </p>
            </div>
            <div className="grid gap-2 border-b border-l-2 border-transparent py-8 transition-colors hover:border-l-destructive sm:grid-cols-[2rem,minmax(10rem,0.4fr),1fr] sm:gap-4">
              <p className="font-mono text-xs text-destructive">03</p>
              <p className="text-base font-medium">Query</p>
              <p className="text-sm leading-6 text-muted-foreground">
                Search the document instantly and find exact answers without copy-paste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
