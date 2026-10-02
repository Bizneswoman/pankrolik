'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu as MenuIcon, X, Phone, Mail, MapPin, Clock, Instagram, Facebook,
  Leaf, Sparkles, ConciergeBell, Star, Navigation, CalendarCheck, UtensilsCrossed,
  ChevronLeft, ChevronRight, Quote
} from 'lucide-react'
import { LOGO_BASE64 } from '@/lib/logo-image'

const LOGO = LOGO_BASE64

const ICONS = { Leaf, MapPin, Sparkles, ConciergeBell }

const NAV_LINKS = [
  { id: 'home', label: 'Strona główna' },
  { id: 'o-nas', label: 'O nas' },
  { id: 'menu', label: 'Menu' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'kontakt', label: 'Kontakt' },
]

const CATEGORY_ORDER = ['Przystawki', 'Zupy', 'Dania główne', 'Pizza', 'Burgery', 'Makarony', 'Desery', 'Napoje']

const CAT_EN = {
  'Przystawki': 'Appetizers',
  'Zupy': 'Soups',
  'Dania główne': 'Main courses',
  'Pizza': 'Pizza',
  'Burgery': 'Burgers',
  'Makarony': 'Pasta',
  'Desery': 'Desserts',
  'Napoje': 'Drinks',
}

const T = {
  pl: {
    nav: ['Strona główna', 'O nas', 'Menu', 'Galeria', 'Kontakt'],
    reserve: 'Zarezerwuj stolik',
    heroOverline: 'Restauracja Premium',
    viewMenu: 'Zobacz menu',
    aboutOverline: 'Nasza historia',
    menuOverline: 'Kulinarna sztuka', menuTitle: 'Nasze Menu',
    menuEmpty: 'Nowe menu już wkrótce.', galleryEmpty: 'Galeria już wkrótce.',
    galleryOverline: 'Galeria', galleryTitle: 'Nasze wnętrze i dania', view: 'Zobacz',
    reviewsOverline: 'Referencje', reviewsTitle: 'Opinie naszych gości', moreReviews: 'Zobacz więcej opinii Google',
    findUsOverline: 'Znajdź nas', locationTitle: 'Lokalizacja',
    address: 'Adres', phone: 'Telefon', email: 'E-mail', hours: 'Godziny otwarcia',
    navigate: 'Nawiguj w Google Maps',
    reservationOverline: 'Rezerwacja', reservationTitle: 'Zarezerwuj stolik',
    reservationText: 'Chcesz zarezerwować stolik lub masz pytania? Skontaktuj się z nami telefonicznie lub mailowo – z przyjemnością pomożemy zaplanować Twoją wizytę w Pan Królik.',
    call: 'Zadzwoń', writeUs: 'Napisz do nas', findUs: 'Znajdź nas',
    footerNav: 'Nawigacja', footerContact: 'Kontakt', rights: 'Wszelkie prawa zastrzeżone.',
    mCall: 'Zadzwoń', mNav: 'Nawiguj', mBook: 'Rezerwuj',
  },
  en: {
    nav: ['Home', 'About', 'Menu', 'Gallery', 'Contact'],
    reserve: 'Book a table',
    heroOverline: 'Premium Restaurant',
    viewMenu: 'View menu',
    aboutOverline: 'Our story',
    menuOverline: 'Culinary art', menuTitle: 'Our Menu',
    menuEmpty: 'New menu coming soon.', galleryEmpty: 'Gallery coming soon.',
    galleryOverline: 'Gallery', galleryTitle: 'Our interior & dishes', view: 'View',
    reviewsOverline: 'Testimonials', reviewsTitle: 'What our guests say', moreReviews: 'See more Google reviews',
    findUsOverline: 'Find us', locationTitle: 'Location',
    address: 'Address', phone: 'Phone', email: 'E-mail', hours: 'Opening hours',
    navigate: 'Navigate with Google Maps',
    reservationOverline: 'Reservation', reservationTitle: 'Book a table',
    reservationText: 'Would you like to book a table or have questions? Contact us by phone or email – we will be happy to help you plan your visit to Pan Królik.',
    call: 'Call', writeUs: 'Write to us', findUs: 'Find us',
    footerNav: 'Navigation', footerContact: 'Contact', rights: 'All rights reserved.',
    mCall: 'Call', mNav: 'Navigate', mBook: 'Book',
  },
}

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const FadeIn = ({ children, delay = 0, y = 30, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

const GoldButton = ({ children, onClick, className = '', variant = 'solid', ...props }) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer'
  const styles = variant === 'solid'
    ? 'bg-gradient-to-b from-gold-light to-gold text-forest-dark hover:shadow-[0_8px_30px_rgba(198,161,91,0.4)] hover:-translate-y-0.5'
    : 'border border-gold/60 text-gold hover:bg-gold hover:text-forest-dark'
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  )
}

const SectionTitle = ({ overline, title, light = false }) => (
  <div className="text-center mb-14">
    {overline && (
      <FadeIn>
        <p className="font-display text-gold tracking-[0.35em] uppercase text-xs mb-4">{overline}</p>
      </FadeIn>
    )}
    <FadeIn delay={0.1}>
      <h2 className={`font-serif text-4xl md:text-5xl ${light ? 'text-cream' : 'text-cream'}`}>{title}</h2>
    </FadeIn>
    <FadeIn delay={0.2}>
      <div className="flex items-center justify-center gap-3 mt-5">
        <span className="h-px w-10 bg-gold/50" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="h-px w-10 bg-gold/50" />
      </div>
    </FadeIn>
  </div>
)

export default function SiteClient({ initial }) {
  const [content, setContent] = useState(initial?.content || null)
  const [menu, setMenu] = useState(Array.isArray(initial?.menu) ? initial.menu : [])
  const [gallery, setGallery] = useState(Array.isArray(initial?.gallery) ? initial.gallery : [])
  const [reviews, setReviews] = useState(Array.isArray(initial?.reviews) ? initial.reviews : [])
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeCat, setActiveCat] = useState(CATEGORY_ORDER[0])
  const [lightbox, setLightbox] = useState(-1)
  const [lang, setLang] = useState('pl')

  const t = T[lang]
  const pick = (obj, key) => (lang === 'en' && obj && obj[key + '_en']) ? obj[key + '_en'] : (obj ? obj[key] : '')
  const catLabel = (cat) => (lang === 'en' ? (CAT_EN[cat] || cat) : cat)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pk_lang')
      if (saved === 'en' || saved === 'pl') setLang(saved)
    }
  }, [])

  const switchLang = (l) => {
    setLang(l)
    if (typeof window !== 'undefined') localStorage.setItem('pk_lang', l)
  }

  useEffect(() => {
    if (content) return
    const load = async () => {
      try {
        const [c, m, g, r] = await Promise.all([
          fetch('/api/content').then((x) => x.json()),
          fetch('/api/menu').then((x) => x.json()),
          fetch('/api/gallery').then((x) => x.json()),
          fetch('/api/reviews').then((x) => x.json()),
        ])
        setContent(c)
        setMenu(Array.isArray(m) ? m : [])
        setGallery(Array.isArray(g) ? g : [])
        setReviews(Array.isArray(r) ? r : [])
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [content])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const categories = CATEGORY_ORDER.filter((cat) => menu.some((m) => m.category === cat))
  const shownItems = menu.filter((m) => m.category === activeCat)

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-dark">
        <img src={LOGO} alt="Pan Królik" className="w-32 h-32 object-contain animate-pulse" />
      </div>
    )
  }

  return (
    <div className="bg-forest-dark text-cream overflow-x-hidden">
      {/* ---------- NAVBAR ---------- */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-forest-dark/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-gold/15 py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container flex items-center justify-between">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-3 cursor-pointer">
            <img src={LOGO} alt="Pan Królik logo" className={`object-contain transition-all duration-500 ${scrolled ? 'h-12' : 'h-16'}`} />
          </button>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((l, i) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm tracking-wide text-cream/85 hover:text-gold transition-colors relative group"
              >
                {t.nav[i]}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <div className="flex items-center gap-1 text-sm">
              <button onClick={() => switchLang('pl')} className={`px-1.5 transition-colors ${lang === 'pl' ? 'text-gold font-semibold' : 'text-cream/50 hover:text-cream'}`}>PL</button>
              <span className="text-cream/30">|</span>
              <button onClick={() => switchLang('en')} className={`px-1.5 transition-colors ${lang === 'en' ? 'text-gold font-semibold' : 'text-cream/50 hover:text-cream'}`}>EN</button>
            </div>
            <GoldButton onClick={() => scrollTo('kontakt')}>
              <CalendarCheck size={16} /> {t.reserve}
            </GoldButton>
          </nav>

          <div className="lg:hidden flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <button onClick={() => switchLang('pl')} className={`px-1 ${lang === 'pl' ? 'text-gold font-semibold' : 'text-cream/50'}`}>PL</button>
              <span className="text-cream/30">|</span>
              <button onClick={() => switchLang('en')} className={`px-1 ${lang === 'en' ? 'text-gold font-semibold' : 'text-cream/50'}`}>EN</button>
            </div>
            <button className="text-gold" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <MenuIcon size={28} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-forest-dark/98 backdrop-blur-lg lg:hidden"
          >
            <div className="flex justify-between items-center container py-5">
              <img src={LOGO} alt="Pan Królik" className="h-14 object-contain" />
              <button onClick={() => setMobileOpen(false)} className="text-gold"><X size={30} /></button>
            </div>
            <nav className="flex flex-col items-center justify-center gap-8 mt-16">
              {NAV_LINKS.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => { scrollTo(l.id); setMobileOpen(false) }}
                  className="font-serif text-2xl text-cream hover:text-gold transition-colors"
                >
                  {t.nav[i]}
                </button>
              ))}
              <GoldButton onClick={() => { scrollTo('kontakt'); setMobileOpen(false) }} className="mt-4">
                <CalendarCheck size={18} /> {t.reserve}
              </GoldButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- HERO ---------- */}
      <section id="home" className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={content.hero.backgroundImage} alt="Wnętrze restauracji Pan Królik" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-dark/95 via-forest-dark/80 to-forest-dark/60" />
          <div className="absolute inset-0 bg-forest-dark/40" />
        </div>

        <div className="container relative z-10 pt-28 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="flex justify-center lg:justify-start"
            >
              <img src={LOGO} alt="Pan Królik" className="w-64 md:w-80 lg:w-[26rem] object-contain" />
            </motion.div>

            <div className="text-center lg:text-left">
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
                className="font-display text-gold tracking-[0.35em] uppercase text-xs md:text-sm mb-5"
              >
                {t.heroOverline}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.9 }}
                className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-cream"
              >
                {pick(content.hero, 'title')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.9 }}
                className="mt-6 text-lg text-cream/80 max-w-md mx-auto lg:mx-0 leading-relaxed font-light"
              >
                {pick(content.hero, 'subtitle')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.9 }}
                className="mt-9 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <GoldButton onClick={() => scrollTo('menu')}>
                  <UtensilsCrossed size={16} /> {t.viewMenu}
                </GoldButton>
                <GoldButton variant="outline" onClick={() => scrollTo('kontakt')}>
                  <CalendarCheck size={16} /> {t.reserve}
                </GoldButton>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- O NAS ---------- */}
      <section id="o-nas" className="py-28 bg-forest">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <FadeIn className="relative" y={40}>
              <div className="relative">
                <img src={content.about.image} alt="Restauracja Pan Królik" className="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl" />
              </div>
            </FadeIn>

            <div>
              <FadeIn>
                <p className="font-display text-gold tracking-[0.35em] uppercase text-xs mb-4">{t.aboutOverline}</p>
                <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6">{pick(content.about, 'title')}</h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                {pick(content.about, 'text').split('\n\n').map((p, i) => (
                  <p key={i} className="text-cream/75 leading-relaxed mb-4 font-light">{p}</p>
                ))}
              </FadeIn>

              <div className="grid grid-cols-2 gap-4 mt-9">
                {content.about.features.map((f, i) => {
                  const Icon = ICONS[f.icon] || Sparkles
                  return (
                    <FadeIn key={i} delay={0.15 + i * 0.08}>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-forest-light/60 border border-gold/15 hover:border-gold/40 transition-colors duration-300">
                        <span className="flex-shrink-0 w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                          <Icon size={20} />
                        </span>
                        <span className="text-sm text-cream/90 font-medium">{pick(f, 'title')}</span>
                      </div>
                    </FadeIn>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MENU ---------- */}
      <section id="menu" className="py-28 bg-forest-dark">
        <div className="container">
          <SectionTitle overline={t.menuOverline} title={t.menuTitle} />

          <FadeIn>
            <div className="flex flex-wrap justify-center gap-3 mb-14">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-5 py-2 rounded-full text-sm tracking-wide transition-all duration-300 border ${
                    activeCat === cat
                      ? 'bg-gold text-forest-dark border-gold'
                      : 'border-gold/25 text-cream/70 hover:border-gold/60 hover:text-gold'
                  }`}
                >
                  {catLabel(cat)}
                </button>
              ))}
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {menu.length === 0 && (
              <p className="sm:col-span-2 lg:col-span-3 text-center text-cream/60 font-light py-10 text-lg">{t.menuEmpty}</p>
            )}
            <AnimatePresence mode="popLayout">
              {shownItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group rounded-2xl overflow-hidden bg-forest border border-gold/15 hover:border-gold/40 transition-all duration-400 hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent opacity-70" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-serif text-xl text-cream leading-tight">{pick(item, 'name')}</h3>
                      <span className="font-display text-gold whitespace-nowrap text-lg">{item.price}</span>
                    </div>
                    <p className="text-sm text-cream/60 leading-relaxed font-light">{pick(item, 'description')}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ---------- GALERIA ---------- */}
      <section id="galeria" className="py-28 bg-forest">
        <div className="container">
          <SectionTitle overline={t.galleryOverline} title={t.galleryTitle} />
          {gallery.length === 0 && (
            <p className="text-center text-cream/60 font-light py-10 text-lg">{t.galleryEmpty}</p>
          )}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {gallery.map((g, i) => (
              <FadeIn key={g.id} delay={(i % 4) * 0.06} className="mb-4 break-inside-avoid">
                <button
                  onClick={() => setLightbox(i)}
                  className="block w-full overflow-hidden rounded-xl group relative cursor-pointer"
                >
                  <img
                    src={g.url}
                    alt={`Galeria Pan Królik ${i + 1}`}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-forest-dark/0 group-hover:bg-forest-dark/40 transition-all duration-400 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gold border border-gold/60 rounded-full px-4 py-1.5 text-xs tracking-widest uppercase">
                      {t.view}
                    </span>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox >= 0 && gallery[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-forest-dark/97 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightbox(-1)}
          >
            <button className="absolute top-6 right-6 text-cream/80 hover:text-gold" onClick={() => setLightbox(-1)}>
              <X size={34} />
            </button>
            <button
              className="absolute left-4 md:left-10 text-cream/70 hover:text-gold"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length) }}
            >
              <ChevronLeft size={44} />
            </button>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              src={gallery[lightbox].url}
              alt="Powiększone zdjęcie"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 md:right-10 text-cream/70 hover:text-gold"
              onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length) }}
            >
              <ChevronRight size={44} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- OPINIE ---------- */}
      <section className="py-28 bg-forest-dark">
        <div className="container">
          <SectionTitle overline={t.reviewsOverline} title={t.reviewsTitle} />
          <div className="grid md:grid-cols-3 gap-7">
            {reviews.map((r, i) => (
              <FadeIn key={r.id} delay={i * 0.12}>
                <div className="h-full p-8 rounded-2xl bg-forest border border-gold/15 hover:border-gold/40 transition-all duration-400 relative">
                  <Quote className="text-gold/25 absolute top-6 right-6" size={40} />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <Star key={s} size={18} className="fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-cream/80 leading-relaxed font-light italic mb-6">&ldquo;{pick(r, 'text')}&rdquo;</p>
                  <p className="font-serif text-gold text-lg">{r.name}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <div className="text-center mt-12">
              <GoldButton variant="outline" onClick={() => window.open(content.contact.mapsLink, '_blank')}>
                <Star size={16} /> {t.moreReviews}
              </GoldButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---------- LOKALIZACJA ---------- */}
      <section className="py-28 bg-forest">
        <div className="container">
          <SectionTitle overline={t.findUsOverline} title={t.locationTitle} />
          <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <FadeIn className="order-2 lg:order-1" y={40}>
              <div className="h-full min-h-[380px] rounded-2xl overflow-hidden border border-gold/20 shadow-xl">
                <iframe
                  title="Mapa Pan Królik"
                  src={content.contact.mapsEmbed}
                  className="w-full h-full min-h-[380px]"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="order-1 lg:order-2 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0"><MapPin size={20} /></span>
                  <div>
                    <p className="font-display text-gold text-xs tracking-widest uppercase mb-1">Adres</p>
                    <p className="text-cream/85">{content.contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0"><Phone size={20} /></span>
                  <div>
                    <p className="font-display text-gold text-xs tracking-widest uppercase mb-1">{t.phone}</p>
                    <a href={`tel:${content.contact.phone}`} className="text-cream/85 hover:text-gold transition-colors">{content.contact.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0"><Mail size={20} /></span>
                  <div>
                    <p className="font-display text-gold text-xs tracking-widest uppercase mb-1">{t.email}</p>
                    <a href={`mailto:${content.contact.email}`} className="text-cream/85 hover:text-gold transition-colors">{content.contact.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0"><Clock size={20} /></span>
                  <div>
                    <p className="font-display text-gold text-xs tracking-widest uppercase mb-2">{t.hours}</p>
                    <ul className="space-y-1">
                      {content.contact.hours.map((h, i) => (
                        <li key={i} className="flex justify-between gap-6 text-cream/85 text-sm">
                          <span>{pick(h, 'day')}</span><span className="text-cream/60">{pick(h, 'time')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <GoldButton onClick={() => window.open(content.contact.mapsLink, '_blank')} className="mt-2 w-full sm:w-auto">
                  <Navigation size={16} /> {t.navigate}
                </GoldButton>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ---------- KONTAKT / REZERWACJA ---------- */}
      <section id="kontakt" className="py-28 bg-forest-dark relative">
        <div className="container">
          <SectionTitle overline={t.reservationOverline} title={t.reservationTitle} />
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-cream/75 leading-relaxed font-light mb-10">
                {t.reservationText}
              </p>
              <div className="grid sm:grid-cols-2 gap-5">
                <a href={`tel:${content.contact.phone}`} className="group p-8 rounded-2xl bg-forest border border-gold/20 hover:border-gold/50 transition-all duration-400 flex flex-col items-center gap-3">
                  <span className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-forest-dark transition-all"><Phone size={24} /></span>
                  <span className="font-display text-gold tracking-widest uppercase text-xs">{t.call}</span>
                  <span className="text-cream/85">{content.contact.phone}</span>
                </a>
                <a href={`mailto:${content.contact.email}`} className="group p-8 rounded-2xl bg-forest border border-gold/20 hover:border-gold/50 transition-all duration-400 flex flex-col items-center gap-3">
                  <span className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-forest-dark transition-all"><Mail size={24} /></span>
                  <span className="font-display text-gold tracking-widest uppercase text-xs">{t.writeUs}</span>
                  <span className="text-cream/85">{content.contact.email}</span>
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Social */}
          <FadeIn delay={0.15}>
            <div className="mt-20 text-center">
              <p className="font-serif text-2xl text-cream mb-6">{t.findUs}</p>
              <div className="flex items-center justify-center gap-5">
                {content.social.instagram && (
                  <a href={content.social.instagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-forest-dark transition-all duration-300 hover:-translate-y-1">
                    <Instagram size={24} />
                  </a>
                )}
                {content.social.facebook && (
                  <a href={content.social.facebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-forest-dark transition-all duration-300 hover:-translate-y-1">
                    <Facebook size={24} />
                  </a>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="bg-forest-900 border-t border-gold/15 pt-16 pb-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <div>
              <img src={LOGO} alt="Pan Królik" className="h-24 object-contain mb-4" />
              <p className="text-cream/60 text-sm leading-relaxed font-light max-w-xs">{pick(content.footer, 'description')}</p>
            </div>
            <div className="md:text-center">
              <p className="font-display text-gold tracking-widest uppercase text-xs mb-4">{t.footerNav}</p>
              <ul className="space-y-2">
                {NAV_LINKS.map((l, i) => (
                  <li key={l.id}>
                    <button onClick={() => scrollTo(l.id)} className="text-cream/70 hover:text-gold transition-colors text-sm">{t.nav[i]}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:text-right">
              <p className="font-display text-gold tracking-widest uppercase text-xs mb-4">{t.footerContact}</p>
              <ul className="space-y-2 text-sm text-cream/70">
                <li><a href={`tel:${content.contact.phone}`} className="hover:text-gold transition-colors">{content.contact.phone}</a></li>
                <li><a href={`mailto:${content.contact.email}`} className="hover:text-gold transition-colors">{content.contact.email}</a></li>
                <li>{content.contact.address}</li>
              </ul>
              <div className="flex md:justify-end gap-3 mt-4">
                {content.social.instagram && <a href={content.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gold/80 hover:text-gold"><Instagram size={20} /></a>}
                {content.social.facebook && <a href={content.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gold/80 hover:text-gold"><Facebook size={20} /></a>}
                <a href={content.contact.mapsLink} target="_blank" rel="noopener noreferrer" className="text-gold/80 hover:text-gold"><MapPin size={20} /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gold/10 mt-12 pt-6 text-center">
            <p className="text-cream/40 text-xs tracking-wide">
              &copy; {new Date().getFullYear()} Restauracja Pan Królik. {t.rights}
            </p>
          </div>
        </div>
      </footer>

      {/* ---------- FLOATING MOBILE BUTTONS ---------- */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-forest-dark/95 backdrop-blur-md border-t border-gold/20 grid grid-cols-3 divide-x divide-gold/15">
        <a href={`tel:${content.contact.phone}`} className="flex flex-col items-center gap-1 py-3 text-gold text-xs">
          <Phone size={20} /> {t.mCall}
        </a>
        <a href={content.contact.mapsLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 py-3 text-gold text-xs">
          <Navigation size={20} /> {t.mNav}
        </a>
        <button onClick={() => scrollTo('kontakt')} className="flex flex-col items-center gap-1 py-3 text-gold text-xs">
          <CalendarCheck size={20} /> {t.mBook}
        </button>
      </div>
      <div className="lg:hidden h-16" />
    </div>
  )
}

