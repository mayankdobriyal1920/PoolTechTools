import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SwRegister } from "@/components/layout/SwRegister";
import { WaterBackground } from "@/components/layout/WaterBackground";
import { OfflineBanner } from "@/components/states/OfflineBanner";
import { ProLockBanner } from "@/components/ProLockBanner";
import { TokenRefresh } from "@/components/TokenRefresh";
import { ThemeProvider } from "@/components/ThemeProvider";
import { OfflineStatusProvider } from "@/components/OfflineStatusProvider";
import { UpdateBanner } from "@/components/UpdateBanner";
import { NetworkStatus } from "@/components/NetworkStatus";
import { AdSenseScript } from "@/components/AdSenseScript";
import { ToastProvider } from "@/components/ui/Toast";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PoolTechTools — Pool Volume, Chemicals & Service Reports",
  description:
    "Fast, mobile-first, offline-capable pool care toolkit: volume calculator, label-rate chemical scaling, maintenance schedules, water test logs, and professional service reports.",
  applicationName: "PoolTechTools",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "PoolTechTools",
    description: "Pool volume, chemicals, maintenance, and service reports — offline-capable.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <AdSenseScript />
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N6C9SR8T" height="0" width="0" style={{display:"none",visibility:"hidden"}} /></noscript>
      <ThemeProvider>
      <OfflineStatusProvider>
      <NetworkStatus />
      <ToastProvider>
      <Script id="consent-mode" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied"});`}
      </Script>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-N6C9SR8T');`}
      </Script>
      <Script id="gtm-datalayer" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date());`}
      </Script><WaterBackground /><SwRegister /><OfflineBanner /><ProLockBanner /><TokenRefresh /><UpdateBanner />{children}</ToastProvider>
      </OfflineStatusProvider>
      </ThemeProvider>
    </body>
    </html>
  );
}
