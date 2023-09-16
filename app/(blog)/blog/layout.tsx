import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/app/global_components/globals.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sean Michael',
  description: "Sean Michael's Personal Website"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <head>
            <link rel="icon" type="image/png" sizes="any" href="/seanml_tp.png"/>
        </head>
        <body className="dark:bg-slate-800">
            {children}
        </body>
      </html>
  )
}
