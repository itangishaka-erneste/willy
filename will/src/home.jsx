import { Fragment, createContext, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import logo from './assets/logo.PNG';
import { translate } from './translations.js';
import {
  Menu, X, ChevronDown, Layers, Cpu, BarChart3, GraduationCap, Mail, Phone, MapPin, Moon, Sun, Leaf,
  ArrowUpRight, Send, CheckCircle2, Award, Briefcase, BadgeCheck, Star, LockKeyhole,
  LayoutDashboard, MessageSquare, FolderKanban, Users, Settings, Trash2, Pencil, Eye, EyeOff, Search,
  Reply, Download, RefreshCw, LogOut, Plus, ShieldCheck, Inbox, Check, KeyRound, Bell, FileText, ImagePlus,
  UserPlus, UserRound, TrendingUp, AlertCircle, ArrowLeft,
} from 'lucide-react';

/* =====================================================================
   EDIT YOUR CONTENT HERE. Everything on the page reads from these lists.
   Colours: green #15803D and orange-red #FF4500 (see CSS block at bottom).

   The ADMIN console now lives in this file (search for "ADMIN CONSOLE").
   It opens as a pop-up: click the "Admin" button beside the logo.
   ===================================================================== */
const API = import.meta.env.VITE_API_URL || '';
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

const LEADER_IMAGE = 'https://workforceafrica.com/wp-content/uploads/2025/02/Jean-Willy-ULIHO-Monitoring-Evaluation-and-Learing-Mgr-Agahozo-Shalom-Youth-Village.webp';
const HERO_IMAGE = LEADER_IMAGE;
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
  { id: 'p1', title: 'TradeMark Africa Standards & SPS Young Professionals Programme', category: 'Economic',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    description: 'Baseline, endline and employment-traceability assessment of young professionals’ knowledge, standards awareness, employability and work readiness.' },
  { id: 'p2', title: 'Healthy Teeth for Life Endline Evaluation', category: 'Health',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    description: 'Co-principal evaluation of an oral-health programme, covering relevance, effectiveness, efficiency, impact, sustainability and stakeholder learning.' },
  { id: 'p3', title: 'Kura Umenye Family Strengthening & Education Evaluation', category: 'Education',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    description: 'Endline evaluation across family strengthening, education, psychosocial support and SRHR in more than eight districts.' },
  { id: 'p4', title: 'TVET Development for Transformation', category: 'Education',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    description: 'Baseline study and M&E framework development for Rwanda Polytechnic institutions, with reporting tools and practical programme indicators.' },
];

const CREDENTIALS = [
  { icon: BadgeCheck, title: 'Registered consultancy', text: `TIN ${CONTACT.tin}, headquartered in Kigali, Rwanda.` },
  { icon: Award, title: 'USAID-funded programmes', text: 'Experience across multiple USAID-supported projects and partners.' },
  { icon: Briefcase, title: 'International partners', text: 'Delivered work for Expertise France, StrategyHouse, SOS Children’s Villages, TradeMark Africa and more.' },
];

const TRAINING = [
  'MIT Open Learning: Evaluating Social Programs; Impact Evaluation certificates',
  'edX: Evaluating Impact in Low- and Middle-Income Countries; Data Analytics for Business',
  'WorldQuant University: Foundations of Financial Engineering and applied Python, risk and econometrics',
  'King’s College London: Prediction Modelling in Health Research',
  'James Lind Institute: Postgraduate Diploma in Public Health Research',
  'Udemy: Project Impact Evaluation with R Software',
  'Athena Global Education: Executive Diploma in Business Communication and Diploma in Business Administration',
  'Alison: Leadership and Management Styles, Emotional Intelligence and Health Studies',
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
  { label: 'Careers', href: '#careers', ids: ['careers'] },
  { label: 'Contact', href: '#contact', ids: ['contact'] },
];

const SECTION_IDS = ['home', 'about', 'mission', 'services', 'expertise', 'experience', 'projects', 'careers', 'credentials', 'team', 'contact'];

const UI_COPY = {
  en: {
    label: 'English', chooseLanguage: 'Choose language', themeLight: 'Switch to light mode', themeDark: 'Switch to dark mode',
    nav: { Home: 'Home', About: 'About', Services: 'Services', Expertise: 'Expertise', Experience: 'Experience', Projects: 'Projects', Careers: 'Careers', Contact: 'Contact', 'Our story': 'Our story', 'Mission & vision': 'Mission & vision', Leadership: 'Leadership', 'Model Building': 'Model Building', 'System Customization': 'System Customization', 'Research & Evaluation': 'Research & Evaluation', 'Capacity Building': 'Capacity Building' },
    talk: 'Let’s talk', join: 'Join REL4D', marquee: ['Endline', 'Impact', 'MEL systems', 'Analytics', 'Learning', 'Capacity', 'Baseline', 'Endline'],
    contactTitle: 'Request a proposal', name: 'Full name', email: 'Email address', organization: 'Organization (optional)', service: 'Service interested in', details: 'Project details', send: 'Send request', sending: 'Sending…', sent: 'Your request has been sent. We’ll be in touch soon.', sendError: 'We could not send your request. Please try again.', multipleServices: 'Multiple services',
  },
  fr: {
    label: 'Français', chooseLanguage: 'Choisir la langue', themeLight: 'Passer en mode clair', themeDark: 'Passer en mode sombre',
    nav: { Home: 'Accueil', About: 'À propos', Services: 'Services', Expertise: 'Expertise', Experience: 'Parcours', Projects: 'Projets', Careers: 'Carrières', Contact: 'Contact', 'Our story': 'Notre histoire', 'Mission & vision': 'Mission et vision', Leadership: 'Direction', 'Model Building': 'Élaboration de modèles', 'System Customization': 'Personnalisation des systèmes', 'Research & Evaluation': 'Recherche et évaluation', 'Capacity Building': 'Renforcement des capacités' },
    talk: 'Parlons-en', join: 'Contacter REL4D', marquee: ['Évaluation finale', 'Impact', 'Systèmes S&E', 'Analytique', 'Apprentissage', 'Capacités', 'Étude de référence', 'Évaluation finale'],
    contactTitle: 'Demander une proposition', name: 'Nom complet', email: 'Adresse e-mail', organization: 'Organisation (facultatif)', service: 'Service souhaité', details: 'Détails du projet', send: 'Envoyer la demande', sending: 'Envoi en cours…', sent: 'Votre demande a été envoyée. Nous vous contacterons bientôt.', sendError: 'Votre demande n’a pas pu être envoyée. Veuillez réessayer.', multipleServices: 'Plusieurs services',
  },
  rw: {
    label: 'Kinyarwanda', chooseLanguage: 'Hitamo ururimi', themeLight: 'Hindura ujye ku mucyo', themeDark: 'Hindura ujye mu mwijima',
    nav: { Home: 'Ahabanza', About: 'Ibitwerekeye', Services: 'Serivisi', Expertise: 'Ubumenyi', Experience: 'Uburambe', Projects: 'Imishinga', Careers: 'Akazi', Contact: 'Twandikire', 'Our story': 'Amateka yacu', 'Mission & vision': 'Intego n’icyerekezo', Leadership: 'Ubuyobozi', 'Model Building': 'Gukora imiterere', 'System Customization': 'Gutunganya sisitemu', 'Research & Evaluation': 'Ubushakashatsi n’isuzuma', 'Capacity Building': 'Kongera ubushobozi' },
    talk: 'Tuganire', join: 'Vugana na REL4D', marquee: ['Isuzuma rya nyuma', 'Ingaruka', 'Sisitemu za MEL', 'Isesengura', 'Kwiga', 'Kongera ubushobozi', 'Ibarura fatizo', 'Isuzuma rya nyuma'],
    contactTitle: 'Saba icyifuzo cy’akazi', name: 'Amazina yose', email: 'Aderesi ya imeyili', organization: 'Ikigo (si ngombwa)', service: 'Serivisi wifuza', details: 'Ibisobanuro by’umushinga', send: 'Ohereza ubusabe', sending: 'Birimo koherezwa…', sent: 'Ubusabe bwawe bwoherejwe. Turakuvugisha vuba.', sendError: 'Ubusabe bwawe ntibwoherejwe. Ongera ugerageze.', multipleServices: 'Serivisi nyinshi',
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

/* Circle that spins while something is loading (used inside every button) */
function Spinner({ size = 18, className = '' }) {
  return (
    <svg className={`r4d-spinner shrink-0 ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* Button that shows the spinning circle and blocks double clicks while loading */
function Btn({ loading = false, disabled = false, className = '', children, ...rest }) {
  return (
    <button {...rest} disabled={loading || disabled} aria-busy={loading} className={className}>
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
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
        {language !== 'en' ? tr(fullTitle) : <>{title}{accent && <> <span className="text-[var(--o)]">{accent}</span></>}</>}
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
  // Language selection is now placed inside the main navbar.
  return null;
}

/* ------------------------------ Navbar -------------------------------- */
function Navbar({ theme, setTheme, t, onAdmin, onAuth, account, onLogout, language, setLanguage }) {
  const tr = useTranslate();
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(null);
  const [languageOpen, setLanguageOpen] = useState(false);
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
  const link = (on) => `flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition hover:bg-[var(--gs)] hover:text-[var(--o)] ${on ? 'bg-[var(--gs)] text-[var(--o)]' : 'text-[var(--gd)]'}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav aria-label={tr('Main')} className={`transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-md backdrop-blur-xl' : 'bg-white/70 backdrop-blur-md'} border-b border-black/5`}>
        <div className="mx-auto flex min-h-[68px] max-w-7xl items-center gap-2 px-3 sm:gap-4 sm:px-4 lg:px-8">
          {/* left: logo */}
          <a href="#home" onClick={close} className="flex shrink-0 items-center gap-2.5">
            <img src={logo} alt="" className="h-11 w-11 object-contain" />
            <span className="text-xl font-extrabold tracking-tight text-[var(--gd)]">REL4D</span>
          </a>

          {/* centre: links */}
          <ul className="mx-auto hidden min-w-0 items-center gap-0.5 xl:flex">
            {NAV.slice(0, 3).map((item) => (
              <li key={item.label} className="relative" onMouseEnter={() => item.children && setDrop(item.label)} onMouseLeave={() => setDrop(null)}>
                {item.children ? (
                  <>
                    <button className={link(isActive(item))} aria-expanded={drop === item.label}>
                      {t.nav[item.label] || item.label}<ChevronDown size={14} className={`transition-transform ${drop === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {drop === item.label && (
                      <div className="absolute left-0 top-full w-60 pt-2">
                        <ul className="r4d-pop overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                          {item.children.map((c) => <li key={c.label}><a href={c.href} onClick={close} className="block rounded-xl px-4 py-2.5 text-sm hover:bg-[var(--os)] hover:text-[var(--od)]">{t.nav[c.label] || c.label}</a></li>)}
                        </ul>
                      </div>
                    )}
                  </>
                ) : <a href={item.href} className={link(isActive(item))}>{t.nav[item.label] || item.label}</a>}
              </li>
            ))}
            <li className="relative" onMouseEnter={() => setDrop('More')} onMouseLeave={() => setDrop(null)}>
              <button type="button" className={link(NAV.slice(3).some(isActive))} onClick={() => setDrop(drop === 'More' ? null : 'More')} aria-expanded={drop === 'More'}>
                More <ChevronDown size={14} className={`transition-transform ${drop === 'More' ? 'rotate-180' : ''}`} />
              </button>
              {drop === 'More' && <div className="absolute right-0 top-full z-20 w-60 pt-2"><ul className="r4d-pop max-h-[70vh] overflow-y-auto rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                {NAV.slice(3).flatMap((item) => item.children ? item.children.map((child) => ({ ...child, group: item.label })) : [item]).map((entry) => (
                  <li key={`${entry.group || ''}-${entry.label}`}><a href={entry.href} onClick={close} className="block rounded-xl px-4 py-2.5 text-sm text-[var(--gd)] hover:bg-[var(--gs)] hover:text-[var(--o)]">{entry.group ? <span className="mr-1 text-black/45">{t.nav[entry.group] || entry.group} ·</span> : null}{t.nav[entry.label] || entry.label}</a></li>
                ))}
              </ul></div>}
            </li>
          </ul>

          {/* right: language, theme, admin (small), account */}
          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1.5 lg:ml-0">
            <div className="relative">
              <button type="button" onClick={() => setLanguageOpen((v) => !v)} aria-label={t.chooseLanguage} aria-expanded={languageOpen}
                className="flex h-10 items-center gap-1 rounded-full px-2.5 text-xs font-bold text-[var(--gd)] transition hover:bg-[var(--gs)]">
                {language.toUpperCase()} <ChevronDown size={13} className={`transition-transform ${languageOpen ? 'rotate-180' : ''}`} />
              </button>
              {languageOpen && (
                <div className="r4d-pop absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 shadow-xl">
                  {Object.entries(UI_COPY).map(([code, labels]) => (
                    <button key={code} type="button" onClick={() => { setLanguage(code); setLanguageOpen(false); }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${language === code ? 'bg-[var(--os)] text-[var(--od)]' : 'text-[var(--gd)] hover:bg-[var(--gs)]'}`}>
                      {labels.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t.themeLight : t.themeDark}
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--gd)] transition hover:bg-[var(--gs)]">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button type="button" onClick={onAdmin} aria-label="Admin login" title="Admin login"
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--gd)] transition hover:bg-[var(--gs)] hover:text-[var(--o)]"><LockKeyhole size={17} /></button>
            {account ? (
              <div className="hidden items-center gap-2 sm:flex">
                <span title={account.email} className="grid h-10 w-10 place-items-center rounded-full bg-[var(--gd)] text-sm font-bold text-white">{(account.name || '?')[0].toUpperCase()}</span>
                <button type="button" onClick={onLogout} className="text-sm font-semibold text-[var(--gd)] hover:text-[var(--o)]">Sign out</button>
              </div>
            ) : (
              <>
                <button type="button" onClick={() => onAuth('login')} className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--gd)] transition hover:bg-[var(--gs)] sm:block">Sign in</button>
                <button type="button" onClick={() => onAuth('register')} className="hidden items-center gap-1.5 rounded-full bg-[var(--gd)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--o)] sm:inline-flex"><UserPlus size={15} />Create account</button>
              </>
            )}
            <button className="grid h-10 w-10 place-items-center rounded-full text-[var(--gd)] hover:bg-[var(--gs)] xl:hidden" onClick={() => setOpen((v) => !v)} aria-label={tr('Toggle menu')} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="r4d-pop max-h-[78vh] overflow-y-auto border-b border-black/5 bg-white px-5 pb-5 shadow-xl xl:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-black/5 py-1">
              {item.children ? (
                <>
                  <button className="flex w-full items-center justify-between py-3 font-medium" onClick={() => setDrop(drop === item.label ? null : item.label)}>{t.nav[item.label] || item.label}<ChevronDown size={18} className={drop === item.label ? 'rotate-180' : ''} /></button>
                  {drop === item.label && item.children.map((c) => <a key={c.label} href={c.href} onClick={close} className="block py-2 pl-4 text-sm text-black/70">{t.nav[c.label] || c.label}</a>)}
                </>
              ) : <a href={item.href} onClick={close} className={`block py-3 font-medium ${isActive(item) ? 'text-[var(--o)]' : ''}`}>{t.nav[item.label] || item.label}</a>}
            </div>
          ))}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { close(); onAuth('login'); }} className="rounded-xl border border-[var(--gd)]/20 py-3 font-semibold text-[var(--gd)]">Sign in</button>
            <button type="button" onClick={() => { close(); onAuth('register'); }} className="rounded-xl bg-[var(--o)] py-3 font-semibold text-white">Create account</button>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------ Sections ------------------------------ */
function Hero() {
  const tr = useTranslate();
  return (
    <section id="home" className="relative isolate overflow-hidden bg-white pb-28 pt-[68px] text-[var(--gd)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-[22rem] w-[22rem] rounded-full bg-emerald-100/60 blur-[110px]" />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(40,86,64,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(40,86,64,.035) 1px,transparent 1px)', backgroundSize: '48px 48px', WebkitMaskImage: 'radial-gradient(ellipse at 60% 40%,#000 20%,transparent 75%)', maskImage: 'radial-gradient(ellipse at 60% 40%,#000 20%,transparent 75%)' }} />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div>
          <p className="r4d-rise inline-flex items-center gap-2 rounded-full border border-[var(--g)]/20 bg-[var(--gs)] px-4 py-1.5 text-sm font-medium text-[var(--gd)]" style={{ animationDelay: '1.9s' }}>
            {tr('Evidence drives change and transformation')}
          </p>
          <h1 className="r4d-rise mt-6 text-4xl font-extrabold leading-[1.08] text-[var(--gd)] sm:text-5xl lg:text-[3.6rem]" style={{ animationDelay: '2s' }}>
            {tr('Research & learning for')}{' '}<span className="text-[var(--o)]">{tr('development excellence.')}</span>
          </h1>
          <p className="r4d-rise mt-6 max-w-xl text-base leading-relaxed text-black/70 sm:text-lg" style={{ animationDelay: '2.15s' }}>
            {tr('REL4D is a registered consultancy in Kigali that conducts research and evaluations and supports learning for international development programmes, using data analytics, machine learning and AI to get the most from evidence.')}
          </p>
          <div className="r4d-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '2.3s' }}>
            <a href="#services" className="inline-flex items-center gap-2 rounded-xl bg-[var(--o)] px-7 py-3.5 font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:-translate-y-0.5 hover:bg-[var(--od)]">{tr('Explore services')} <ArrowUpRight size={18} /></a>
            <a href="#contact" className="rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 font-semibold backdrop-blur transition hover:bg-white hover:text-[var(--gd)]">{tr('Request a proposal')}</a>
          </div>
          {/* mini trust row */}
          <div className="r4d-rise mt-10 grid max-w-lg grid-cols-3 gap-3" style={{ animationDelay: '2.45s' }}>
            {[[50, '+', 'Projects'], [15, '+', 'Sectors'], [10, '+', 'Years']].map(([v, s, l]) => (
              <div key={l} className="rounded-2xl border border-white/10 bg-white/[.07] px-4 py-3 backdrop-blur">
                <p className="text-2xl font-extrabold"><CountUp to={v} suffix={s} /></p>
                <p className="text-xs text-white/60">{tr(l)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="r4d-rise relative mx-auto w-full max-w-[420px] px-5 pb-5 pt-4 sm:px-8" style={{ animationDelay: '2.2s' }}>
          <div className="r4d-orbit absolute left-1/2 top-1/2 aspect-square w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-200/30" />
          <div className="r4d-portrait-ring relative mx-auto aspect-square w-full max-w-[360px] rounded-full p-[7px]">
            <div className="absolute inset-[8px] rounded-full border border-white/35" />
            <div className="relative h-full w-full overflow-hidden rounded-full border-[5px] border-[#0c2a1c] bg-white/10 shadow-[0_30px_90px_-20px_rgba(0,0,0,.7)] ring-1 ring-white/35">
              <img src={HERO_IMAGE} alt={tr('Portrait of Jean Willy ULIHO')} className="h-full w-full rounded-full object-cover object-[center_12%] transition duration-700 hover:scale-105" />
              <div className="absolute inset-x-6 bottom-3 rounded-2xl border border-white/25 bg-[#07140d]/65 px-4 py-2 text-center backdrop-blur-md">
                <p className="font-bold">Jean Willy ULIHO</p><p className="text-xs text-white/75">{tr('Managing Director')} · REL4D Ltd</p>
              </div>
            </div>
          </div>
          <span className="r4d-orbit-dot absolute left-[13%] top-[24%] h-3 w-3 rounded-full bg-[var(--o)] shadow-[0_0_22px_rgba(243,160,68,.9)]" />
          <span className="r4d-orbit-dot absolute bottom-[13%] right-[17%] h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(110,231,183,.9)]" />
          <div className="r4d-float absolute -left-1 bottom-0 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/95 px-3 py-2.5 text-[var(--gd)] shadow-xl sm:-left-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--g)] text-white"><BadgeCheck size={20} /></span>
            <span className="text-sm font-bold leading-tight">{tr('50+ projects')}<span className="block text-xs font-medium text-black/50">{tr('delivered across Rwanda')}</span></span>
          </div>
          <div className="r4d-float absolute -right-1 bottom-0 w-36 rounded-2xl border border-white/20 bg-white/95 p-3 text-[var(--gd)] shadow-xl sm:-right-3" style={{ animationDelay: '-2s' }}>
            <div className="flex items-center justify-between text-[.65rem] font-bold uppercase text-black/50"><span>Impact</span><TrendingUp size={13} className="text-[var(--o)]" /></div>
            <svg viewBox="0 0 120 40" className="mt-1 h-10 w-full"><polyline points="0,32 20,24 40,28 60,14 80,18 100,6 120,10" fill="none" stroke="var(--g)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="100" cy="6" r="3" fill="var(--o)" /></svg>
          </div>
        </div>
      </div>
      <Curve className="text-[var(--paper)]" />
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
  const [databaseProjects, setDatabaseProjects] = useState([]);

  // Projects added in the admin console come from the database.
  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then((response) => response.ok ? response.json() : [])
      .then((items) => setDatabaseProjects(Array.isArray(items) ? items : []))
      .catch(() => setDatabaseProjects([]));
  }, []);

  const visibleProjects = databaseProjects.length ? databaseProjects : PROJECTS;
  return (
    <section id="projects" className="bg-[var(--gs)] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Recent" accent="projects" text="Key work across development sectors in Rwanda." />
        <div className="grid gap-6 md:grid-cols-3">
          {visibleProjects.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <article className="group h-full overflow-hidden rounded-[2rem] rounded-tr-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--g)] to-[var(--gd)]">
                  {(p.image_url || p.image) && <img src={p.image_url || p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                  {p.category && <span className="absolute right-4 top-4 rounded-full bg-[var(--o)] px-3 py-1 text-xs font-semibold text-white">{tr(p.category)}</span>}
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

function Careers() {
  const tr = useTranslate();
  const [openings, setOpenings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', cvUrl: '' });
  const [cv, setCv] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/openings`).then((r) => r.ok ? r.json() : []).then((items) => setOpenings(Array.isArray(items) ? items : [])).catch(() => setOpenings([]));
  }, []);

  const apply = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending'); setError('');
    try {
      let cvData = null;
      if (cv) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(',')[1]);
          reader.onerror = () => reject(new Error('Could not read the CV file.'));
          reader.readAsDataURL(cv);
        });
        cvData = { name: cv.name, data: base64 };
      }
      const res = await fetch(`${API}/api/applications`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opening_id: selected?.id || null, name: form.name, email: form.email, phone: form.phone, message: form.message, cv_url: form.cvUrl, cv: cvData }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Application could not be submitted.');
      setStatus('sent'); setForm({ name: '', email: '', phone: '', message: '', cvUrl: '' }); setCv(null);
    } catch (err) { setError(err.message); setStatus('idle'); }
  };

  return (
    <section id="careers" className="bg-[var(--gs)] py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Careers at" accent="REL4D" text="Join a team turning evidence into better decisions and stronger development programmes." />
        {openings.length ? (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              {openings.map((opening, i) => {
                const data = opening.data || opening;
                return <Reveal key={opening.id || i} delay={i * 80} className="h-full"><article className="flex h-full flex-col rounded-3xl border border-black/10 bg-white p-7 shadow-sm"><div className="flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-[var(--os)] px-3 py-1 text-[var(--od)]">{tr(data.type || 'Consultancy')}</span><span className="rounded-full bg-[var(--gs)] px-3 py-1 text-[var(--gd)]">{tr(data.location || 'Kigali, Rwanda')}</span></div><h3 className="mt-5 text-xl font-bold text-[var(--gd)]">{data.title}</h3><p className="mt-3 flex-1 text-sm leading-relaxed text-black/65">{tr(data.description)}</p><button type="button" onClick={() => { setSelected(opening); setApplicationOpen(true); setStatus('idle'); setError(''); }} className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gd)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--o)]">Apply for this role <ArrowUpRight size={16} /></button></article></Reveal>;
              })}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-black/60">Don't see a role that fits? Send us an open application.</p>
              <button type="button" onClick={() => { setSelected(null); setApplicationOpen(true); setStatus('idle'); setError(''); }} className="mt-3 rounded-xl border border-[var(--gd)]/20 bg-white px-5 py-3 text-sm font-bold text-[var(--gd)] transition hover:border-[var(--o)] hover:text-[var(--od)]">Apply to join REL4D</button>
            </div>
          </>
        ) : (
          <Reveal><div className="rounded-3xl border border-black/10 bg-white p-8 text-center"><Briefcase className="mx-auto text-[var(--o)]" /><h3 className="mt-4 text-xl font-bold text-[var(--gd)]">No public vacancies right now</h3><p className="mt-2 text-sm text-black/60">You can still send an open application and tell us how you can contribute.</p><button type="button" onClick={() => { setSelected(null); setApplicationOpen(true); setStatus('idle'); setError(''); }} className="mt-5 rounded-xl bg-[var(--gd)] px-6 py-3 font-bold text-white transition hover:bg-[var(--o)]">Send an open application</button></div></Reveal>
        )}
      </div>

      {applicationOpen || status === 'sent' ? createPortal(
        <div className="fixed inset-0 z-[150] grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) { setApplicationOpen(false); setSelected(null); } }}>
          <div className="r4d-pop w-full max-w-lg rounded-3xl bg-white p-7 text-[#24372c] shadow-2xl">
            <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[var(--o)]">REL4D Careers</p><h2 className="mt-1 text-2xl font-extrabold text-[var(--gd)]">{selected ? (selected.data || selected).title : 'Open application'}</h2></div><button type="button" onClick={() => { setApplicationOpen(false); setSelected(null); }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5"><X size={18} /></button></div>
            {status === 'sent' ? <div className="py-10 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-[var(--g)]"/><h3 className="mt-4 text-xl font-bold text-[var(--gd)]">Application received</h3><p className="mt-2 text-sm text-black/60">Our team will review your details and get in touch if there is a match.</p><button type="button" onClick={() => { setApplicationOpen(false); setSelected(null); setStatus('idle'); }} className="mt-5 rounded-xl bg-[var(--gd)] px-6 py-3 font-bold text-white">Close</button></div> : (
              <form onSubmit={apply} className="mt-5 space-y-3"><input required placeholder="Full name" className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/><input required type="email" placeholder="Email address" className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/><input placeholder="Phone number" className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/><textarea placeholder="Short cover note" rows="4" className="w-full resize-y rounded-xl border border-black/15 px-4 py-3 text-sm" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}/><input type="url" placeholder="CV link (Google Drive, Dropbox, LinkedIn…)" className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm" value={form.cvUrl} onChange={(e) => setForm({ ...form, cvUrl: e.target.value })}/><div><label className="block text-xs font-bold text-black/55">Or attach CV (PDF or Word, max 2.5 MB)</label><input type="file" accept=".pdf,.doc,.docx" className="mt-2 block w-full text-sm" onChange={(e) => setCv(e.target.files?.[0] || null)}/></div>{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<Btn type="submit" loading={status === 'sending'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gd)] px-5 py-3.5 font-bold text-white transition hover:bg-[var(--o)]">Submit application <Send size={16}/></Btn></form>
            )}
          </div>
        </div>, document.body) : null}
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

const DEFAULT_TEAM_MEMBERS = [
  { name: 'Jean Willy ULIHO', role: 'Managing Director',
    photo: LEADER_IMAGE,
    bio: 'Data scientist and MERL specialist with more than 10 years of experience across education, early childhood, youth, OVC, health systems and social protection programmes. Holds a Postgraduate Diploma in Public Health Research from James Lind Institute and a BSc in Clinical Psychology from the University of Rwanda. Fluent in English, French and Kinyarwanda.' },
  { name: 'Research Team', role: 'Technical experts',
    bio: 'Specialists in survey design, field data collection, analysis and distilling insights across development sectors.' },
  { name: 'Data Analytics Team', role: 'Data scientists',
    bio: 'Experts in machine learning, AI for development, predictive modelling and data visualisation systems.' },
];

function Team() {
  const tr = useTranslate();
  const [savedMembers, setSavedMembers] = useState(null);
  const [failedPhotos, setFailedPhotos] = useState(() => new Set());
  useEffect(() => {
    fetch(`${API}/api/team`)
      .then((response) => response.ok ? response.json() : [])
      .then((items) => setSavedMembers(Array.isArray(items) && items.length ? items.map((item) => ({
        id: item.id,
        name: item.title,
        role: item.role,
        photo: item.image,
        bio: item.description,
      })) : DEFAULT_TEAM_MEMBERS))
      .catch(() => setSavedMembers(DEFAULT_TEAM_MEMBERS));
  }, []);
  const members = savedMembers || DEFAULT_TEAM_MEMBERS;
  return (
    <section id="team" className="relative overflow-hidden bg-[var(--gd)] py-28 text-white sm:py-36">
      <Curve flip />
      <div className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-[var(--g)]/40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Our" accent="leadership" text="Experienced professionals driving evidence-based transformation." light />
        <div className="grid gap-6 md:grid-cols-3">
          {members.map((m, i) => (
            <Reveal key={m.id || m.name} delay={i * 100} className={i === 0 ? 'md:col-span-3 lg:col-span-1' : ''}>
              <div className="h-full rounded-3xl rounded-tr-xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur transition hover:border-[var(--o)]">
                {m.photo && !failedPhotos.has(m.name) ? (
                  <div className="r4d-portrait-ring mx-auto h-36 w-36 rounded-full p-[5px]">
                    <div className="h-full w-full overflow-hidden rounded-full border-4 border-[var(--gd)] bg-white shadow-xl ring-2 ring-white/50">
                      <img src={m.photo} alt={m.name} onError={() => setFailedPhotos((current) => new Set(current).add(m.name))} className="h-full w-full rounded-full object-cover object-[center_20%] transition duration-500 hover:scale-110" />
                    </div>
                  </div>
                ) : (
                  <div className="r4d-portrait-ring mx-auto grid h-36 w-36 place-items-center rounded-full p-[5px] text-3xl font-bold"><span className="grid h-full w-full place-items-center rounded-full border-4 border-[var(--gd)] bg-gradient-to-br from-[var(--g)] to-[var(--o)]">{m.name?.[0] || '?'}</span></div>
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
  const [form, setForm] = useState({ name: '', email: '', organization: '', service: '', message: '' });
  const [status, setStatus] = useState('idle');
  const set = (k) => (e) => {
    setForm((current) => ({ ...current, [k]: e.target.value }));
    if (status !== 'sending') setStatus('idle');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      // The server saves it; the admin console shows it under "Messages".
      const response = await fetch(`${API}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          organization: form.organization,
          service: form.service,
          message: form.message,
        }),
      });
      if (!response.ok) throw new Error('Contact request failed');
      setStatus('sent');
      setForm({ name: '', email: '', organization: '', service: '', message: '' });
    } catch {
      setStatus('error');
    }
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
              <label className="block space-y-1.5 text-sm font-medium text-[var(--gd)]"><span>{t.details} *</span><textarea className={`${input} resize-y`} rows={5} placeholder={t.details} value={form.message} onChange={set('message')} required minLength={5} /></label>
              {status === 'sent' && <p role="status" className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm text-[var(--g)]"><CheckCircle2 size={18} /> {t.sent}</p>}
              {status === 'error' && <p role="alert" className="rounded-xl bg-white px-4 py-2.5 text-sm text-red-700">{t.sendError}</p>}
              <Btn type="submit" loading={status === 'sending'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gd)] py-3.5 font-semibold text-white transition hover:bg-[var(--o)] disabled:cursor-wait disabled:opacity-70">
                {status !== 'sending' && <Send size={17} />}{status === 'sending' ? t.sending : t.send}
              </Btn>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer({ onAdmin }) {
  const tr = useTranslate();
  return (
    <footer className="bg-[var(--gd)] text-white">
      <div className="h-1 bg-gradient-to-r from-[var(--g)] via-white to-[var(--o)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-white/70 sm:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span>{tr('REL4D Ltd · Research and Learning for Development · TIN {tin}', { tin: CONTACT.tin })}</span>
        </div>
        <div className="flex items-center gap-4">
          <p>{tr('© {year} REL4D Ltd. All rights reserved.', { year: new Date().getFullYear() })}</p>
          <button type="button" onClick={onAdmin} className="inline-flex items-center gap-1 text-white/50 transition hover:text-white" aria-label="Admin login"><LockKeyhole size={14} /></button>
        </div>
      </div>
    </footer>
  );
}

/* =====================================================================
   ADMIN CONSOLE  (pop-up: login first, then the full dashboard)
   Talks to server.js:  /api/admin/login, /api/admin/stats, /messages,
   /content, /applications, /users, /password
   ===================================================================== */
const TOKEN_KEY = 'rel4d-admin-token';
const readToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } };
const saveToken = (value) => {
  try { if (value) localStorage.setItem(TOKEN_KEY, value); else localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
};

async function apiRequest(path, { token, method = 'GET', body, raw = false } = {}) {
  let res;
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Check that the API is running and your connection is on.');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return raw ? res : res.json().catch(() => ({}));
}

const fmtDate = (d) => (d ? new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—');
const initials = (name = '') => (name.trim()[0] || '?').toUpperCase();

function downloadCsv(filename, rows, columns) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [columns.map((c) => esc(c.label)).join(','), ...rows.map((r) => columns.map((c) => esc(r[c.key])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* Shrinks a chosen picture to a small JPEG so it fits in the database */
function fileToDataUrl(file, maxW = 1000, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image.'));
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const PROJECT_FIELDS = [
  { name: 'title', label: 'Project title', required: true },
  { name: 'category', label: 'Category', type: 'combo', options: ['Health', 'Education', 'Economic', 'Agriculture', 'Youth', 'Governance', 'Other'] },
  { name: 'image', label: 'Cover image', type: 'image' },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
];
const OPENING_FIELDS = [
  { name: 'title', label: 'Job title', required: true },
  { name: 'type', label: 'Contract type', type: 'combo', options: ['Full-time', 'Part-time', 'Consultancy', 'Internship'] },
  { name: 'location', label: 'Location' },
  { name: 'deadline', label: 'Deadline' },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
];
const TEAM_FIELDS = [
  { name: 'title', label: 'Name or team name', required: true },
  { name: 'role', label: 'Role', required: true },
  { name: 'image', label: 'Profile photo', type: 'image' },
  { name: 'description', label: 'Biography', type: 'textarea', required: true },
];

const APP_STATUS_STYLE = {
  new: 'bg-orange-400/15 text-orange-200 ring-orange-300/30',
  reviewing: 'bg-sky-400/15 text-sky-200 ring-sky-300/30',
  shortlisted: 'bg-emerald-400/15 text-emerald-200 ring-emerald-300/30',
  rejected: 'bg-red-400/15 text-red-200 ring-red-300/30',
  hired: 'bg-violet-400/15 text-violet-200 ring-violet-300/30',
};
const STATUS_COLOR = {
  new: '#fb923c',
  reviewing: '#38bdf8',
  shortlisted: '#34d399',
  rejected: '#f87171',
  hired: '#a78bfa',
};
const APP_STATUSES = ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'];

const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'team', label: 'Users', icon: UserRound },
  { id: 'openings', label: 'Careers', icon: Briefcase },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'users', label: 'Settings', icon: Settings },
];

const ADMIN_CSS = `
.adm{color:#e8f1ea;background:#06100a;font-feature-settings:"ss01"}
.adm *{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent}
.adm-bg{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.adm-blob{position:absolute;border-radius:9999px;filter:blur(95px);opacity:.5;animation:adm-float 16s ease-in-out infinite}
.adm-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:46px 46px;-webkit-mask-image:radial-gradient(ellipse at 50% 30%,#000 25%,transparent 75%);mask-image:radial-gradient(ellipse at 50% 30%,#000 25%,transparent 75%)}
.adm-glass{background:linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.025));border:1px solid rgba(255,255,255,.1);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:0 24px 60px -28px rgba(0,0,0,.75)}
.adm-in{animation:adm-in .5s cubic-bezier(.2,.8,.2,1) both}
.adm-input{width:100%;border-radius:.85rem;border:1px solid rgba(255,255,255,.12);background:rgba(3,10,6,.6);padding:.7rem .95rem;font-size:.875rem;color:#f1f7f2;outline:none;transition:border-color .2s,box-shadow .2s}
.adm-input:focus{border-color:#4ade80;box-shadow:0 0 0 4px rgba(74,222,128,.14)}
.adm-input::placeholder{color:rgba(232,241,234,.35)}
select.adm-input option{background:#0d1d15;color:#f1f7f2}
.adm-label{display:block;font-size:.7rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:rgba(232,241,234,.55);margin-bottom:.4rem}
.adm-btn,.adm-btn-ghost,.adm-btn-danger{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;border-radius:.85rem;padding:.62rem 1.05rem;font-size:.82rem;font-weight:700;transition:all .25s;white-space:nowrap}
.adm-btn{color:#fff;background:linear-gradient(120deg,#16a34a,#f3a044,#16a34a);background-size:220% auto;box-shadow:0 12px 26px -12px rgba(243,160,68,.7)}
.adm-btn:hover:not(:disabled){background-position:right center;transform:translateY(-1px)}
.adm-btn-ghost{color:#e8f1ea;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.05)}
.adm-btn-ghost:hover:not(:disabled){background:rgba(255,255,255,.12);transform:translateY(-1px)}
.adm-btn-danger{color:#fecaca;border:1px solid rgba(248,113,113,.35);background:rgba(239,68,68,.1)}
.adm-btn-danger:hover:not(:disabled){background:rgba(239,68,68,.25)}
.adm-btn:disabled,.adm-btn-ghost:disabled,.adm-btn-danger:disabled{opacity:.65;cursor:not-allowed}
.adm-chip{display:inline-flex;align-items:center;gap:.35rem;border-radius:9999px;padding:.22rem .7rem;font-size:.7rem;font-weight:700}
.adm-nav{display:flex;align-items:center;gap:.7rem;width:100%;border-radius:.9rem;padding:.72rem .9rem;font-size:.875rem;font-weight:600;color:rgba(232,241,234,.65);transition:all .2s;text-align:left}
.adm-nav:hover{background:rgba(255,255,255,.06);color:#fff}
.adm-nav[data-active="true"]{background:linear-gradient(120deg,rgba(74,222,128,.22),rgba(243,160,68,.2));color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
.adm-title{background:linear-gradient(90deg,#fff,#a7f3d0,#fdba74,#fff);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:adm-shine 7s linear infinite}
.adm-pulse{animation:adm-ring 1.9s infinite}
.adm-row:hover{background:rgba(255,255,255,.045)}
.adm-toast{animation:adm-toast .35s cubic-bezier(.2,.8,.2,1) both}
@keyframes adm-float{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(46px,-34px) scale(1.18)}}
@keyframes adm-in{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}
@keyframes adm-toast{from{opacity:0;transform:translateX(34px)}to{opacity:1;transform:none}}
@keyframes adm-shine{to{background-position:200% center}}
@keyframes adm-ring{0%{box-shadow:0 0 0 0 rgba(243,160,68,.55)}100%{box-shadow:0 0 0 16px rgba(243,160,68,0)}}
@keyframes adm-draw{from{stroke-dashoffset:1200}to{stroke-dashoffset:0}}
.adm-line{stroke-dasharray:1200;animation:adm-draw 1.6s ease forwards}
@media (prefers-reduced-motion:reduce){.adm-blob,.adm-title,.adm-pulse,.adm-line{animation:none}}
`;

const ADMIN_CSS_EXTRA = `
.adm{transition:background .25s,color .25s}
.adm[data-t="light"]{color:#17261d;background:#eef3ef}
.adm[data-t="light"] .adm-blob{opacity:.22}
.adm[data-t="light"] .adm-grid{background-image:linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px)}
.adm[data-t="light"] .adm-glass{background:#fff;border-color:rgba(20,40,28,.1);box-shadow:0 10px 30px -18px rgba(20,40,28,.35)}
.adm[data-t="light"] .adm-input{background:#fff;color:#17261d;border-color:rgba(20,40,28,.18)}
.adm[data-t="light"] .adm-input::placeholder{color:rgba(23,38,29,.4)}
.adm[data-t="light"] select.adm-input option{background:#fff;color:#17261d}
.adm[data-t="light"] .adm-label{color:rgba(23,38,29,.6)}
.adm[data-t="light"] .adm-btn-ghost{color:#17261d;border-color:rgba(20,40,28,.16);background:rgba(20,40,28,.04)}
.adm[data-t="light"] .adm-btn-ghost:hover:not(:disabled){background:rgba(20,40,28,.1)}
.adm[data-t="light"] .adm-btn-danger{color:#b91c1c;background:rgba(239,68,68,.08)}
.adm[data-t="light"] .adm-nav{color:rgba(23,38,29,.7)}
.adm[data-t="light"] .adm-nav:hover{background:rgba(20,40,28,.06);color:#000}
.adm[data-t="light"] .adm-nav[data-active="true"]{color:#0b2616;background:linear-gradient(120deg,rgba(74,222,128,.3),rgba(243,160,68,.28))}
.adm[data-t="light"] .adm-title{color:#285640!important}
.adm[data-t="light"] .adm-glass{border-color:rgba(40,86,64,.09)!important}
.adm[data-t="light"] .adm-label{color:rgba(23,38,29,.65)!important}

/* Welcome banner on the dashboard overview (plain CSS so the light-theme overrides never touch it) */
.adm-hero{position:relative;isolation:isolate;overflow:hidden;border-radius:1.25rem;padding:1.5rem 1.6rem;margin-bottom:1rem;color:#fff;background:linear-gradient(120deg,#0b2417 0%,#285640 62%,#3d7556 100%);box-shadow:0 22px 50px -26px rgba(12,42,28,.8)}
.adm-hero::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(380px 240px at 100% 0%,rgba(243,160,68,.42),transparent 70%),radial-gradient(360px 300px at -10% 105%,rgba(74,222,128,.25),transparent 70%)}
.adm-hero small{display:block;font-size:.74rem;font-weight:600;color:rgba(255,255,255,.7)}
.adm-hero h3{margin-top:.25rem;font-size:1.65rem;font-weight:800;letter-spacing:-.01em;line-height:1.15;color:#fff}
.adm-hero p{margin-top:.4rem;max-width:34rem;font-size:.86rem;line-height:1.5;color:rgba(255,255,255,.78)}
.adm-hero-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.1rem}
.adm-hero-chip{display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .9rem;border-radius:9999px;font-size:.78rem;font-weight:700;color:#fff;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.24);transition:background .2s,transform .2s}
.adm-hero-chip:hover{background:rgba(255,255,255,.26);transform:translateY(-1px)}
.adm-hero-chip b{display:inline-grid;place-items:center;min-width:1.35rem;height:1.35rem;padding:0 .35rem;border-radius:9999px;font-size:.68rem;background:#F3A044;color:#2b1a05}
`;

function ThemeToggle({ theme, setTheme }) {
  return (
    <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="adm-btn-ghost" aria-label="Toggle admin theme">
      {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}<span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}

function AdminBackdrop() {
  return (
    <div className="adm-bg" aria-hidden="true">
      <div className="adm-blob -left-24 -top-24 h-96 w-96 bg-emerald-500/50" />
      <div className="adm-blob -right-20 top-1/3 h-[26rem] w-[26rem] bg-orange-500/35" style={{ animationDelay: '-5s' }} />
      <div className="adm-blob bottom-[-8rem] left-1/3 h-96 w-96 bg-teal-500/30" style={{ animationDelay: '-9s' }} />
      <div className="adm-grid" />
    </div>
  );
}

/* =====================================================================
   SIGN-IN SCREENS  (visitor sign in, create account, admin sign in)
   One shared, professional layout: brand panel on the left, form on the
   right, social sign-in below the main form.
   ===================================================================== */
const SOCIAL_ICONS = {
  google: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.83z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#0A66C2" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" /></svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#24292f" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.83-.26.83-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .3z" /></svg>
  ),
};

const SOCIAL_PROVIDERS = [
  { id: 'google', label: 'Google' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'github', label: 'GitHub' },
];

function SocialAuthButtons({ intent }) {
  return (
    <div className="r4d-social-grid">
      {SOCIAL_PROVIDERS.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => {
            const query = intent === 'admin' ? '?intent=admin' : '';
            window.location.assign(`${API}/api/auth/${provider.id}${query}`);
          }}
          className="r4d-social"
          aria-label={`Continue with ${provider.label}`}
        >
          {SOCIAL_ICONS[provider.id]}
          <span>{provider.label}</span>
        </button>
      ))}
    </div>
  );
}

/* Left brand panel (hidden on phones, where a slim brand bar is shown instead) */
function AuthBrandPanel({ eyebrow, title, text, points, footer }) {
  return (
    <aside className="r4d-auth-side">
      <div className="r4d-auth-brand">
        <span className="r4d-auth-logo"><img src={logo} alt="REL4D" /></span>
        <span><strong>REL4D<i>.</i></strong><small>{eyebrow}</small></span>
      </div>
      <div className="r4d-auth-copy">
        <h2>{title}</h2>
        <p>{text}</p>
        <ul>
          {points.map(({ icon: Icon, title: pointTitle, text: pointText }) => (
            <li key={pointTitle}>
              <span><Icon size={18} /></span>
              <div><b>{pointTitle}</b><em>{pointText}</em></div>
            </li>
          ))}
        </ul>
      </div>
      <p className="r4d-auth-foot">{footer}</p>
    </aside>
  );
}

function AuthMobileBar({ label }) {
  return (
    <div className="r4d-auth-mobilebar">
      <span className="r4d-auth-logo"><img src={logo} alt="REL4D" /></span>
      <span><strong>REL4D<i>.</i></strong><small>{label}</small></span>
    </div>
  );
}

/* Text input with a leading icon and an optional element on the right */
function AuthField({ icon: Icon, label, id, right, ...rest }) {
  return (
    <div>
      <label className="r4d-label" htmlFor={id}>{label}</label>
      <div className="r4d-field">
        {Icon && <Icon size={17} className="lead" aria-hidden="true" />}
        <input id={id} {...rest} className={`r4d-input${Icon ? '' : ' noicon'}${right ? ' has-right' : ''}`} />
        {right}
      </div>
    </div>
  );
}

function PasswordField({ id, label, value, onChange, autoComplete, placeholder, minLength }) {
  const [show, setShow] = useState(false);
  return (
    <AuthField
      id={id} icon={LockKeyhole} label={label} required minLength={minLength}
      type={show ? 'text' : 'password'} autoComplete={autoComplete} placeholder={placeholder}
      value={value} onChange={onChange}
      right={<button type="button" className="r4d-eye" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>}
    />
  );
}

function PasswordStrength({ value }) {
  if (!value) return null;
  const score = [value.length >= 8, /[a-z]/.test(value) && /[A-Z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#ef4444', '#ef4444', '#f59e0b', '#84cc16', '#16a34a'];
  return (
    <div className="r4d-strength" aria-live="polite">
      <div className="bars">{[1, 2, 3, 4].map((n) => <i key={n} style={{ background: n <= score ? colors[score] : '#e2e9e4' }} />)}</div>
      <span style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

/* ----- the pop-up that appears when you press the Admin button ----- */
function AdminLogin({ onLoggedIn, onClose, notice }) {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const data = await apiRequest('/api/admin/login', { method: 'POST', body: creds });
      onLoggedIn(data.token, data.user);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  return (
    <div className="r4d-auth-stage" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="r4d-auth-card adm-in">
        <AuthMobileBar label="Admin console" />
        <AuthBrandPanel
          eyebrow="Admin console"
          title="Run your website from one place."
          text="Review enquiries, publish projects and manage applications securely."
          points={[
            { icon: MessageSquare, title: 'Messages inbox', text: 'Read, star and reply to enquiries from the contact form.' },
            { icon: FolderKanban, title: 'Projects, team and careers', text: 'Add, edit, hide or remove anything shown on the site.' },
            { icon: FileText, title: 'Applications', text: 'Track candidates from new to hired and download CVs.' },
          ]}
          footer="Authorised administrators only. Sessions expire after 12 hours."
        />
        <div className="r4d-auth-main">
          <button type="button" onClick={onClose} aria-label="Close" className="r4d-auth-close"><X size={18} /></button>
          <span className="r4d-auth-badge"><ShieldCheck size={14} />Secure area</span>
          <h2 className="r4d-auth-title">Admin sign in</h2>
          <p className="r4d-auth-sub">Enter your administrator details to open the console.</p>
          {notice && <p role="alert" className="r4d-alert warn" style={{ marginTop: '1rem' }}><AlertCircle size={16} className="shrink-0" /><span>{notice}</span></p>}
          <form onSubmit={submit} className="r4d-auth-form">
            <AuthField id="adm-email" icon={Mail} label="Email address" required type="email" autoComplete="email" autoFocus placeholder="admin@rel4d.com" value={creds.email} onChange={(e) => setCreds((c) => ({ ...c, email: e.target.value }))} />
            <PasswordField id="adm-pass" label="Password" autoComplete="current-password" placeholder="Enter your password" value={creds.password} onChange={(e) => setCreds((c) => ({ ...c, password: e.target.value }))} />
            {error && <p role="alert" className="r4d-alert err"><AlertCircle size={16} className="shrink-0" /><span>{error}</span></p>}
            <Btn type="submit" loading={loading} className="r4d-auth-btn">{!loading && <ShieldCheck size={17} />}{loading ? 'Signing in…' : 'Sign in to console'}</Btn>
          </form>
          <div className="r4d-divider">or continue with</div>
          <SocialAuthButtons intent="admin" />
          <button type="button" onClick={onClose} className="r4d-auth-back"><ArrowLeft size={15} />Back to website</button>
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, actions, children }) {
  return (
    <section className="adm-in">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="adm-title text-2xl font-extrabold sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-white/55">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

function Empty({ icon: Icon, text }) {
  return (
    <div className="grid place-items-center gap-3 px-6 py-14 text-center text-white/45">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-white/5"><Icon size={24} /></span>
      <p className="text-sm">{text}</p>
    </div>
  );
}

/* ----- Visitor sign in / create account pop-up ----- */
function AuthModal({ mode, setMode, onClose, onDone, notice }) {
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const reg = mode === 'register';

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(''); setLoading(true);
    try {
      const data = await apiRequest(reg ? '/api/auth/register' : '/api/auth/login', { method: 'POST', body: reg ? f : { email: f.email, password: f.password } });
      onDone(data.token, data.user);
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return createPortal(
    <div className="r4d-auth-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label={reg ? 'Create your account' : 'Sign in'}>
      <div className="r4d-auth-card r4d-pop">
        <AuthMobileBar label="Research & learning" />
        <AuthBrandPanel
          eyebrow="Research & learning"
          title={reg ? 'Join the REL4D community.' : 'Good to see you again.'}
          text={reg
            ? 'Create a free account to stay close to our work and apply for opportunities with REL4D.'
            : 'Sign in to pick up where you left off and keep in touch with the REL4D team.'}
          points={[
            { icon: Bell, title: 'Stay connected', text: 'Follow our projects and updates from Kigali.' },
            { icon: Briefcase, title: 'Apply with your CV', text: 'Send applications for open roles or an open application.' },
            { icon: ShieldCheck, title: 'Private and secure', text: 'Your details are only used to manage your account.' },
          ]}
          footer={`REL4D Ltd · Kigali, Rwanda · TIN ${CONTACT.tin}`}
        />
        <div className="r4d-auth-main">
          <button type="button" onClick={onClose} aria-label="Close" className="r4d-auth-close"><X size={18} /></button>
          <span className="r4d-auth-badge">{reg ? <UserPlus size={14} /> : <UserRound size={14} />}{reg ? 'New account' : 'Visitor account'}</span>
          <h2 className="r4d-auth-title">{reg ? 'Create your account' : 'Welcome back'}</h2>
          <p className="r4d-auth-sub">{reg ? 'It takes less than a minute. No payment needed.' : 'Sign in with your email or a social account.'}</p>

          <div className="r4d-tabs" role="tablist" aria-label="Account">
            {[['login', 'Sign in'], ['register', 'Create account']].map(([m, l]) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setError(''); }}>{l}</button>
            ))}
          </div>

          {notice && <p role="alert" className="r4d-alert warn" style={{ marginTop: '1rem' }}><AlertCircle size={16} className="shrink-0" /><span>{notice}</span></p>}

          <form onSubmit={submit} className="r4d-auth-form">
            {reg && <AuthField id="auth-name" icon={UserRound} label="Full name" required autoComplete="name" placeholder="Your full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />}
            <AuthField id="auth-email" icon={Mail} label="Email address" required type="email" autoComplete="email" placeholder="you@example.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <div>
              <PasswordField id="auth-pass" label="Password" minLength={reg ? 8 : 1} autoComplete={reg ? 'new-password' : 'current-password'} placeholder={reg ? 'At least 8 characters' : 'Enter your password'} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
              {reg && <PasswordStrength value={f.password} />}
            </div>
            {error && <p role="alert" className="r4d-alert err"><AlertCircle size={16} className="shrink-0" /><span>{error}</span></p>}
            <Btn type="submit" loading={loading} className="r4d-auth-btn">{!loading && (reg ? <UserPlus size={17} /> : <ArrowUpRight size={17} />)}{loading ? (reg ? 'Creating account…' : 'Signing in…') : (reg ? 'Create account' : 'Sign in')}</Btn>
          </form>

          <div className="r4d-divider">or continue with</div>
          <SocialAuthButtons intent="user" />

          <p className="r4d-auth-switch">
            {reg ? 'Already have an account?' : 'New to REL4D?'}{' '}
            <button type="button" className="r4d-auth-link" onClick={() => { setMode(reg ? 'login' : 'register'); setError(''); }}>{reg ? 'Sign in' : 'Create an account'}</button>
          </p>
        </div>
      </div>
    </div>, document.body);
}

/* ----- Overview: stats, 14-day chart, quick actions ----- */
function Sparkline({ values }) {
  const w = 640, h = 120, pad = 10;
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => [pad + (i * (w - pad * 2)) / Math.max(1, values.length - 1), h - pad - (v / max) * (h - pad * 2)]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-32 w-full" preserveAspectRatio="none" role="img" aria-label="Messages in the last 14 days">
      <defs>
        <linearGradient id="adm-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#4ade80" stopOpacity=".4" /><stop offset="1" stopColor="#4ade80" stopOpacity="0" /></linearGradient>
        <linearGradient id="adm-stroke" x1="0" x2="1"><stop offset="0" stopColor="#4ade80" /><stop offset="1" stopColor="#f3a044" /></linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={pad} x2={w - pad} y1={pad + f * (h - pad * 2)} y2={pad + f * (h - pad * 2)} stroke="currentColor" strokeOpacity=".1" />)}
      <path d={area} fill="url(#adm-fill)" />
      <path d={line} fill="none" stroke="url(#adm-stroke)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="adm-line" />
      {pts.map(([x, y], i) => values[i] > 0 && <circle key={i} cx={x} cy={y} r="3" fill="#f3a044" />)}
    </svg>
  );
}

function Donut({ data }) {
  const total = data.reduce((sum, item) => sum + item.n, 0);
  const circumference = 2 * Math.PI * 34;
  let offset = 0;
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20 shrink-0" role="img" aria-label="Applications by status">
      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="10" />
      {total > 0 && data.map(({ s, n }) => {
        const length = (n / total) * circumference;
        const segment = (
          <circle
            key={s}
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke={STATUS_COLOR[s]}
            strokeWidth="10"
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 40 40)"
          />
        );
        offset += length;
        return segment;
      })}
      <text x="40" y="43" textAnchor="middle" className="fill-current text-[12px] font-bold">{total}</text>
    </svg>
  );
}

const STAT_CARDS = [
  { key: 'unread_messages', label: 'Unread messages', icon: Inbox, tone: 'from-orange-500 to-amber-400', tab: 'messages' },
  { key: 'messages', label: 'Total messages', icon: MessageSquare, tone: 'from-emerald-500 to-teal-400', tab: 'messages' },
  { key: 'new_applications', label: 'New applications', icon: Bell, tone: 'from-fuchsia-500 to-pink-400', tab: 'applications' },
  { key: 'applications', label: 'All applications', icon: FileText, tone: 'from-sky-500 to-cyan-400', tab: 'applications' },
  { key: 'users', label: 'Registered users', icon: Users, tone: 'from-violet-500 to-indigo-400', tab: 'users' },
  { key: 'projects', label: 'Projects', icon: FolderKanban, tone: 'from-lime-500 to-emerald-400', tab: 'projects' },
  { key: 'openings', label: 'Open positions', icon: Briefcase, tone: 'from-rose-500 to-orange-400', tab: 'openings' },
];

function Overview({ stats, messages, applications, users = [], goto, user }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = (user?.name || 'Admin').split(' ')[0];
  const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (13 - i)); return d; });
  const inDay = (list, key, d) => list.filter((m) => { const t = new Date(m[key]).getTime(); return t >= d.getTime() && t.getTime() < d.getTime() + 86400000; }).length;
  const counts = days.map((d) => inDay(messages, 'created_at', d));
  const signups = days.map((d) => inDay(users, 'created_at', d));
  const byStatus = APP_STATUSES.map((s) => ({ s, n: applications.filter((a) => a.status === s).length }));
  const svc = Object.entries(messages.reduce((a, m) => { const k = m.service || 'General'; a[k] = (a[k] || 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const svcMax = Math.max(1, ...svc.map(([, n]) => n));
  const unreadCount = Number(stats?.unread_messages || 0);
  const newAppCount = Number(stats?.new_applications || 0);
  const badge = { messages: unreadCount, applications: newAppCount };
  const ctx = { call, run, busy, toast, search };

  let content = null;
  if (tab === 'overview') content = <Overview stats={liveStats} messages={messages} applications={applications} users={users} goto={goto} user={user} />;
  if (tab === 'messages') content = <MessagesPanel items={messages} setItems={setMessages} ctx={ctx} focusId={focusMessage} />;
  if (tab === 'projects') content = <ContentManager kind="project" title="Projects" singular="Project" subtitle="Projects shown in the “Recent projects” section of the website." items={projects} setItems={setProjects} fields={PROJECT_FIELDS} meta={['category']} ctx={ctx} />;
  if (tab === 'team') content = <ContentManager kind="team" title="Team profiles" singular="Team profile" subtitle="Add and manage the people shown in the website leadership section." items={teamMembers} setItems={setTeamMembers} fields={TEAM_FIELDS} meta={['role']} ctx={ctx} />;
  if (tab === 'openings') content = <ContentManager kind="opening" title="Careers" singular="Opening" subtitle="Open positions that candidates can apply for." items={openings} setItems={setOpenings} fields={OPENING_FIELDS} meta={['type', 'location', 'deadline']} ctx={ctx} />;
  if (tab === 'applications') content = <ApplicationsPanel items={applications} setItems={setApplications} ctx={ctx} token={token} />;
  if (tab === 'users') content = <UsersPanel items={users} setItems={setUsers} ctx={ctx} />;
  if (tab === 'settings') content = <SettingsPanel user={user} ctx={ctx} messages={messages} applications={applications} onLogout={onLogout} />;

  const navButtons = (horizontal = false) => ADMIN_TABS.map((tb) => (
    <button key={tb.id} type="button" data-active={tab === tb.id} onClick={() => goto(tb.id)} className={`adm-nav ${horizontal ? '!w-auto shrink-0 !px-4' : ''}`}>
      <tb.icon size={18} />{tb.label}
      {badge[tb.id] > 0 && <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-[.65rem] font-extrabold text-white">{badge[tb.id]}</span>}
    </button>
  ));

  return (
    <div className="relative flex h-full">
      <aside className="adm-glass hidden w-64 shrink-0 flex-col gap-1 border-y-0 border-l-0 p-4 lg:flex">
        <div className="mb-5 flex items-center gap-3 px-1">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white p-1.5"><img src={logo} alt="" className="h-full w-full object-contain" /></span>
          <div><p className="text-lg font-extrabold leading-tight">REL4D</p><p className="text-[.65rem] font-bold uppercase tracking-[.2em] text-orange-300">Admin console</p></div>
        </div>
        {navButtons()}
        <div className="mt-auto rounded-2xl border border-white/10 bg-black/25 p-3">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-orange-400 font-bold">{initials(user?.name)}</span><div className="min-w-0"><p className="truncate text-sm font-bold">{user?.name || 'Admin'}</p><p className="truncate text-xs text-white/45">{user?.email}</p></div></div>
          <button type="button" onClick={onLogout} className="adm-btn-danger mt-3 w-full !py-2"><LogOut size={14} />Sign out</button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="adm-glass flex flex-wrap items-center gap-3 border-x-0 border-t-0 px-4 py-3 sm:px-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-white p-1 lg:hidden"><img src={logo} alt="" className="h-full w-full object-contain" /></span>
          <div className="relative min-w-[160px] flex-1 sm:max-w-md">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search in this section…" aria-label="Search" className="adm-input !pl-10" />
          </div>
          <div className="ml-auto flex items-center gap-2"><ThemeToggle theme={theme} setTheme={setTheme} />
            <Btn type="button" loading={refreshing} onClick={() => refresh(true)} className="adm-btn-ghost">{!refreshing && <RefreshCw size={15} />}<span className="hidden sm:inline">Refresh</span></Btn>
            <button type="button" onClick={onClose} className="adm-btn-ghost"><X size={15} /><span className="hidden sm:inline">Close</span></button>
            <button type="button" onClick={onLogout} className="adm-btn-danger lg:hidden" aria-label="Sign out"><LogOut size={15} /></button>
          </div>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b border-white/10 px-3 py-2 lg:hidden" aria-label="Admin sections">{navButtons(true)}</nav>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="grid h-full min-h-[50vh] place-items-center"><div className="flex flex-col items-center gap-4 text-white/70"><Spinner size={46} className="text-orange-300" /><p className="text-sm font-semibold">Loading your dashboard…</p></div></div>
          ) : content}
        </main>
      </div>

      <div className="pointer-events-none fixed bottom-5 right-5 z-[300] flex w-[min(92vw,22rem)] flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`adm-toast adm-glass pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${t.type === 'err' ? '!border-red-400/40 text-red-100' : '!border-emerald-400/40 text-emerald-50'}`}>
            <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${t.type === 'err' ? 'bg-red-500' : 'bg-emerald-500'}`}>{t.type === 'err' ? <X size={12} /> : <Check size={12} />}</span>{t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------- Theme + animations ------------------------- */
const CSS = `
:root{
  --g:#4D8A6C; --gd:#285640; --gs:#F1F6F0;
  --o:#F3A044; --od:#D9822E; --os:#FFF4E7;
  --earth:#65513B; --paper:#FFFFFF;
}
html{scroll-behavior:smooth}
body{background:#FFFFFF}
.r4d-app{min-height:100vh;background:#FFFFFF;color:#24372c;transition:background-color .25s ease,color .25s ease}
.r4d-app[data-theme="light"]{--paper:#FFFFFF;--gs:#F1F6F0;background:#FFFFFF}
.r4d-app[data-theme="light"] #home{background-color:#FFFFFF!important;background-image:none!important;color:#24372c!important}
.r4d-app[data-theme="light"] header nav{background:rgba(255,255,255,.98)!important}
.r4d-app[data-theme="light"] #home [aria-hidden="true"]{opacity:.12}
.r4d-app[data-theme="light"] #home h1,
.r4d-app[data-theme="light"] #home p,
.r4d-app[data-theme="light"] #home .text-white,
.r4d-app[data-theme="light"] #home [class*="text-white/"]{color:#24372c!important}
.r4d-app[data-theme="light"] #home [class*="border-white/"]{border-color:rgba(40,86,64,.18)!important}
.r4d-app[data-theme="light"] #home [class*="bg-white/"]{background-color:rgba(241,246,240,.9)!important}
.r4d-app[data-theme="light"] #home [class*="text-[var(--gd)]"]{color:var(--gd)!important}
.r4d-app[data-theme="dark"]{--paper:#14231c;--gs:#20362a;--os:#3a3123;--g:#75ad83;--gd:#285640;--o:#f3a044;--od:#f3a044;color:#e6eee7;color-scheme:dark}
.r4d-app[data-theme="dark"] #home{background-color:#14231c!important;color:#edf4ee}
.r4d-app[data-theme="dark"] #home .bg-white,
.r4d-app[data-theme="dark"] #home [class*="bg-white/"]{background-color:#20362a!important}
.r4d-app[data-theme="dark"] #home [class*="border-emerald-800"]{border-color:rgba(167,208,177,.35)!important}
.r4d-app[data-theme="dark"] #home .text-emerald-900{color:#dcebdd!important}
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
`;

/* ------------------------------- Page --------------------------------- */
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [adminOpen, setAdminOpen] = useState(() => typeof window !== 'undefined' && (
    window.location.hash === '#admin'
    || (() => {
      const callback = new URLSearchParams(window.location.hash.slice(1));
      return callback.has('auth_admin_token') || callback.get('auth_intent') === 'admin';
    })()
  ));
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('rel4d-theme') || 'light'; } catch { return 'light'; }
  });
  const [authMode, setAuthMode] = useState(() => {
    if (typeof window === 'undefined') return null;
    const callback = new URLSearchParams(window.location.hash.slice(1));
    return callback.has('auth_error') && callback.get('auth_intent') !== 'admin' ? 'login' : null;
  });
  const [authNotice, setAuthNotice] = useState(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.hash.slice(1)).get('auth_error') || '';
  });
  const [account, setAccount] = useState(() => { try { return JSON.parse(localStorage.getItem('rel4d-user') || 'null'); } catch { return null; } });
  const accountDone = (token, u) => { try { localStorage.setItem('rel4d-user-token', token); localStorage.setItem('rel4d-user', JSON.stringify(u)); } catch { /* storage unavailable */ } setAccount(u); setAuthMode(null); };
  const accountOut = () => { try { localStorage.removeItem('rel4d-user-token'); localStorage.removeItem('rel4d-user'); } catch { /* storage unavailable */ } setAccount(null); };
  const [language, setLanguage] = useState(() => {
    try { return UI_COPY[localStorage.getItem('rel4d-language')] ? localStorage.getItem('rel4d-language') : 'en'; } catch { return 'en'; }
  });
  const t = UI_COPY[language] || UI_COPY.en;

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const socialToken = hash.get('auth_token');
    const adminToken = hash.get('auth_admin_token');
    const socialError = hash.get('auth_error');
    if (adminToken) {
      saveToken(adminToken);
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } else if (socialToken) {
      try { localStorage.setItem('rel4d-user-token', socialToken); } catch { /* storage unavailable */ }
      apiRequest('/api/auth/me', { token: socialToken })
        .then((data) => { setAccount(data.user); try { localStorage.setItem('rel4d-user', JSON.stringify(data.user)); } catch { /* storage unavailable */ } })
        .catch(() => {})
        .finally(() => { window.history.replaceState(null, '', window.location.pathname + window.location.search); });
    } else if (socialError) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const openAdmin = () => {
    setAdminOpen(true);
    try { window.history.replaceState(null, '', '#admin'); } catch { /* ignore */ }
  };
  const closeAdmin = () => {
    setAdminOpen(false);
    setAuthNotice('');
    try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch { /* ignore */ }
  };
  const closeAuth = () => { setAuthMode(null); setAuthNotice(''); };

  useEffect(() => { const timer = setTimeout(() => setLoading(false), 1900); return () => clearTimeout(timer); }, []);
  useEffect(() => { // typing /#admin in the address bar also opens the pop-up
    const onHash = () => { if (window.location.hash === '#admin') setAdminOpen(true); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => { // page behind the pop-up must not scroll
    document.body.style.overflow = adminOpen || authMode ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [adminOpen, authMode]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'rw' ? 'REL4D Ltd | Ubushakashatsi no kwigira ku iterambere' : language === 'fr' ? 'REL4D Ltd | Recherche et apprentissage au service du développement' : 'REL4D Ltd | Research and Learning for Development';
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
        <Navbar theme={theme} setTheme={setTheme} t={t} onAdmin={openAdmin} onAuth={setAuthMode} account={account} onLogout={accountOut} language={language} setLanguage={setLanguage} />
        {authMode && <AuthModal mode={authMode} setMode={(mode) => { setAuthNotice(''); setAuthMode(mode); }} onClose={closeAuth} onDone={accountDone} notice={authNotice} />}
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
          <Careers />
          <Credentials />
          <Team />
          <Contact t={t} />
        </main>
        <Footer onAdmin={openAdmin} />
        {adminOpen && <AdminPortal onClose={closeAdmin} notice={authNotice} />}
      </div>
    </LanguageContext.Provider>
  );
}