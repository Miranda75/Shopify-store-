import { useParams, Link } from "react-router-dom";
import { LEGAL_PAGES } from "@/data/legal";

const Legal = () => {
  const { slug } = useParams();
  const page = LEGAL_PAGES[slug];

  if (!page) {
    return (
      <div className="container-mx py-32 text-center">
        <h1 className="font-serif text-4xl">Page introuvable</h1>
        <Link to="/" className="btn-secondary mt-8 inline-flex">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div data-testid="legal-page">
      <div className="bg-beige">
        <div className="container-mx py-16 md:py-24 text-center">
          <p className="overline text-gold mb-4">Informations légales</p>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight">{page.title}</h1>
          <p className="text-xs uppercase tracking-[0.18em] text-charcoalLight mt-4">
            Dernière mise à jour : {page.lastUpdated}
          </p>
        </div>
      </div>

      <article className="container-mx py-16 max-w-3xl">
        {page.sections.map((s, idx) => (
          <section key={idx} className="mb-12">
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-4">{s.heading}</h2>
            <p className="text-charcoalLight leading-relaxed whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </article>
    </div>
  );
};

export default Legal;
