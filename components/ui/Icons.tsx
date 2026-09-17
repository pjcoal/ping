// Small, dependency-free inline icon set. Kept as one file so every icon
// in the app shares the same stroke weight and viewBox conventions.
type IconProps = { className?: string };

export function CheckCircleIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 10.3l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrendUpIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M3 13.5l4.7-4.7 3 3L17 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.2 5H17v4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CoinsIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <ellipse cx="7.5" cy="6" rx="4.5" ry="2.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 6v3.2c0 1.33 2.02 2.4 4.5 2.4s4.5-1.07 4.5-2.4V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 9.2v3.2c0 1.33 2.02 2.4 4.5 2.4s4.5-1.07 4.5-2.4V9.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 9.2c2.2.2 4.5 1.15 4.5 2.4s-2.3 2.2-4.5 2.4M11.5 12.4c2.2.2 4.5 1.15 4.5 2.4s-2.3 2.2-4.5 2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function LaunchIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M10 2.5c2.4 2 3.8 4.9 3.8 8 0 1.2-.2 2.3-.6 3.3l-3.2 1.7-3.2-1.7c-.4-1-.6-2.1-.6-3.3 0-3.1 1.4-6 3.8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="10" cy="8.2" r="1.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 14l-2 3.5M13 14l2 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ClaimIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="6.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9.5h14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 3.5v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.8 5.3L10 3.5l2.2 1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
