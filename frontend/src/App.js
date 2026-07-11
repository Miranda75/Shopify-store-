import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "@/App.css";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Collection from "@/pages/Collection";
import Product from "@/pages/Product";
import Wishlist from "@/pages/Wishlist";
import Legal from "@/pages/Legal";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ConsentProvider } from "@/context/ConsentContext";

// Basic SEO title routing: updates <title> on route change
const TitleUpdater = () => {
  useEffect(() => {
    document.title = "Le Choix de Miranda · Maison, Beauté, Accessoires & plus";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Le Choix de Miranda — maison française d'objets d'exception. Maison, beauté, accessoires, sport et électronique. Livraison en France, paiement sécurisé.";
  }, []);
  return null;
};

function App() {
  return (
    <div className="App">
      <ConsentProvider>
        <WishlistProvider>
          <CartProvider>
            <BrowserRouter>
              <TitleUpdater />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="collections/:handle" element={<Collection />} />
                  <Route path="products/:handle" element={<Product />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="legal/:slug" element={<Legal />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </ConsentProvider>
    </div>
  );
}

export default App;
