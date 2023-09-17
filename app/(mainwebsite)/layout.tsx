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
        <Script id="GoogleAnalytics">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-N9WRVZLC');
          `}
        </Script>
          <link rel="icon" type="image/png" sizes="any" href="/seanml_tp.png"/>
      </head>
      <body className={inter.className}>
        <ClientComponent>
          <Navbar></Navbar>
          {children}
          <Footer></Footer>
        </ClientComponent>
        <noscript dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N9WRVZLC" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
          }}
        />
      </body>
    </html>
  )
}
