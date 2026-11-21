import Navbar from "@/app/component/Navbar";
import Footer from "@/app/component/Footer";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
