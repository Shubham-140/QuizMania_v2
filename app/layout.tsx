import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./component/Navbar";
import ReduxProvider from "./store/provider";
import { AuthProvider } from "./component/SessionProvider";
import Footer from "./component/Footer";
import { ReduxPersistProvider } from "./component/ReduxPersistProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuizMania: The ultimate quiz challenge",
  description:
    "QuizMania is a feature-rich, full-stack quiz application built with Next.js 14, TypeScript, and PostgreSQL. Test your knowledge with beautiful animations, real-time scoring, and personalized feedback — all in a modern, secure, and responsive interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ReduxPersistProvider>
            <AuthProvider>
              <Navbar />
              {children}
              <Footer />
            </AuthProvider>
          </ReduxPersistProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
