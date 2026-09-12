import type { SVGProps } from "react";

export default function HighlighterPen({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 420 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M33 190C113 181 189 187 274 180C316 177 354 177 389 181" stroke="#1B2430" strokeWidth="3" strokeLinecap="round" />
      <path d="M64 64L299 122L277 187L47 127L64 64Z" fill="#E0A72E" stroke="#1B2430" strokeWidth="4" strokeLinejoin="round" />
      <path d="M65 65L46 58C40 57 35 61 34 68L24 104C22 112 27 117 34 119L48 127L65 65Z" fill="#F2F0E8" stroke="#1B2430" strokeWidth="4" strokeLinejoin="round" />
      <path d="M299 122L363 137C371 139 375 147 372 154L365 182C363 190 355 194 347 192L277 187L299 122Z" fill="#F2F0E8" stroke="#1B2430" strokeWidth="4" strokeLinejoin="round" />
      <path d="M311 126L296 184M326 130L311 188" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      <path d="M78 82L274 131M70 101L267 150M63 119L259 168" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" opacity="0.72" />
      <path d="M120 45C150 35 179 36 202 45" stroke="#E0A72E" strokeWidth="8" strokeLinecap="round" opacity="0.75" />
      <path d="M130 32C145 26 161 24 177 27" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
      <path d="M205 207C245 203 279 206 315 213" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 7" />
    </svg>
  );
}
