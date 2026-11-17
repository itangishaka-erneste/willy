import { createContext, useContext, useEffect, useRef, useState } from 'react';
import logo from './assets/logo.PNG';
import { translate } from './translations.js';
import {
  Menu, X, ChevronDown, Layers, Cpu, BarChart3, GraduationCap, Mail, Phone, MapPin, Moon, Sun, Leaf,
  ArrowUpRight, Send, CheckCircle2, Award, Briefcase, BadgeCheck, Star,
} from 'lucide-react';

/* =====================================================================
   EDIT YOUR CONTENT HERE. Everything on the page reads from these lists.
   Colours: green #15803D and orange-red #FF4500 (see CSS block at bottom).
   Layout and style inspired by the Ingazi landing page: floating pill
   navbar, circular hero photo, curved section edges, overlapping images.
   ===================================================================== */
const LOGO = logo;
const LanguageContext = createContext('en');

function useTranslate() {
  const language = useContext(LanguageContext);
  return (text, values) => translate(text, language, values);
}

const CONTACT = {
  email: 'rel4dltd@gmail.com',
  phone: '+250 788 286 965',
  place: 'Kigali, Rwanda',
  tin: '121718400',
};

const HERO_IMAGE = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80';
const ABOUT_IMAGE_MAIN = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80';
const ABOUT_IMAGE_INSET = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80';

const STATS = [
  { value: 50, suffix: '+', label: 'Projects completed' },
  { value: 15, suffix: '+', label: 'Development sectors' },
  { value: 10, suffix: '+', label: 'Years of MERL experience' },
  { value: 3, label: 'Working languages · English, French & Kinyarwanda' },
];

const STEPS = ['Frame the question', 'Collect & analyse evidence', 'Learn & adapt'];

const SERVICES = [
  { id: 'model', icon: Layers, title: 'Model Building', color: 'orange',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    text: 'We help organisations develop the Theory of Change, results and logic frameworks, key performance indicators and complete M&E plans.',
    points: ['Theory of Change development', 'Results framework design', 'Custom indicator development', 'M&E plan creation'] },
  { id: 'systems', icon: Cpu, title: 'System Customization', color: 'green',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80',
    text: 'We customise efficient, robust systems for data collection, analytics and visualisation, using machine learning and artificial intelligence.',
    points: ['Data collection systems', 'Analytics dashboards', 'AI-powered insights', 'Real-time reporting'] },
  { id: 'research', icon: BarChart3, title: 'Research & Evaluation', color: 'orange',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    text: 'We apply scientific methods to run descriptive, predictive and prescriptive evaluations that measure real programme impact.',
    points: ['Baseline, midline and endline studies', 'Impact evaluations', 'Learning assessments', 'Predictive analytics'] },
  { id: 'capacity', icon: GraduationCap, title: 'Capacity Building', color: 'green',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    text: 'We build lasting capability and a culture of data-driven, evidence-based decision-making inside partner organisations.',
    points: ['Training programmes', 'Technical mentorship', 'Knowledge transfer', 'Tool development'] },
];

const EXPERTISE = [
  { title: 'Evaluation design', text: 'Baseline, midline, endline, impact evaluation, tracer studies, KAP surveys, OECD-DAC criteria and learning studies.' },
  { title: 'MERL systems', text: 'Theory of change, results frameworks, indicator matrices, M&E plans, data quality assurance and CLA processes.' },
  { title: 'Randomized evaluations', text: 'Sampling and sample size, treatment and comparison groups, SurveyCTO data collection, research integrity and reproducibility.' },
  { title: 'Econometrics', text: 'OLS, logit and probit, fixed and random effects, difference-in-differences, propensity score matching, RDD and instrumental variables.' },
  { title: 'Machine learning', text: 'Regularised regression, random forests, gradient boosting, SVM, clustering, PCA and predictive model validation.' },
  { title: 'Biostatistics & epidemiology', text: 'Survival analysis, Cox models, GLM and GEE, Poisson and negative binomial regression, cohort and case-control analysis.' },
];

const TOOLS = ['Stata', 'R', 'Python', 'SPSS', 'Atlas.ti', 'SurveyCTO', 'KoboToolbox', 'ODK', 'DHIS2', 'Tangerine', 'Excel'];

const EXPERIENCE = [
  { year: '2022 – Present', title: 'Monitoring & Evaluation Manager', org: 'Agahozo Shalom Youth Village',
    text: 'Uses propensity-score, nearest-neighbour and kernel matching to assess educational outcomes, and turns psychosocial, health, life-skills, financial-literacy and gender KAP data into planning priorities.',
    tags: ['Education', 'Impact evaluation', 'KAP studies'] },
  { year: '2021 – 2022', title: 'Technical Advisor, M&E – Health Workforce', org: 'Clinton Health Access Initiative',
    text: 'Designed the national health-workforce indicator matrix, evaluation plan and HRH information-system requirements.',
    tags: ['Health systems', 'Workforce', 'M&E systems'] },
  { year: '2018 – 2020', title: 'MERL Manager, USAID Twiyubake', org: 'Global Communities Rwanda',
    text: 'Led data management, quality assurance, analysis and reporting across six implementing partners and 12 districts, using panel-data and ordinal probit models.',
    tags: ['Vulnerable populations', 'SRHR / HIV', 'Graduation'] },
  { year: '2015 – 2018', title: 'MEAL Officer', org: 'Save the Children International Rwanda',
    text: 'Analysed EGRA, EGMA and IDELA data and supported baseline and outcome-study design, data-quality reviews and reporting.',
    tags: ['Early childhood', 'Literacy', 'Numeracy'] },
];

const CLIENTS = [
  { name: 'TradeMark Africa (via Right Seat)', years: '2025 – 2027', text: 'Baseline, endline, employment-traceability and employability analyses for programme reporting and learning.' },
  { name: 'Expertise France', years: '2025 – 2026', text: 'TVET baseline, indicators, reporting tools and practical systems for tracking programme performance.' },
  { name: 'StrategyHouse Denmark / SOS Children’s Villages', years: '2021 – 2026', text: 'Sampling design, SurveyCTO workflows and analysis of EGRA, EGMA, education and health data in R and Stata.' },
  { name: 'ThreeStones / Data4Impact / DUHAMIC-ADRI', years: '2023', text: 'Sampling, multivariate analysis, visualisation and reporting for USAID-funded health and youth studies.' },
];

const PROJECTS = [
  { id: 'p1', title: 'USAID Ingobyi Activity Endline Survey', category: 'Health',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    description: 'Comprehensive endline assessment of a health system strengthening programme across Rwanda’s healthcare facilities.' },
  { id: 'p2', title: 'Igire Ubaka Ejo Baseline Survey', category: 'Economic',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    description: 'Baseline data collection in Gasabo, Kayonza and Rusizi districts for an economic empowerment programme.' },
  { id: 'p3', title: 'DREAMS Baseline Survey', category: 'Education',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    description: 'Technical lead for the baseline assessment of a vulnerable-youth programme in Nyarugenge District.' },
];

const CREDENTIALS = [
  { icon: BadgeCheck, title: 'Registered consultancy', text: `TIN ${CONTACT.tin}, headquartered in Kigali, Rwanda.` },
  { icon: Award, title: 'USAID-funded programmes', text: 'Experience across multiple USAID-supported projects and partners.' },
  { icon: Briefcase, title: 'International partners', text: 'Delivered work for Expertise France, StrategyHouse, SOS Children’s Villages, TradeMark Africa and more.' },
];

const TRAINING = [
  'MIT: Data Analysis for Social Scientists; Designing and Running Randomized Evaluations (2026)',
  'King’s College London: Prediction Modelling for Health Research; R for Health Research (2025)',
  'WorldQuant University: Foundations of Financial Engineering (2025)',
  'Harvard T.H. Chan School of Public Health: Quantitative Methods for M&E (2019)',
  'Johns Hopkins / NIH: Biostatistics (2018)',
  'CDC TRAIN: Economic Evaluation in Public Health (2020)',
];

/* `ids` = the page sections that highlight this menu item while you scroll */
const NAV = [
  { label: 'Home', href: '#home', ids: ['home'] },
  { label: 'About', ids: ['about', 'mission', 'team'], children: [
    { label: 'Our story', href: '#about' },
    { label: 'Mission & vision', href: '#mission' },
    { label: 'Leadership', href: '#team' },
  ] },
  { label: 'Services', ids: ['services'], children: SERVICES.map((s) => ({ label: s.title, href: '#services' })) },
  { label: 'Expertise', href: '#expertise', ids: ['expertise'] },
  { label: 'Experience', href: '#experience', ids: ['experience'] },
  { label: 'Projects', href: '#projects', ids: ['projects'] },
  { label: 'Contact', href: '#contact', ids: ['contact'] },
];

const SECTION_IDS = ['home', 'about', 'mission', 'services', 'expertise', 'experience', 'projects', 'credentials', 'team', 'contact'];

const UI_COPY = {
  en: {
    label: 'English', chooseLanguage: 'Choose language', themeLight: 'Switch to light mode', themeDark: 'Switch to dark mode',
    nav: { Home: 'Home', About: 'About', Services: 'Services', Expertise: 'Expertise', Experience: 'Experience', Projects: 'Projects', Contact: 'Contact', 'Our story': 'Our story', 'Mission & vision': 'Mission & vision', Leadership: 'Leadership', 'Model Building': 'Model Building', 'System Customization': 'System Customization', 'Research & Evaluation': 'Research & Evaluation', 'Capacity Building': 'Capacity Building' },
    talk: 'Let’s talk', join: 'Join REL4D', marquee: ['Endline', 'Impact', 'MEL systems', 'Analytics', 'Learning', 'Capacity', 'Baseline', 'Endline'],
    contactTitle: 'Request a proposal', name: 'Full name', email: 'Email address', organization: 'Organization (optional)', service: 'Service interested in', details: 'Project details', send: 'Send request', sent: 'Your email app is opening with your message.', multipleServices: 'Multiple services',
  },
  fr: {
    label: 'Français', chooseLanguage: 'Choisir la langue', themeLight: 'Passer en mode clair', themeDark: 'Passer en mode sombre',
    nav: { Home: 'Accueil', About: 'À propos', Services: 'Services', Expertise: 'Expertise', Experience: 'Parcours', Projects: 'Projets', Contact: 'Contact', 'Our story': 'Notre histoire', 'Mission & vision': 'Mission et vision', Leadership: 'Direction', 'Model Building': 'Élaboration de modèles', 'System Customization': 'Personnalisation des systèmes', 'Research & Evaluation': 'Recherche et évaluation', 'Capacity Building': 'Renforcement des capacités' },
    talk: 'Parlons-en', join: 'Contacter REL4D', marquee: ['Évaluation finale', 'Impact', 'Systèmes S&E', 'Analytique', 'Apprentissage', 'Capacités', 'Étude de référence', 'Évaluation finale'],
    contactTitle: 'Demander une proposition', name: 'Nom complet', email: 'Adresse e-mail', organization: 'Organisation (facultatif)', service: 'Service souhaité', details: 'Détails du projet', send: 'Envoyer la demande', sent: 'Votre application de messagerie va ouvrir le message.', multipleServices: 'Plusieurs services',
  },
  rw: {
    label: 'Kinyarwanda', chooseLanguage: 'Hitamo ururimi', themeLight: 'Hindura ujye ku mucyo', themeDark: 'Hindura ujye mu mwijima',
    nav: { Home: 'Ahabanza', About: 'Ibitwerekeye', Services: 'Serivisi', Expertise: 'Ubumenyi', Experience: 'Uburambe', Projects: 'Imishinga', Contact: 'Twandikire', 'Our story': 'Amateka yacu', 'Mission & vision': 'Intego n’icyerekezo', Leadership: 'Ubuyobozi', 'Model Building': 'Gukora imiterere', 'System Customization': 'Gutunganya sisitemu', 'Research & Evaluation': 'Ubushakashatsi n’isuzuma', 'Capacity Building': 'Kongera ubushobozi' },
    talk: 'Tuganire', join: 'Vugana na REL4D', marquee: ['Isuzuma rya nyuma', 'Ingaruka', 'Sisitemu za MEL', 'Isesengura', 'Kwiga', 'Kongera ubushobozi', 'Ibarura fatizo', 'Isuzuma rya nyuma'],
    contactTitle: 'Saba icyifuzo cy’akazi', name: 'Amazina yose', email: 'Aderesi ya imeyili', organization: 'Ikigo (si ngombwa)', service: 'Serivisi wifuza', details: 'Ibisobanuro by’umushinga', send: 'Ohereza ubusabe', sent: 'Porogaramu ya imeyili iri gufungura ubutumwa bwawe.', multipleServices: 'Serivisi nyinshi',
  },
};

/* ---------------------------- Small helpers --------------------------- */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

function useActiveSection(ids) {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, seen] = useInView(0.12);
  return (
    <div ref={ref} className={className}
      style={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(24px)', transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function CountUp({ to, suffix = '' }) {
  const [ref, seen] = useInView(0.5);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const t0 = performance.now(), dur = 1400;
    let raf;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p === 1) return;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* Logo image with a text fallback if the file is missing */
function Logo({ className = '', ring = '' }) {
  const tr = useTranslate();
  const [bad, setBad] = useState(false);
  if (bad) {
    return <span className={`grid place-items-center rounded-full bg-white text-xs font-extrabold text-[var(--gd)] ring-1 ring-[var(--gd)]/15 ${className} ${ring}`}>R4D</span>;
  }
  return <img src={LOGO} alt={tr('REL4D logo')} onError={() => setBad(true)} className={`object-contain mix-blend-multiply ${className} ${ring}`} />;
}

/* Section heading: dark first part + orange accent, like "Skill up anytime, anywhere." */
const Heading = ({ title, accent, text, light }) => {
  const tr = useTranslate();
  const language = useContext(LanguageContext);
  const fullTitle = [title, accent].filter(Boolean).join(' ');
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <h2 className={`text-3xl font-extrabold sm:text-4xl ${light ? 'text-white' : 'text-[var(--gd)]'}`}>
        {language === 'rw' ? tr(fullTitle) : <>{title}{accent && <> <span className="text-[var(--o)]">{accent}</span></>}</>}
      </h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--o)]" />
      {text && <p className={`mt-5 ${light ? 'text-white/80' : 'text-black/65'}`}>{tr(text)}</p>}
    </Reveal>
  );
};

/* Curved section edge. flip = sits at the top of a section. */
const Curve = ({ flip = false, className = 'text-white' }) => (
  <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"
    className={`pointer-events-none absolute inset-x-0 h-10 w-full sm:h-16 lg:h-24 ${flip ? '-top-px rotate-180' : '-bottom-px'} ${className}`}>
    <path fill="currentColor" d="M0,120 L0,70 C360,130 1080,130 1440,50 L1440,120 Z" />
  </svg>
);

/* Decorative drawings (medal, ladder, dashed arrow, spiral) */
function Medal({ className = '', star = 'var(--gd)' }) {
  return (
    <svg viewBox="0 0 160 220" className={className} aria-hidden="true" fill="currentColor">
      <path d="M30 125 L8 200 L45 188 L62 215 L80 140Z" />
      <path d="M130 125 L152 200 L115 188 L98 215 L80 140Z" />
      <circle cx="80" cy="75" r="72" />
      <polygon points="80,41 88.2,63.7 112.3,64.5 93.3,79.3 100,102.5 80,89 60,102.5 66.7,79.3 47.7,64.5 71.8,63.7" style={{ fill: star }} />
    </svg>
  );
}

function Ladder({ className = '', rung = 'var(--gd)' }) {
  return (
    <svg viewBox="0 0 150 300" className={className} aria-hidden="true" fill="currentColor">
      <path d="M0 300 V75 a75 75 0 0 1 150 0 V300Z" />
      <rect x="24" y="105" width="102" height="38" rx="3" style={{ fill: rung }} />
      <rect x="24" y="170" width="102" height="38" rx="3" style={{ fill: rung }} />
      <rect x="24" y="235" width="102" height="38" rx="3" style={{ fill: rung }} />
    </svg>
  );
}

const DashedArrow = ({ className = '' }) => (
  <svg viewBox="0 0 260 110" className={className} aria-hidden="true" fill="none">
    <path d="M5 95 C30 40 90 20 150 40 C190 55 175 85 150 75 C130 65 150 25 225 28" stroke="currentColor" strokeWidth="2" strokeDasharray="6 7" strokeLinecap="round" />
    <path d="M222 12 L256 30 L220 46Z" fill="currentColor" />
  </svg>
);

const Spiral = ({ className = '' }) => (
  <svg viewBox="0 0 110 110" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M25 95 C8 80 12 45 40 32 C70 18 100 40 88 66 C78 86 48 82 50 60 C52 45 72 44 74 56" />
    <path d="M18 84 L24 98 L38 90" />
  </svg>
);

/* ------------------------------ Loader -------------------------------- */
function Loader({ done }) {
  const tr = useTranslate();
  return (
    <div className={`fixed inset-0 z-[100] grid place-items-center bg-white transition-all duration-700 ${done ? 'pointer-events-none scale-105 opacity-0' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-[var(--o)] r4d-spin" />
          <Logo className="r4d-float absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] text-lg" />
        </div>
        <p className="text-lg font-semibold">REL4D Ltd</p>
        <div className="h-1.5 w-56 overflow-hidden rounded-full bg-[var(--gs)]">
          <div className="r4d-fill h-full rounded-full bg-gradient-to-r from-[var(--g)] to-[var(--o)]" />
        </div>
        <p className="text-sm text-black/60">{tr('Evidence drives change…')}</p>
      </div>
    </div>
  );
}

/* --------------------- Language tab (fixed on the left) ---------------- */
function LangTab({ language, setLanguage, t }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed left-3 top-1/2 z-40 -translate-y-1/2">
      <button onClick={() => setOpen((v) => !v)} aria-label={t.chooseLanguage} aria-expanded={open} aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl bg-[var(--gd)] px-3 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--g)]">
        {language.toUpperCase()} <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="r4d-pop absolute left-0 top-full mt-2 w-48 overflow-hidden rounded-xl bg-white p-1.5 text-sm shadow-xl ring-1 ring-black/10" role="menu" aria-label={t.chooseLanguage}>
          {Object.entries(UI_COPY).map(([code, labels]) => (
            <li key={code} role="none"><button role="menuitemradio" aria-checked={language === code}
              className={`w-full rounded-lg px-3 py-2 text-left font-semibold ${language === code ? 'bg-[var(--os)] text-[var(--od)]' : 'hover:bg-[var(--gs)]'}`}
              onClick={() => { setLanguage(code); setOpen(false); }}>{labels.label}</button></li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------ Navbar -------------------------------- */
function Navbar({ theme, setTheme, t }) {
  const tr = useTranslate();
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => { setOpen(false); setDrop(null); };
  const isActive = (item) => item.ids.includes(active);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav aria-label={tr('Main')}
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl transition-all duration-300 ${scrolled ? 'bg-white/85 px-3 py-1.5 shadow-lg backdrop-blur-xl ring-1 ring-black/5' : 'px-0 py-0'}`}>
        <a href="#home" className="flex shrink-0 items-center gap-3 px-2 py-2" onClick={close}>
          <img src={logo} alt="" className={`object-contain transition-all duration-300 ${scrolled ? 'h-12 w-12 sm:h-14 sm:w-14' : 'h-14 w-14 sm:h-16 sm:w-16'}`} />
          <span className="text-lg font-bold tracking-tight text-[var(--gd)] sm:text-xl">REL4D<span aria-hidden="true">.</span></span>
        </a>
        <div className={`flex items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-3 backdrop-blur-xl ring-1 ring-black/5 transition-all duration-300 ${scrolled ? 'py-1.5 shadow-md' : 'py-2.5 shadow-lg'}`}>
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <li key={item.label} className="relative"
              onMouseEnter={() => item.children && setDrop(item.label)} onMouseLeave={() => setDrop(null)}>
              {item.children ? (
                <>
                  <button className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-[var(--gs)] hover:text-[var(--o)] ${isActive(item) ? 'bg-[var(--gs)] text-[var(--o)]' : 'text-[var(--gd)]'}`}
                    aria-expanded={drop === item.label} onClick={() => setDrop(drop === item.label ? null : item.label)}>
                    {t.nav[item.label] || item.label}
                    <ChevronDown size={15} className={`transition-transform ${drop === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {drop === item.label && (
                    <div className="absolute left-0 top-full w-64 pt-3">
                      <ul className="r4d-pop overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <a href={c.href} onClick={close} className="block rounded-xl px-4 py-2.5 text-sm hover:bg-[var(--os)] hover:text-[var(--od)]">{t.nav[c.label] || c.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <a href={item.href} className={`block rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-[var(--gs)] hover:text-[var(--o)] ${isActive(item) ? 'bg-[var(--gs)] text-[var(--o)]' : 'text-[var(--gd)]'}`}>{t.nav[item.label] || item.label}</a>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full text-[var(--gd)] transition hover:bg-[var(--gs)]" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t.themeLight : t.themeDark} title={theme === 'dark' ? t.themeLight : t.themeDark}>
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <a href="#contact" className="hidden items-center gap-1.5 rounded-full bg-[var(--gd)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--o)] sm:inline-flex">{t.talk} <ArrowUpRight size={16} /></a>
          <button className="grid h-11 w-11 place-items-center rounded-full text-[var(--gd)] hover:bg-[var(--gs)] lg:hidden" onClick={() => setOpen((v) => !v)} aria-label={tr('Toggle menu')} aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        </div>
      </nav>

      {open && (
        <div className="r4d-pop mx-auto mt-2 max-h-[75vh] max-w-6xl overflow-y-auto rounded-3xl bg-white px-5 pb-5 shadow-xl ring-1 ring-black/5 lg:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-black/5 py-1">
              {item.children ? (
                <>
                  <button className={`flex w-full items-center justify-between py-3 font-medium ${isActive(item) ? 'text-[var(--o)]' : ''}`} onClick={() => setDrop(drop === item.label ? null : item.label)}>
                    {t.nav[item.label] || item.label}<ChevronDown size={18} className={drop === item.label ? 'rotate-180' : ''} />
                  </button>
                  {drop === item.label && item.children.map((c) => (
                    <a key={c.label} href={c.href} onClick={close} className="block py-2 pl-4 text-sm text-black/70">{t.nav[c.label] || c.label}</a>
                  ))}
                </>
              ) : (
                <a href={item.href} onClick={close} className={`block py-3 font-medium ${isActive(item) ? 'text-[var(--o)]' : ''}`}>{t.nav[item.label] || item.label}</a>
              )}
            </div>
          ))}
          <a href="#contact" onClick={close} className="mt-4 block rounded-xl bg-[var(--o)] py-3 text-center font-semibold text-white">{t.join}</a>
        </div>
      )}
    </header>
  );
}

/* ------------------------------ Sections ------------------------------ */
function Hero() {
  const tr = useTranslate();
  const accentText = tr('development excellence.');
  return (
    <section id="home" className="relative isolate overflow-hidden bg-[#f8faf6] pb-32 pt-36 text-[var(--gd)] sm:pb-40 lg:pt-44">
      {/* Layered, softly animated canvas inspired by evidence and data. */}
      <div className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundImage: 'radial-gradient(ellipse at 78% 30%, rgba(77,138,108,.18), transparent 40%), radial-gradient(ellipse at 8% 14%, rgba(243,160,68,.16), transparent 32%), linear-gradient(rgba(40,86,64,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(40,86,64,.035) 1px, transparent 1px)', backgroundSize: 'auto, auto, 46px 46px, 46px 46px' }} />
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[68%] w-[56%] rounded-bl-[48%] bg-gradient-to-bl from-white/80 via-emerald-100/45 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[4%] top-24 hidden h-52 w-60 rotate-[-8deg] rounded-3xl border border-white/80 bg-white/35 shadow-[0_24px_70px_rgba(39,88,58,.10)] sm:block lg:right-[12%] lg:top-32">
        <div className="absolute inset-x-5 top-5 flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[var(--o)]/70" /><i className="h-2 w-2 rounded-full bg-[var(--g)]/60" /><span className="ml-auto h-1.5 w-12 rounded-full bg-[var(--g)]/15" /></div>
        <div className="absolute inset-x-5 bottom-5 top-14 border-b border-l border-[var(--gd)]/10" style={{ backgroundImage: 'linear-gradient(to top, rgba(39,88,58,.05) 1px, transparent 1px)' }}>
          <div className="absolute inset-x-2 bottom-0 h-[78%]" style={{ clipPath: 'polygon(0 76%, 18% 58%, 35% 67%, 53% 34%, 70% 45%, 87% 14%, 100% 23%, 100% 100%, 0 100%)', background: 'linear-gradient(180deg, rgba(120,185,138,.3), rgba(120,185,138,.025))' }} />
          <svg viewBox="0 0 220 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible"><polyline points="0,72 40,54 78,63 116,33 154,43 192,14 220,22" fill="none" stroke="var(--g)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="192" cy="14" r="4" fill="var(--o)" /></svg>
        </div>
      </div>
      <DashedArrow className="pointer-events-none absolute left-[9%] top-32 hidden w-56 text-[var(--g)] lg:block" />
      <Spiral className="r4d-float pointer-events-none absolute right-[7%] top-28 hidden w-24 text-[var(--o)] lg:block" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8 xl:grid-cols-[130px_1.1fr_1fr]">
        {/* medal + ladder illustration */}
        <div className="r4d-float hidden flex-col items-center gap-4 self-end xl:flex" aria-hidden="true">
          <Medal className="w-28 text-[var(--g)]/30" star="var(--o)" />
          <Ladder className="-mb-24 w-28 text-[var(--gd)]/20" rung="white" />
        </div>

        <div>
          <p className="r4d-rise inline-flex items-center gap-2 rounded-full border border-emerald-800/15 bg-white/75 px-4 py-1.5 text-sm font-medium text-emerald-900 shadow-sm" style={{ animationDelay: '1.9s' }}>
            <span className="h-2 w-2 rounded-full bg-[var(--o)]" /> {tr('Evidence drives change and transformation')}
          </p>
          <h1 className="r4d-rise mt-6 text-3xl font-bold leading-[1.12] sm:text-4xl lg:text-[2.8rem]" style={{ animationDelay: '2s' }}>
            <span className="text-[var(--gd)]">{tr('Research & learning for')} </span><span className="inline-block text-[var(--o)]" aria-label={accentText}>{Array.from(accentText).map((letter, i) => <span key={i} aria-hidden="true" className="r4d-letter-bounce inline-block" style={{ animationDelay: `${i * 55}ms` }}>{letter === ' ' ? '\u00a0' : letter}</span>)}</span>
          </h1>
          <p className="r4d-rise mt-6 max-w-xl text-base leading-relaxed text-slate-700 sm:text-[1.05rem]" style={{ animationDelay: '2.15s' }}>
            {tr('REL4D is a registered consultancy in Kigali that conducts research and evaluations and supports learning for international development programmes, using data analytics, machine learning and AI to get the most from evidence.')}
          </p>
          <div className="r4d-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '2.3s' }}>
            <a href="#services" className="inline-flex items-center gap-2 rounded-xl bg-[var(--o)] px-8 py-4 font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[var(--od)]">{tr('Explore services')} <ArrowUpRight size={18} /></a>
            <a href="#contact" className="rounded-xl border-2 border-[var(--gd)]/20 bg-white/70 px-8 py-4 font-semibold text-[var(--gd)] transition hover:border-[var(--gd)] hover:bg-[var(--gd)] hover:text-white">{tr('Request a proposal')}</a>
          </div>
        </div>

        {/* circular hero photo with orange ring + quarter-circle accent */}
        <div className="r4d-rise relative mx-auto w-full max-w-[300px] sm:max-w-[440px] lg:max-w-[500px]" style={{ animationDelay: '2.2s' }}>
          <div className="absolute -inset-5 animate-pulse rounded-[46%] bg-gradient-to-br from-[var(--g)]/35 via-white/65 to-[var(--o)]/35 blur-md [animation-duration:6s] sm:-inset-7" />
          <div className="absolute -bottom-5 -right-5 h-32 w-32 rounded-full bg-[var(--o)] shadow-xl shadow-orange-900/15 sm:-bottom-7 sm:-right-7 sm:h-40 sm:w-40" />
          <div className="absolute -left-5 top-12 h-20 w-20 rounded-full border border-[var(--g)]/25 sm:-left-10 sm:h-28 sm:w-28" />
          <div className="relative aspect-[.94/1] rotate-2 rounded-[46%] bg-white p-2 shadow-2xl shadow-emerald-950/20 ring-1 ring-[var(--gd)]/10 sm:aspect-square">
            <div className="h-full w-full -rotate-2 overflow-hidden rounded-[46%] border-[6px] border-white">
              <img src={HERO_IMAGE} alt={tr('Team discussing research findings')} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
            </div>
          </div>
          <div className="r4d-float absolute -left-3 bottom-10 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 text-[var(--gd)] shadow-xl sm:-left-8">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--g)] text-white"><BadgeCheck size={20} /></span>
            <span className="text-sm font-bold leading-tight">{tr('50+ projects')}<span className="block text-xs font-medium text-black/50">{tr('delivered across Rwanda')}</span></span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-0 h-20 rounded-t-[55%] bg-white sm:h-28" />
      <Curve />
    </section>
  );
}

function Stats() {
  const tr = useTranslate();
  return (
    <section className="relative z-10 -mt-16 pb-16 sm:-mt-20">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 sm:gap-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 90}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50 p-5 shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
              <span className="absolute -right-7 -top-8 h-24 w-24 rounded-full bg-emerald-100/70 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <p className="text-4xl font-extrabold tracking-tight text-emerald-700 lg:text-5xl"><CountUp to={s.value} suffix={s.suffix} /></p>
                <div className="my-3 h-1 w-10 rounded-full bg-emerald-500" />
                <p className="text-sm font-medium leading-relaxed text-emerald-950/70">{tr(s.label)}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Marquee({ t }) {
  return (
    <div className="r4d-marquee-viewport relative overflow-hidden border-y border-[var(--gd)]/10 bg-[var(--gd)] py-4 text-white" role="group" aria-label={t.marquee.join(', ')}>
      <div className="r4d-marquee-track flex w-max text-sm font-semibold sm:text-base" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-8 px-4 sm:gap-12 sm:px-6">
            {t.marquee.map((word, index) => (
              <span key={`${word}-${index}`} className="flex items-center gap-8 sm:gap-12">
                {word}<Leaf size={16} className="shrink-0 text-[var(--o)]" strokeWidth={2.2} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function About() {
  const tr = useTranslate();
  return (
    <section id="about" className="relative overflow-hidden py-24">
      <Medal className="pointer-events-none absolute -right-12 top-8 hidden w-72 text-[var(--gs)] lg:block" star="#fff" />
      <Ladder className="pointer-events-none absolute -right-4 bottom-0 hidden w-40 text-[var(--gs)] lg:block" rung="#fff" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal className="relative pb-24 sm:pb-28">
          <div className="relative overflow-hidden rounded-[2.5rem] rounded-br-xl rounded-tr-xl">
            <img src={ABOUT_IMAGE_MAIN} alt={tr('Colleagues collaborating on a project')} className="aspect-[4/4.4] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--gd)]/70 via-transparent to-transparent" />
            <span className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[var(--o)] px-4 py-2 text-sm font-semibold text-white">
              <BadgeCheck size={16} /> {tr('Registered consultancy')}
            </span>
          </div>
          <div className="absolute bottom-0 left-4 w-[62%] overflow-hidden rounded-[2rem] border-[10px] border-[var(--gs)] bg-[var(--gs)] shadow-2xl sm:left-8">
            <img src={ABOUT_IMAGE_INSET} alt={tr('Analyst reviewing programme data')} className="aspect-[4/3] w-full rounded-[1.4rem] object-cover" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <h2 className="text-3xl font-extrabold text-[var(--gd)] sm:text-4xl">
            {tr('Transforming development through evidence-based approaches.')}
          </h2>
          <p className="mt-5 leading-relaxed text-black/70">
            {tr('REL4D Ltd (TIN {tin}) is a registered consultancy firm based in Kigali, Rwanda. We conduct research and evaluations and support learning initiatives for international development programmes.', { tin: CONTACT.tin })}
          </p>
          <p className="mt-4 leading-relaxed text-black/70">
            {tr('We blend traditional and computational methods to deliver customised evaluations, data analysis, interactive visualisation, predictive modelling and learning strategies that connect evidence to practice across the programme lifecycle.')}
          </p>
          <ul className="mt-7 space-y-3">
            {['End-to-end research and evaluation services', 'Cutting-edge data analytics and machine learning', 'Monitoring, evaluation and learning (MEL) systems', 'Capacity building and knowledge management'].map((item) => (
              <li key={item} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-[var(--g)]" size={20} />{tr(item)}</li>
            ))}
          </ul>
          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step} className="flex items-center gap-3">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[var(--gd)] text-white"><Star size={22} className="text-[var(--o)]" /></span>
                <span className="text-sm font-semibold leading-snug">{tr(step)}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Mission() {
  const tr = useTranslate();
  return (
    <section id="mission" className="relative overflow-hidden bg-[var(--gd)] py-28 text-white sm:py-36">
      <Curve flip />
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-[var(--g)]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-[var(--o)]/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Mission &" accent="vision" text="The principles behind everything we do." light />
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-white/15 bg-white/5 p-9 backdrop-blur transition hover:border-[var(--o)]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--o)]"><Star size={22} /></span>
            <p className="mt-5 text-2xl font-bold text-[var(--o)]">{tr('Our mission')}</p>
            <p className="mt-4 leading-relaxed text-white/80">{tr('To strengthen development outcomes through a rigorous, robust, evidence-based model of scientific inquiry and collaborative learning partnerships.')}</p>
          </Reveal>
          <Reveal delay={120} className="rounded-3xl border border-white/15 bg-white/5 p-9 backdrop-blur transition hover:border-[#4ADE80]">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--g)]"><Star size={22} /></span>
            <p className="mt-5 text-2xl font-bold text-[#4ADE80]">{tr('Our vision')}</p>
            <p className="mt-4 leading-relaxed text-white/80">{tr('Evidence-informed policies, resilient communities and locally sustained development outcomes, achieved through collaborative learning partnerships.')}</p>
          </Reveal>
        </div>
      </div>
      <Curve />
    </section>
  );
}

function Services() {
  const tr = useTranslate();
  const [active, setActive] = useState(SERVICES[0].id);
  const s = SERVICES.find((x) => x.id === active);
  const Icon = s.icon;
  return (
    <section id="services" className="relative overflow-hidden py-24">
      <DashedArrow className="pointer-events-none absolute left-4 top-10 hidden w-48 text-[var(--g)]/40 lg:block" />
      <Spiral className="pointer-events-none absolute right-8 top-10 hidden w-20 text-[var(--o)]/60 lg:block" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Our" accent="services" text="Everything needed to build strong, functional monitoring, evaluation, research and learning systems." />
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {SERVICES.map((x) => (
              <button key={x.id} onClick={() => setActive(x.id)}
                className={`flex shrink-0 items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left font-semibold transition ${active === x.id ? 'border-[var(--gd)] bg-[var(--gd)] text-white shadow-lg' : 'border-black/10 bg-white hover:border-[var(--g)]'}`}>
                <x.icon size={20} className={active === x.id ? 'text-[var(--o)]' : 'text-[var(--g)]'} />{tr(x.title)}
              </button>
            ))}
          </div>
          <div key={s.id} className="r4d-pop overflow-hidden rounded-[2.5rem] rounded-tr-xl bg-[var(--gs)] shadow-sm">
            <div className="h-48 bg-cover bg-center sm:h-60" style={{ backgroundImage: `url(${s.image})` }} />
            <div className="px-8 pb-8 lg:px-10 lg:pb-10">
              <span className={`-mt-8 grid h-16 w-16 place-items-center rounded-2xl border-4 border-[var(--gs)] text-white shadow-lg ${s.color === 'orange' ? 'bg-[var(--o)]' : 'bg-[var(--g)]'}`}><Icon size={26} /></span>
              <h3 className="mt-5 text-2xl font-bold text-[var(--gd)]">{tr(s.title)}</h3>
              <p className="mt-3 max-w-xl text-black/70">{tr(s.text)}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {s.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium"><Star size={14} className="shrink-0 text-[var(--o)]" fill="currentColor" />{tr(pt)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Expertise() {
  const tr = useTranslate();
  return (
    <section id="expertise" className="relative bg-[var(--gs)] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Technical" accent="expertise" text="Methods and tools our team applies on every assignment." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map((e, i) => (
            <Reveal key={e.title} delay={i * 70}>
              <div className="group h-full rounded-3xl rounded-tr-xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--gd)] text-sm font-bold text-white transition group-hover:bg-[var(--o)]">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-5 text-lg font-bold text-[var(--gd)]">{tr(e.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/65">{tr(e.text)}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
          {TOOLS.map((t) => (
            <span key={t} className="rounded-full border border-[var(--g)]/30 bg-white px-4 py-1.5 text-sm font-medium text-[var(--gd)]">{t}</span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Experience() {
  const tr = useTranslate();
  return (
    <section id="experience" className="py-24">
      <div className="mx-auto max-w-4xl px-5">
        <Heading title="Our" accent="experience" text="A proven track record with international organisations and development programmes." />
        <div className="relative border-l-2 border-emerald-200 pl-8 sm:pl-10">
          {EXPERIENCE.map((j, i) => (
            <Reveal key={j.title} delay={i * 100} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border-4 border-white bg-orange-300 shadow-sm sm:-left-[49px]"><span className="h-1.5 w-1.5 rounded-full bg-white" /></span>
              <article className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/60 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg sm:p-7">
                <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[3rem] bg-orange-100/60 transition group-hover:bg-orange-200/60" />
                <div className="relative">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-bold tracking-wide text-emerald-800"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{tr(j.year)}</p>
                    <span className="text-xs font-semibold uppercase tracking-[.18em] text-orange-400">{tr('Career chapter {number}', { number: String(i + 1).padStart(2, '0') })}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold leading-snug text-emerald-950 sm:text-2xl">{tr(j.title)}</h3>
                  <p className="mt-1 font-semibold text-emerald-700">{j.org}</p>
                  <p className="mt-4 max-w-3xl leading-relaxed text-neutral-600">{tr(j.text)}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {j.tags.map((tag) => <span key={tag} className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-emerald-800 transition group-hover:border-orange-200">{tr(tag)}</span>)}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <h3 className="mb-6 mt-20 text-center text-2xl font-bold text-[var(--gd)]">{tr('Selected consulting clients')}</h3>
        <div className="grid gap-5 md:grid-cols-2">
          {CLIENTS.map((c, i) => (
            <Reveal key={c.name} delay={i * 80}>
              <div className="h-full rounded-2xl rounded-tr-lg border border-black/10 bg-white p-6 transition hover:border-[var(--o)] hover:shadow-lg">
                <p className="text-xs font-semibold text-[var(--o)]">{c.years}</p>
                <h4 className="mt-1 font-bold">{c.name}</h4>
                <p className="mt-2 text-sm text-black/65">{tr(c.text)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const tr = useTranslate();
  return (
    <section id="projects" className="bg-[var(--gs)] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Recent" accent="projects" text="Key work across development sectors in Rwanda." />
        <div className="grid gap-6 md:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <article className="group h-full overflow-hidden rounded-[2rem] rounded-tr-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--g)] to-[var(--gd)]">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute right-4 top-4 rounded-full bg-[var(--o)] px-3 py-1 text-xs font-semibold text-white">{tr(p.category)}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[var(--gd)]">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/65">{tr(p.description)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Credentials() {
  const tr = useTranslate();
  return (
    <section id="credentials" className="py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Credentials &" accent="training" text="Registrations and professional development that back our work." />
        <div className="grid gap-6 md:grid-cols-3">
          {CREDENTIALS.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <div className="h-full rounded-3xl rounded-tr-xl border border-black/10 p-7 text-center transition hover:border-[var(--g)] hover:shadow-lg">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--g)] text-white"><c.icon size={26} /></span>
                <h3 className="mt-5 text-lg font-bold text-[var(--gd)]">{tr(c.title)}</h3>
                <p className="mt-2 text-sm text-black/65">{tr(c.text, { tin: CONTACT.tin })}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-10 max-w-3xl rounded-3xl bg-[var(--gs)] p-8">
          <h3 className="text-lg font-bold text-[var(--gd)]">{tr('Essential training')}</h3>
          <ul className="mt-4 space-y-2.5">
            {TRAINING.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-black/75"><Star size={14} className="mt-1 shrink-0 text-[var(--o)]" fill="currentColor" />{tr(t)}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Team() {
  const tr = useTranslate();
  const [photoBad, setPhotoBad] = useState(false);
  const members = [
    { name: 'Jean Willy ULIHO', role: 'Managing Director',
      photo: 'https://workforceafrica.com/wp-content/uploads/2025/02/Jean-Willy-ULIHO-Monitoring-Evaluation-and-Learing-Mgr-Agahozo-Shalom-Youth-Village.webp',
      bio: 'Data scientist and MERL specialist with more than 10 years of experience across education, early childhood, youth, OVC and health systems programmes. MSc Financial Engineering (in progress), Postgraduate in Public Health Research (James Lind Institute) and BSc Clinical Psychology (University of Rwanda). Fluent in English, French and Kinyarwanda.' },
    { name: 'Research Team', role: 'Technical experts',
      bio: 'Specialists in survey design, field data collection, analysis and distilling insights across development sectors.' },
    { name: 'Data Analytics Team', role: 'Data scientists',
      bio: 'Experts in machine learning, AI for development, predictive modelling and data visualisation systems.' },
  ];
  return (
    <section id="team" className="relative overflow-hidden bg-[var(--gd)] py-28 text-white sm:py-36">
      <Curve flip />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-[var(--g)]/40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Our" accent="leadership" text="Experienced professionals driving evidence-based transformation." light />
        <div className="grid gap-6 md:grid-cols-3">
          {members.map((m, i) => (
            <Reveal key={m.name} delay={i * 100} className={i === 0 ? 'md:col-span-3 lg:col-span-1' : ''}>
              <div className="h-full rounded-3xl rounded-tr-xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur transition hover:border-[var(--o)]">
                {m.photo && !photoBad ? (
                  <div className="mx-auto h-32 w-32 rounded-full bg-white p-1.5">
                    <img src={m.photo} alt={m.name} onError={() => setPhotoBad(true)} className="h-full w-full rounded-full border-4 border-[var(--o)] object-cover" />
                  </div>
                ) : (
                  <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-[var(--g)] to-[var(--o)] text-3xl font-bold">{m.name[0]}</div>
                )}
                <h3 className="mt-5 text-lg font-bold">{tr(m.name)}</h3>
                <p className="mt-1 text-sm font-medium text-[var(--o)]">{tr(m.role)}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{tr(m.bio)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Curve />
    </section>
  );
}

function Contact({ t }) {
  const tr = useTranslate();
  const language = useContext(LanguageContext);
  const [form, setForm] = useState({ name: '', email: '', organization: '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const body = language === 'rw'
      ? `Amazina: ${form.name}\nImeyili: ${form.email}\nIkigo: ${form.organization || 'Ntabwo cyatanzwe'}\nSerivisi: ${form.service || 'Ikibazo rusange'}\n\n${form.message}`
      : `Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.organization || 'Not provided'}\nService: ${form.service || 'General inquiry'}\n\n${form.message}`;
    const subject = language === 'rw' ? 'Ubusabe bwa serivisi REL4D' : 'Proposal request: ' + (form.service || 'General inquiry');
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const input = 'w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-[var(--gd)] outline-none transition placeholder:text-black/40 hover:border-[var(--g)] focus:border-[var(--g)] focus:ring-4 focus:ring-[var(--g)]/15';
  const cards = [
    { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Phone, label: 'Phone', value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Location', value: tr(CONTACT.place), href: 'https://www.google.com/maps/search/Kigali+Rwanda' },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <Spiral className="pointer-events-none absolute right-10 top-10 hidden w-20 text-[var(--o)]/60 lg:block" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Get in" accent="touch" text="Ready to strengthen your programmes with evidence-based insight? Tell us about your project." />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 90}>
                <a href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-5 rounded-2xl border border-black/10 bg-white p-5 transition hover:border-[var(--o)] hover:shadow-lg">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--g)] text-white"><c.icon size={22} /></span>
                  <span><span className="block text-sm text-black/50">{tr(c.label)}</span><span className="font-semibold">{c.value}</span></span>
                </a>
              </Reveal>
            ))}
            <Reveal delay={270}>
              <div className="rounded-2xl bg-[var(--gd)] p-5 text-white">
                <p className="text-sm text-white/70">{tr('Managing Director')}</p>
                <p className="font-semibold">Jean Willy ULIHO</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <form onSubmit={submit} className="space-y-5 rounded-2xl border border-[var(--gd)]/10 bg-[var(--gs)] p-6 shadow-sm sm:p-8 lg:p-9">
                <div className="mb-1 border-b border-[var(--gd)]/10 pb-4">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--o)]">REL4D Ltd</p>
                  <h3 className="mt-1 text-xl font-bold text-[var(--gd)]">{t.contactTitle}</h3>
                </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5 text-sm font-medium text-[var(--gd)]"><span>{t.name} *</span><input className={input} autoComplete="name" placeholder={t.name} value={form.name} onChange={set('name')} required /></label>
                <label className="block space-y-1.5 text-sm font-medium text-[var(--gd)]"><span>{t.email} *</span><input className={input} type="email" autoComplete="email" placeholder={t.email} value={form.email} onChange={set('email')} required /></label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5 text-sm font-medium text-[var(--gd)]"><span>{t.organization}</span><input className={input} autoComplete="organization" placeholder={t.organization} value={form.organization} onChange={set('organization')} /></label>
                <label className="block space-y-1.5 text-sm font-medium text-[var(--gd)]"><span>{t.service}</span><select className={input} value={form.service} onChange={set('service')}>
                  <option value="">{t.service}</option>
                  {SERVICES.map((s) => <option key={s.id}>{t.nav[s.title] || s.title}</option>)}
                  <option>{t.multipleServices}</option>
                </select></label>
              </div>
              <label className="block space-y-1.5 text-sm font-medium text-[var(--gd)]"><span>{t.details} *</span><textarea className={`${input} resize-y`} rows={5} placeholder={t.details} value={form.message} onChange={set('message')} required /></label>
              {sent && <p role="status" className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm text-[var(--g)]"><CheckCircle2 size={18} /> {t.sent}</p>}
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gd)] py-3.5 font-semibold text-white transition hover:bg-[var(--o)]">
                <Send size={17} />{t.send}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const tr = useTranslate();
  return (
    <footer className="bg-[var(--gd)] text-white">
      <div className="h-1 bg-gradient-to-r from-[var(--g)] via-white to-[var(--o)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-white/70 sm:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span>{tr('REL4D Ltd · Research and Learning for Development · TIN {tin}', { tin: CONTACT.tin })}</span>
        </div>
        <p>{tr('© {year} REL4D Ltd. All rights reserved.', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}

/* ------------------------- Theme + animations ------------------------- */
const CSS = `
:root{
  --g:#4D8A6C; --gd:#285640; --gs:#F1F6F0;
  --o:#F3A044; --od:#D9822E; --os:#FFF4E7;
  --earth:#65513B; --paper:#FBFAF6;
}
html{scroll-behavior:smooth}
body{background:var(--paper)}
.r4d-app{min-height:100vh;background:var(--paper);color:#24372c;transition:background-color .25s ease,color .25s ease}
.r4d-app[data-theme="dark"]{--paper:#14231c;--gs:#20362a;--os:#3a3123;--g:#75ad83;--gd:#285640;--o:#f3a044;--od:#f3a044;color:#e6eee7;color-scheme:dark}
.r4d-app[data-theme="dark"] #home{background-color:#14231c!important;color:#edf4ee}
.r4d-app[data-theme="dark"] #home [class*="text-emerald-900"]{color:#dcebdd!important}
.r4d-app[data-theme="dark"] .bg-white,
.r4d-app[data-theme="dark"] [class*="bg-white/"],
.r4d-app[data-theme="dark"] [class~="bg-[var(--gs)]"],
.r4d-app[data-theme="dark"] [class*="bg-[var(--gs)]/"]{background-color:#20362a!important}
.r4d-app[data-theme="dark"] [class*="to-emerald-50"]{background-image:none!important;background-color:#20362a!important}
.r4d-app[data-theme="dark"] [class~="text-[var(--gd)]"]{color:#dcebdd!important}
.r4d-app[data-theme="dark"] [class*="text-black/"],
.r4d-app[data-theme="dark"] [class*="text-slate-"],
.r4d-app[data-theme="dark"] [class~="text-neutral-900"],
.r4d-app[data-theme="dark"] [class~="text-neutral-600"]{color:#d7e1d8!important}
.r4d-app[data-theme="dark"] [class*="text-emerald-950"]{color:#e0e9e1!important}
.r4d-app[data-theme="dark"] [class*="text-emerald-800"],
.r4d-app[data-theme="dark"] [class*="text-emerald-700"]{color:#a7d0b1!important}
.r4d-app[data-theme="dark"] [class*="bg-emerald-50"],
.r4d-app[data-theme="dark"] [class*="bg-emerald-100"],
.r4d-app[data-theme="dark"] [class*="bg-orange-50"],
.r4d-app[data-theme="dark"] [class*="bg-orange-100"]{background-color:#2a4033!important}
.r4d-app[data-theme="dark"] [class*="border-emerald-"],
.r4d-app[data-theme="dark"] [class*="border-orange-"]{border-color:rgba(167,208,177,.24)!important}
.r4d-app[data-theme="dark"] input,
.r4d-app[data-theme="dark"] textarea,
.r4d-app[data-theme="dark"] select{color:#edf4ee!important;background-color:#182a21!important;border-color:rgba(188,214,192,.28)!important}
.r4d-app[data-theme="dark"] option{background:#182a21;color:#edf4ee}
.r4d-app[data-theme="dark"] [class*="border-black/"]{border-color:rgba(230,238,231,.16)!important}
.r4d-app[data-theme="dark"] input::placeholder,
.r4d-app[data-theme="dark"] textarea::placeholder{color:#9eafa2}
section[id]{scroll-margin-top:90px}
@keyframes r4d-spin{to{transform:rotate(360deg)}}
@keyframes r4d-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes r4d-fill{from{width:0}to{width:100%}}
@keyframes r4d-rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes r4d-pop{from{opacity:0;transform:scale(.97) translateY(6px)}to{opacity:1;transform:none}}
@keyframes r4d-marquee{to{transform:translateX(-50%)}}
@keyframes r4d-letter-bounce{0%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}60%{transform:translateY(0)}}
.r4d-spin{animation:r4d-spin 6s linear infinite}
.r4d-float{animation:r4d-float 4s ease-in-out infinite}
.r4d-fill{animation:r4d-fill 1.8s ease forwards}
.r4d-rise{opacity:0;animation:r4d-rise .8s ease forwards}
.r4d-pop{animation:r4d-pop .35s ease both}
.r4d-marquee-track{animation:r4d-marquee 44s linear infinite;will-change:transform}
.r4d-marquee-viewport:hover .r4d-marquee-track,.r4d-marquee-viewport:focus-within .r4d-marquee-track{animation-play-state:paused}
.r4d-letter-bounce{animation:r4d-letter-bounce 10s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.r4d-spin,.r4d-float,.r4d-marquee-track,.r4d-letter-bounce,.r4d-rise{animation:none;opacity:1}.r4d-fill{animation:none;width:100%}}
`;

/* ------------------------------- Page --------------------------------- */
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('rel4d-theme') || 'light'; } catch { return 'light'; }
  });
  const [language, setLanguage] = useState(() => {
    try { return UI_COPY[localStorage.getItem('rel4d-language')] ? localStorage.getItem('rel4d-language') : 'en'; } catch { return 'en'; }
  });
  const t = UI_COPY[language] || UI_COPY.en;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1900); return () => clearTimeout(t); }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'rw' ? 'REL4D Ltd | Ubushakashatsi no kwigira ku iterambere' : 'REL4D Ltd | Research and Learning for Development';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = translate('REL4D is a registered consultancy in Kigali that conducts research and evaluations and supports learning for international development programmes, using data analytics, machine learning and AI to get the most from evidence.', language);
    try {
      localStorage.setItem('rel4d-theme', theme);
      localStorage.setItem('rel4d-language', language);
    } catch { /* Preferences remain usable when storage is unavailable. */ }
  }, [language, theme]);

  return (
    <LanguageContext.Provider value={language}>
      <div className="r4d-app" data-theme={theme} lang={language}>
        <style>{CSS}</style>
        <Loader done={!loading} />
        <LangTab language={language} setLanguage={setLanguage} t={t} />
        <Navbar theme={theme} setTheme={setTheme} t={t} />
        <main>
          <Hero />
          <Stats />
          <Marquee t={t} />
          <About />
          <Mission />
          <Services />
          <Expertise />
          <Experience />
          <Projects />
          <Credentials />
          <Team />
          <Contact t={t} />
        </main>
        <Footer />
      </div>
    </LanguageContext.Provider>
  );
}