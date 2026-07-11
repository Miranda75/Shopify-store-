import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatEUR } from "@/lib/format";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { endpoints } from "@/lib/api";

const FREE_SHIPPING = 80;

export const CartDrawer = () => {
  const { items, subtotal, open, setOpen, updateQty, removeItem, discountCode, setDiscountCode, checkout } = useCart();
  const [codeInput, setCodeInput] = useState(discountCode || "");
  const [shipping, setShipping] = useState(null);

  useEffect(() => {
    if (!open) return;
    endpoints
      .shippingEstimate({ subtotal })
      .then(setShipping)
      .catch(() => setShipping(null));
  }, [subtotal, open]);

  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[460px] p-0 bg-ivory flex flex-col"
        data-testid="cart-drawer"
      >
        <SheetHeader className="p-6 border-b border-border/60">
          <SheetTitle className="font-serif text-2xl tracking-tight text-charcoal text-left">
            Votre Panier
            <span className="ml-2 text-sm text-charcoalLight font-sans font-normal">
              ({items.length})
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6" data-testid="cart-empty">
            <ShoppingBag size={40} strokeWidth={1} className="text-charcoalLight/40" />
            <p className="text-charcoalLight">Votre panier est vide.</p>
            <Link to="/" onClick={() => setOpen(false)} className="btn-secondary" data-testid="cart-empty-cta">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-6 py-4 bg-beigeLight/60 border-b border-border/40">
              {subtotal >= FREE_SHIPPING ? (
                <p className="text-xs uppercase tracking-[0.2em] text-goldDark">
                  ✦ Livraison offerte débloquée
                </p>
              ) : (
                <>
                  <p className="text-xs text-charcoalLight mb-2">
                    Plus que{" "}
                    <span className="text-charcoal font-medium">
                      {formatEUR(FREE_SHIPPING - subtotal)}
                    </span>{" "}
                    pour la livraison offerte.
                  </p>
                  <div className="h-[2px] bg-charcoal/10 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gold transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6" data-testid="cart-items">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4">
                  <Link
                    to={`/products/${item.productHandle}`}
                    onClick={() => setOpen(false)}
                    className="shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-24 object-cover"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <div>
                        <Link
                          to={`/products/${item.productHandle}`}
                          onClick={() => setOpen(false)}
                          className="font-serif text-base leading-snug hover:text-gold transition-colors block"
                        >
                          {item.title}
                        </Link>
                        {item.variantTitle && item.variantTitle !== "Standard" && (
                          <p className="text-xs text-charcoalLight mt-1">{item.variantTitle}</p>
                        )}
                      </div>
                      <button
                        aria-label="Retirer l'article"
                        onClick={() => removeItem(item.variantId)}
                        className="p-1 text-charcoalLight hover:text-gold transition-colors -mt-1"
                        data-testid={`cart-remove-${item.productHandle}`}
                      >
                        <X size={16} strokeWidth={1.25} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-charcoal/25">
                        <button
                          className="w-8 h-8 flex items-center justify-center hover:bg-charcoal hover:text-ivory transition-colors"
                          onClick={() => updateQty(item.variantId, item.quantity - 1)}
                          aria-label="Diminuer la quantité"
                          data-testid={`cart-qty-dec-${item.productHandle}`}
                        >
                          <Minus size={12} strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm" data-testid={`cart-qty-${item.productHandle}`}>
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 flex items-center justify-center hover:bg-charcoal hover:text-ivory transition-colors"
                          onClick={() => updateQty(item.variantId, item.quantity + 1)}
                          aria-label="Augmenter la quantité"
                          data-testid={`cart-qty-inc-${item.productHandle}`}
                        >
                          <Plus size={12} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-sm font-medium">
                        {formatEUR(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border/60 p-6 space-y-4 bg-ivory">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code promo"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 border border-charcoal/25 bg-transparent px-3 py-2.5 text-sm focus:border-gold focus:outline-none transition-colors"
                  data-testid="cart-discount-input"
                />
                <button
                  onClick={() => setDiscountCode(codeInput)}
                  className="border border-charcoal px-4 text-xs uppercase tracking-[0.15em] hover:bg-charcoal hover:text-ivory transition-colors"
                  data-testid="cart-discount-apply-btn"
                >
                  Appliquer
                </button>
              </div>

              {shipping && (
                <p className="text-xs text-charcoalLight">
                  Livraison estimée · {shipping.label} —{" "}
                  {shipping.free ? "Offerte" : formatEUR(shipping.amount)}
                </p>
              )}

              <div className="flex justify-between items-baseline">
                <span className="text-sm uppercase tracking-[0.18em] text-charcoalLight">Sous-total</span>
                <span className="font-serif text-2xl" data-testid="cart-subtotal">{formatEUR(subtotal)}</span>
              </div>
              <p className="text-[11px] text-charcoalLight">
                Frais de port et taxes calculés au paiement.
              </p>

              <button
                onClick={checkout}
                className="btn-primary w-full"
                data-testid="cart-checkout-btn"
              >
                Passer à la caisse
              </button>
              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-charcoalLight">
                Paiement 100% sécurisé
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
