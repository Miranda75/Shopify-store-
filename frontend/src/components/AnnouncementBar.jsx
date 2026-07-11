import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/lib/api";

const DISMISS_KEY = "lcm_announce_dismissed_v1";

export const AnnouncementBar = () => {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === "1");
  const { data: cms } = useQuery({ queryKey: ["cms-homepage"], queryFn: endpoints.cmsHomepage });

  useEffect(() => {
    if (dismissed) sessionStorage.setItem(DISMISS_KEY, "1");
  }, [dismissed]);

  const ann = cms?.announcement;
  if (!ann?.enabled || dismissed || !ann.message) return null;

  return (
    <div
      className="bg-charcoal text-ivory text-[11px] tracking-[0.24em] uppercase py-2.5 relative"
      data-testid="announcement-bar"
    >
      <div className="container-mx flex items-center justify-center gap-6">
        {ann.link ? (
          <Link to={ann.link} className="hover:text-gold transition-colors duration-300">
            {ann.message}
          </Link>
        ) : (
          <span>{ann.message}</span>
        )}
      </div>
      <button
        aria-label="Fermer l'annonce"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 hover:text-gold transition-colors"
        onClick={() => setDismissed(true)}
        data-testid="announcement-close-btn"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
