import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from "./providers"
import { usePathname } from 'next/navigation';

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

import ClientComponent from './client'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sean Michael',
  description: "Sean Michael's Personal Website",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientComponent>
      {children}
    </ClientComponent>
  )
}
