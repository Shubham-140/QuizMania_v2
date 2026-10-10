import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getServerSession } from "next-auth";
import "./globals.css";
import Navbar from "./component/Navbar";
import ReduxProvider from "./store/provider";
import { AuthProvider } from "./component/SessionProvider";
import Footer from "./component/Footer";
import { ThemeProvider } from "./component/ThemeProvider";
import { authOptions } from "@/lib/authOptions";

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

// Runs before paint so theme matches localStorage immediately (avoids half-second flash).
const themeInitScript = `(function(){try{var t=localStorage.getItem("quizmania-theme");var light=t==="light";document.documentElement.classList.toggle("dark",!light);document.documentElement.style.colorScheme=light?"light":"dark";}catch(e){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ReduxProvider>
            <AuthProvider session={session}>
              <Navbar />
              {children}
              <Footer />
            </AuthProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
