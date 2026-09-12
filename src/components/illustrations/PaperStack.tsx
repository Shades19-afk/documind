import type { SVGProps } from "react";

export default function PaperStack({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 440 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M43 270C125 263 207 273 295 267C340 264 380 268 400 265" stroke="#1B2430" strokeWidth="3" strokeLinecap="round" />
      <path d="M83 78L322 59L355 239L112 264L83 78Z" fill="#F2F0E8" stroke="#1B2430" strokeWidth="4" strokeLinejoin="round" />
      <path d="M75 92L312 72L342 250L105 276L75 92Z" fill="#F2F0E8" stroke="#1B2430" strokeWidth="3" strokeLinejoin="round" />
      <path d="M67 109L305 88L333 263L96 288L67 109Z" fill="#F2F0E8" stroke="#1B2430" strokeWidth="4" strokeLinejoin="round" />
      <path d="M95 134L269 116L272 137L98 156L95 134Z" fill="#E0A72E" opacity="0.78" />
      <path d="M104 176L285 157M108 195L296 176M112 215L251 200M117 237L273 219" stroke="#1B2430" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M305 88L333 263L316 265L288 91L305 88Z" fill="#E0A72E" opacity="0.5" />
      <path d="M348 77C362 65 381 67 389 79C397 91 390 105 375 110C360 114 346 106 343 94C341 87 343 81 348 77Z" fill="#E0A72E" stroke="#1B2430" strokeWidth="3" />
      <path d="M354 86C362 82 371 83 378 88" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 57C67 48 86 48 101 55" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 6" />
    </svg>
  );
}
