import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";
import { endpoints } from "@/lib/api";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await endpoints.contact(form);
      toast.success("Merci ! Nous vous répondrons sous 24 heures ouvrées.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Impossible d'envoyer votre message. Merci de réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <div className="bg-beige">
        <div className="container-mx py-16 md:py-24 text-center">
          <p className="overline text-gold mb-4">Écrivez-nous</p>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight">Contact.</h1>
          <p className="text-sm text-charcoalLight max-w-lg mx-auto mt-6 leading-relaxed">
            Une question, une demande particulière ? Notre service client vous répond sous 24 heures ouvrées.
          </p>
        </div>
      </div>

      <div className="container-mx py-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
        <aside className="space-y-8">
          <div>
            <Mail size={20} strokeWidth={1.25} className="text-gold mb-3" />
            <p className="overline mb-2">E-mail</p>
            <a href="mailto:contact@lechoixdemiranda.fr" className="text-sm hover:text-gold transition-colors">
              contact@lechoixdemiranda.fr
            </a>
          </div>
          <div>
            <Phone size={20} strokeWidth={1.25} className="text-gold mb-3" />
            <p className="overline mb-2">Téléphone</p>
            <p className="text-sm">01 23 45 67 89</p>
            <p className="text-xs text-charcoalLight mt-1">Du lundi au vendredi, 9h-18h</p>
          </div>
          <div>
            <MapPin size={20} strokeWidth={1.25} className="text-gold mb-3" />
            <p className="overline mb-2">Adresse</p>
            <p className="text-sm">
              12 rue de la Paix<br />
              75002 Paris, France
            </p>
          </div>
        </aside>

        <form onSubmit={onSubmit} className="md:col-span-2 space-y-6" data-testid="contact-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="overline block mb-2" htmlFor="c-name">Nom complet</label>
              <input
                id="c-name"
                required
                type="text"
                value={form.name}
                onChange={onChange("name")}
                className="input-line"
                data-testid="contact-name"
              />
            </div>
            <div>
              <label className="overline block mb-2" htmlFor="c-email">E-mail</label>
              <input
                id="c-email"
                required
                type="email"
                value={form.email}
                onChange={onChange("email")}
                className="input-line"
                data-testid="contact-email"
              />
            </div>
          </div>
          <div>
            <label className="overline block mb-2" htmlFor="c-subject">Objet</label>
            <input
              id="c-subject"
              required
              type="text"
              value={form.subject}
              onChange={onChange("subject")}
              className="input-line"
              data-testid="contact-subject"
            />
          </div>
          <div>
            <label className="overline block mb-2" htmlFor="c-message">Message</label>
            <textarea
              id="c-message"
              required
              rows="6"
              value={form.message}
              onChange={onChange("message")}
              className="w-full bg-transparent border border-charcoal/30 focus:border-gold focus:outline-none py-3 px-4 text-sm placeholder:text-charcoalLight/60 transition-colors resize-none"
              data-testid="contact-message"
            />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={submitting} className="btn-primary" data-testid="contact-submit">
              {submitting ? "Envoi…" : "Envoyer le message"}
            </button>
          </div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-charcoalLight">
            Les données recueillies sont utilisées uniquement pour répondre à votre demande.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Contact;
