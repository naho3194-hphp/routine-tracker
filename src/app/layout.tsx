import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import StoreHydration from '@/components/StoreHydration'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ルーティントラッカー',
  description: '毎日のルーティンを挫折せずこなすためのシンプルなトラッカー',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ルーティン',
  },
  icons: {
    apple: '/icon-192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563EB',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={geist.className}>
        <StoreHydration />
        {children}
      </body>
    </html>
  )
}
