import type { Metadata } from "next"
import ClientComponent from "../global_components/client"
import { Inter } from "next/font/google"
import Navbar from "@/app/global_components/Navbar"
import Footer from "@/app/global_components/Footer"

import Script from 'next/script'

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
        <div className="container">
          <Script async src="https://www.googletagmanager.com/gtag/js?id=G-W1WZS731E2" />
          <Script id="google-analytics">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-W1WZS731E2');
            `}
          </Script>
        </div>
        <ClientComponent>
          <Navbar></Navbar>
          {children}
          <Footer></Footer>
        </ClientComponent>
      </body>
    </html>
  )
}
