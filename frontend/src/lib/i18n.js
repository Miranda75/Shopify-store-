// Minimal in-house i18n. French by default; the map is structured so
// a second locale (English) can be added without code changes.
const dict = {
  fr: {
    nav: {
      shop: "Boutique",
      new: "Nouveautés",
      bestsellers: "Best-sellers",
      home: "Maison",
      beauty: "Beauté",
      accessories: "Accessoires",
      sport: "Sport",
      electronics: "Électronique",
      journal: "Journal",
      contact: "Contact",
      wishlist: "Favoris",
      cart: "Panier",
      search: "Rechercher",
      account: "Compte",
    },
    common: {
      loading: "Chargement…",
      error: "Une erreur est survenue.",
      empty: "Aucun résultat.",
      close: "Fermer",
      required: "Champ requis.",
    },
    home: {
      why_title: "Pourquoi Le Choix de Miranda",
      bestsellers: "Nos best-sellers",
      new_arrivals: "Nouveautés",
      reviews_title: "Ce qu'elles en disent",
      faq_title: "Questions fréquentes",
      newsletter_title: "Rejoignez notre cercle",
      newsletter_text:
        "Recevez en avant-première nos nouvelles collections, invitations privées et éditos.",
    },
    product: {
      add_to_cart: "Ajouter au panier",
      added: "Ajouté au panier",
      out_of_stock: "Épuisé",
      ttc_note: "Prix TTC · TVA incluse",
      delivery: "Livraison",
      returns: "Retours 14 jours",
      description: "Description",
      details: "Détails & entretien",
      shipping_returns: "Livraison & retours",
      related: "Vous aimerez aussi",
      quantity: "Quantité",
      in_stock: "En stock",
      low_stock: "Stock limité",
    },
    cart: {
      title: "Votre Panier",
      empty: "Votre panier est vide.",
      empty_cta: "Découvrir la boutique",
      subtotal: "Sous-total",
      checkout: "Passer à la caisse",
      shipping_note: "Frais de port et taxes calculés au paiement.",
      discount_code: "Code promo",
      apply: "Appliquer",
      free_shipping_reached: "Livraison offerte débloquée !",
      free_shipping_missing: (n) => `Plus que ${n} pour la livraison offerte.`,
    },
    footer: {
      customer_service: "Service client",
      about: "Maison",
      legal: "Informations légales",
      newsletter_placeholder: "Votre adresse e-mail",
      newsletter_cta: "S'inscrire",
      rights: "Tous droits réservés",
    },
    consent: {
      title: "Nous respectons votre vie privée",
      text: "Nous utilisons des cookies pour améliorer votre expérience, mesurer notre audience et personnaliser nos offres. Vous pouvez ajuster vos préférences à tout moment.",
      accept: "Tout accepter",
      decline: "Continuer sans accepter",
      customize: "Personnaliser",
      save: "Enregistrer mes préférences",
      essential: "Essentiels",
      essential_desc: "Requis au fonctionnement du site (panier, favoris).",
      analytics: "Mesure d'audience",
      analytics_desc: "Nous aide à améliorer nos pages et parcours.",
      marketing: "Marketing",
      marketing_desc: "Personnalisation des offres et publicités.",
    },
    filters: {
      title: "Filtres",
      price: "Prix",
      availability: "Disponibilité",
      in_stock: "En stock",
      sort: "Trier par",
      sort_featured: "Recommandés",
      sort_price_asc: "Prix croissant",
      sort_price_desc: "Prix décroissant",
      sort_new: "Nouveautés",
      clear: "Effacer",
    },
  },
};

export const t = (path, locale = "fr", ...args) => {
  const parts = path.split(".");
  let cur = dict[locale];
  for (const p of parts) {
    cur = cur?.[p];
    if (cur === undefined) return path;
  }
  return typeof cur === "function" ? cur(...args) : cur;
};
