import Badge from "./Badge";

// Shared header pattern (eyebrow badge + title + description) used at the
// top of every page so the site reads as one consistent product instead of
// each route inventing its own heading markup.
export default function PageHeader({
  eyebrow,
  title,
  description,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <Badge className="mb-4">{eyebrow}</Badge>}
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-white/55">
          {description}
        </p>
      )}
    </div>
  );
}
