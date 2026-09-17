type Tone = "neutral" | "success" | "warning";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "border-white/15 text-white/55",
  success: "border-[#2DD4BF]/30 bg-[#2DD4BF]/10 text-[#2DD4BF]",
  warning: "border-[#FFB84A]/30 bg-[#FFB84A]/10 text-[#FFB84A]",
};

export default function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
