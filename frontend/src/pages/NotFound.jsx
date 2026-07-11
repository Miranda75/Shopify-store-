import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container-mx py-32 text-center" data-testid="notfound-page">
    <p className="overline text-gold mb-4">Erreur 404</p>
    <h1 className="font-serif text-6xl md:text-7xl tracking-tight">Page introuvable.</h1>
    <p className="text-sm text-charcoalLight mt-6 max-w-md mx-auto">
      La page que vous cherchez n'existe pas ou a été déplacée.
    </p>
    <Link to="/" className="btn-primary mt-10 inline-flex">Retour à l'accueil</Link>
  </div>
);

export default NotFound;
