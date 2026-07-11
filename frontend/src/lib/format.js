// French number formatting: 45,00 €
const eur = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatEUR = (value) => {
  const n = typeof value === "string" ? parseFloat(value) : value || 0;
  return eur.format(n);
};

export const priceFromShopify = (moneyOrRange) => {
  if (!moneyOrRange) return 0;
  if (moneyOrRange.amount) return parseFloat(moneyOrRange.amount);
  if (moneyOrRange.minVariantPrice?.amount)
    return parseFloat(moneyOrRange.minVariantPrice.amount);
  return 0;
};

// Stable session id used for wishlist + consent when user isn't authenticated
export const getSessionId = () => {
  let id = localStorage.getItem("lcm_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("lcm_session_id", id);
  }
  return id;
};
