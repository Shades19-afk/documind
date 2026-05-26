import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8b5cf6 0%, #38bdf8 100%)",
          borderRadius: 18,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="48"
          height="48"
          role="img"
        >
          <rect width="64" height="64" rx="18" fill="rgba(15,23,42,0.18)" />
          <path
            d="M18 22h16c4 0 7 3 7 7v15H20c-1 0-2-1-2-2V22Z"
            fill="#0f172a"
            fillOpacity="0.18"
          />
          <path
            d="M20 18h14l8 8v20a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4Z"
            fill="#f8fafc"
          />
          <path
            d="M34 18v8h8"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 32h16M24 38h12"
            fill="none"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
