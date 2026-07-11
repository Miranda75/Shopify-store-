import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { endpoints } from "@/lib/api";
import { getSessionId } from "@/lib/format";
import ProductCard from "@/components/ProductCard";
import { useWishlist } from "@/context/WishlistContext";

const Wishlist = () => {
  const { handles } = useWishlist();
  const sessionId = getSessionId();
  const { data, isLoading } = useQuery({
    queryKey: ["wishlist", sessionId, handles.length],
    queryFn: () => endpoints.wishlistList(sessionId),
  });

  const products = data?.products || [];

  return (
    <div className="min-h-[60vh]" data-testid="wishlist-page">
      <div className="bg-beige">
        <div className="container-mx py-16 md:py-24 text-center">
          <p className="overline text-gold mb-4">Vos favoris</p>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight">Ma sélection.</h1>
          <p className="text-sm text-charcoalLight max-w-md mx-auto mt-6">
            Les pièces qui ont retenu votre attention. Enregistrées sur cet appareil.
          </p>
        </div>
      </div>

      <div className="container-mx py-14">
        {isLoading ? (
          <p className="text-center text-charcoalLight">Chargement…</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={40} strokeWidth={1} className="mx-auto text-charcoalLight/40 mb-6" />
            <p className="text-charcoalLight mb-8">Votre liste de favoris est vide.</p>
            <Link to="/" className="btn-primary">Découvrir la boutique</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10" data-testid="wishlist-grid">
            {products.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
