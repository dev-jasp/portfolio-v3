import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { Menu } from "@/components/layout/Menu";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { site } from "@/lib/constants";
import "./globals.css";

// Display + UI. Variable font, so no weight list is needed.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// Labels, categories, tech lists — anything that should read as data.
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const title = `${site.name} — ${site.role}`;

// TODO(phase 8): add `metadataBase` and an OG image once the domain is settled.
export const metadata: Metadata = {
  title,
  description: site.description,
  openGraph: {
    title,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased`}
    >
      <body>
        <SmoothScroll />
        <Menu />
        {children}
      </body>
    </html>
  );
}
