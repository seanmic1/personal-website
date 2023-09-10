'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from "./providers"
import { usePathname } from 'next/navigation';

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ['latin'] })
 
export default function ClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
    if (['/dashboard'].includes(usePathname())){
        return (
          <html lang="en">
            <body className={inter.className}>
                <Providers>
                  {children}
                </Providers>
              </body>
          </html>
        )
      }
    
      return (
        <html lang="en">
          <body className={inter.className}>
            <Providers>
              <Navbar/>
              {children}
              <Footer/>
            </Providers>
            </body>
        </html>
      )
}