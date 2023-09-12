import type { Metadata } from 'next'
import ClientComponent from './client'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Box } from '@chakra-ui/react'

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
    <html lang="en">
      <body className={inter.className}>
        <ClientComponent>
          <Navbar></Navbar>
          <Box pt={'60px'}></Box>
          {children}
          <Footer></Footer>
        </ClientComponent>
      </body>
    </html>
  )
}
