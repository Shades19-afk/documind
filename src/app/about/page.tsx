export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="font-serif text-lg font-semibold">DocuMind</a>
        <h1 className="mt-16 font-serif text-4xl font-semibold">About DocuMind</h1>
        <p className="mt-6 text-base leading-7 text-muted-foreground">
          DocuMind helps people turn long contracts, research papers, and reports into clear working knowledge.
          We are building a calmer way to read, search, and use important documents.
        </p>
      </div>
    </main>
  );
}
