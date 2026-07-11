"""
Mock data mirroring the shape returned by the Shopify Storefront API.
When the Shopify token is provided (SHOPIFY_STOREFRONT_TOKEN in .env),
shopify.py will bypass this file and fetch live data from Shopify.
"""
from datetime import datetime, timezone


def _iso_now():
    return datetime.now(timezone.utc).isoformat()


COLLECTIONS = [
    {
        "id": "collection-maison",
        "handle": "maison",
        "title": "Maison",
        "description": "Objets et décoration pour sublimer votre intérieur.",
        "image": "https://images.unsplash.com/photo-1667312939978-64cf31718a6e?auto=format&fit=crop&w=1600&q=80",
    },
    {
        "id": "collection-beaute",
        "handle": "beaute",
        "title": "Beauté",
        "description": "Rituels de beauté et soins d'exception.",
        "image": "https://images.unsplash.com/photo-1613521076081-2820f9746a2d?auto=format&fit=crop&w=1600&q=80",
    },
    {
        "id": "collection-accessoires",
        "handle": "accessoires",
        "title": "Accessoires",
        "description": "L'élégance dans les moindres détails.",
        "image": "https://images.unsplash.com/photo-1664076458686-3449062080ac?auto=format&fit=crop&w=1600&q=80",
    },
    {
        "id": "collection-sport",
        "handle": "sport",
        "title": "Sport",
        "description": "Performance et style, sans compromis.",
        "image": "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80",
    },
    {
        "id": "collection-electronique",
        "handle": "electronique",
        "title": "Électronique",
        "description": "Technologie raffinée pour un quotidien connecté.",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
    },
]


def _product(handle, title, price_ttc, images, collections, description, variants=None, tags=None, compare_at=None, stock=25):
    return {
        "id": f"product-{handle}",
        "handle": handle,
        "title": title,
        "description": description,
        "descriptionHtml": f"<p>{description}</p>",
        "vendor": "Le Choix de Miranda",
        "productType": collections[0] if collections else "",
        "tags": tags or [],
        "images": images,
        "collections": collections,
        "priceRange": {
            "minVariantPrice": {"amount": str(price_ttc), "currencyCode": "EUR"},
            "maxVariantPrice": {"amount": str(price_ttc), "currencyCode": "EUR"},
        },
        "compareAtPrice": {"amount": str(compare_at), "currencyCode": "EUR"} if compare_at else None,
        "availableForSale": stock > 0,
        "totalInventory": stock,
        "variants": variants or [
            {
                "id": f"variant-{handle}-default",
                "title": "Standard",
                "sku": handle.upper(),
                "price": {"amount": str(price_ttc), "currencyCode": "EUR"},
                "compareAtPrice": {"amount": str(compare_at), "currencyCode": "EUR"} if compare_at else None,
                "availableForSale": stock > 0,
                "quantityAvailable": stock,
                "selectedOptions": [{"name": "Style", "value": "Standard"}],
            }
        ],
        "options": [{"name": "Style", "values": ["Standard"]}],
        "metafields": {
            "delivery_days": "2-4 jours ouvrés",
            "return_days": "14",
            "made_in": "France",
        },
    }


PRODUCTS = [
    _product(
        "vase-porcelaine-ivoire",
        "Vase en porcelaine ivoire",
        89.00,
        [
            "https://images.unsplash.com/photo-1667312939978-64cf31718a6e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
        ],
        ["maison"],
        "Un vase minimaliste en porcelaine tournée main. Ses lignes épurées subliment un bouquet de saison ou une branche graphique.",
        compare_at=110.00,
        tags=["best-seller", "nouveau"],
    ),
    _product(
        "lampe-albatre",
        "Lampe d'appoint en albâtre",
        249.00,
        [
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
        ],
        ["maison"],
        "Une lampe sculpturale en albâtre naturel. Chaque pièce est unique, révélant des veinures singulières lorsqu'elle s'illumine.",
        tags=["nouveau"],
    ),
    _product(
        "plaid-cachemire",
        "Plaid en cachemire tissé",
        329.00,
        [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        ],
        ["maison"],
        "Cachemire des Hautes Terres tissé sur métier ancien. Une chaleur enveloppante, un tombé parfait.",
        tags=["best-seller"],
    ),
    _product(
        "serum-eclat",
        "Sérum éclat aux extraits floraux",
        68.00,
        [
            "https://images.unsplash.com/photo-1613521076081-2820f9746a2d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80",
        ],
        ["beaute"],
        "Un sérum lumineux formulé à partir d'extraits de rose de Damas et d'immortelle corse. Texture fluide, absorption immédiate.",
        tags=["best-seller", "nouveau"],
    ),
    _product(
        "parfum-jardin-secret",
        "Eau de parfum · Jardin Secret",
        145.00,
        [
            "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1200&q=80",
        ],
        ["beaute"],
        "Une composition olfactive rare : néroli, iris pâle et bois de santal. Un sillage discret et raffiné.",
        compare_at=170.00,
    ),
    _product(
        "creme-mains-oud",
        "Crème mains à l'oud",
        32.00,
        [
            "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
        ],
        ["beaute"],
        "Une crème riche et fondante, aux notes boisées d'oud et de vanille bourbon.",
    ),
    _product(
        "foulard-soie",
        "Foulard en soie imprimée",
        195.00,
        [
            "https://images.unsplash.com/photo-1601924582971-df3adcbdb8c9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=1200&q=80",
        ],
        ["accessoires"],
        "Soie sergée imprimée à Lyon. Un motif dessiné à la main par notre atelier, réédité en séries limitées.",
        tags=["best-seller"],
    ),
    _product(
        "sac-cuir-camel",
        "Sac en cuir camel",
        420.00,
        [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
        ],
        ["accessoires"],
        "Cuir pleine fleur tanné végétalement en Toscane. Une patine qui s'embellit avec le temps.",
        tags=["nouveau"],
    ),
    _product(
        "ceinture-cuir-tressee",
        "Ceinture en cuir tressé",
        128.00,
        [
            "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1200&q=80",
        ],
        ["accessoires"],
        "Un accessoire intemporel, tressé à la main, boucle laiton doré patiné.",
    ),
    _product(
        "tapis-yoga-lin",
        "Tapis de yoga en lin naturel",
        89.00,
        [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
        ],
        ["sport"],
        "Lin biologique et caoutchouc naturel. Une surface antidérapante et un toucher soyeux.",
        tags=["nouveau"],
    ),
    _product(
        "gourde-inox",
        "Gourde isotherme en inox brossé",
        45.00,
        [
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80",
        ],
        ["sport"],
        "Inox 18/8 double paroi. Conserve le froid 24 h et le chaud 12 h.",
        tags=["best-seller"],
    ),
    _product(
        "sneakers-blanc-casse",
        "Sneakers en cuir blanc cassé",
        189.00,
        [
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
        ],
        ["sport", "accessoires"],
        "Cuir de veau nappa, semelle vulcanisée. Un modèle épuré, sans artifice.",
        compare_at=220.00,
    ),
    _product(
        "casque-audio-cuir",
        "Casque audio · Édition cuir",
        349.00,
        [
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
        ],
        ["electronique"],
        "Réduction de bruit active, arceau en cuir grainé. Un design horloger pour une écoute immersive.",
        tags=["best-seller"],
    ),
    _product(
        "enceinte-bois-noyer",
        "Enceinte bluetooth en noyer",
        279.00,
        [
            "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80",
        ],
        ["electronique", "maison"],
        "Bois de noyer massif, tissu acoustique italien. Un son chaud, un objet à contempler.",
        tags=["nouveau"],
    ),
    _product(
        "montre-connectee-milanaise",
        "Montre connectée · Bracelet milanais",
        299.00,
        [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
        ],
        ["electronique", "accessoires"],
        "Boîtier acier poli, bracelet milanais tissé. La technologie au service du geste élégant.",
    ),
    _product(
        "bougie-parfumee-figue",
        "Bougie parfumée · Figuier de Provence",
        58.00,
        [
            "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=1200&q=80",
        ],
        ["maison", "beaute"],
        "Cire végétale, mèche coton. 60 heures de diffusion pour une fragrance ensoleillée.",
        tags=["best-seller", "nouveau"],
    ),
]


HOMEPAGE_CMS = {
    "announcement": {
        "enabled": True,
        "message": "Livraison offerte dès 80 € — Retours gratuits sous 14 jours",
        "link": "/collections/nouveautes",
    },
    "hero": {
        "eyebrow": "Nouvelle collection · Automne-Hiver",
        "headline": "L'Élégance Redéfinie.",
        "subtext": "Une sélection curée de pièces d'exception, pensées pour sublimer votre quotidien. Matières nobles, savoir-faire rares.",
        "cta_label": "Découvrir la collection",
        "cta_link": "/collections/nouveautes",
        "image": "https://images.pexels.com/photos/17228223/pexels-photo-17228223.jpeg?auto=compress&cs=tinysrgb&w=2000",
    },
    "featured_collections": [
        {"handle": "maison", "label": "Maison"},
        {"handle": "beaute", "label": "Beauté"},
        {"handle": "accessoires", "label": "Accessoires"},
        {"handle": "electronique", "label": "Électronique"},
    ],
    "why_choose_us": [
        {
            "icon": "sparkles",
            "title": "Sélection curée",
            "description": "Chaque pièce est choisie pour sa qualité, son histoire et son intemporalité.",
        },
        {
            "icon": "truck",
            "title": "Livraison soignée",
            "description": "Emballage éco-responsable, expédition sous 24 h, livraison 2 à 4 jours.",
        },
        {
            "icon": "shield-check",
            "title": "Paiement sécurisé",
            "description": "Transactions chiffrées SSL. Visa, Mastercard, PayPal, Apple Pay.",
        },
        {
            "icon": "rotate-ccw",
            "title": "Retours 14 jours",
            "description": "Un doute ? Retournez gratuitement votre commande sous 14 jours.",
        },
    ],
    "reviews": [
        {
            "author": "Camille D.",
            "location": "Paris",
            "rating": 5,
            "text": "Un service irréprochable et des pièces d'une élégance rare. Mon vase en porcelaine est devenu la signature de mon salon.",
        },
        {
            "author": "Léa M.",
            "location": "Lyon",
            "rating": 5,
            "text": "La qualité du cuir dépasse mes attentes. On sent le travail de l'artisan à chaque détail.",
        },
        {
            "author": "Antoine R.",
            "location": "Bordeaux",
            "rating": 5,
            "text": "Emballage magnifique, livraison rapide. Le sérum éclat est devenu incontournable dans ma routine.",
        },
    ],
    "faq": [
        {
            "question": "Quels sont les délais de livraison ?",
            "answer": "Les commandes passées avant 14 h sont expédiées le jour même. Livraison en France métropolitaine sous 2 à 4 jours ouvrés via Colissimo, Mondial Relay ou Chronopost.",
        },
        {
            "question": "Comment retourner un article ?",
            "answer": "Vous disposez de 14 jours à réception pour retourner votre commande. Les retours sont gratuits en France métropolitaine. Rendez-vous sur notre page « Politique de retour » pour la procédure complète.",
        },
        {
            "question": "Les prix affichés incluent-ils la TVA ?",
            "answer": "Oui, tous les prix sont affichés TTC (Toutes Taxes Comprises), TVA française incluse. Les frais de livraison sont calculés à l'étape suivante.",
        },
        {
            "question": "Puis-je modifier ou annuler ma commande ?",
            "answer": "Vous pouvez modifier ou annuler votre commande dans l'heure suivant sa validation en nous contactant à contact@lechoixdemiranda.fr.",
        },
        {
            "question": "Proposez-vous des cartes cadeaux ?",
            "answer": "Oui, nos cartes cadeaux numériques sont disponibles de 25 € à 500 € et sont valables 12 mois.",
        },
    ],
    "promo_block": {
        "eyebrow": "Édition limitée",
        "title": "L'atelier de l'hiver.",
        "text": "Découvrez notre capsule pensée pour les soirées longues et les matins feutrés. Cachemire tissé main, bougies parfumées, objets d'art de vivre.",
        "cta_label": "Explorer la capsule",
        "cta_link": "/collections/maison",
        "image": "https://images.unsplash.com/photo-1772442364436-6ee6e42302a2?auto=format&fit=crop&w=1600&q=80",
    },
}


def get_collections():
    return COLLECTIONS


def get_collection(handle):
    return next((c for c in COLLECTIONS if c["handle"] == handle), None)


def get_products_by_collection(handle):
    return [p for p in PRODUCTS if handle in p["collections"]]


def get_product(handle):
    return next((p for p in PRODUCTS if p["handle"] == handle), None)


def get_products_by_tag(tag):
    return [p for p in PRODUCTS if tag in (p.get("tags") or [])]


def all_products():
    return PRODUCTS


def get_cms():
    return HOMEPAGE_CMS
