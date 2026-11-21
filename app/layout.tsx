import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { getServerSession } from "next-auth";
import "./globals.css";
import Navbar from "./component/Navbar";
import ReduxProvider from "./store/provider";
import { AuthProvider } from "./component/SessionProvider";
import Footer from "./component/Footer";
import { ThemeProvider } from "./component/ThemeProvider";
import { authOptions } from "@/lib/authOptions";
import { THEME_COOKIE_MAX_AGE, THEME_KEY } from "@/lib/theme";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { cookies } from "next/headers";

const appFont = Plus_Jakarta_Sans({
  variable: "--font-app",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultTitle = `${siteName} | Test your knowledge`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: defaultTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName,
    title: defaultTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteDescription,
  },
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
        className={`${appFont.variable} ${geistMono.variable} antialiased`}
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
