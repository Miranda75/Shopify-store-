import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Sparkles, Truck, ShieldCheck, RotateCcw, Star } from "lucide-react";
import { endpoints } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import { toast } from "sonner";

const ICONS = { sparkles: Sparkles, truck: Truck, "shield-check": ShieldCheck, "rotate-ccw": RotateCcw };

const Section = ({ children, className = "" }) => (
  <section className={`container-mx py-20 md:py-28 ${className}`}>{children}</section>
);

const Home = () => {
  const { data: cms } = useQuery({ queryKey: ["cms-homepage"], queryFn: endpoints.cmsHomepage });
  const { data: collections } = useQuery({ queryKey: ["collections"], queryFn: endpoints.collections });
  const { data: bestSellers } = useQuery({
    queryKey: ["products", "best-seller"],
    queryFn: () => endpoints.productsByTag("best-seller"),
  });
  const { data: newArrivals } = useQuery({
    queryKey: ["products", "nouveau"],
    queryFn: () => endpoints.productsByTag("nouveau"),
  });

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await endpoints.newsletter({ email, source: "home" });
      toast.success(res.message || "Merci !");
      setEmail("");
    } catch {
      toast.error("Impossible de vous inscrire pour le moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const hero = cms?.hero;
  const promo = cms?.promo_block;

  return (
    <div data-testid="home-page">
      {/* Hero */}
      {hero && (
        <section className="relative overflow-hidden bg-beige" data-testid="hero-section">
          <div className="container-mx grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 py-16 md:py-24 items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              {hero.eyebrow && <p className="overline text-gold mb-6">{hero.eyebrow}</p>}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-charcoal">
                {hero.headline}
              </h1>
              <div className="divider-hair mt-8 mb-8" />
              <p className="text-base leading-relaxed text-charcoalLight max-w-md">
                {hero.subtext}
              </p>
              <Link to={hero.cta_link || "/"} className="btn-primary mt-10 inline-flex" data-testid="hero-cta">
                {hero.cta_label}
              </Link>
            </div>
            <div className="md:col-span-7 order-1 md:order-2 relative">
              <div className="aspect-[4/5] w-full overflow-hidden">
                <img
                  src={hero.image}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="hidden md:block absolute -bottom-6 -left-6 bg-ivory px-6 py-4 shadow-xl border border-border/40">
                <p className="overline text-gold">Fait à Paris</p>
                <p className="font-serif text-lg mt-1">Sélection curée · 2026</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured collections */}
      {collections && (
        <Section>
          <Reveal>
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <p className="overline text-gold mb-3">Nos univers</p>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Explorez la maison.</h2>
              </div>
              <p className="text-sm text-charcoalLight max-w-sm">
                Cinq univers, une même exigence : la beauté durable et l'authenticité.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6" data-testid="featured-collections-grid">
            {collections.map((c, idx) => (
              <Reveal key={c.handle} delay={idx * 60}>
                <Link
                  to={`/collections/${c.handle}`}
                  className="group block relative overflow-hidden aspect-[3/4] bg-beige"
                  data-testid={`featured-collection-${c.handle}`}
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/30 transition-colors duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                    <h3 className="font-serif text-2xl md:text-3xl text-ivory">{c.title}</h3>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-gold mt-2 inline-block">
                      Découvrir →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Best sellers */}
      {bestSellers && bestSellers.length > 0 && (
        <Section className="bg-ivory">
          <Reveal>
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="overline text-gold mb-3">Best-sellers</p>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
                  Les incontournables.
                </h2>
              </div>
              <Link to="/collections/maison" className="btn-ghost">Voir tout</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10" data-testid="bestsellers-grid">
            {bestSellers.slice(0, 4).map((p, idx) => (
              <Reveal key={p.handle} delay={idx * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Promo block */}
      {promo && (
        <section className="bg-beige" data-testid="promo-block">
          <div className="container-mx grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
            <div className="relative aspect-[4/3] md:aspect-auto min-h-[400px]">
              <img src={promo.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-10 md:p-20 flex flex-col justify-center">
              {promo.eyebrow && <p className="overline text-gold mb-6">{promo.eyebrow}</p>}
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-tight">
                {promo.title}
              </h2>
              <p className="text-base leading-relaxed text-charcoalLight mt-6 max-w-md">
                {promo.text}
              </p>
              <Link to={promo.cta_link} className="btn-secondary mt-10 self-start">
                {promo.cta_label}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* New arrivals */}
      {newArrivals && newArrivals.length > 0 && (
        <Section>
          <Reveal>
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <p className="overline text-gold mb-3">Nouveautés</p>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Fraîchement arrivés.</h2>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10" data-testid="new-arrivals-grid">
            {newArrivals.slice(0, 4).map((p, idx) => (
              <Reveal key={p.handle} delay={idx * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Why choose us */}
      {cms?.why_choose_us && (
        <section className="bg-beigeLight py-20 md:py-28" data-testid="why-choose-us">
          <div className="container-mx">
            <Reveal>
              <div className="text-center max-w-2xl mx-auto mb-16">
                <p className="overline text-gold mb-3">Pourquoi nous</p>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
                  Une expérience à la hauteur.
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {cms.why_choose_us.map((b, idx) => {
                const Icon = ICONS[b.icon] || Sparkles;
                return (
                  <Reveal key={b.title} delay={idx * 80}>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 border border-gold text-gold mb-6">
                        <Icon size={22} strokeWidth={1.25} />
                      </div>
                      <h3 className="font-serif text-xl mb-3">{b.title}</h3>
                      <p className="text-sm text-charcoalLight leading-relaxed">{b.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {cms?.reviews && (
        <Section>
          <Reveal>
            <div className="text-center max-w-xl mx-auto mb-14">
              <p className="overline text-gold mb-3">Elles nous font confiance</p>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
                Ce qu'elles en disent.
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10" data-testid="reviews-section">
            {cms.reviews.map((r, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="border border-border/60 p-8 bg-ivory h-full flex flex-col">
                  <div className="flex gap-1 text-gold mb-4">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-gold" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="font-serif text-lg leading-relaxed italic text-charcoal mb-6 flex-1">
                    « {r.text} »
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-charcoalLight">
                    {r.author} · {r.location}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Newsletter */}
      <section className="bg-charcoal text-ivory" data-testid="newsletter-section">
        <div className="container-mx py-20 md:py-28 text-center max-w-2xl mx-auto">
          <p className="overline text-gold mb-4">Le Cercle</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-ivory">
            Rejoignez notre cercle.
          </h2>
          <p className="text-sm text-ivory/70 mt-6 leading-relaxed">
            Nouvelles collections en avant-première, invitations privées et éditos livrés une fois
            par mois. Rien de plus.
          </p>
          <form
            onSubmit={onSubscribe}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            data-testid="home-newsletter-form"
          >
            <input
              type="email"
              required
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-b border-ivory/30 focus:border-gold focus:outline-none py-3 text-sm placeholder:text-ivory/40 text-ivory transition-colors"
              data-testid="home-newsletter-input"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-gold text-ivory px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-goldDark transition-colors disabled:opacity-50"
              data-testid="home-newsletter-submit"
            >
              {submitting ? "…" : "S'inscrire"}
            </button>
          </form>
          <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/40 mt-4">
            Désinscription en un clic
          </p>
        </div>
      </section>

      {/* FAQ */}
      {cms?.faq && (
        <Section>
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <p className="overline text-gold mb-3">Vos questions</p>
                <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
                  Questions fréquentes.
                </h2>
              </div>
            </Reveal>
            <Accordion type="single" collapsible className="border-t border-border/60" data-testid="faq-section">
              {cms.faq.map((q, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border/60">
                  <AccordionTrigger className="font-serif text-lg text-left hover:no-underline hover:text-gold py-6" data-testid={`faq-trigger-${idx}`}>
                    {q.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-charcoalLight leading-relaxed pb-6">
                    {q.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Section>
      )}
    </div>
  );
};

export default Home;
