import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { endpoints } from "@/lib/api";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

const STORAGE_KEY = "lcm_cart_v1";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { items: [], discountCode: null };
  } catch {
    return { items: [], discountCode: null };
  }
};

export const CartProvider = ({ children }) => {
  const [state, setState] = useState(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = (product, variant, qty = 1) => {
    setState((s) => {
      const existing = s.items.find((i) => i.variantId === variant.id);
      let items;
      if (existing) {
        items = s.items.map((i) =>
          i.variantId === variant.id ? { ...i, quantity: Math.min(99, i.quantity + qty) } : i
        );
      } else {
        items = [
          ...s.items,
          {
            variantId: variant.id,
            productHandle: product.handle,
            title: product.title,
            variantTitle: variant.title,
            image: product.images?.[0],
            price: parseFloat(variant.price.amount),
            quantity: qty,
          },
        ];
      }
      return { ...s, items };
    });
    toast.success("Ajouté à votre panier", { description: product.title });
    setOpen(true);
  };

  const updateQty = (variantId, qty) => {
    setState((s) => ({
      ...s,
      items: qty <= 0
        ? s.items.filter((i) => i.variantId !== variantId)
        : s.items.map((i) => (i.variantId === variantId ? { ...i, quantity: qty } : i)),
    }));
  };

  const removeItem = (variantId) =>
    setState((s) => ({ ...s, items: s.items.filter((i) => i.variantId !== variantId) }));

  const clear = () => setState({ items: [], discountCode: null });

  const setDiscountCode = (code) => setState((s) => ({ ...s, discountCode: code || null }));

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const checkout = async () => {
    if (!state.items.length) return;
    try {
      const res = await endpoints.checkout({
        items: state.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        discountCode: state.discountCode,
      });
      if (res.checkoutUrl) {
        // Real Shopify handoff: redirect. In mock mode the URL is a demo placeholder,
        // so we show a toast so the tester sees confirmation.
        if (res.checkoutUrl.includes("demo=1")) {
          toast.info("Paiement Shopify (mode démo)", {
            description:
              "Le token Storefront API n'est pas encore configuré. La redirection vers le checkout Shopify sera activée dès l'ajout du token.",
          });
        } else {
          window.location.href = res.checkoutUrl;
        }
      }
    } catch (e) {
      toast.error("Échec du paiement. Merci de réessayer.");
    }
  };

  return (
    <CartCtx.Provider
      value={{
        items: state.items,
        discountCode: state.discountCode,
        subtotal,
        itemCount,
        open,
        setOpen,
        addItem,
        updateQty,
        removeItem,
        clear,
        setDiscountCode,
        checkout,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
};
