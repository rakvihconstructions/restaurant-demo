import type { Metadata, Viewport } from "next";
import { Archivo, Bodoni_Moda, Instrument_Sans, JetBrains_Mono, Manrope, Shrikhand } from "next/font/google";
import { Toaster } from "sonner";
import { DemoSwitcher } from "@/components/demo-switcher";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const shrikhand = Shrikhand({
  variable: "--font-shrikhand",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Demo Restaurant — Coastal Kitchen · Indiranagar, Bengaluru",
    template: "%s · Demo Restaurant",
  },
  description:
    "Demo Restaurant on 12th Main, Indiranagar. Wood-fired seafood, heirloom curries, private dining rooms, and instant table reservations.",
};

export const viewport: Viewport = {
  themeColor: "#4E1D84",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${bodoni.variable} ${instrument.variable} ${jetbrains.variable} ${archivo.variable} ${shrikhand.variable} antialiased`}
    >
      <body className="min-h-dvh">
        {children}
        <DemoSwitcher />
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast:
                "!rounded-2xl !border !border-white/10 !bg-[#0b111e] !text-[#faf8f4] !font-[var(--font-manrope)] !shadow-2xl",
              description: "!text-[#faf8f4]/65",
            },
          }}
        />
      </body>
    </html>
  );
}
