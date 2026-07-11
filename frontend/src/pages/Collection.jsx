import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { endpoints } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { priceFromShopify } from "@/lib/format";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "featured", label: "Recommandés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "new", label: "Nouveautés" },
];

const Filters = ({ maxPrice, priceRange, setPriceRange, inStock, setInStock, onSale, setOnSale, onlyNew, setOnlyNew, onClear }) => (
  <div className="space-y-8">
    <div>
      <p className="overline mb-4">Prix</p>
      <Slider
        min={0}
        max={maxPrice}
        step={5}
        value={priceRange}
        onValueChange={setPriceRange}
        className="mt-2"
        data-testid="filter-price-slider"
      />
      <div className="mt-3 flex justify-between text-xs text-charcoalLight">
        <span>{priceRange[0]} €</span>
        <span>{priceRange[1]} €</span>
      </div>
    </div>
    <div className="pt-6 border-t border-border/60">
      <p className="overline mb-4">Disponibilité</p>
      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <Checkbox checked={inStock} onCheckedChange={setInStock} data-testid="filter-instock" />
        <span>En stock uniquement</span>
      </label>
    </div>
    <div className="pt-6 border-t border-border/60">
      <p className="overline mb-4">Sélections</p>
      <div className="space-y-3">
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <Checkbox checked={onSale} onCheckedChange={setOnSale} data-testid="filter-onsale" />
          <span>En promotion</span>
        </label>
        <label className="flex items-center gap-3 text-sm cursor-pointer">
          <Checkbox checked={onlyNew} onCheckedChange={setOnlyNew} data-testid="filter-new" />
          <span>Nouveautés</span>
        </label>
      </div>
    </div>
    <button onClick={onClear} className="btn-ghost" data-testid="filter-clear">
      Effacer les filtres
    </button>
  </div>
);

const Collection = () => {
  const { handle } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["collection", handle],
    queryFn: () => endpoints.collection(handle),
  });

  const maxPrice = useMemo(() => {
    if (!data?.products) return 500;
    return Math.ceil(Math.max(...data.products.map((p) => priceFromShopify(p.priceRange))) / 10) * 10;
  }, [data]);

  const [priceRange, setPriceRange] = useState([0, 500]);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [sort, setSort] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    let list = data.products.filter((p) => {
      const price = priceFromShopify(p.priceRange);
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (inStock && !p.availableForSale) return false;
      if (onSale && !p.compareAtPrice) return false;
      if (onlyNew && !(p.tags || []).includes("nouveau")) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => priceFromShopify(a.priceRange) - priceFromShopify(b.priceRange));
    if (sort === "price-desc") list = [...list].sort((a, b) => priceFromShopify(b.priceRange) - priceFromShopify(a.priceRange));
    if (sort === "new") list = [...list].sort((a, b) => ((b.tags || []).includes("nouveau") ? 1 : 0) - ((a.tags || []).includes("nouveau") ? 1 : 0));
    return list;
  }, [data, priceRange, inStock, onSale, onlyNew, sort]);

  const clear = () => {
    setPriceRange([0, maxPrice]);
    setInStock(false);
    setOnSale(false);
    setOnlyNew(false);
    setSort("featured");
  };

  if (isLoading) {
    return (
      <div className="container-mx py-32 text-center text-charcoalLight" data-testid="collection-loading">
        Chargement…
      </div>
    );
  }

  if (!data?.collection) {
    return (
      <div className="container-mx py-32 text-center">
        <h1 className="font-serif text-4xl">Collection introuvable</h1>
        <Link to="/" className="btn-secondary mt-8 inline-flex">Retour à l'accueil</Link>
      </div>
    );
  }

  const collection = data.collection;

  return (
    <div data-testid="collection-page">
      {/* Header */}
      <div className="bg-beige">
        <div className="container-mx py-16 md:py-24 text-center">
          <p className="overline text-gold mb-4">Collection</p>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-charcoal">
            {collection.title}
          </h1>
          <p className="text-sm text-charcoalLight max-w-xl mx-auto mt-6 leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-mx py-14">
        <div className="flex items-center justify-between mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-charcoalLight" data-testid="collection-count">
            {filteredProducts.length} article{filteredProducts.length > 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-3">
            {/* Mobile filters */}
            <div className="lg:hidden">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <button className="btn-ghost inline-flex items-center gap-2" data-testid="mobile-filters-btn">
                    <SlidersHorizontal size={14} /> Filtres
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-ivory w-[85%] sm:w-[380px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="font-serif text-2xl text-left">Filtres</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8">
                    <Filters
                      maxPrice={maxPrice}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      inStock={inStock}
                      setInStock={setInStock}
                      onSale={onSale}
                      setOnSale={setOnSale}
                      onlyNew={onlyNew}
                      setOnlyNew={setOnlyNew}
                      onClear={clear}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Sort */}
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[220px] rounded-none border-charcoal/30 focus:ring-0 text-xs uppercase tracking-[0.15em]" data-testid="sort-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value} className="text-xs uppercase tracking-[0.15em]">
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 xl:gap-16">
          {/* Desktop filters */}
          <aside className="hidden lg:block" data-testid="desktop-filters">
            <Filters
              maxPrice={maxPrice}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStock={inStock}
              setInStock={setInStock}
              onSale={onSale}
              setOnSale={setOnSale}
              onlyNew={onlyNew}
              setOnlyNew={setOnlyNew}
              onClear={clear}
            />
          </aside>

          {/* Products grid */}
          <div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-charcoalLight mb-6">Aucun produit ne correspond à vos filtres.</p>
                <button onClick={clear} className="btn-secondary">Réinitialiser</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10" data-testid="collection-products-grid">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.handle} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
