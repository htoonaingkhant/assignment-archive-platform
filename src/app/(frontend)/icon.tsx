import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  height: 32,
  width: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#FF6B35',
        border: '2px solid #0F0F0F',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <svg
        fill="none"
        height="24"
        viewBox="0 0 32 32"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          fill="#FAF5EE"
          height="16"
          stroke="#0F0F0F"
          strokeWidth="1.5"
          width="12"
          x="10"
          y="8"
        />
        <line stroke="#0F0F0F" strokeWidth="1.5" x1="16" x2="16" y1="8" y2="24" />
        <polyline
          points="12,16 14,18 20,12"
          stroke="#0F0F0F"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </div>,
    {
      ...size,
    },
  )
}
