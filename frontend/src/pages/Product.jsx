import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, Truck, RotateCcw, ShieldCheck, Minus, Plus, Check } from "lucide-react";
import { endpoints } from "@/lib/api";
import { formatEUR, priceFromShopify } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Product = () => {
  const { handle } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => endpoints.product(handle),
  });

  const { addItem } = useCart();
  const { isInWishlist, toggle } = useWishlist();

  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="container-mx py-32 text-center text-charcoalLight" data-testid="product-loading">
        Chargement…
      </div>
    );
  }

  const product = data?.product;
  if (!product) {
    return (
      <div className="container-mx py-32 text-center">
        <h1 className="font-serif text-4xl">Produit introuvable</h1>
        <Link to="/" className="btn-secondary mt-8 inline-flex">Retour à l'accueil</Link>
      </div>
    );
  }

  const related = data.related || [];
  const variant = product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0];
  const price = variant ? parseFloat(variant.price.amount) : priceFromShopify(product.priceRange);
  const compareAt = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : null;
  const isFav = isInWishlist(product.handle);
  const stock = variant?.quantityAvailable ?? 0;

  const onAdd = () => {
    if (!variant) return;
    addItem(product, variant, qty);
  };

  return (
    <div className="pb-32 lg:pb-16" data-testid="product-page">
      {/* Breadcrumb */}
      <div className="container-mx pt-8">
        <nav className="text-xs uppercase tracking-[0.18em] text-charcoalLight" aria-label="Fil d'Ariane">
          <Link to="/" className="hover:text-gold transition-colors">Accueil</Link>
          {product.collections?.[0] && (
            <>
              <span className="mx-2">/</span>
              <Link
                to={`/collections/${product.collections[0]}`}
                className="hover:text-gold transition-colors capitalize"
              >
                {product.collections[0]}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-charcoal">{product.title}</span>
        </nav>
      </div>

      <div className="container-mx grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-10 lg:py-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-beigeLight overflow-hidden">
            <img
              src={product.images?.[activeImage] || product.images?.[0]}
              alt={product.title}
              className="w-full h-full object-cover"
              data-testid="product-main-image"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2" data-testid="product-thumbnails">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square bg-beigeLight overflow-hidden ${
                    idx === activeImage ? "ring-1 ring-gold" : ""
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info column (sticky on desktop) */}
        <div className="lg:sticky lg:top-24 self-start">
          <p className="overline text-gold mb-4">{product.collections?.[0] || product.vendor}</p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.1]" data-testid="product-title">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-2xl font-medium" data-testid="product-price">{formatEUR(price)}</span>
            {compareAt && (
              <span className="text-base text-charcoalLight line-through">{formatEUR(compareAt)}</span>
            )}
          </div>
          <p className="text-xs text-charcoalLight mt-1">Prix TTC · TVA incluse. Livraison calculée au paiement.</p>

          {/* Stock indicator */}
          <div className="mt-6 flex items-center gap-2 text-sm">
            {product.availableForSale ? (
              <>
                <span className="w-2 h-2 rounded-full bg-goldDark inline-block" />
                <span className="text-charcoalLight" data-testid="product-stock">
                  {stock < 5 && stock > 0
                    ? `Stock limité · ${stock} en stock`
                    : "En stock · Expédition sous 24 h"}
                </span>
              </>
            ) : (
              <span className="text-destructive">Épuisé</span>
            )}
          </div>

          {/* Variants */}
          {product.variants?.length > 1 && (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.18em] mb-3">Choisir un modèle</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const active = v.id === (selectedVariantId || product.variants[0].id);
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-4 py-2 border text-xs uppercase tracking-[0.15em] transition-colors ${
                        active
                          ? "border-charcoal bg-charcoal text-ivory"
                          : "border-charcoal/25 text-charcoal hover:border-charcoal"
                      }`}
                    >
                      {v.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity + add to cart */}
          <div className="mt-8 flex items-stretch gap-3">
            <div className="inline-flex items-center border border-charcoal/30" data-testid="product-qty">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Diminuer"
                className="w-11 h-full flex items-center justify-center hover:bg-charcoal hover:text-ivory transition-colors"
              >
                <Minus size={14} strokeWidth={1.5} />
              </button>
              <span className="w-11 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty(Math.min(99, qty + 1))}
                aria-label="Augmenter"
                className="w-11 h-full flex items-center justify-center hover:bg-charcoal hover:text-ivory transition-colors"
              >
                <Plus size={14} strokeWidth={1.5} />
              </button>
            </div>
            <button
              onClick={onAdd}
              disabled={!product.availableForSale}
              className="btn-primary flex-1"
              data-testid="product-add-to-cart-btn"
            >
              {product.availableForSale ? "Ajouter au panier" : "Épuisé"}
            </button>
            <button
              onClick={() => toggle(product.handle, product.title)}
              aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
              className="w-14 h-14 border border-charcoal/30 flex items-center justify-center hover:bg-charcoal hover:text-ivory transition-colors"
              data-testid="product-wishlist-btn"
            >
              <Heart size={16} strokeWidth={1.25} className={isFav ? "fill-gold text-gold" : ""} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-10 grid grid-cols-3 gap-4 text-center border-y border-border/60 py-6">
            <div>
              <Truck size={18} strokeWidth={1.25} className="mx-auto text-gold" />
              <p className="text-[10px] uppercase tracking-[0.18em] mt-2">Livraison 2-4 j</p>
            </div>
            <div>
              <RotateCcw size={18} strokeWidth={1.25} className="mx-auto text-gold" />
              <p className="text-[10px] uppercase tracking-[0.18em] mt-2">Retour 14 j</p>
            </div>
            <div>
              <ShieldCheck size={18} strokeWidth={1.25} className="mx-auto text-gold" />
              <p className="text-[10px] uppercase tracking-[0.18em] mt-2">Paiement sécurisé</p>
            </div>
          </div>

          {/* Accordions */}
          <Accordion type="single" collapsible defaultValue="desc" className="mt-8">
            <AccordionItem value="desc" className="border-b border-border/60">
              <AccordionTrigger className="text-xs uppercase tracking-[0.18em] hover:no-underline hover:text-gold py-5">
                Description
              </AccordionTrigger>
              <AccordionContent className="text-sm text-charcoalLight leading-relaxed pb-5">
                {product.description}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery" className="border-b border-border/60">
              <AccordionTrigger className="text-xs uppercase tracking-[0.18em] hover:no-underline hover:text-gold py-5">
                Livraison & retours
              </AccordionTrigger>
              <AccordionContent className="text-sm text-charcoalLight leading-relaxed pb-5 space-y-2">
                <p>Livraison sous {product.metafields?.delivery_days || "2 à 4 jours ouvrés"} en France métropolitaine (Colissimo, Mondial Relay ou Chronopost).</p>
                <p>Retours gratuits sous {product.metafields?.return_days || "14"} jours après réception.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="details" className="border-b border-border/60">
              <AccordionTrigger className="text-xs uppercase tracking-[0.18em] hover:no-underline hover:text-gold py-5">
                Détails & entretien
              </AccordionTrigger>
              <AccordionContent className="text-sm text-charcoalLight leading-relaxed pb-5">
                <p>Origine : {product.metafields?.made_in || "France"}. Confectionné avec soin.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-mx py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="overline text-gold mb-3">Vous aimerez aussi</p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Autres pièces à découvrir.</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile add-to-cart */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-ivory border-t border-border/60 p-4 flex items-center gap-3 shadow-2xl">
        <div className="flex-1">
          <p className="font-serif text-sm truncate">{product.title}</p>
          <p className="text-sm font-medium">{formatEUR(price)}</p>
        </div>
        <button
          onClick={onAdd}
          disabled={!product.availableForSale}
          className="btn-primary py-3 px-6"
          data-testid="product-add-to-cart-btn-mobile"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default Product;
