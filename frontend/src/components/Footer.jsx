import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { endpoints } from "@/lib/api";
import Logo from "./Logo";

const LEGAL_LINKS = [
  { to: "/legal/mentions-legales", label: "Mentions légales" },
  { to: "/legal/cgv", label: "Conditions Générales de Vente" },
  { to: "/legal/confidentialite", label: "Politique de confidentialité" },
  { to: "/legal/retours", label: "Politique de retour" },
  { to: "/legal/cookies", label: "Gestion des cookies" },
  { to: "/contact", label: "Contactez-nous" },
];

const SHOP_LINKS = [
  { to: "/collections/maison", label: "Maison" },
  { to: "/collections/beaute", label: "Beauté" },
  { to: "/collections/accessoires", label: "Accessoires" },
  { to: "/collections/sport", label: "Sport" },
  { to: "/collections/electronique", label: "Électronique" },
];

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await endpoints.newsletter({ email, source: "footer" });
      toast.success(res.message || "Merci !");
      setEmail("");
    } catch {
      toast.error("Impossible d'enregistrer votre inscription.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-charcoal text-ivory mt-24" data-testid="site-footer">
      <div className="container-mx py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Logo variant="light" />
            <p className="mt-6 text-sm text-ivory/70 leading-relaxed max-w-xs">
              Une maison française dédiée aux objets d'exception : maison, beauté, accessoires,
              sport et électronique.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.24em] text-gold mb-6">Boutique</h4>
            <ul className="space-y-3 text-sm text-ivory/80">
              {SHOP_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.24em] text-gold mb-6">
              Informations légales
            </h4>
            <ul className="space-y-3 text-sm text-ivory/80">
              {LEGAL_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.24em] text-gold mb-6">Rejoignez-nous</h4>
            <p className="text-sm text-ivory/70 leading-relaxed mb-4">
              Nouveautés, éditos et invitations privées.
            </p>
            <form onSubmit={onSubscribe} className="flex flex-col gap-4" data-testid="footer-newsletter-form">
              <input
                type="email"
                required
                placeholder="Votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-b border-ivory/30 focus:border-gold focus:outline-none py-3 text-sm placeholder:text-ivory/40 text-ivory transition-colors"
                data-testid="footer-newsletter-input"
              />
              <button
                type="submit"
                disabled={submitting}
                className="self-start text-xs tracking-[0.2em] uppercase text-ivory border-b border-gold pb-1 hover:text-gold transition-colors disabled:opacity-50"
                data-testid="footer-newsletter-submit"
              >
                {submitting ? "…" : "S'inscrire"}
              </button>
            </form>

            <div className="mt-8">
              <p className="text-[10px] uppercase tracking-[0.24em] text-ivory/50 mb-3">
                Paiement sécurisé
              </p>
              <div className="flex items-center gap-3 opacity-80">
                {["Visa", "MC", "PayPal", "Apple", "SSL"].map((t) => (
                  <span
                    key={t}
                    className="border border-ivory/25 px-2 py-1 text-[10px] tracking-[0.15em] uppercase text-ivory/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ivory/15 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ivory/50">
            © {new Date().getFullYear()} Le Choix de Miranda · Tous droits réservés
          </p>
          <p className="text-xs text-ivory/50">Fait avec soin à Paris</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
