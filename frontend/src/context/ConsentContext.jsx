import { createContext, useContext, useEffect, useState } from "react";
import { endpoints } from "@/lib/api";
import { getSessionId } from "@/lib/format";

const ConsentCtx = createContext(null);
export const useConsent = () => useContext(ConsentCtx);

const STORAGE_KEY = "lcm_consent_v1";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};

export const ConsentProvider = ({ children }) => {
  const [prefs, setPrefs] = useState(load);

  const save = (newPrefs) => {
    const full = { essential: true, ...newPrefs, savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    setPrefs(full);
    // Best-effort audit log; the UI never blocks on this
    endpoints
      .consent({
        sessionId: getSessionId(),
        essential: true,
        analytics: !!newPrefs.analytics,
        marketing: !!newPrefs.marketing,
      })
      .catch(() => {});
  };

  // Consent-gated analytics loaders (GA4 / Meta Pixel) — no-ops until env IDs are provided.
  useEffect(() => {
    if (!prefs?.analytics) return;
    const ga = process.env.REACT_APP_GA4_ID;
    if (ga && !window.__ga_loaded) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", ga, { anonymize_ip: true });
      window.__ga_loaded = true;
    }
  }, [prefs?.analytics]);

  useEffect(() => {
    if (!prefs?.marketing) return;
    const pixel = process.env.REACT_APP_META_PIXEL_ID;
    if (pixel && !window.__fbq_loaded) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', pixel);
      window.fbq('track', 'PageView');
      /* eslint-enable */
      window.__fbq_loaded = true;
    }
  }, [prefs?.marketing]);

  return (
    <ConsentCtx.Provider value={{ prefs, save, hasChosen: !!prefs }}>
      {children}
    </ConsentCtx.Provider>
  );
};
