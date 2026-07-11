import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Heart, Search, ShoppingBag, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchModal from "./SearchModal";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/collections/maison", label: "Maison" },
  { to: "/collections/beaute", label: "Beauté" },
  { to: "/collections/accessoires", label: "Accessoires" },
  { to: "/collections/sport", label: "Sport" },
  { to: "/collections/electronique", label: "Électronique" },
];

export const Header = () => {
  const { itemCount, setOpen: setCartOpen } = useCart();
  const { handles } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 bg-ivory/90 backdrop-blur-xl border-b border-border/50"
        data-testid="site-header"
      >
        <div className="container-mx flex items-center justify-between py-5">
          {/* Mobile menu trigger */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button aria-label="Ouvrir le menu" data-testid="mobile-menu-btn" className="p-2 -ml-2">
                  <Menu size={22} strokeWidth={1.25} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-ivory w-[85%] sm:w-[380px] p-0">
                <div className="p-6 border-b border-border/50">
                  <Logo />
                </div>
                <nav className="flex flex-col p-6 gap-6">
                  {NAV.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setMobileOpen(false)}
                      className="font-serif text-2xl text-charcoal hover:text-gold transition-colors"
                    >
                      {l.label}
                    </NavLink>
                  ))}
                  <div className="h-px bg-border/60 my-2" />
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="link-nav"
                  >
                    Favoris
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="link-nav"
                  >
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Left desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 flex-1">
            {NAV.slice(0, 3).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `link-nav ${isActive ? "text-gold" : ""}`
                }
                data-testid={`nav-link-${l.label.toLowerCase()}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Right nav + utility */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-end">
            {NAV.slice(3).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `link-nav ${isActive ? "text-gold" : ""}`
                }
                data-testid={`nav-link-${l.label.toLowerCase()}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Utility icons */}
          <div className="flex items-center gap-4 lg:gap-5 lg:ml-6">
            <button
              aria-label="Rechercher"
              onClick={() => setSearchOpen(true)}
              className="p-1 hover:text-gold transition-colors"
              data-testid="header-search-btn"
            >
              <Search size={20} strokeWidth={1.25} />
            </button>
            <Link
              to="/wishlist"
              aria-label="Mes favoris"
              className="p-1 hover:text-gold transition-colors relative"
              data-testid="header-wishlist-link"
            >
              <Heart size={20} strokeWidth={1.25} />
              {handles.length > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-gold text-ivory rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {handles.length}
                </span>
              )}
            </Link>
            <button
              aria-label="Ouvrir le panier"
              onClick={() => setCartOpen(true)}
              className="p-1 hover:text-gold transition-colors relative"
              data-testid="header-cart-btn"
            >
              <ShoppingBag size={20} strokeWidth={1.25} />
              {itemCount > 0 && (
                <span
                  data-testid="header-cart-count"
                  className="absolute -top-1 -right-1 text-[10px] bg-charcoal text-ivory rounded-full w-4 h-4 flex items-center justify-center font-medium"
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Header;
