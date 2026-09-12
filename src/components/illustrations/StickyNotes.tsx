import type { SVGProps } from "react";

export default function StickyNotes({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 420 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M35 260C101 255 188 264 255 258C307 253 355 257 386 251" stroke="#1B2430" strokeWidth="3" strokeLinecap="round" />
      <path d="M74 48L206 37L219 166L84 179L74 48Z" fill="#E0A72E" stroke="#1B2430" strokeWidth="4" strokeLinejoin="round" />
      <path d="M84 179L107 151L219 140L219 166L84 179Z" fill="#F2F0E8" stroke="#1B2430" strokeWidth="2" strokeLinejoin="round" />
      <path d="M101 75L181 68M104 94L194 86M106 114L166 108" stroke="#1B2430" strokeWidth="3" strokeLinecap="round" />
      <path d="M248 70L365 79L353 202L237 191L248 70Z" fill="#F2F0E8" stroke="#1B2430" strokeWidth="4" strokeLinejoin="round" />
      <path d="M248 70L365 79L359 105L245 97L248 70Z" fill="#E0A72E" opacity="0.8" />
      <path d="M267 125L336 131M265 145L323 151M263 165L343 172" stroke="#1B2430" strokeWidth="3" strokeLinecap="round" />
      <path d="M111 208C127 194 153 196 165 210C176 223 168 242 149 247C130 251 109 240 106 226C104 219 106 213 111 208Z" fill="#E0A72E" stroke="#1B2430" strokeWidth="3" />
      <path d="M125 218C135 213 146 214 154 220" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
      <path d="M190 222C210 208 237 211 248 226C258 240 247 257 227 260C207 262 188 252 185 238C183 232 185 226 190 222Z" fill="#F2F0E8" stroke="#1B2430" strokeWidth="3" />
      <path d="M202 231C216 226 228 228 237 234" stroke="#1B2430" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
