import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "@/app/global_components/globals.css"
import Script from "next/script"

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
        <body className="dark:bg-slate-800">
            {children}
        </body>
      </html>
  )
}
