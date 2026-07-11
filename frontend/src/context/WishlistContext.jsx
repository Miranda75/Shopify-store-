import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { endpoints } from "@/lib/api";
import { getSessionId } from "@/lib/format";
import { toast } from "sonner";

const WishlistCtx = createContext(null);
export const useWishlist = () => useContext(WishlistCtx);

const STORAGE_KEY = "lcm_wishlist_v1";

const loadLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [handles, setHandles] = useState(loadLocal);
  const sessionId = getSessionId();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
  }, [handles]);

  // Sync with backend on mount (best-effort; guest wishlist works offline too)
  useEffect(() => {
    endpoints
      .wishlistList(sessionId)
      .then((res) => {
        if (Array.isArray(res.handles) && res.handles.length) {
          // Merge server + local (union)
          setHandles((prev) => Array.from(new Set([...prev, ...res.handles])));
        }
      })
      .catch(() => {});
  }, [sessionId]);

  const isInWishlist = useCallback((handle) => handles.includes(handle), [handles]);

  const toggle = useCallback(
    async (handle, productTitle) => {
      const wasActive = handles.includes(handle);
      // Optimistic local update
      setHandles((prev) =>
        wasActive ? prev.filter((h) => h !== handle) : [...prev, handle]
      );
      try {
        await endpoints.wishlistToggle({ sessionId, productHandle: handle });
        if (!wasActive && productTitle) {
          toast.success("Ajouté à vos favoris", { description: productTitle });
        }
      } catch {
        // Roll back on failure
        setHandles((prev) =>
          wasActive ? [...prev, handle] : prev.filter((h) => h !== handle)
        );
        toast.error("Impossible d'enregistrer les favoris.");
      }
    },
    [handles, sessionId]
  );

  return (
    <WishlistCtx.Provider value={{ handles, isInWishlist, toggle, sessionId }}>
      {children}
    </WishlistCtx.Provider>
  );
};
