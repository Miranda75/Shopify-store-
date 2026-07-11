"""
Le Choix de Miranda — FastAPI backend.

Responsibilities:
- Proxy Shopify Storefront API (falls back to mock data when no token set)
- Newsletter subscriptions (MongoDB, marketing-tool-ready)
- Wishlist persistence (guest-friendly via anonymous session id)
- Contact form
- Homepage CMS content
- SEO helpers (sitemap/robots minimal stubs) — expandable

All routes are exposed under the /api prefix (required for k8s ingress).
"""
import logging
import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

import shopify

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# --- Mongo ---
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# --- App ---
app = FastAPI(title="Le Choix de Miranda API", version="1.0.0")
api = APIRouter(prefix="/api")

logger = logging.getLogger("miranda")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")


# ---------- Utilities ----------

def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ---------- Health ----------

@api.get("/")
async def root():
    return {
        "app": "Le Choix de Miranda",
        "status": "ok",
        "shopify_live": shopify.LIVE,
        "shop_domain": shopify.SHOP_DOMAIN,
    }


# ---------- CMS: Homepage ----------

@api.get("/cms/homepage")
async def cms_homepage():
    return await shopify.fetch_homepage_cms()


@api.post("/cms/revalidate")
async def cms_revalidate():
    """Placeholder endpoint. In production this would purge a cache layer."""
    return {"revalidated": True, "at": _iso_now()}


# ---------- Catalog ----------

@api.get("/collections")
async def list_collections():
    return await shopify.list_collections()


@api.get("/collections/{handle}")
async def get_collection(handle: str):
    col = await shopify.fetch_collection(handle)
    if not col:
        raise HTTPException(404, "Collection introuvable")
    products = await shopify.fetch_products_by_collection(handle)
    return {"collection": col, "products": products}


@api.get("/products")
async def list_products(tag: Optional[str] = None):
    if tag:
        return await shopify.fetch_products_by_tag(tag)
    from mock_data import all_products
    return all_products()


@api.get("/products/{handle}")
async def get_product(handle: str):
    p = await shopify.fetch_product(handle)
    if not p:
        raise HTTPException(404, "Produit introuvable")
    # related: same collection, exclude self, max 4
    related = []
    if p.get("collections"):
        related = [r for r in await shopify.fetch_products_by_collection(p["collections"][0]) if r["handle"] != handle][:4]
    return {"product": p, "related": related}


@api.get("/search")
async def search(q: str = Query("", min_length=0, max_length=100)):
    return {"query": q, "results": await shopify.search_products(q)}


# ---------- Cart / Checkout handoff ----------

class CartItem(BaseModel):
    variantId: str
    quantity: int = Field(ge=1, le=99)


class CheckoutRequest(BaseModel):
    items: list[CartItem]
    discountCode: Optional[str] = None


@api.post("/checkout")
async def create_checkout(payload: CheckoutRequest):
    if not payload.items:
        raise HTTPException(400, "Panier vide")
    result = await shopify.create_checkout(
        [i.model_dump() for i in payload.items], payload.discountCode
    )
    return result


class ShippingEstimateRequest(BaseModel):
    subtotal: float
    postalCode: Optional[str] = None


@api.post("/shipping/estimate")
async def estimate_shipping(req: ShippingEstimateRequest):
    """Very simple estimator; real rates come from Shopify at checkout."""
    free_threshold = 80.0
    if req.subtotal >= free_threshold:
        return {"free": True, "amount": 0.0, "label": "Livraison offerte", "threshold": free_threshold}
    return {
        "free": False,
        "amount": 5.90,
        "label": "Colissimo · 2 à 4 jours",
        "threshold": free_threshold,
        "missing": round(free_threshold - req.subtotal, 2),
    }


# ---------- Newsletter ----------

class NewsletterSignup(BaseModel):
    model_config = ConfigDict(extra="ignore")
    email: EmailStr
    source: Optional[str] = "footer"


@api.post("/newsletter/subscribe")
async def newsletter_subscribe(payload: NewsletterSignup):
    email = payload.email.lower().strip()
    existing = await db.newsletter.find_one({"email": email}, {"_id": 0})
    if existing:
        return {"ok": True, "already": True, "message": "Vous êtes déjà inscrit(e)."}
    doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "source": payload.source,
        "createdAt": _iso_now(),
        "consent": True,
        "syncedTo": [],
    }
    await db.newsletter.insert_one(doc)
    return {"ok": True, "already": False, "message": "Merci ! Vous êtes bien inscrit(e)."}


# ---------- Wishlist ----------

class WishlistPayload(BaseModel):
    sessionId: str
    productHandle: str


@api.post("/wishlist/toggle")
async def wishlist_toggle(payload: WishlistPayload):
    existing = await db.wishlist.find_one(
        {"sessionId": payload.sessionId, "productHandle": payload.productHandle}
    )
    if existing:
        await db.wishlist.delete_one({"_id": existing["_id"]})
        return {"active": False}
    await db.wishlist.insert_one({
        "id": str(uuid.uuid4()),
        "sessionId": payload.sessionId,
        "productHandle": payload.productHandle,
        "createdAt": _iso_now(),
    })
    return {"active": True}


@api.get("/wishlist/{session_id}")
async def wishlist_list(session_id: str):
    items = await db.wishlist.find({"sessionId": session_id}, {"_id": 0}).to_list(200)
    handles = [i["productHandle"] for i in items]
    products = []
    for h in handles:
        p = await shopify.fetch_product(h)
        if p:
            products.append(p)
    return {"handles": handles, "products": products}


# ---------- Contact ----------

class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=4000)


@api.post("/contact")
async def contact(payload: ContactMessage):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["createdAt"] = _iso_now()
    doc["status"] = "new"
    await db.contact_messages.insert_one(doc)
    return {"ok": True, "message": "Merci, votre message a bien été envoyé."}


# ---------- Consent log (GDPR) ----------

class ConsentPayload(BaseModel):
    sessionId: str
    essential: bool = True
    analytics: bool = False
    marketing: bool = False


@api.post("/consent")
async def save_consent(payload: ConsentPayload):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["createdAt"] = _iso_now()
    await db.consent_log.insert_one(doc)
    return {"ok": True}


# ---------- Register router ----------
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def _shutdown():
    client.close()
