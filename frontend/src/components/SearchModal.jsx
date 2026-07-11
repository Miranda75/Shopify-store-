import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { endpoints } from "@/lib/api";
import { formatEUR, priceFromShopify } from "@/lib/format";

const POPULAR = ["Sérum éclat", "Foulard soie", "Casque audio", "Bougie figue", "Vase porcelaine"];

export const SearchModal = ({ open, onOpenChange }) => {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQ("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!q || q.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      setLoading(true);
      endpoints
        .search(q)
        .then((res) => setResults(res.results || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl bg-ivory p-0 gap-0 top-[10%] translate-y-0 rounded-none border-none shadow-2xl"
        data-testid="search-modal"
      >
        <div className="border-b border-border/50 px-6 py-5 flex items-center gap-4">
          <SearchIcon size={20} strokeWidth={1.25} className="text-charcoalLight" />
          <input
            autoFocus
            type="text"
            placeholder="Rechercher un produit, une catégorie…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none text-lg font-serif placeholder:text-charcoalLight/50"
            data-testid="search-input"
          />
          <button aria-label="Fermer" onClick={() => onOpenChange(false)}>
            <X size={20} strokeWidth={1.25} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
          {!q && (
            <div>
              <p className="overline mb-4">Suggestions</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((p) => (
                  <button
                    key={p}
                    onClick={() => setQ(p)}
                    className="border border-charcoal/25 px-3 py-1.5 text-xs uppercase tracking-[0.12em] hover:bg-charcoal hover:text-ivory transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
          {q && loading && <p className="text-sm text-charcoalLight">Recherche…</p>}
          {q && !loading && results.length === 0 && (
            <p className="text-sm text-charcoalLight">Aucun résultat pour « {q} ».</p>
          )}
          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-testid="search-results">
              {results.map((p) => (
                <Link
                  key={p.handle}
                  to={`/products/${p.handle}`}
                  onClick={() => onOpenChange(false)}
                  className="flex gap-4 group"
                  data-testid={`search-result-${p.handle}`}
                >
                  <img
                    src={p.images?.[0]}
                    alt={p.title}
                    className="w-20 h-24 object-cover"
                  />
                  <div>
                    <p className="font-serif text-lg leading-snug group-hover:text-gold transition-colors">
                      {p.title}
                    </p>
                    <p className="text-sm mt-1">{formatEUR(priceFromShopify(p.priceRange))}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
