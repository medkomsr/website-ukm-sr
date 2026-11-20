import { useId } from "react";

/** Original SR medal artwork; the nested layers are animated separately by GSAP. */
export default function SrMedal({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 440 500" fill="none" aria-hidden="true">
      <defs>
        <linearGradient
          id={`${id}-gold`}
          x1="85"
          y1="160"
          x2="380"
          y2="410"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e3bd68" />
          <stop offset=".2" stopColor="#fff0bd" />
          <stop offset=".42" stopColor="#ac782b" />
          <stop offset=".57" stopColor="#f8d890" />
          <stop offset=".77" stopColor="#95702f" />
          <stop offset="1" stopColor="#e5c984" />
        </linearGradient>
        <radialGradient id={`${id}-face`} cx=".32" cy=".24" r=".8">
          <stop stopColor="#fff1bd" />
          <stop offset=".5" stopColor="#d3ab56" />
          <stop offset="1" stopColor="#8b642a" />
        </radialGradient>
        <linearGradient
          id={`${id}-ribbon`}
          x1="100"
          y1="0"
          x2="280"
          y2="230"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#436e4e" />
          <stop offset=".5" stopColor="#0a2d21" />
          <stop offset=".7" stopColor="#6a8b60" />
          <stop offset="1" stopColor="#163c2b" />
        </linearGradient>
        <path id={`${id}-type`} d="M89 321a129 129 0 1 1 258 0" />
      </defs>
      <path d="M108 10 163 0 247 201 193 229Z" fill={`url(#${id}-ribbon)`} />
      <path d="m327 10-54-10-84 201 54 28Z" fill={`url(#${id}-ribbon)`} />
      <path d="m120 10 84 199m111-199-85 199" stroke="#e5c984" strokeWidth="4" opacity=".7" />
      <rect
        x="194"
        y="186"
        width="52"
        height="44"
        rx="13"
        stroke={`url(#${id}-gold)`}
        strokeWidth="10"
      />
      <circle cx="225" cy="329" r="147" fill="#533e21" />
      <circle cx="218" cy="321" r="147" fill={`url(#${id}-gold)`} />
      <circle cx="218" cy="321" r="138" stroke="#fff2bb" strokeWidth="1.5" opacity=".9" />
      <circle cx="218" cy="321" r="128" stroke="#7d5a27" strokeWidth="1" />
      <circle
        cx="218"
        cy="321"
        r="117"
        fill={`url(#${id}-face)`}
        stroke="#f2d896"
        strokeWidth="2"
      />
      {Array.from({ length: 64 }, (_, i) => (
        <path
          key={i}
          d="M218 182v7"
          stroke="#765621"
          strokeWidth="1.3"
          transform={`rotate(${i * 5.625} 218 321)`}
          opacity=".65"
        />
      ))}
      <image
        href="/logo.png"
        x="115"
        y="218"
        width="206"
        height="206"
        preserveAspectRatio="xMidYMid meet"
      />
      <path
        d="M126 251c26-41 92-65 144-41"
        stroke="#fff7d4"
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  );
}
