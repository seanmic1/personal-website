import { Inter } from "next/font/google"

const inter = Inter({ subsets: ['latin'] })


export default function BlogLayout({
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
          {children}
      </body>
    </html>
  )
}
