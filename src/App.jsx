import { useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  MousePointerClick,
  Mail,
  Smile,
  ChevronLeft,
  ChevronRight,
  X,
  XCircle,
  CalendarDays,
} from "lucide-react";

/**
 * SOCIQL — Site vitrine premium (React + Tailwind + Framer Motion)
 * FINAL: pas de prix, CTAs -> Cal.com
 */

// ===== Helpers & constants =====
if (typeof window !== "undefined") {
  document.documentElement.style.scrollBehavior = "smooth";
}
const reveal = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const hoverPop = "transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]";
const easeIn = [0.16, 1, 0.3, 1];
const easeOut = [0.4, 0, 1, 1];

// GOLD palette
const GOLD = {
  border: "#D4AF37",
  glow: "rgba(212,175,55,0.35)",
  text: "#3A2D00",
  from: "#FFF6D0",
  mid: "#F4DE8A",
  to: "#D4AF37",
};

const CAL_URL = "https://cal.com/sociql/consulting";
const openCalendar = () => window.open(CAL_URL, "_blank", "noopener,noreferrer");

function headerOffset() {
  const header = document.querySelector("header");
  return header ? header.offsetHeight + 8 : 0;
}
function smoothScrollToId(id) {
  const el = document.getElementById(id); if (!el) return;
  const rect = el.getBoundingClientRect();
  const top = window.scrollY + rect.top - headerOffset();
  window.scrollTo({ top, behavior: "smooth" });
}

// ===== Material Icon helper =====
function MI({ name, className = "" }) {
  return <span className={`material-symbols-rounded align-middle ${className}`}>{name}</span>;
}

// ===== Logo =====
function Logo({ className = "h-9 md:h-10" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 64 64" fill="none" aria-hidden>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A0A0A" />
            <stop offset="1" stopColor="#2B2B2B" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#g)" />
        <path d="M20 38c8-2 12-14 12-14s4 12 12 14c-5 4-12 8-12 8s-7-4-12-8Z" fill="white" />
      </svg>
      <span className="font-semibold tracking-tight text-2xl md:text-3xl">SOCIQL</span>
    </div>
  );
}

// ===== Smooth anchor link =====
function SmoothLink({ href, className = "", children, onFocus }) {
  const onClick = (e) => { if (!href?.startsWith("#")) return; e.preventDefault(); smoothScrollToId(href.slice(1)); };
  return <a href={href} onClick={onClick} onFocus={onFocus} className={className}>{children}</a>;
}

// ===== PillNav (desktop) =====
function PillNav({ active, setActive }) {
  const tabs = useMemo(() => [
    { key: "realisations", label: "Nos réalisations", icon: "photo_library" },
    { key: "process", label: "Notre process", icon: "workflow" },
    { key: "comparatif", label: "Comparatif", icon: "table" },
    { key: "faq", label: "FAQ", icon: "help" },
    { key: "offres", label: "Offres", icon: "sell" },
  ], []);

  const barRef = useRef(null);
  const btnRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const measure = () => {
    const bar = barRef.current; if (!bar) return;
    const btn = btnRefs.current[active]; if (!btn) return;
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({ left: btnRect.left - barRect.left, width: btnRect.width });
  };

  useLayoutEffect(measure, [active]);
  useEffect(() => {
    const ro = new ResizeObserver(measure); if (barRef.current) ro.observe(barRef.current);
    const onResize = () => measure();
    window.addEventListener("resize", onResize); window.addEventListener("orientationchange", onResize);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(measure); }
    return () => { ro.disconnect(); window.removeEventListener("resize", onResize); window.removeEventListener("orientationchange", onResize); };
  }, []);

  const onTabClick = (key) => { setActive(key); smoothScrollToId(key); };

  return (
    <div className="relative w-full" data-role="pillnav">
      <div
        ref={barRef}
        className="relative mx-auto flex items-center gap-2 rounded-full border bg-white/85 backdrop-blur px-2 py-2 shadow-sm overflow-x-auto no-scrollbar max-w-full"
        style={{ borderColor: GOLD.border }}
      >
        <motion.div
          data-pill-indicator
          className="absolute top-1 bottom-1 rounded-full shadow-sm"
          style={{ background: `linear-gradient(90deg, ${GOLD.from}, ${GOLD.to})`, boxShadow: `inset 0 0 0 1px ${GOLD.border}` }}
          initial={false}
          animate={{ left: indicator.left, width: indicator.width }}
          transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.7 }}
        />
        {tabs.map((t) => (
          <button
            key={t.key}
            ref={(el) => (btnRefs.current[t.key] = el)}
            data-tab={t.key}
            onClick={() => onTabClick(t.key)}
            className={`relative z-10 rounded-full px-5 py-2.5 text-sm leading-5 whitespace-nowrap outline-none inline-flex items-center gap-2 ${active === t.key ? "text-black font-semibold" : "text-neutral-700 hover:text-black"}`}
            aria-current={active === t.key ? "page" : undefined}
            type="button"
          >
            <MI name={t.icon} className="text-[18px]" />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== CTA / Badges =====
function CTA({ children, href, onClick, className = "" }) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium border bg-black text-white w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    hoverPop +
    (className ? ` ${className}` : "");
  const style = { borderColor: "#111", boxShadow: `0 6px 22px ${GOLD.glow}` };
  return onClick ? (
    <button onClick={onClick} className={base} type="button" style={style}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </button>
  ) : (
    <SmoothLink href={href} className={base} style={style}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </SmoothLink>
  );
}
function Ghost({ children, href, onClick, className = "" }) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium border text-neutral-900 bg-white w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    hoverPop +
    (className ? ` ${className}` : "");
  const style = { borderColor: GOLD.border };
  return onClick ? (
    <button onClick={onClick} className={base} type="button" style={style}>
      {children}
    </button>
  ) : (
    <SmoothLink href={href} className={base} style={style}>
      {children}
    </SmoothLink>
  );
}
function Badge({ children, variant }) {
  const isGold = variant === "gold";
  const style = isGold
    ? { background: `linear-gradient(90deg, ${GOLD.from}, ${GOLD.mid})`, borderColor: GOLD.border, color: GOLD.text, boxShadow: `0 6px 18px ${GOLD.glow}` }
    : {};
  return (
    <span
      style={style}
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs uppercase tracking-wider ${isGold ? "" : "border-neutral-200"}`}
    >
      <Sparkles className="h-3 w-3" /> {children}
    </span>
  );
}

// ===== Star rating =====
function StarRating({ value = 5 }) {
  const stars = [1, 2, 3, 4, 5].map((i) => {
    const diff = value - i + 1;
    const fill = Math.max(0, Math.min(1, diff)) * 100;
    return (
      <span key={i} className="relative inline-block h-4 w-4" aria-hidden>
        <svg viewBox="0 0 24 24" className="absolute inset-0 h-4 w-4 text-neutral-300">
          <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 3.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 17.8 6.8 19.8l1-5.9L3.5 9.7l5.9-.9L12 3.5z" />
        </svg>
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" style={{ color: GOLD.text }}>
            <path fill="currentColor" d="M12 3.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 17.8 6.8 19.8l1-5.9L3.5 9.7l5.9-.9L12 3.5z" />
          </svg>
        </div>
      </span>
    );
  });
  return <div className="flex items-center gap-0.5" aria-label={`${value}/5`}>{stars}</div>;
}

// ===== Plan card =====
function PlanCard({ name, description, features, notIncluded = [], highlighted, variant = "light", onBook }) {
  const isGold = highlighted;
  const isDark = variant === "dark";
  const base = `flex flex-col rounded-3xl border p-6 ${hoverPop}`;
  let className = `${base} bg-white`;
  let style = { borderColor: GOLD.border };
  if (isGold) {
    className = `${base} text-black`;
    style = { background: `linear-gradient(135deg, ${GOLD.from} 0%, ${GOLD.mid} 45%, ${GOLD.to} 100%)`, borderColor: GOLD.border, boxShadow: `0 10px 40px ${GOLD.glow}` };
  } else if (isDark) {
    className = `${base} text-white`;
    style = { background: `linear-gradient(135deg, #121212 0%, #1a1a1a 45%, #232323 100%)`, borderColor: "#1f1f1f" };
  }

  const fullList = [
    ...features.map((t) => ({ t, ok: true })),
    ...notIncluded.map((t) => ({ t, ok: false })),
  ];

  return (
    <motion.div variants={reveal} data-plan={name} className={className} style={style}>
      <div className="flex items-baseline justify-between">
        <h3 className="text-xl font-semibold">{name}</h3>
        {highlighted && <Badge variant="gold">Le plus populaire</Badge>}
      </div>
      {description && <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">{description}</p>}

      <ul className="mt-6 space-y-2">
        {fullList.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            {f.ok ? (
              <Check className="mt-0.5 h-4 w-4" style={isGold ? { color: GOLD.text } : {}} />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 text-red-500" />
            )}
            <span className={f.ok ? "" : "text-neutral-500 line-through"}>{f.t}</span>
          </li>
        ))}
      </ul>

      {onBook && (
        <button onClick={onBook} className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border bg-black text-white ${hoverPop}`} style={{ borderColor: "#111", boxShadow: `0 6px 22px ${GOLD.glow}` }}>
          <MI name="event" /> Prendre un rendez‑vous
        </button>
      )}
      <Ghost href="#devis" className="mt-3 px-4 py-2.5 text-sm">
        <MI name="request_quote" /> Demander un devis
      </Ghost>
    </motion.div>
  );
}

// ===== Projects carousel =====
function Projects() {
  const projects = [
    { key: "eyethic", title: "Eyethic — Optique", desc: "Boutique d'optique engagée.", img: "/projects/eyethic.jpg", fallback: "https://images.unsplash.com/photo-1520975922203-b94c3b6e3a17?q=80&w=1600&auto=format&fit=crop", href: "https://eyethic.com" },
    { key: "koaskin", title: "Koa Skin — Cosmétique", desc: "Beauté naturelle & performante.", img: "/projects/koaskin.jpg", fallback: "https://images.unsplash.com/photo-1585238342028-4bbc91a30fa2?q=80&w=1600&auto=format&fit=crop", href: "https://koaskin.fr" },
    { key: "mpj", title: "Mon Petit Jeu — Jeux", desc: "Fun & pédagogique.", img: "/projects/monpetitjeu.jpg", fallback: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop", href: "https://monpetitjeu.com/?pb=0" },
    { key: "essentielcar", title: "EssentielCar — Auto", desc: "Accessoires auto essentiels.", img: "/projects/essentielcar.jpg", fallback: "https://images.unsplash.com/photo-1549925887-74e6b51a9cdb?q=80&w=1600&auto=format&fit=crop", href: "https://www.essentielcar.com" },
  ];

  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const el = trackRef.current; if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect(); const center = rect.left + rect.width / 2; let best = 0; let bestD = Infinity;
        cardRefs.current.forEach((node, i) => { if (!node) return; const r = node.getBoundingClientRect(); const c = r.left + r.width / 2; const d = Math.abs(center - c); if (d < bestD) { bestD = d; best = i; } });
        setIndex(best);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    setTimeout(onScroll, 100);
    return () => { el.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const goto = (i) => { const node = cardRefs.current[i]; if (!node) return; node.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); };
  const prev = () => goto(Math.max(0, index - 1));
  const next = () => goto(Math.min(projects.length - 1, index + 1));

  return (
    <section id="realisations" className="py-16 border-t border-neutral-100 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2 variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-3xl md:text-4xl font-semibold">
          Nos réalisations
        </motion.h2>
        <p className="mt-3 text-neutral-700">Faites défiler ou utilisez les flèches. L’élément centré est mis en avant.</p>

        <div className="relative mt-8">
          <button onClick={prev} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white p-2 shadow hover:shadow-md" style={{ borderColor: GOLD.border }}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white p-2 shadow hover:shadow-md" style={{ borderColor: GOLD.border }}>
            <ChevronRight className="h-5 w-5" />
          </button>

          <div ref={trackRef} className="overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex gap-6 px-2 py-2">
              {projects.map((p, i) => (
                <motion.article
                  key={p.key}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="snap-center shrink-0 w-[85%] sm:w-[70%] lg:w-[55%] xl:w-[50%]"
                  animate={{ scale: i === index ? 1 : 0.9, opacity: i === index ? 1 : 0.7, filter: i === index ? "blur(0px)" : "blur(1.5px)" }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  onClick={() => goto(i)}
                >
                  <div className="rounded-3xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: GOLD.border }}>
                    <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100">
                      <img src={p.img} alt={p.title} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = p.fallback; }} />
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold">{p.title}</h3>
                      <p className="text-sm text-neutral-600">{p.desc}</p>
                      <a className="mt-2 inline-block text-sm underline underline-offset-4" href={p.href} target="_blank" rel="noreferrer">
                        Voir la version live ↗
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== FAQ Section =====
function FAQSection() {
  const items = [
    { q: "Comment vais‑je recevoir ma boutique ?", a: "Livraison via un espace client sécurisé (lien + accès). On vous remet les identifiants et un guide vidéo." },
    { q: "Que comprennent les cycles de révisions ?", a: "Corrections textuelles, ajustements UI, petits ajustements d’animations (dans la limite du forfait)." },
    { q: "Puis‑je proposer mes propres idées ?", a: "Bien sûr ! Nous co‑construisons la maquette et priorisons vos demandes selon l’impact conversion." },
    { q: "Combien de temps pour avoir du résultat ?", a: "Starter sous 72h, Pro 1–2 semaines, Elite 2–3 semaines selon la complexité et les contenus fournis." },
  ];
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold">Les questions fréquentes</h2>
          <p className="mt-4 text-neutral-700">Vous avez des questions supplémentaires ? Réservez un appel dès maintenant.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <CTA href="#offres">
              <MI name="sell" /> Je lance ma marque
            </CTA>
            <Ghost onClick={openCalendar}>Réserver un appel</Ghost>
          </div>
        </div>
        <div className="space-y-4">
          {items.map((it, i) => (
            <div key={i} className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: GOLD.border }}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                <span className="font-medium">{it.q}</span>
                <span className="h-8 w-8 rounded-full border grid place-items-center shadow-sm" style={{ borderColor: GOLD.border }}>
                  <MI name={open === i ? "remove" : "add"} />
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-4 text-neutral-700">
                    {it.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== Timeline =====
function ProcessTimeline() {
  const steps = [
    { t: "Onboarding simple & rapide", d: "Accès à votre espace client, formulaire de brief et checklist contenus.", k: 1 },
    { t: "Démarrage de la prestation", d: "Wireframe et moodboard. Alignement sur le message et la hiérarchie des infos.", k: 2 },
    { t: "Design UI/UX", d: "Création des maquettes (desktop/mobile) et micro‑interactions.", k: 3 },
    { t: "Intégration & animations", d: "Intégration React/Tailwind, animations Framer Motion, accessibilité.", k: 4 },
    { t: "Optimisations & SEO", d: "Charge rapide (images WebP, lazy), balises meta, analytics, données structurées.", k: 5 },
    { t: "Mise en ligne & handoff", d: "Connexion domaine, transfert accès + mini‑formation vidéo.", k: 6 },
  ];
  return (
    <section id="process" className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="text-3xl md:text-4xl font-semibold">
          Comment ça marche ?
        </motion.h2>
        <div className="relative mt-10">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px" style={{ background: GOLD.border }} />
          <ul className="space-y-8">
            {steps.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <li key={i} className={`relative md:flex ${left ? "justify-start" : "justify-end"}`}>
                  <span className="hidden md:block absolute top-6 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full" style={{ background: GOLD.mid, boxShadow: `0 0 0 2px ${GOLD.border}` }} />
                  <div className="md:w-[46%]">
                    <div className="rounded-3xl border p-6 shadow-sm bg-white" style={{ borderColor: GOLD.border }}>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border" style={{ borderColor: GOLD.border, background: GOLD.from, color: GOLD.text }}>
                          {s.k}
                        </span>
                        <h3 className="text-lg font-semibold">{s.t}</h3>
                      </div>
                      <p className="mt-3 text-neutral-700">{s.d}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ===== Legal Page =====
function LegalPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    ["mentions-legales", "cgu", "cgv", "confidentialite", "cookies"].forEach((id) =>
      document.getElementById(id)?.classList.add("scroll-mt-24")
    );
  }, []);
  return (
    <main className="py-16 bg-neutral-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold">Informations légales</h1>
          <Ghost
            onClick={() => {
              history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
          >
            ← Retour au site
          </Ghost>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <article id="mentions-legales" className="rounded-3xl border bg-white p-6" style={{ borderColor: GOLD.border }}>
            <h3 className="font-semibold">Mentions légales</h3>
            <div className="mt-2 text-sm text-neutral-700 space-y-2">
              <p>
                <strong>Éditeur :</strong> SociQl SAS, au capital de 10 000 €, siège social : 00 rue Exemple, 75000 Paris, France.
                <strong> SIREN :</strong> 000 000 000. <strong>TVA :</strong> FR00 000000000.
              </p>
              <p>
                <strong>Directeur de la publication :</strong> Nom Prénom. <strong>Contact :</strong> contact@sociql.example — +33 7 49 41 27 56.
              </p>
              <p>
                <strong>Hébergeur :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA (ou OVH SAS, 2 rue Kellermann, 59100 Roubaix, France).
              </p>
              <p>
                <strong>Propriété intellectuelle :</strong> l’ensemble des contenus du site (textes, visuels, logos, code) est protégé. Toute reproduction non autorisée est interdite.
              </p>
            </div>
          </article>
          <article id="cgu" className="rounded-3xl border bg-white p-6" style={{ borderColor: GOLD.border }}>
            <h3 className="font-semibold">Conditions d’utilisation (CGU)</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-1">
              <li>Objet : présentation des offres SociQl, demande de devis, prise de rendez-vous.</li>
              <li>Accès : le service est fourni « en l’état ». Disponibilité non garantie.</li>
              <li>Interdictions : intrusion, scraping massif, exploitation non autorisée du contenu.</li>
              <li>Liens externes : SociQl n’est pas responsable des sites tiers.</li>
              <li>Responsabilité : l’éditeur ne peut être tenu responsable des dommages indirects.</li>
            </ul>
          </article>
          <article id="cgv" className="rounded-3xl border bg-white p-6" style={{ borderColor: GOLD.border }}>
            <h3 className="font-semibold">Conditions Générales de Vente (CGV)</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-1">
              <li>Prestations : conception, intégration, mise en ligne et maintenance légère.</li>
              <li>Devis & commande : devis valable 30 jours. Commande effective après signature et acompte.</li>
              <li>Prix : HT, selon la formule choisie (Starter/Pro/Elite). Frais additionnels possibles (nom de domaine, services tiers).</li>
              <li>Paiement : via Stripe (carte, Apple Pay, Link). Acomptes 30–50 % selon projet.</li>
              <li>Livraison : délais indicatifs (72h à 3 semaines). Validation par livrables intermédiaires.</li>
              <li>Retouches : incluses selon la formule (7 à 60 jours), hors refontes majeures.</li>
              <li>Rétractation/annulation : selon la loi applicable (pro/consommateur) et l’avancement.</li>
              <li>Transfert de propriété : à complet paiement, le client obtient les droits d’usage convenus.</li>
            </ul>
          </article>
          <article id="confidentialite" className="rounded-3xl border bg-white p-6" style={{ borderColor: GOLD.border }}>
            <h3 className="font-semibold">Politique de confidentialité</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-1">
              <li>Données collectées : nom, email, téléphone, informations projet, données d’usage.</li>
              <li>Finalités : contact, devis, rendez-vous, facturation, amélioration du service.</li>
              <li>Base légale : exécution contractuelle, intérêt légitime, consentement pour prospection.</li>
              <li>Conservation : durée nécessaire + obligations légales. Sous-traitants conformes RGPD.</li>
              <li>Droits : accès, rectification, opposition, suppression à contact@sociql.example. Droit de réclamation : CNIL.</li>
            </ul>
          </article>
          <article id="cookies" className="rounded-3xl border bg-white p-6 md:col-span-2" style={{ borderColor: GOLD.border }}>
            <h3 className="font-semibold">Politique de cookies</h3>
            <p className="mt-2 text-sm text-neutral-700">
              Cookies techniques indispensables et mesure d’audience. Vous pouvez désactiver les cookies non essentiels depuis votre navigateur. Un bandeau de consentement peut être intégré sur demande.
            </p>
          </article>
          <article className="rounded-3xl border bg-white p-6 md:col-span-2" style={{ borderColor: GOLD.border }}>
            <h3 className="font-semibold">Droit applicable & médiation</h3>
            <p className="mt-2 text-sm text-neutral-700">
              Droit français. En cas de litige, recherche préalable d’une solution amiable. À défaut, compétence des tribunaux du ressort du siège de SociQl. Médiation de la consommation accessible selon profil.
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}

// ===== Main component =====
export default function SociQl() {
  const [submitted, setSubmitted] = useState(false);
  const [openModal] = useState(false); // reserved for future use
  const [activeTab, setActiveTab] = useState("realisations");
  const [route, setRoute] = useState(() => (typeof window !== "undefined" ? window.location.pathname : "/"));

  // Fonts
  useEffect(() => {
    const ensure = (id, href, rel = "stylesheet") => {
      if (document.getElementById(id)) return;
      const l = document.createElement("link");
      l.id = id; l.rel = rel; l.href = href; document.head.appendChild(l);
    };
    ensure("gfont-roboto", "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap");
    ensure("gfont-material", "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:wght@400;600&display=swap");
    document.documentElement.style.fontFamily = "Roboto, ui-sans-serif, system-ui, -apple-system, Segoe UI, Helvetica, Arial";
  }, []);

  useEffect(() => {
    ["offres", "comparatif", "process", "faq", "devis", "contact", "realisations"].forEach((id) =>
      document.getElementById(id)?.classList.add("scroll-mt-24")
    );
  }, [route]);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname || "/");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (route !== "/") return;
    const sections = ["realisations", "process", "comparatif", "faq", "offres"];
    const observers = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveTab(id); },
        { rootMargin: "-50% 0px -45% 0px", threshold: 0.01 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [route]);

  function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const headerRef = useRef(null);
    useLayoutEffect(() => {
      const setVar = () => {
        const h = headerRef.current?.offsetHeight || 80;
        document.documentElement.style.setProperty("--header-h", `${h}px`);
      };
      setVar();
      const ro = new ResizeObserver(setVar);
      if (headerRef.current) ro.observe(headerRef.current);
      window.addEventListener("resize", setVar);
      window.addEventListener("orientationchange", setVar);
      return () => { ro.disconnect(); window.removeEventListener("resize", setVar); window.removeEventListener("orientationchange", setVar); };
    }, []);

    const tabs = [
      { key: "realisations", label: "Nos réalisations" },
      { key: "process", label: "Notre process" },
      { key: "comparatif", label: "Comparatif" },
      { key: "faq", label: "FAQ" },
      { key: "offres", label: "Offres" },
    ];

    const go = (key) => { setActiveTab(key); smoothScrollToId(key); setMobileOpen(false); };

    return (
      <header ref={headerRef} className="sticky top-0 z-40 bg-transparent">
        <div className="pointer-events-none absolute inset-x-0 top-[-40px] h-24 opacity-70" aria-hidden>
          <div className="mx-auto h-full max-w-7xl rounded-full" style={{ background: `radial-gradient(60% 100% at 50% 0%, ${GOLD.glow} 0%, rgba(0,0,0,0) 60%)` }} />
        </div>
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="relative flex items-center justify-center rounded-full border bg-white/85 backdrop-blur-md px-5 py-4 md:px-6 md:py-3 shadow-sm overflow-hidden" style={{ borderColor: GOLD.border, minHeight: 68 }}>
            <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2">
              <Logo />
            </div>
            {route === "/" && (
              <nav className="hidden lg:flex w-full max-w-3xl justify-center">
                <PillNav active={activeTab} setActive={setActiveTab} />
              </nav>
            )}
            {route === "/" && (
              <div className="flex lg:hidden items-center gap-2 absolute right-3 md:right-4 top-1/2 -translate-y-1/2">
                <Ghost href="#offres" className="px-4 py-2 text-sm bg-white/80 backdrop-blur">
                  <MI name="sell" /> Offres
                </Ghost>
                <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} className="h-10 w-10 rounded-full border bg-white/90 backdrop-blur grid place-items-center shadow-sm" style={{ borderColor: GOLD.border }}>
                  <MI name={mobileOpen ? "close" : "add"} className="text-[20px]" />
                </button>
              </div>
            )}
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && route === "/" && (
            <>
              <motion.div className="fixed left-0 right-0 bottom-0 z-40" style={{ top: "var(--header-h, 80px)" }} initial={{ opacity: 0 }} animate={{ opacity: 1, backgroundColor: "rgba(0,0,0,0.3)" }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
              <motion.div className="fixed right-3 z-50 w-[92vw] max-w-sm rounded-3xl border bg-white shadow-2xl" style={{ top: "var(--header-h, 80px)", borderColor: GOLD.border }} initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.18, ease: easeIn }}>
                <div className="flex items-center justify-between p-4 pb-2">
                  <p className="text-xs font-semibold text-neutral-500">MENU</p>
                  <button onClick={() => setMobileOpen(false)} className="h-8 w-8 rounded-full border grid place-items-center" style={{ borderColor: GOLD.border }}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-4 pb-4">
                  <div className="divide-y" style={{ borderColor: GOLD.border }}>
                    {tabs.map((t, i) => (
                      <motion.button key={t.key} onClick={() => go(t.key)} className="w-full py-3 text-left flex items-center justify-between" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                        <span>{t.label}</span>
                        <span className="material-symbols-rounded">arrow_forward</span>
                      </motion.button>
                    ))}
                  </div>
                  <button onClick={() => { setMobileOpen(false); openCalendar(); }} className={`mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium border bg-black text-white ${hoverPop}`} style={{ borderColor: "#111", boxShadow: `0 6px 22px ${GOLD.glow}` }}>
                    <MI name="event" /> Contact / Devis
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    );
  }

  function Home() {
    return (
      <>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-24 left-1/2 h-72 w-[1200px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: GOLD.glow }} />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={reveal} className="max-w-3xl">
              <Badge variant="gold">Site vitrine premium</Badge>
              <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
                Vendez plus avec un site <span className="underline decoration-neutral-900">rapide</span>,
                <span className="underline decoration-neutral-900"> design</span> et
                <span className="underline decoration-neutral-900"> crédible</span>.
              </h1>
              <p className="mt-6 text-neutral-700 text-lg">
                SociQl conçoit des sites vitrines élégants et performants. Animations fluides, UX soignée, et intégration de paiement en quelques clics.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-[auto_auto] gap-3 max-w-xl">
                <CTA href="#devis"><MI name="request_quote" /> Devis gratuit</CTA>
                <Ghost href="#offres"><MI name="sell" /> Voir les formules</Ghost>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-neutral-600">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Paiement sécurisé</div>
                <div className="flex items-center gap-2"><Zap className="h-4 w-4" /> Chargement ultra-rapide</div>
                <div className="flex items-center gap-2"><MousePointerClick className="h-4 w-4" /> Interactions au survol</div>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 border rounded-full px-4 py-2" style={{ borderColor: GOLD.border }}>
                  <StarRating value={4.7} />
                  <span className="font-medium">Moyenne 4.7/5</span>
                  <span className="text-neutral-600">(383 avis)</span>
                </div>
                <div className="flex items-center gap-2 border rounded-full px-4 py-2" style={{ borderColor: GOLD.border }}>
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">300 projets livrés</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Projects />

        <section id="offres" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="text-3xl md:text-4xl font-semibold">Nos offres</motion.h2>
            <p className="mt-3 text-neutral-700 max-w-2xl">Choisissez la formule qui convient : nous adaptons le périmètre, les pages et l'accompagnement selon vos objectifs.</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div variants={reveal} className={`flex flex-col rounded-3xl border p-6 bg-white ${hoverPop}`} style={{ borderColor: GOLD.border }}>
                <div className="flex items-baseline justify-between"><h3 className="text-xl font-semibold">Starter</h3></div>
                <p className="mt-2 text-sm text-neutral-600">Idéal pour lancer rapidement.</p>
                <ul className="mt-6 space-y-2">
                  {[
                    "2 pages incluses (Landing + Contact)",
                    "Design premium monochrome",
                    "Animations fluides au scroll",
                    "Formulaire de contact intégré",
                    "Mise en ligne rapide (sous 72h)",
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4" /> <span>{t}</span></li>
                  ))}
                  {["Blog complet", "E‑commerce", "Pack photos pro", "Nom de domaine & hébergement"].map((t, i) => (
                    <li key={`s-n-${i}`} className="flex items-start gap-2"><XCircle className="mt-0.5 h-4 w-4 text-red-500" /> <span className="text-neutral-500 line-through">{t}</span></li>
                  ))}
                </ul>
                <div className="mt-6" />
                <button onClick={openCalendar} className={`px-4 py-2.5 text-sm inline-flex items-center gap-2 rounded-full font-medium border bg-black text-white ${hoverPop}`} style={{ borderColor: "#111", boxShadow: `0 6px 22px ${GOLD.glow}` }}>
                  <MI name="event" /> Prendre un rendez‑vous
                </button>
                <Ghost href="#devis" className="mt-3 px-4 py-2.5 text-sm"><MI name="request_quote" /> Demander un devis</Ghost>
              </motion.div>

              <PlanCard
                name="Pro"
                description="Site vitrine 4 à 6 pages + blog léger."
                highlighted
                features={["Navigation fluide & responsive", "Performance & SEO de base", "Composants animés", "Support & retouches (30 jours)"]}
                notIncluded={["Rédaction longue (en option)", "Pack photos professionnel", "Nom de domaine & hébergement", "Multi‑langues avancé"]}
                onBook={openCalendar}
              />

              <PlanCard
                name="Elite"
                description="Site complet 4 à 6 pages + options avancées."
                variant="dark"
                features={["Comparateur d’offres avancé", "Animations Framer Motion", "Optimisations performance (Lighthouse)", "Support prioritaire (60 jours)"]}
                notIncluded={["Production vidéo", "Campagnes publicitaires", "Traductions multiples (en option)"]}
                onBook={openCalendar}
              />
            </div>
          </div>
        </section>

        <section id="comparatif" className="py-16 border-t bg-neutral-50" style={{ borderColor: GOLD.border }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="text-3xl md:text-4xl font-semibold">Comparatif des offres</motion.h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[720px]">
                <thead>
                  <tr className="border-b" style={{ borderColor: GOLD.border }}>
                    <th className="py-3">Fonctionnalités</th>
                    <th className="py-3">Starter</th>
                    <th className="py-3">Pro</th>
                    <th className="py-3">Elite</th>
                  </tr>
                </thead>
                <tbody className="[&>tr:nth-child(even)]:bg-white [&>tr:nth-child(odd)]:bg-neutral-50">
                  {[
                    { f: "Pages incluses", s: "2", p: "4-6", e: "4-6" },
                    { f: "Animations au scroll", s: "Basique", p: "Avancée", e: "Avancée+" },
                    { f: "Formulaire de devis", s: "Oui", p: "Oui", e: "Oui" },
                    { f: "E‑commerce", s: "—", p: "—", e: "—" },
                    { f: "Blog", s: "—", p: "Oui (léger)", e: "Oui (complet)" },
                    { f: "Support", s: "7 jours", p: "30 jours", e: "60 jours" },
                    { f: "Optimisation SEO", s: "Base", p: "Base+", e: "Complète" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b last:border-0" style={{ borderColor: GOLD.border }}>
                      <td className="py-3 font-medium">{row.f}</td>
                      <td className="py-3">{row.s}</td>
                      <td className="py-3">{row.p}</td>
                      <td className="py-3">{row.e}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <ProcessTimeline />

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="text-3xl md:text-4xl font-semibold">Ils recommandent SociQl</motion.h2>
              <div className="flex items-center gap-3 border rounded-2xl px-4 py-2" style={{ borderColor: GOLD.border }}>
                <StarRating value={4.7} />
                <span className="font-medium">4.7/5</span>
                <span className="text-neutral-600">sur 383 avis</span>
              </div>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Amine Bakkali", text: "Site livré en 5 jours, propre et rapide.", rating: 5 },
                { name: "Sarah Dupont", text: "UX nickel, j'ai gagné en conversions.", rating: 4.5 },
                { name: "Yanis Lemaire", text: "Très pro, super réactifs.", rating: 4 },
                { name: "Lina Benali", text: "Design premium, animations propres.", rating: 5 },
                { name: "Hugo Martin", text: "Mise en ligne sans prise de tête.", rating: 4.5 },
                { name: "Mélissa Cohen", text: "Accompagnement clair, résultats au rendez-vous.", rating: 5 },
              ].map((r, i) => (
                <motion.div key={i} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className={`rounded-3xl border p-6 bg-white ${hoverPop}`} style={{ borderColor: GOLD.border }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3"><Smile className="h-6 w-6" /><p className="font-medium">{r.name}</p></div>
                    <StarRating value={r.rating} />
                  </div>
                  <p className="mt-3 text-neutral-700">“{r.text}”</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="devis" className="py-16 border-t bg-neutral-50" style={{ borderColor: GOLD.border }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal} className="text-3xl md:text-4xl font-semibold">Devis gratuit — 1ère page offerte</motion.h2>
            <p className="mt-3 text-neutral-700 max-w-3xl">Remplis tes coordonnées et décris ton projet. Nous offrons la première page pour lancer ta présence en ligne.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Merci ! Votre demande a été envoyée (démo).'); }} className="mt-8 grid gap-4 rounded-3xl border bg-white p-6 md:grid-cols-2" style={{ borderColor: GOLD.border }}>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Nom complet</span>
                <input required placeholder="Votre nom" className="h-11 rounded-xl border border-neutral-300 px-4 outline-none focus:ring-2 focus:ring-black" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium">Email</span>
                <input required type="email" placeholder="vous@exemple.com" className="h-11 rounded-xl border border-neutral-300 px-4 outline-none focus:ring-2 focus:ring-black" />
              </label>
              <label className="md:col-span-2 flex flex-col gap-2">
                <span className="text-sm font-medium">Votre projet</span>
                <textarea required placeholder="Parlez-nous de votre activité et de vos objectifs…" className="min-h-[120px] rounded-xl border border-neutral-300 p-4 outline-none focus:ring-2 focus:ring-black" />
              </label>
              <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                <button type="submit" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium border bg-black text-white ${hoverPop}`} style={{ borderColor: "#111", boxShadow: `0 6px 22px ${GOLD.glow}` }}>
                  <Mail className="h-4 w-4" /> Envoyer ma demande
                </button>
                <button type="button" onClick={openCalendar} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium border bg-white text-black ${hoverPop}`} style={{ borderColor: GOLD.border }}>
                  <CalendarDays className="h-4 w-4" /> Ouvrir l’agenda
                </button>
                <span className="text-sm text-neutral-600">Réponse sous 24h ouvrées.</span>
              </div>
            </form>
          </div>
        </section>

        <FAQSection />
      </>
    );
  }

  function Footer() {
    const legalLink = (hash) => () => {
      history.pushState({}, "", "/legal" + (hash ? `#${hash}` : ""));
      window.dispatchEvent(new PopStateEvent("popstate"));
      setTimeout(() => { if (hash) { const el = document.getElementById(hash); el?.scrollIntoView({ behavior: "smooth", block: "start" }); } }, 50);
    };
    return (
      <footer id="contact" className="border-t py-12" style={{ borderColor: GOLD.border }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Logo />
          <p className="text-sm text-neutral-600">© {new Date().getFullYear()} SociQl — Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="tel:+33749412756" className="rounded-full border px-4 py-2 text-sm" style={{ borderColor: GOLD.border }}><MI name="call" /> +33 7 49 41 27 56</a>
            <Ghost href="#devis"><MI name="request_quote" /> Devis</Ghost>
            <Ghost href="#offres"><MI name="sell" /> Offres</Ghost>
            <Ghost onClick={legalLink()}><MI name="gavel" /> Légal</Ghost>
          </div>
        </div>
        <div className="mt-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-xs text-neutral-600">
          <div className="flex flex-wrap gap-4">
            <button onClick={legalLink("mentions-legales")} className="underline underline-offset-4">Mentions légales</button>
            <button onClick={legalLink("cgu")} className="underline underline-offset-4">CGU</button>
            <button onClick={legalLink("cgv")} className="underline underline-offset-4">CGV</button>
            <button onClick={legalLink("confidentialite")} className="underline underline-offset-4">Confidentialité</button>
            <button onClick={legalLink("cookies")} className="underline underline-offset-4">Cookies</button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <>
      <motion.div className="min-h-screen bg-white text-black" animate={openModal ? { scale: 0.985, opacity: 0.6, filter: "blur(1px)" } : { scale: 1, opacity: 1, filter: "none" }} transition={{ duration: 0.25, ease: easeIn }}>
        <Header />
        {route === "/" ? <Home /> : <LegalPage />}
        <Footer />
      </motion.div>
    </>
  );
}
