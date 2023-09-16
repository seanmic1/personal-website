import type { Metadata } from "next"
import ClientComponent from "../global_components/client"
import { Inter } from "next/font/google"
import Navbar from "@/app/global_components/Navbar"
import Footer from "@/app/global_components/Footer"

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
      <body className={inter.className}>
        <ClientComponent>
          <Navbar></Navbar>
          {children}
          <Footer></Footer>
        </ClientComponent>
      </body>
    </html>
  )
}
