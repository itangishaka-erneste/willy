import { useEffect, useRef, useState } from 'react';
import {
  Menu, X, ChevronDown, Layers, Cpu, BarChart3, GraduationCap, Mail, Phone, MapPin,
  ArrowUpRight, Send, CheckCircle2, Award, Briefcase, BadgeCheck,
} from 'lucide-react';

/* =====================================================================
   EDIT YOUR CONTENT HERE. Everything on the page reads from these lists.
   Colours: green #15803D and orange-red #FF4500 (see CSS block at bottom).
   ===================================================================== */
const LOGO = '/Capture.PNG'; // put Capture.PNG in your /public folder

const CONTACT = {
  email: 'rel4dltd@gmail.com',
  phone: '+250 788 286 965',
  place: 'Kigali, Rwanda',
  tin: '121718400',
};

const STATS = [
  { value: 50, suffix: '+', label: 'Projects completed' },
  { value: 15, suffix: '+', label: 'Development sectors' },
  { value: 10, suffix: '+', label: 'Years of MERL experience' },
  { value: 3, label: 'Working languages: English, French, Kinyarwanda' },
];

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

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'About', children: [
    { label: 'Our story', href: '#about' },
    { label: 'Mission & vision', href: '#mission' },
    { label: 'Leadership', href: '#team' },
  ] },
  { label: 'Services', children: SERVICES.map((s) => ({ label: s.title, href: '#services' })) },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

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
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* Logo image with a text fallback if the file is missing */
function Logo({ className = '', ring = '' }) {
  const [bad, setBad] = useState(false);
  if (bad) {
    return <span className={`grid place-items-center rounded-full bg-[var(--g)] text-xs font-extrabold text-white ${className} ${ring}`}>R4D</span>;
  }
  return <img src={LOGO} alt="REL4D logo" onError={() => setBad(true)} className={`rounded-full bg-white object-cover ${className} ${ring}`} />;
}

const Heading = ({ title, text, light }) => (
  <Reveal className="mx-auto mb-14 max-w-2xl text-center">
    <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[var(--o)]" />
    {text && <p className={`mt-5 ${light ? 'text-white/70' : 'text-black/65'}`}>{text}</p>}
  </Reveal>
);

/* ------------------------------ Loader -------------------------------- */
function Loader({ done }) {
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
        <p className="text-sm text-black/60">Evidence drives change…</p>
      </div>
    </div>
  );
}

/* ------------------------------ Navbar -------------------------------- */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => { setOpen(false); setDrop(null); };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md backdrop-blur' : 'bg-white'}`}>
      <div className="h-1 w-full bg-gradient-to-r from-[var(--g)] via-white to-[var(--o)]" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8" aria-label="Main">
        <a href="#home" className="flex items-center gap-3" onClick={close}>
          <Logo className="h-12 w-12" ring="ring-2 ring-[var(--g)]" />
          <span className="leading-tight">
            <span className="block text-sm font-bold">REL4D Ltd</span>
            <span className="block text-xs font-medium text-[var(--g)]">Research & Learning for Development</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <li key={item.label} className="relative"
              onMouseEnter={() => item.children && setDrop(item.label)} onMouseLeave={() => setDrop(null)}>
              {item.children ? (
                <>
                  <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium hover:bg-[var(--gs)]"
                    aria-expanded={drop === item.label} onClick={() => setDrop(drop === item.label ? null : item.label)}>
                    {item.label}
                    <ChevronDown size={15} className={`transition-transform ${drop === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {drop === item.label && (
                    <div className="absolute left-0 top-full w-64 pt-2">
                      <ul className="r4d-pop overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <a href={c.href} onClick={close} className="block rounded-xl px-4 py-2.5 text-sm hover:bg-[var(--os)] hover:text-[var(--od)]">{c.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <a href={item.href} className="block rounded-full px-4 py-2 text-sm font-medium hover:bg-[var(--gs)]">{item.label}</a>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#contact" className="hidden rounded-full bg-[var(--o)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--od)] sm:inline-block">Get started</a>
          <button className="grid h-11 w-11 place-items-center rounded-full hover:bg-[var(--gs)] lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="r4d-pop max-h-[75vh] overflow-y-auto border-t border-black/10 bg-white px-5 pb-6 lg:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-black/5 py-1">
              {item.children ? (
                <>
                  <button className="flex w-full items-center justify-between py-3 font-medium" onClick={() => setDrop(drop === item.label ? null : item.label)}>
                    {item.label}<ChevronDown size={18} className={drop === item.label ? 'rotate-180' : ''} />
                  </button>
                  {drop === item.label && item.children.map((c) => (
                    <a key={c.label} href={c.href} onClick={close} className="block py-2 pl-4 text-sm text-black/70">{c.label}</a>
                  ))}
                </>
              ) : (
                <a href={item.href} onClick={close} className="block py-3 font-medium">{item.label}</a>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

/* ------------------------------ Sections ------------------------------ */
function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[var(--gd)] pt-32 text-white lg:pt-40">
      <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-30">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-data-processing-5036-large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--gd)] via-[var(--gd)]/85 to-[var(--g)]/60" />
      <div className="pointer-events-none absolute -right-32 -top-24 h-[480px] w-[480px] rounded-full bg-[var(--o)]/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="r4d-rise inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium" style={{ animationDelay: '2s' }}>
            <span className="h-2 w-2 rounded-full bg-[var(--o)]" /> Evidence drives change and transformation
          </p>
          <h1 className="r4d-rise mt-6 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.6rem]" style={{ animationDelay: '2.1s' }}>
            Research & learning for <span className="text-[var(--o)]">development excellence.</span>
          </h1>
          <p className="r4d-rise mt-6 max-w-2xl text-lg leading-relaxed text-white/80" style={{ animationDelay: '2.25s' }}>
            REL4D is a registered consultancy in Kigali that conducts research and evaluations and supports learning for international development programmes, using data analytics, machine learning and AI to get the most from evidence.
          </p>
          <div className="r4d-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: '2.4s' }}>
            <a href="#services" className="inline-flex items-center gap-2 rounded-full bg-[var(--o)] px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--od)]">Explore services <ArrowUpRight size={18} /></a>
            <a href="#contact" className="rounded-full border-2 border-white px-7 py-3.5 font-semibold transition hover:bg-white hover:text-[var(--gd)]">Request a proposal</a>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-black py-4 text-white">
        <div className="r4d-marquee flex w-max gap-12 whitespace-nowrap text-sm font-medium">
          {[...Array(2)].flatMap((_, i) => ['Baseline', 'Endline', 'Impact', 'MEL systems', 'Analytics', 'Learning', 'Capacity'].map((w) => (
            <span key={w + i} className="flex items-center gap-12">{w}<span className="h-1.5 w-1.5 rounded-full bg-[var(--o)]" /></span>
          )))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 lg:grid-cols-4 lg:px-8">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="border-l-4 border-[var(--g)] pl-5">
            <p className="text-4xl font-extrabold text-[var(--o)] lg:text-5xl"><CountUp to={s.value} suffix={s.suffix} /></p>
            <p className="mt-1 text-sm text-black/65">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-[2rem]">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80" alt="Team discussing research findings" className="aspect-[4/5] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--gd)]/80 via-transparent to-transparent" />
            <span className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-[var(--o)] px-4 py-2 text-sm font-semibold text-white">
              <BadgeCheck size={16} /> Registered consultancy
            </span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="text-3xl font-bold sm:text-4xl">Transforming development through evidence-based approaches.</h2>
          <p className="mt-5 leading-relaxed text-black/70">
            REL4D Ltd (TIN {CONTACT.tin}) is a registered consultancy firm based in Kigali, Rwanda. We conduct research and evaluations and support learning initiatives for international development programmes.
          </p>
          <p className="mt-4 leading-relaxed text-black/70">
            We blend traditional and computational methods to deliver customised evaluations, data analysis, interactive visualisation, predictive modelling and learning strategies that connect evidence to practice across the programme lifecycle.
          </p>
          <ul className="mt-7 space-y-3">
            {['End-to-end research and evaluation services', 'Cutting-edge data analytics and machine learning', 'Monitoring, evaluation and learning (MEL) systems', 'Capacity building and knowledge management'].map((t) => (
              <li key={t} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-[var(--g)]" size={20} />{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Mission() {
  return (
    <section id="mission" className="bg-[var(--gd)] py-20 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Mission & vision" text="The principles behind everything we do." light />
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-white/15 p-9 transition hover:border-[var(--o)]">
            <p className="text-2xl font-bold text-[var(--o)]">Our mission</p>
            <p className="mt-4 leading-relaxed text-white/80">To strengthen development outcomes through a rigorous, robust, evidence-based model of scientific inquiry and collaborative learning partnerships.</p>
          </Reveal>
          <Reveal delay={120} className="rounded-3xl border border-white/15 p-9 transition hover:border-[#4ADE80]">
            <p className="text-2xl font-bold text-[#4ADE80]">Our vision</p>
            <p className="mt-4 leading-relaxed text-white/80">Evidence-informed policies, resilient communities and locally sustained development outcomes, achieved through collaborative learning partnerships.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const [active, setActive] = useState(SERVICES[0].id);
  const s = SERVICES.find((x) => x.id === active);
  const Icon = s.icon;
  return (
    <section id="services" className="py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Our services" text="Everything needed to build strong, functional monitoring, evaluation, research and learning systems." />
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="flex gap-2 overflow-x-auto lg:flex-col">
            {SERVICES.map((x) => (
              <button key={x.id} onClick={() => setActive(x.id)}
                className={`flex shrink-0 items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left font-semibold transition ${active === x.id ? 'border-[var(--gd)] bg-[var(--gd)] text-white' : 'border-black/10 hover:border-[var(--g)]'}`}>
                <x.icon size={20} className={active === x.id ? 'text-[var(--o)]' : 'text-[var(--g)]'} />{x.title}
              </button>
            ))}
          </div>
          <div key={s.id} className="r4d-pop overflow-hidden rounded-3xl bg-[var(--gs)]">
            <div className="h-48 bg-cover bg-center sm:h-56" style={{ backgroundImage: `url(${s.image})` }} />
            <div className="p-8 lg:p-10">
              <span className={`grid h-14 w-14 place-items-center rounded-2xl text-white ${s.color === 'orange' ? 'bg-[var(--o)]' : 'bg-[var(--g)]'}`}><Icon size={26} /></span>
              <h3 className="mt-5 text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 max-w-xl text-black/70">{s.text}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {s.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium"><span className="h-2 w-2 rounded-full bg-[var(--o)]" />{pt}</li>
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
  return (
    <section id="expertise" className="bg-[var(--gs)] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Technical expertise" text="Methods and tools our team applies on every assignment." />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map((e, i) => (
            <Reveal key={e.title} delay={i * 70}>
              <div className="h-full rounded-3xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <span className="mb-4 block h-1.5 w-10 rounded-full bg-[var(--o)]" />
                <h3 className="text-lg font-bold">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/65">{e.text}</p>
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
  return (
    <section id="experience" className="py-20">
      <div className="mx-auto max-w-4xl px-5">
        <Heading title="Our experience" text="A proven track record with international organisations and development programmes." />
        <div className="relative border-l-4 border-[var(--g)] pl-8">
          {EXPERIENCE.map((j, i) => (
            <Reveal key={j.title} delay={i * 100} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[46px] top-1 h-5 w-5 rounded-full border-4 border-white bg-[var(--o)]" />
              <p className="text-sm font-semibold text-[var(--o)]">{j.year}</p>
              <h3 className="mt-1 text-xl font-bold">{j.title}</h3>
              <p className="text-sm font-medium text-[var(--g)]">{j.org}</p>
              <p className="mt-2 text-black/65">{j.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {j.tags.map((t) => <span key={t} className="rounded-full bg-[var(--gs)] px-3 py-1 text-xs font-medium text-[var(--gd)]">{t}</span>)}
              </div>
            </Reveal>
          ))}
        </div>

        <h3 className="mb-6 mt-20 text-center text-2xl font-bold">Selected consulting clients</h3>
        <div className="grid gap-5 md:grid-cols-2">
          {CLIENTS.map((c, i) => (
            <Reveal key={c.name} delay={i * 80}>
              <div className="h-full rounded-2xl border border-black/10 p-6 transition hover:border-[var(--o)] hover:shadow-lg">
                <p className="text-xs font-semibold text-[var(--o)]">{c.years}</p>
                <h4 className="mt-1 font-bold">{c.name}</h4>
                <p className="mt-2 text-sm text-black/65">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="bg-[var(--gs)] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Recent projects" text="Key work across development sectors in Rwanda." />
        <div className="grid gap-6 md:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <article className="h-full overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-44 bg-gradient-to-br from-[var(--g)] to-[var(--gd)] bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }}>
                  <span className="absolute right-4 top-4 rounded-full bg-[var(--o)] px-3 py-1 text-xs font-semibold text-white">{p.category}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/65">{p.description}</p>
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
  return (
    <section id="credentials" className="py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Credentials & training" text="Registrations and professional development that back our work." />
        <div className="grid gap-6 md:grid-cols-3">
          {CREDENTIALS.map((c, i) => (
            <Reveal key={c.title} delay={i * 90}>
              <div className="h-full rounded-3xl border border-black/10 p-7 text-center transition hover:border-[var(--g)] hover:shadow-lg">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--g)] text-white"><c.icon size={26} /></span>
                <h3 className="mt-5 text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-black/65">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-10 max-w-3xl rounded-3xl bg-[var(--gs)] p-8">
          <h3 className="text-lg font-bold">Essential training</h3>
          <ul className="mt-4 space-y-2.5">
            {TRAINING.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-black/75"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--o)]" />{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Team() {
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
    <section id="team" className="bg-[var(--gd)] py-20 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Our leadership" text="Experienced professionals driving evidence-based transformation." light />
        <div className="grid gap-6 md:grid-cols-3">
          {members.map((m, i) => (
            <Reveal key={m.name} delay={i * 100} className={i === 0 ? 'md:col-span-3 lg:col-span-1' : ''}>
              <div className="h-full rounded-3xl border border-white/15 p-8 text-center transition hover:border-[var(--o)]">
                {m.photo && !photoBad ? (
                  <img src={m.photo} alt={m.name} onError={() => setPhotoBad(true)} className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-[var(--o)]" />
                ) : (
                  <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-[var(--g)] to-[var(--o)] text-3xl font-bold">{m.name[0]}</div>
                )}
                <h3 className="mt-5 text-lg font-bold">{m.name}</h3>
                <p className="mt-1 text-sm font-medium text-[var(--o)]">{m.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', organization: '', service: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const body = `Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.organization || 'Not provided'}\nService: ${form.service || 'General inquiry'}\n\n${form.message}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Proposal request: ' + (form.service || 'General inquiry'))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const input = 'w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--g)] focus:ring-2 focus:ring-[var(--g)]/20';
  const cards = [
    { icon: Mail, label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Phone, label: 'Phone', value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Location', value: CONTACT.place, href: 'https://www.google.com/maps/search/Kigali+Rwanda' },
  ];

  return (
    <section id="contact" className="py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Heading title="Get in touch" text="Ready to strengthen your programmes with evidence-based insight? Tell us about your project." />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            {cards.map((c, i) => (
              <Reveal key={c.label} delay={i * 90}>
                <a href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-5 rounded-2xl border border-black/10 p-5 transition hover:border-[var(--o)] hover:shadow-lg">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[var(--g)] text-white"><c.icon size={22} /></span>
                  <span><span className="block text-sm text-black/50">{c.label}</span><span className="font-semibold">{c.value}</span></span>
                </a>
              </Reveal>
            ))}
            <Reveal delay={270}>
              <div className="rounded-2xl bg-[var(--gd)] p-5 text-white">
                <p className="text-sm text-white/60">Managing Director</p>
                <p className="font-semibold">Jean Willy ULIHO</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <form onSubmit={submit} className="space-y-3 rounded-3xl bg-[var(--gs)] p-7 lg:p-9">
              <h3 className="text-xl font-bold">Request a proposal</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={input} placeholder="Full name *" value={form.name} onChange={set('name')} required />
                <input className={input} type="email" placeholder="Email *" value={form.email} onChange={set('email')} required />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={input} placeholder="Organization (optional)" value={form.organization} onChange={set('organization')} />
                <select className={input} value={form.service} onChange={set('service')}>
                  <option value="">Service interested in</option>
                  {SERVICES.map((s) => <option key={s.id}>{s.title}</option>)}
                  <option>Multiple services</option>
                </select>
              </div>
              <textarea className={input} rows={5} placeholder="Project details *" value={form.message} onChange={set('message')} required />
              {sent && <p role="status" className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm text-[var(--g)]"><CheckCircle2 size={18} /> Your email app is opening with your message.</p>}
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--o)] py-3.5 font-semibold text-white transition hover:bg-[var(--od)]">
                <Send size={17} />Send request
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="h-1 bg-gradient-to-r from-[var(--g)] via-white to-[var(--o)]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-white/70 sm:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span>REL4D Ltd · Research and Learning for Development · TIN {CONTACT.tin}</span>
        </div>
        <p>© {new Date().getFullYear()} REL4D Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ------------------------- Theme + animations ------------------------- */
const CSS = `
:root{
  --g:#15803D; --gd:#0B3D20; --gs:#ECF7F0;
  --o:#FF4500; --od:#D93A00; --os:#FFF0EA;
}
html{scroll-behavior:smooth}
section[id]{scroll-margin-top:84px}
@keyframes r4d-spin{to{transform:rotate(360deg)}}
@keyframes r4d-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes r4d-fill{from{width:0}to{width:100%}}
@keyframes r4d-rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes r4d-pop{from{opacity:0;transform:scale(.97) translateY(6px)}to{opacity:1;transform:none}}
@keyframes r4d-marquee{to{transform:translateX(-50%)}}
.r4d-spin{animation:r4d-spin 6s linear infinite}
.r4d-float{animation:r4d-float 4s ease-in-out infinite}
.r4d-fill{animation:r4d-fill 1.8s ease forwards}
.r4d-rise{opacity:0;animation:r4d-rise .8s ease forwards}
.r4d-pop{animation:r4d-pop .35s ease both}
.r4d-marquee{animation:r4d-marquee 28s linear infinite}
@media (prefers-reduced-motion:reduce){.r4d-spin,.r4d-float,.r4d-marquee{animation:none}}
`;

/* ------------------------------- Page --------------------------------- */
export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1900); return () => clearTimeout(t); }, []);

  return (
    <>
      <style>{CSS}</style>
      <Loader done={!loading} />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Mission />
        <Services />
        <Expertise />
        <Experience />
        <Projects />
        <Credentials />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}