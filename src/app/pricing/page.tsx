import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="font-serif text-lg font-semibold">DocuMind</a>
        <div className="mt-16 max-w-3xl">
          <p className="text-sm font-medium text-accent">Plans for every workflow</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold">Pricing</h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            Start with the essentials, then add more capacity as your document workflow grows.
            Every plan keeps summaries, key points, and search in one focused workspace.
          </p>
        </div>
        <div className="mt-16 grid border-t border-border md:grid-cols-3 md:divide-x md:divide-border">
          <div className="border-b border-border px-0 py-8 md:border-b-0 md:px-8 md:first:pl-0">
            <h2 className="font-serif text-2xl font-semibold">Free</h2>
            <p className="mt-5 font-mono text-2xl text-foreground">$0<span className="text-sm text-muted-foreground"> / month</span></p>
            <ul className="mt-8 space-y-4 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
              <li>5 document uploads per month</li>
              <li>Summary and key point extraction</li>
              <li>Searchable workspace history</li>
            </ul>
            <Button asChild variant="outline" className="mt-8">
              <a href="/auth/signup">Start free</a>
            </Button>
          </div>
          <div className="border-b border-border px-0 py-8 md:border-b-0 md:px-8">
            <h2 className="font-serif text-2xl font-semibold">Pro</h2>
            <p className="mt-5 font-mono text-2xl text-foreground">$18<span className="text-sm text-muted-foreground"> / month</span></p>
            <ul className="mt-8 space-y-4 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
              <li>Unlimited document uploads</li>
              <li>Flashcards and export formats</li>
              <li>Priority processing for long PDFs</li>
            </ul>
            <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
              <a href="/auth/signup">Choose Pro</a>
            </Button>
          </div>
          <div className="px-0 py-8 md:px-8 md:last:pr-0">
            <h2 className="font-serif text-2xl font-semibold">Team</h2>
            <p className="mt-5 font-mono text-2xl text-foreground">$42<span className="text-sm text-muted-foreground"> / user / month</span></p>
            <ul className="mt-8 space-y-4 border-t border-border pt-6 text-sm leading-6 text-muted-foreground">
              <li>Shared workspace and permissions</li>
              <li>Team document history and exports</li>
              <li>Collaborative review workflows</li>
            </ul>
            <Button asChild variant="outline" className="mt-8">
              <a href="/contact">Talk to us</a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
