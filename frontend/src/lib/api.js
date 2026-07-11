import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export const endpoints = {
  cmsHomepage: () => api.get("/cms/homepage").then((r) => r.data),
  collections: () => api.get("/collections").then((r) => r.data),
  collection: (handle) => api.get(`/collections/${handle}`).then((r) => r.data),
  product: (handle) => api.get(`/products/${handle}`).then((r) => r.data),
  productsByTag: (tag) => api.get("/products", { params: { tag } }).then((r) => r.data),
  search: (q) => api.get("/search", { params: { q } }).then((r) => r.data),
  checkout: (payload) => api.post("/checkout", payload).then((r) => r.data),
  shippingEstimate: (payload) => api.post("/shipping/estimate", payload).then((r) => r.data),
  newsletter: (payload) => api.post("/newsletter/subscribe", payload).then((r) => r.data),
  wishlistToggle: (payload) => api.post("/wishlist/toggle", payload).then((r) => r.data),
  wishlistList: (sessionId) => api.get(`/wishlist/${sessionId}`).then((r) => r.data),
  contact: (payload) => api.post("/contact", payload).then((r) => r.data),
  consent: (payload) => api.post("/consent", payload).then((r) => r.data),
};
