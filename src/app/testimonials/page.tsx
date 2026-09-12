export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-3xl font-semibold">What teams say</h1>
        <p className="mt-4 text-sm text-muted-foreground">Trusted by teams around the world (placeholder).</p>
        <div className="mt-8 space-y-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-card-foreground">“DocuMind saved us time.”</p>
            <p className="mt-2 text-xs text-muted-foreground">— A satisfied user</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-card-foreground">“Great for teams.”</p>
            <p className="mt-2 text-xs text-muted-foreground">— Another user</p>
          </div>
        </div>
      </div>
    </div>
  );
}
