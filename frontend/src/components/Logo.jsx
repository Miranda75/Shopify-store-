import { Link } from "react-router-dom";

/**
 * Le Choix de Miranda — gold monogram + serif wordmark on ivory.
 * SVG-only so it stays crisp on every DPR.
 */
export const Logo = ({ variant = "dark", withWordmark = true }) => {
  const stroke = variant === "light" ? "#F9F8F6" : "#1F1F1F";
  const gold = "#C9A227";
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-3 group"
      data-testid="logo-link"
      aria-label="Le Choix de Miranda — Accueil"
    >
      <svg
        width="42"
        height="42"
        viewBox="0 0 60 60"
        aria-hidden="true"
        className="transition-transform duration-500 group-hover:rotate-[-2deg]"
      >
        <circle cx="30" cy="30" r="28" fill="none" stroke={gold} strokeWidth="1.25" />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="Cormorant Garamond, serif"
          fontStyle="italic"
          fontWeight="500"
          fontSize="26"
          fill={gold}
          letterSpacing="-1"
        >
          LM
        </text>
      </svg>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className="font-serif text-[19px] tracking-tight"
            style={{ color: variant === "light" ? "#F9F8F6" : "#1F1F1F" }}
          >
            Le Choix de Miranda
          </span>
          <span
            className="text-[9px] tracking-[0.35em] uppercase mt-1"
            style={{ color: gold }}
          >
            Maison · Paris
          </span>
        </span>
      )}
    </Link>
  );
};

export default Logo;
