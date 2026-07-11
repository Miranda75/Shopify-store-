import { useState } from "react";
import { X } from "lucide-react";
import { useConsent } from "@/context/ConsentContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export const CookieBanner = () => {
  const { prefs, save, hasChosen } = useConsent();
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(prefs?.analytics ?? false);
  const [marketing, setMarketing] = useState(prefs?.marketing ?? false);

  if (hasChosen) return null;

  return (
    <>
      <div
        role="dialog"
        aria-labelledby="cookie-banner-title"
        className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-ivory border border-border shadow-2xl z-50 p-6 animate-fade-in-up"
        data-testid="cookie-banner"
      >
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <p className="overline text-gold">Cookies</p>
            <h3 id="cookie-banner-title" className="font-serif text-xl mt-2 leading-tight">
              Nous respectons votre vie privée
            </h3>
          </div>
        </div>
        <p className="text-sm text-charcoalLight leading-relaxed mb-5">
          Nous utilisons des cookies pour améliorer votre expérience, mesurer notre audience et
          personnaliser nos offres. Vous pouvez ajuster vos préférences à tout moment.
        </p>
        <div className="flex flex-col gap-2">
          <button
            className="btn-primary w-full"
            onClick={() => save({ analytics: true, marketing: true })}
            data-testid="cookie-accept-all-btn"
          >
            Tout accepter
          </button>
          <div className="flex gap-2">
            <button
              className="flex-1 text-xs uppercase tracking-[0.15em] py-3 border border-charcoal/30 hover:bg-charcoal hover:text-ivory transition-colors"
              onClick={() => save({ analytics: false, marketing: false })}
              data-testid="cookie-decline-btn"
            >
              Refuser
            </button>
            <button
              className="flex-1 text-xs uppercase tracking-[0.15em] py-3 border border-charcoal/30 hover:bg-charcoal hover:text-ivory transition-colors"
              onClick={() => setCustomize(true)}
              data-testid="cookie-customize-btn"
            >
              Personnaliser
            </button>
          </div>
        </div>
      </div>

      <Dialog open={customize} onOpenChange={setCustomize}>
        <DialogContent className="bg-ivory rounded-none border-none max-w-lg">
          <DialogTitle className="font-serif text-2xl">
            Préférences de confidentialité
          </DialogTitle>
          <p className="text-sm text-charcoalLight mt-1">
            Choisissez les catégories de cookies que vous souhaitez activer.
          </p>

          <div className="mt-6 space-y-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium">Essentiels</p>
                <p className="text-xs text-charcoalLight mt-1">
                  Requis au fonctionnement du site (panier, favoris, sécurité). Ne peuvent être
                  désactivés.
                </p>
              </div>
              <Switch checked disabled />
            </div>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium">Mesure d'audience</p>
                <p className="text-xs text-charcoalLight mt-1">
                  Nous aide à améliorer nos pages et parcours (Google Analytics).
                </p>
              </div>
              <Switch checked={analytics} onCheckedChange={setAnalytics} data-testid="cookie-analytics-switch" />
            </div>
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium">Marketing</p>
                <p className="text-xs text-charcoalLight mt-1">
                  Personnalisation des offres et publicités (Meta Pixel).
                </p>
              </div>
              <Switch checked={marketing} onCheckedChange={setMarketing} data-testid="cookie-marketing-switch" />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              className="btn-secondary flex-1"
              onClick={() => {
                save({ analytics: false, marketing: false });
                setCustomize(false);
              }}
            >
              Refuser tout
            </button>
            <button
              className="btn-primary flex-1"
              onClick={() => {
                save({ analytics, marketing });
                setCustomize(false);
              }}
              data-testid="cookie-save-preferences-btn"
            >
              Enregistrer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieBanner;
