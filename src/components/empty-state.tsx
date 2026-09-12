import Link from "next/link";
import PaperStack from "@/components/illustrations/PaperStack";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const action = actionHref ? (
    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
      <Link href={actionHref}>{actionLabel}</Link>
    </Button>
  ) : (
    <Button
      type="button"
      className="bg-accent text-accent-foreground hover:bg-accent/90"
      onClick={onAction}
    >
      {actionLabel}
    </Button>
  );

  return (
    <div
      className={`flex flex-col items-center rounded-xl border border-border bg-card px-6 py-10 text-center ${className ?? ""}`}
    >
      <PaperStack className="h-40 w-56" />
      <h2 className="font-serif mt-4 text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-5">{action}</div>
    </div>
  );
}
