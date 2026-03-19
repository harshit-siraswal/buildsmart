interface BrandLogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
}

export function BrandLogo({ className, textClassName, showText = true }: BrandLogoProps) {
  return (
    <div className={className ?? "inline-flex items-center gap-2"}>
      <svg
        aria-hidden="true"
        width="26"
        height="26"
        viewBox="0 0 64 64"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#0EA5E9" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#brandGradient)" />
        <path
          d="M18 42 L24 22 L32 36 L40 18 L46 42"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {showText && (
        <span className={textClassName ?? "font-heading text-lg font-bold text-foreground"}>
          BuildSmart AI
        </span>
      )}
    </div>
  );
}
