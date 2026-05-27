import type { Metadata, Viewport } from "next";
import { Raleway, Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
  weight: ["300", "400", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Wellx Pricing Engine — Commercial Operating System",
  description:
    "The Wellx commercial operating system. Configure stacks, price opportunities, and see the deal behind the deal.",
  applicationName: "Wellx Pricing Engine",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f8" },
    { media: "(prefers-color-scheme: dark)", color: "#08080e" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${raleway.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const t = localStorage.getItem('wx.theme');
                const sys = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                const theme = t === 'light' || t === 'dark' ? t : sys;
                document.documentElement.dataset.theme = theme;
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-dvh font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
