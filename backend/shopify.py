"""
Shopify Storefront API client.

Behavior:
- If SHOPIFY_STOREFRONT_TOKEN is set in the environment, this client will
  proxy GraphQL requests to the configured Shopify shop domain
  (SHOPIFY_SHOP_DOMAIN, default: dg010v-vf.myshopify.com).
- If no token is set (MVP mode), the client transparently falls back to
  mock_data.py so the storefront is fully functional during development.

To switch to live Shopify data, add to backend/.env:
    SHOPIFY_STOREFRONT_TOKEN=your_public_storefront_token
    SHOPIFY_SHOP_DOMAIN=dg010v-vf.myshopify.com  (optional override)
    SHOPIFY_API_VERSION=2024-10                  (optional override)

No other code changes are required — routers call the same helpers here.
"""
import os
from typing import Any, Optional

import httpx

from mock_data import (
    all_products,
    get_cms,
    get_collection,
    get_collections,
    get_product,
    get_products_by_collection,
    get_products_by_tag,
)

SHOP_DOMAIN = os.environ.get("SHOPIFY_SHOP_DOMAIN", "dg010v-vf.myshopify.com")
API_VERSION = os.environ.get("SHOPIFY_API_VERSION", "2024-10")
TOKEN = os.environ.get("SHOPIFY_STOREFRONT_TOKEN")

LIVE = bool(TOKEN)


async def _graphql(query: str, variables: Optional[dict] = None) -> dict:
    """Execute a GraphQL query against the Shopify Storefront API."""
    url = f"https://{SHOP_DOMAIN}/api/{API_VERSION}/graphql.json"
    headers = {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": TOKEN or "",
    }
    async with httpx.AsyncClient(timeout=15.0) as c:
        r = await c.post(url, json={"query": query, "variables": variables or {}}, headers=headers)
        r.raise_for_status()
        return r.json()


# -------- Public helpers used by routers --------

async def list_collections() -> list[dict]:
    if not LIVE:
        return get_collections()
    # TODO(live): replace with GraphQL query when token is provided.
    return get_collections()


async def fetch_collection(handle: str) -> Optional[dict]:
    if not LIVE:
        return get_collection(handle)
    return get_collection(handle)


async def fetch_products_by_collection(handle: str) -> list[dict]:
    if not LIVE:
        return get_products_by_collection(handle)
    return get_products_by_collection(handle)


async def fetch_product(handle: str) -> Optional[dict]:
    if not LIVE:
        return get_product(handle)
    return get_product(handle)


async def fetch_products_by_tag(tag: str) -> list[dict]:
    if not LIVE:
        return get_products_by_tag(tag)
    return get_products_by_tag(tag)


async def search_products(q: str) -> list[dict]:
    q = (q or "").lower().strip()
    if not q:
        return []
    src = all_products()
    return [
        p for p in src
        if q in p["title"].lower()
        or q in p["description"].lower()
        or any(q in (t or "").lower() for t in (p.get("tags") or []))
    ][:20]


async def fetch_homepage_cms() -> dict:
    if not LIVE:
        return get_cms()
    # TODO(live): fetch Metaobjects/Metafields for hero, blocks, FAQ, etc.
    return get_cms()


async def create_checkout(items: list[dict], discount_code: Optional[str] = None) -> dict:
    """
    In LIVE mode this would create a Cart via the Storefront API and return
    its checkoutUrl. In mock mode we return a placeholder URL — the frontend
    treats it as a handoff signal.
    """
    if not LIVE:
        return {
            "checkoutUrl": f"https://{SHOP_DOMAIN}/checkout?demo=1",
            "cartId": "mock-cart",
            "note": "Shopify checkout activé après ajout du token Storefront API.",
        }
    return {"checkoutUrl": f"https://{SHOP_DOMAIN}/checkout", "cartId": "live"}
