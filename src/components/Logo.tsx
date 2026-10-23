// Saheli logo — abstract floral/supportive-circle symbol

interface LogoProps {
  size?: number;
  className?: string;
}

export function SaheliLogo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Saheli"
    >
      {/* Outer supportive circle */}
      <circle cx="24" cy="24" r="22" stroke="#FF8B73" strokeWidth="2" opacity="0.3" />
      {/* Petal arrangement */}
      <g transform="translate(24 24)">
        <ellipse cx="0" cy="-10" rx="5" ry="9" fill="#FFB3A4" opacity="0.8" />
        <ellipse cx="0" cy="-10" rx="5" ry="9" fill="#FFB3A4" opacity="0.8" transform="rotate(60)" />
        <ellipse cx="0" cy="-10" rx="5" ry="9" fill="#F3A8B8" opacity="0.7" transform="rotate(120)" />
        <ellipse cx="0" cy="-10" rx="5" ry="9" fill="#F3A8B8" opacity="0.7" transform="rotate(180)" />
        <ellipse cx="0" cy="-10" rx="5" ry="9" fill="#C4B5E3" opacity="0.6" transform="rotate(240)" />
        <ellipse cx="0" cy="-10" rx="5" ry="9" fill="#C4B5E3" opacity="0.6" transform="rotate(300)" />
        {/* Center */}
        <circle cx="0" cy="0" r="4" fill="#E85538" />
      </g>
    </svg>
  );
}

export function SaheliWordmark({ size = 40, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SaheliLogo size={size} />
      <span className="font-display text-xl font-semibold text-plum-700" style={{ fontSize: size * 0.55 }}>
        Saheli
      </span>
    </div>
  );
}
