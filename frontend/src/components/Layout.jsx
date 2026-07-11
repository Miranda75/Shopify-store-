import { Outlet } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import CookieBanner from "./CookieBanner";
import { Toaster } from "@/components/ui/sonner";

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-charcoal focus:text-ivory focus:px-4 focus:py-2 focus:text-xs focus:tracking-[0.2em] focus:uppercase"
      >
        Aller au contenu principal
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <CookieBanner />
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

export default Layout;
