import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'MamaSign - E-Signature & PDF Tools'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          padding: 60,
        }}
      >
        {/* Logo Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 20,
          }}
        >
          MamaSign
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Free E-Signature & PDF Tools
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 50,
          }}
        >
          {['Sign Documents', 'PDF Tools', 'Legally Binding'].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#e2e8f0',
                fontSize: 24,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#06b6d4',
                }}
              />
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
