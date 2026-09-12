import type { SVGProps } from "react";

export default function AnnotatedDocumentDesk({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 520 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M28 303C116 296 213 306 302 300C378 296 445 300 492 294" stroke="#1B2430" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 304C144 311 235 305 331 309C389 311 443 307 481 312" stroke="#1B2430" strokeWidth="1.5" strokeLinecap="round" />

      <path d="M132 61L351 48C359 48 364 54 365 63L382 260L159 275L132 61Z" fill="#F2F0E8" stroke="#1B2430" strokeWidth="4" strokeLinejoin="round" />
      <path d="M143 75L348 63L364 246L171 259L143 75Z" stroke="#1B2430" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.7" />
      <path d="M174 101C219 94 271 94 318 91" stroke="#1B2430" strokeWidth="3" strokeLinecap="round" />
      <path d="M177 119C228 113 277 113 333 109" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
      <path d="M181 145L270 139" stroke="#1B2430" strokeWidth="3" strokeLinecap="round" />
      <path d="M185 163L322 154" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
      <path d="M188 181L302 174" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
      <path d="M193 203L329 193" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
      <path d="M197 222L279 216" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />

      <path d="M174 137L274 130L276 148L177 155L174 137Z" fill="#E0A72E" opacity="0.78" />
      <path d="M188 197L331 187" stroke="#E0A72E" strokeWidth="9" strokeLinecap="round" opacity="0.72" />
      <path d="M388 103C415 91 451 99 461 122C468 138 458 154 439 158C418 162 394 151 389 133C386 122 385 113 388 103Z" fill="#E0A72E" stroke="#1B2430" strokeWidth="3" />
      <path d="M402 112C420 106 439 109 449 121" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
      <path d="M411 167C425 178 431 192 428 207" stroke="#1B2430" strokeWidth="3" strokeLinecap="round" />
      <path d="M428 207L420 199M428 207L437 201" stroke="#1B2430" strokeWidth="2.5" strokeLinecap="round" />

      <path d="M62 250L111 239L126 285L75 295L62 250Z" fill="#E0A72E" stroke="#1B2430" strokeWidth="3" strokeLinejoin="round" />
      <path d="M74 263L108 255M78 276L113 268" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
      <path d="M390 245C414 239 443 242 458 254C470 265 463 280 445 286C421 293 394 283 386 270C381 261 382 250 390 245Z" fill="#F2F0E8" stroke="#1B2430" strokeWidth="3" />
      <path d="M403 259C416 255 430 255 444 259" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
