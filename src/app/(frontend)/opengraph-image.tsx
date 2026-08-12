import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Assignment Archive — Answers that stay findable'
export const size = {
  height: 630,
  width: 1200,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background: '#FAF5EE',
        border: '8px solid #0F0F0F',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        padding: '80px',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Checker strip background elements */}
      <div
        style={{
          background:
            'repeating-linear-gradient(45deg, #0F0F0F 0, #0F0F0F 10px, transparent 10px, transparent 20px)',
          height: '40px',
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
        }}
      />
      <div
        style={{
          background:
            'repeating-linear-gradient(45deg, #0F0F0F 0, #0F0F0F 10px, transparent 10px, transparent 20px)',
          bottom: 0,
          height: '40px',
          left: 0,
          position: 'absolute',
          width: '100%',
        }}
      />

      {/* Logo */}
      <div
        style={{
          alignItems: 'center',
          background: '#FF6B35',
          border: '6px solid #0F0F0F',
          boxShadow: '8px 8px 0 #0F0F0F',
          display: 'flex',
          height: '160px',
          justifyContent: 'center',
          marginBottom: '60px',
          width: '160px',
        }}
      >
        <svg
          fill="none"
          height="100"
          viewBox="0 0 32 32"
          width="100"
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
      </div>

      {/* Main heading */}
      <div
        style={{
          color: '#0F0F0F',
          display: 'flex',
          fontSize: 90,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: '30px',
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        Assignment Archive
      </div>

      {/* Tagline */}
      <div
        style={{
          background: '#FF6B35',
          border: '4px solid #0F0F0F',
          boxShadow: '6px 6px 0 #0F0F0F',
          color: '#0F0F0F',
          display: 'flex',
          fontSize: 36,
          fontWeight: 700,
          padding: '20px 40px',
        }}
      >
        Answers that stay findable
      </div>

      {/* Features badge */}
      <div
        style={{
          alignItems: 'center',
          bottom: '80px',
          color: '#0F0F0F',
          display: 'flex',
          fontSize: 28,
          fontWeight: 600,
          gap: '30px',
          position: 'absolute',
        }}
      >
        <span>📚 Searchable</span>
        <span>•</span>
        <span>✓ Reviewed</span>
        <span>•</span>
        <span>🎯 Organized</span>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
