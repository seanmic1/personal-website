import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE } from "./lib/site";

const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  // Next has no metrics for this face, so let it use a plain fallback stack
  // rather than warning about the size-adjust it can't compute.
  adjustFontFallback: false,
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const DESCRIPTION =
  "Backend engineer at Qashier, building access control systems. Previously built loan management software for banks and financial institutions across Malaysia and Indonesia.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Sean Michael — Software Engineer",
    template: "%s — Sean Michael",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Sean Michael — Software Engineer",
    description: DESCRIPTION,
    url: SITE,
    siteName: "Sean Michael",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/seanml_tp_white.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-ground font-sans text-ink">
        {children}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N9WRVZLC');`}
        </Script>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N9WRVZLC"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
      </body>
    </html>
  );
}
