// Large illustrated girl with floral details for the Welcome screen

interface GirlIllustrationProps {
  size?: number;
  className?: string;
}

export function GirlIllustration({ size = 200, className = '' }: GirlIllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      role="img"
      aria-label="Saheli — a friendly illustrated girl"
    >
      {/* Decorative ring */}
      <circle cx="60" cy="60" r="56" stroke="#E8D8FF" strokeWidth="1.5" opacity="0.4" />
      <circle cx="60" cy="60" r="52" stroke="#FFB6C1" strokeWidth="1" opacity="0.3" strokeDasharray="3 4" />

      {/* Soft background blob */}
      <ellipse cx="60" cy="58" rx="38" ry="44" fill="#FFF7F0" opacity="0.6" />

      {/* Back hair */}
      <path d="M32 42c0-16 12-28 28-28s28 12 28 28c0 10-3 18-8 24H40c-5-6-8-14-8-24z" fill="#4A2C5A" opacity="0.12" />
      <path d="M28 36c0-16 14-30 32-30s32 14 32 30c0 14-5 22-12 28H40c-7-6-12-14-12-28z" fill="#4A2C5A" opacity="0.88" />

      {/* Side hair cascading */}
      <path d="M30 44c-1 8-2 18 0 28 1 4 3 7 5 9-2-4-3-10-3-16 0-7 1-14 0-21z" fill="#4A2C5A" opacity="0.75" />
      <path d="M90 44c1 8 2 18 0 28-1 4-3 7-5 9 2-4 3-10 3-16 0-7-1-14 0-21z" fill="#4A2C5A" opacity="0.75" />

      {/* Face */}
      <ellipse cx="60" cy="56" rx="20" ry="23" fill="#FFDEB2" />

      {/* Bangs */}
      <path d="M40 48c0-12 8-20 20-20s20 8 20 20c0-3-5-6-10-6-4 0-6 1-10 1s-6-1-10-1c-5 0-10 3-10 6z" fill="#4A2C5A" />
      <path d="M38 44c0-13 10-22 22-22s22 9 22 22c0 3-2 6-5 8 0-5-4-13-10-14-2.5 2-5 3-7 3s-4.5-1-7-3c-6 1-10 9-10 14-3-2-5-5-5-8z" fill="#4A2C5A" />

      {/* Eyebrows */}
      <path d="M48 50c2-1.5 5-1.5 7 0" stroke="#4A2C5A" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M65 50c2-1.5 5-1.5 7 0" stroke="#4A2C5A" strokeWidth="1.2" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <ellipse cx="51.5" cy="55" rx="2" ry="2.5" fill="#4A2C5A" />
      <ellipse cx="68.5" cy="55" rx="2" ry="2.5" fill="#4A2C5A" />
      <circle cx="52" cy="54" r="0.7" fill="#fff" />
      <circle cx="69" cy="54" r="0.7" fill="#fff" />

      {/* Eyelashes */}
      <path d="M49 53c-1-0.5-2-0.5-3 0" stroke="#4A2C5A" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      <path d="M71 53c1-0.5 2-0.5 3 0" stroke="#4A2C5A" strokeWidth="0.8" strokeLinecap="round" fill="none" />

      {/* Cheeks */}
      <circle cx="47" cy="63" r="4" fill="#FFB6C1" opacity="0.45" />
      <circle cx="73" cy="63" r="4" fill="#FFB6C1" opacity="0.45" />

      {/* Nose */}
      <path d="M60 58c0 2-1 3-0.5 4" stroke="#D88B45" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />

      {/* Smile */}
      <path d="M54 66c3 3 9 3 12 0" stroke="#4A2C5A" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Neck */}
      <path d="M54 78c0 3 2 5 6 5s6-2 6-5" fill="#FFDEB2" />

      {/* Shoulders / dress */}
      <path d="M38 120c0-14 10-22 22-22s22 8 22 22z" fill="#E8D8FF" opacity="0.85" />
      <path d="M38 120c0-8 10-14 22-14s22 6 22 14z" fill="#D0B8F0" opacity="0.5" />

      {/* Dress collar */}
      <path d="M50 100c4 3 6 5 10 5s6-2 10-5" stroke="#9A74CC" strokeWidth="1.2" fill="none" opacity="0.6" />

      {/* Flower crown — left */}
      <g transform="translate(40 36)">
        <ellipse cx="0" cy="-4" rx="2.5" ry="4" fill="#FFB6C1" opacity="0.85" />
        <ellipse cx="0" cy="4" rx="2.5" ry="4" fill="#FFB6C1" opacity="0.85" />
        <ellipse cx="-4" cy="0" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.85" />
        <ellipse cx="4" cy="0" rx="4" ry="2.5" fill="#FFB6C1" opacity="0.85" />
        <circle cx="0" cy="0" r="2" fill="#FFDEB2" />
      </g>

      {/* Flower crown — center */}
      <g transform="translate(60 32)">
        <ellipse cx="0" cy="-3" rx="2" ry="3.5" fill="#E8D8FF" opacity="0.85" />
        <ellipse cx="0" cy="3" rx="2" ry="3.5" fill="#E8D8FF" opacity="0.85" />
        <ellipse cx="-3" cy="0" rx="3.5" ry="2" fill="#E8D8FF" opacity="0.85" />
        <ellipse cx="3" cy="0" rx="3.5" ry="2" fill="#E8D8FF" opacity="0.85" />
        <circle cx="0" cy="0" r="1.5" fill="#BFE8D8" />
      </g>

      {/* Flower crown — right */}
      <g transform="translate(80 36)">
        <ellipse cx="0" cy="-3.5" rx="2.2" ry="3.5" fill="#FFB6C1" opacity="0.8" />
        <ellipse cx="0" cy="3.5" rx="2.2" ry="3.5" fill="#FFB6C1" opacity="0.8" />
        <ellipse cx="-3.5" cy="0" rx="3.5" ry="2.2" fill="#FFB6C1" opacity="0.8" />
        <ellipse cx="3.5" cy="0" rx="3.5" ry="2.2" fill="#FFB6C1" opacity="0.8" />
        <circle cx="0" cy="0" r="1.8" fill="#FFDEB2" />
      </g>

      {/* Leaves in flower crown */}
      <path d="M35 38c-2 1-3 3-3 5 2 0 4-1 5-3z" fill="#BFE8D8" opacity="0.7" />
      <path d="M85 38c2 1 3 3 3 5-2 0-4-1-5-3z" fill="#BFE8D8" opacity="0.7" />

      {/* Small floating flowers around */}
      <g transform="translate(20 30)" opacity="0.6">
        <circle cx="0" cy="0" r="1.5" fill="#FFB6C1" />
        <ellipse cx="0" cy="-2" rx="1" ry="1.5" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="0" cy="2" rx="1" ry="1.5" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="-2" cy="0" rx="1.5" ry="1" fill="#FFB6C1" opacity="0.6" />
        <ellipse cx="2" cy="0" rx="1.5" ry="1" fill="#FFB6C1" opacity="0.6" />
        <circle cx="0" cy="0" r="0.8" fill="#FFDEB2" />
      </g>

      <g transform="translate(100 28)" opacity="0.5">
        <circle cx="0" cy="0" r="1.2" fill="#E8D8FF" />
        <ellipse cx="0" cy="-1.5" rx="0.8" ry="1.2" fill="#E8D8FF" opacity="0.6" />
        <ellipse cx="0" cy="1.5" rx="0.8" ry="1.2" fill="#E8D8FF" opacity="0.6" />
        <ellipse cx="-1.5" cy="0" rx="1.2" ry="0.8" fill="#E8D8FF" opacity="0.6" />
        <ellipse cx="1.5" cy="0" rx="1.2" ry="0.8" fill="#E8D8FF" opacity="0.6" />
        <circle cx="0" cy="0" r="0.6" fill="#BFE8D8" />
      </g>

      {/* Sparkles */}
      <circle cx="14" cy="20" r="1" fill="#FFB6C1" opacity="0.4" />
      <circle cx="106" cy="18" r="1" fill="#E8D8FF" opacity="0.4" />
      <circle cx="12" cy="70" r="0.8" fill="#BFE8D8" opacity="0.4" />
      <circle cx="108" cy="72" r="0.8" fill="#FFB6C1" opacity="0.4" />
    </svg>
  );
}
