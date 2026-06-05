export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold">Frequently asked questions</h1>
        <div className="mt-6 space-y-4 text-sm text-slate-300">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="font-semibold">Is DocuMind secure?</p>
            <p className="mt-2">Yes — we use standard security practices. (placeholder)</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="font-semibold">How long does processing take?</p>
            <p className="mt-2">Processing times vary based on document size. (placeholder)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
