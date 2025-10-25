import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: '일상속의 철학자들',
  description: '온라인에서도 대화는 가능하다',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Noto+Serif+KR:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  )
}