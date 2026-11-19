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
import { THEME_COOKIE_MAX_AGE, THEME_KEY } from "@/lib/theme";
import { cookies } from "next/headers";

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

const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(!t)return;var light=t==="light";document.documentElement.classList.toggle("dark",!light);document.documentElement.style.colorScheme=light?"light":"dark";if(document.cookie.indexOf("${THEME_KEY}="+t)===-1){document.cookie="${THEME_KEY}="+t+"; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax";}}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const initialLight = cookieStore.get(THEME_KEY)?.value === "light";

  return (
    <html
      lang="en"
      className={initialLight ? undefined : "dark"}
      style={{ colorScheme: initialLight ? "light" : "dark" }}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider initialLight={initialLight}>
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
