
import type { Metadata } from "next";
import { Russo_One, Chakra_Petch } from "next/font/google";
import "./globals.css";

const russoOne = Russo_One({
  weight: '400', // Russo One only has one weight and it is ultra-thick
  subsets: ['latin'],
  variable: '--font-russo-one',
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra-petch",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Byte Battle",
  description: "Enter the arena. Battle with code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${russoOne.variable} ${chakraPetch.variable} h-full antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
