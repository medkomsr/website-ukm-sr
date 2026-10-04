/** Eight original geometric emblems, drawn for the eight SR disciplines. */
export function SrSymbol({
  index = 0,
  className,
}: {
  index?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      {index % 8 === 0 && (
        <g
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M45 76c-5 10-20 5-21-4-13 0-17-13-11-22-7-10-1-21 8-23-1-13 17-18 24-9v58Zm0-50v50M27 32c-8 1-10 9-7 15m9 17c-9-2-12-9-9-16m10-21c1 7 7 10 15 9m-13 9c10 0 14 8 13 16" />
          <path d="M65 17c-15 0-23 20-12 30 5 4 6 7 6 13h13c0-6 1-9 6-14 10-12 2-29-13-29Zm-6 50h13m-10 7h7M65 5V1m23 13 4-4M42 14l-4-4m48 27h8" />
        </g>
      )}
      {index % 8 === 1 && (
        <>
          <path d="M10 18h58v44H38L10 84Z" fill="currentColor" />
          <path d="M76 35h14v42H63L47 91V70h29Z" fill="currentColor" />
        </>
      )}
      {index % 8 === 2 && (
        <>
          <path
            d="M7 16q23-7 39 6v66Q28 76 7 82ZM93 16q-23-7-39 6v66q18-12 39-6Z"
            fill="currentColor"
          />
          <path d="M50 4v10" stroke="currentColor" strokeWidth="6" />
        </>
      )}
      {index % 8 === 3 && (
        <g stroke="currentColor" strokeWidth="12" strokeLinecap="round">
          <path d="M14 43v14M32 25v50M50 10v80M68 25v50M86 43v14" />
        </g>
      )}
      {index % 8 === 4 && (
        <g
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 12h45l14 15v59H17Zm45 0v16h14M29 40h22M29 53h17M29 70h14" />
          <path
            d="m42 74 6-19 30-30 12 12-30 30-18 7Z"
            fill="var(--symbol-cut)"
          />
          <path d="m49 55 12 12m12-37 12 12M42 74l8-3" />
        </g>
      )}
      {index % 8 === 5 && (
        <g stroke="currentColor" strokeWidth="5" strokeLinejoin="round">
          <ellipse cx="50" cy="43" rx="37" ry="29" />
          <path d="M13 43v16c0 16 17 28 37 28s37-12 37-28V43M20 61v14m15-6v15m30-15v15m15-23v14" />
          <ellipse cx="50" cy="43" rx="28" ry="21" strokeWidth="2.5" />
          <path
            d="m31 21 4 7m30-7-4 7M20 42h7m46 0h7M34 60l-3 5m35-5 3 5"
            strokeWidth="3"
          />
        </g>
      )}
      {index % 8 === 6 && (
        <>
          <path d="m58 4 35 35-31 45-43-3-3-43Z" fill="currentColor" />
          <path
            d="m21 79 34-34"
            stroke="var(--symbol-cut, #f3f0e8)"
            strokeWidth="6"
          />
          <circle cx="58" cy="42" r="8" fill="var(--symbol-cut, #f3f0e8)" />
          <path d="M10 94h74" stroke="currentColor" strokeWidth="6" />
        </>
      )}
      {index % 8 === 7 && (
        <>
          <path
            d="M7 15h56v20H27v27H7ZM93 85H37V65h36V38h20Z"
            fill="currentColor"
          />
          <path d="m47 39 14 11-14 11Z" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
