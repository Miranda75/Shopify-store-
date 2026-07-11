import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { formatEUR, priceFromShopify } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export const ProductCard = ({ product, priority = false }) => {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, toggle } = useWishlist();

  const price = priceFromShopify(product.priceRange);
  const compareAt = product.compareAtPrice ? parseFloat(product.compareAtPrice.amount) : null;
  const onSale = compareAt && compareAt > price;
  const secondaryImage = product.images?.[1] || product.images?.[0];
  const active = isInWishlist(product.handle);

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants?.[0];
    if (!variant) return;
    addItem(product, variant, 1);
  };

  const toggleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.handle, product.title);
  };

  const isNew = (product.tags || []).includes("nouveau");

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-testid={`product-card-${product.handle}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-beigeLight">
        <img
          src={product.images?.[0]}
          alt={product.title}
          loading={priority ? "eager" : "lazy"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            hovered && secondaryImage !== product.images?.[0] ? "opacity-0" : "opacity-100"
          }`}
        />
        {secondaryImage && secondaryImage !== product.images?.[0] && (
          <img
            src={secondaryImage}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isNew && (
            <span className="bg-ivory text-charcoal text-[10px] uppercase tracking-[0.18em] px-2 py-1">
              Nouveau
            </span>
          )}
          {onSale && (
            <span className="bg-gold text-ivory text-[10px] uppercase tracking-[0.18em] px-2 py-1">
              -{Math.round(((compareAt - price) / compareAt) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={toggleWish}
          aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-ivory/85 hover:bg-ivory transition-colors"
          data-testid={`product-card-wishlist-${product.handle}`}
        >
          <Heart
            size={16}
            strokeWidth={1.25}
            className={active ? "fill-gold text-gold" : "text-charcoal"}
          />
        </button>

        {/* Quick add */}
        <button
          onClick={quickAdd}
          className={`absolute bottom-0 left-0 right-0 bg-charcoal text-ivory text-[11px] uppercase tracking-[0.2em] py-3 transition-transform duration-300 hover:bg-gold ${
            hovered ? "translate-y-0" : "translate-y-full"
          }`}
          data-testid={`product-card-quickadd-${product.handle}`}
        >
          Ajouter au panier
        </button>
      </div>

      <div className="mt-4 flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg leading-snug group-hover:text-gold transition-colors">
            {product.title}
          </h3>
          <p className="text-[11px] uppercase tracking-[0.18em] text-charcoalLight mt-1">
            {product.collections?.[0]}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base">{formatEUR(price)}</p>
          {onSale && (
            <p className="text-xs text-charcoalLight line-through mt-0.5">
              {formatEUR(compareAt)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
