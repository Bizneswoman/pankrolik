'use client'

import { useEffect, useState } from 'react'
import { Lock, Save, Plus, Trash2, Image as ImageIcon, LogOut, Utensils, MessageSquare, Settings, LayoutGrid } from 'lucide-react'
import { LOGO_BASE64 } from '@/lib/logo-image'

const LOGO = LOGO_BASE64
const CATEGORIES = ['Przystawki', 'Zupy', 'Dania główne', 'Pizza', 'Burgery', 'Makarony', 'Desery', 'Napoje']

const inputCls = 'w-full bg-forest-dark border border-gold/25 rounded-lg px-3 py-2 text-cream text-sm focus:outline-none focus:border-gold transition-colors'
const labelCls = 'block text-xs uppercase tracking-widest text-gold/80 mb-1.5'
const cardCls = 'bg-forest border border-gold/15 rounded-xl p-5'

function api(path, method, token, body) {
  return fetch(`/api${path}`, {
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token || '' },
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => r.json())
}

const toBase64 = (file) => new Promise((res, rej) => {
  const reader = new FileReader()
  reader.onload = () => res(reader.result)
  reader.onerror = rej
  reader.readAsDataURL(file)
})

// Guarantees every nested field exists so the editor never crashes,
// even if the database document is from an older schema.
const safeContent = (c) => {
  c = c && typeof c === 'object' ? c : {}
  return {
    id: 'site',
    hero: { title: '', title_en: '', subtitle: '', subtitle_en: '', backgroundImage: '', ...(c.hero || {}) },
    about: {
      title: '', title_en: '', text: '', text_en: '', image: '',
      ...(c.about || {}),
      features: Array.isArray(c.about?.features) && c.about.features.length
        ? c.about.features
        : [
            { title: '', title_en: '' },
            { title: '', title_en: '' },
            { title: '', title_en: '' },
            { title: '', title_en: '' },
          ],
    },
    contact: {
      address: '', phone: '', email: '', mapsEmbed: '', mapsLink: '',
      ...(c.contact || {}),
      hours: Array.isArray(c.contact?.hours) ? c.contact.hours : [],
    },
    social: { instagram: '', facebook: '', tiktok: '', ...(c.social || {}) },
    footer: { description: '', description_en: '', ...(c.footer || {}) },
  }
}

export default function Admin() {
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [tab, setTab] = useState('content')
  const [toast, setToast] = useState('')

  const [content, setContent] = useState(null)
  const [menu, setMenu] = useState([])
  const [gallery, setGallery] = useState([])
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('pk_admin') : ''
    if (t) setToken(t)
  }, [])

  useEffect(() => {
    if (!token) return
    Promise.all([
      api('/content', 'GET', token),
      api('/menu', 'GET', token),
      api('/gallery', 'GET', token),
      api('/reviews', 'GET', token),
    ]).then(([c, m, g, r]) => {
      setContent(safeContent(c)); setMenu(m || []); setGallery(g || []); setReviews(r || [])
    }).catch(() => {
      setContent(safeContent(null)); setMenu([]); setGallery([]); setReviews([])
    })
  }, [token])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const login = async (e) => {
    e.preventDefault()
    setLoginErr('')
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const res = await r.json().catch(() => ({}))
      if (r.ok && res.success) {
        localStorage.setItem('pk_admin', res.token)
        setToken(res.token)
      } else if (r.status === 401) {
        setLoginErr('Nieprawidłowe hasło')
      } else {
        setLoginErr('Błąd serwera (' + r.status + ') – problem z połączeniem lub bazą danych. Spróbuj ponownie.')
      }
    } catch (err) {
      setLoginErr('Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.')
    }
  }

  const logout = () => { localStorage.removeItem('pk_admin'); setToken('') }

  // ---- Login screen ----
  if (!token) {
    return (
      <div className="min-h-screen bg-forest-dark flex items-center justify-center p-4">
        <form onSubmit={login} className="w-full max-w-sm bg-forest border border-gold/20 rounded-2xl p-8 text-center">
          <img src={LOGO} alt="Pan Królik" className="h-24 mx-auto object-contain mb-4" />
          <h1 className="font-serif text-2xl text-cream mb-1">Panel administratora</h1>
          <p className="text-cream/50 text-sm mb-6">Zaloguj się, aby zarządzać treścią</p>
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Hasło"
              className={inputCls + ' pl-10'}
            />
          </div>
          {loginErr && <p className="text-red-400 text-sm mb-3">{loginErr}</p>}
          <button type="submit" className="w-full bg-gradient-to-b from-gold-light to-gold text-forest-dark font-medium rounded-full py-2.5 hover:shadow-lg transition-all">
            Zaloguj się
          </button>
          <p className="text-cream/30 text-xs mt-4">Domyślne hasło: pankrolik2025</p>
        </form>
      </div>
    )
  }

  if (!content) {
    return <div className="min-h-screen bg-forest-dark flex items-center justify-center text-gold">Ładowanie...</div>
  }

  // ---- Helpers to update nested content ----
  const setC = (path, value) => {
    setContent((prev) => {
      const next = structuredClone(prev)
      let obj = next
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]]
      obj[path[path.length - 1]] = value
      return next
    })
  }

  const saveContent = async () => {
    await api('/content', 'PUT', token, content)
    showToast('Zapisano treść strony')
  }

  // ---- Menu ops ----
  const addMenuItem = async () => {
    const item = await api('/menu', 'POST', token, { category: tab === 'menu' ? CATEGORIES[0] : 'Dania główne', name: 'Nowa pozycja', description: '', price: '0 zł', image: '' })
    setMenu((m) => [...m, item])
  }
  const updateMenuItem = (id, field, value) => setMenu((m) => m.map((it) => it.id === id ? { ...it, [field]: value } : it))
  const saveMenuItem = async (item) => { await api(`/menu/${item.id}`, 'PUT', token, item); showToast('Zapisano pozycję') }
  const deleteMenuItem = async (id) => { await api(`/menu/${id}`, 'DELETE', token); setMenu((m) => m.filter((it) => it.id !== id)) }

  // ---- Gallery ops ----
  const addGallery = async (url) => {
    if (!url) return
    const item = await api('/gallery', 'POST', token, { url })
    setGallery((g) => [...g, item])
  }
  const deleteGallery = async (id) => { await api(`/gallery/${id}`, 'DELETE', token); setGallery((g) => g.filter((it) => it.id !== id)) }

  // ---- Review ops ----
  const addReview = async () => {
    const item = await api('/reviews', 'POST', token, { name: 'Nowy klient', rating: 5, text: '' })
    setReviews((r) => [...r, item])
  }
  const updateReview = (id, field, value) => setReviews((r) => r.map((it) => it.id === id ? { ...it, [field]: value } : it))
  const saveReview = async (item) => { await api(`/reviews/${item.id}`, 'PUT', token, item); showToast('Zapisano opinię') }
  const deleteReview = async (id) => { await api(`/reviews/${id}`, 'DELETE', token); setReviews((r) => r.filter((it) => it.id !== id)) }

  const TABS = [
    { id: 'content', label: 'Treść strony', icon: Settings },
    { id: 'menu', label: 'Menu', icon: Utensils },
    { id: 'gallery', label: 'Galeria', icon: LayoutGrid },
    { id: 'reviews', label: 'Opinie', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-forest-dark text-cream">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-gold text-forest-dark px-5 py-3 rounded-lg font-medium shadow-lg">{toast}</div>
      )}

      {/* Header */}
      <header className="border-b border-gold/15 bg-forest sticky top-0 z-40">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="Pan Królik" className="h-11 object-contain" />
            <span className="font-serif text-lg text-cream hidden sm:block">Panel administratora</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-cream/70 hover:text-gold transition-colors">Zobacz stronę</a>
            <button onClick={logout} className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold transition-colors">
              <LogOut size={16} /> Wyloguj
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all border ${
                  tab === t.id ? 'bg-gold text-forest-dark border-gold' : 'border-gold/25 text-cream/70 hover:border-gold/60'
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* ---- CONTENT TAB ---- */}
        {tab === 'content' && (
          <div className="space-y-6 max-w-4xl">
            <div className={cardCls}>
              <h3 className="font-serif text-xl text-gold mb-4">Sekcja Hero (strona główna)</h3>
              <div className="space-y-4">
                <div><label className={labelCls}>Nagłówek (PL)</label><input className={inputCls} value={content.hero.title} onChange={(e) => setC(['hero', 'title'], e.target.value)} /></div>
                <div><label className={labelCls}>Nagłówek (EN)</label><input className={inputCls} value={content.hero.title_en || ''} onChange={(e) => setC(['hero', 'title_en'], e.target.value)} /></div>
                <div><label className={labelCls}>Opis (PL)</label><textarea rows={2} className={inputCls} value={content.hero.subtitle} onChange={(e) => setC(['hero', 'subtitle'], e.target.value)} /></div>
                <div><label className={labelCls}>Opis (EN)</label><textarea rows={2} className={inputCls} value={content.hero.subtitle_en || ''} onChange={(e) => setC(['hero', 'subtitle_en'], e.target.value)} /></div>
                <div>
                  <label className={labelCls}>Zdjęcie tła (URL)</label>
                  <input className={inputCls} value={content.hero.backgroundImage} onChange={(e) => setC(['hero', 'backgroundImage'], e.target.value)} />
                  <ImgUpload token={token} onDone={(url) => setC(['hero', 'backgroundImage'], url)} />
                  {content.hero.backgroundImage && <img src={content.hero.backgroundImage} alt="" className="mt-3 h-28 rounded-lg object-cover" />}
                </div>
              </div>
            </div>

            <div className={cardCls}>
              <h3 className="font-serif text-xl text-gold mb-4">Sekcja O nas</h3>
              <div className="space-y-4">
                <div><label className={labelCls}>Tytuł (PL)</label><input className={inputCls} value={content.about.title} onChange={(e) => setC(['about', 'title'], e.target.value)} /></div>
                <div><label className={labelCls}>Tytuł (EN)</label><input className={inputCls} value={content.about.title_en || ''} onChange={(e) => setC(['about', 'title_en'], e.target.value)} /></div>
                <div><label className={labelCls}>Opis PL (2 akapity oddziel pustą linią)</label><textarea rows={5} className={inputCls} value={content.about.text} onChange={(e) => setC(['about', 'text'], e.target.value)} /></div>
                <div><label className={labelCls}>Opis EN (2 akapity oddziel pustą linią)</label><textarea rows={5} className={inputCls} value={content.about.text_en || ''} onChange={(e) => setC(['about', 'text_en'], e.target.value)} /></div>
                <div>
                  <label className={labelCls}>Zdjęcie (URL)</label>
                  <input className={inputCls} value={content.about.image} onChange={(e) => setC(['about', 'image'], e.target.value)} />
                  <ImgUpload token={token} onDone={(url) => setC(['about', 'image'], url)} />
                  {content.about.image && <img src={content.about.image} alt="" className="mt-3 h-28 rounded-lg object-cover" />}
                </div>
                <div>
                  <label className={labelCls}>Kafelki (4) – PL / EN</label>
                  <div className="grid grid-cols-2 gap-3">
                    {content.about.features.map((f, i) => (
                      <div key={i} className="space-y-2">
                        <input className={inputCls} value={f.title} onChange={(e) => setC(['about', 'features', i, 'title'], e.target.value)} placeholder="PL" />
                        <input className={inputCls} value={f.title_en || ''} onChange={(e) => setC(['about', 'features', i, 'title_en'], e.target.value)} placeholder="EN" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={cardCls}>
              <h3 className="font-serif text-xl text-gold mb-4">Kontakt i lokalizacja</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Adres</label><input className={inputCls} value={content.contact.address} onChange={(e) => setC(['contact', 'address'], e.target.value)} /></div>
                <div><label className={labelCls}>Telefon</label><input className={inputCls} value={content.contact.phone} onChange={(e) => setC(['contact', 'phone'], e.target.value)} /></div>
                <div><label className={labelCls}>E-mail</label><input className={inputCls} value={content.contact.email} onChange={(e) => setC(['contact', 'email'], e.target.value)} /></div>
                <div><label className={labelCls}>Link nawigacji Google Maps</label><input className={inputCls} value={content.contact.mapsLink} onChange={(e) => setC(['contact', 'mapsLink'], e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Mapa Google (link embed)</label><input className={inputCls} value={content.contact.mapsEmbed} onChange={(e) => setC(['contact', 'mapsEmbed'], e.target.value)} /></div>
              </div>
              <label className={labelCls + ' mt-4'}>Godziny otwarcia (dzień PL / dzień EN / godziny)</label>
              <div className="space-y-2">
                {content.contact.hours.map((h, i) => (
                  <div key={i} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <input className={inputCls} value={h.day} onChange={(e) => setC(['contact', 'hours', i, 'day'], e.target.value)} placeholder="Dzień PL" />
                    <input className={inputCls} value={h.day_en || ''} onChange={(e) => setC(['contact', 'hours', i, 'day_en'], e.target.value)} placeholder="Day EN" />
                    <input className={inputCls} value={h.time} onChange={(e) => setC(['contact', 'hours', i, 'time'], e.target.value)} placeholder="Godziny PL" />
                    <input className={inputCls} value={h.time_en || ''} onChange={(e) => setC(['contact', 'hours', i, 'time_en'], e.target.value)} placeholder="Hours EN (opcjonalnie)" />
                  </div>
                ))}
              </div>
            </div>

            <div className={cardCls}>
              <h3 className="font-serif text-xl text-gold mb-4">Social Media i stopka</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Instagram (URL)</label><input className={inputCls} value={content.social.instagram} onChange={(e) => setC(['social', 'instagram'], e.target.value)} /></div>
                <div><label className={labelCls}>Facebook (URL)</label><input className={inputCls} value={content.social.facebook} onChange={(e) => setC(['social', 'facebook'], e.target.value)} /></div>
                <div><label className={labelCls}>TikTok (URL, opcjonalnie)</label><input className={inputCls} value={content.social.tiktok} onChange={(e) => setC(['social', 'tiktok'], e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Opis w stopce (PL)</label><textarea rows={2} className={inputCls} value={content.footer.description} onChange={(e) => setC(['footer', 'description'], e.target.value)} /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Opis w stopce (EN)</label><textarea rows={2} className={inputCls} value={content.footer.description_en || ''} onChange={(e) => setC(['footer', 'description_en'], e.target.value)} /></div>
              </div>
            </div>

            <button onClick={saveContent} className="flex items-center gap-2 bg-gradient-to-b from-gold-light to-gold text-forest-dark font-medium rounded-full px-6 py-3 hover:shadow-lg transition-all">
              <Save size={18} /> Zapisz zmiany
            </button>
          </div>
        )}

        {/* ---- MENU TAB ---- */}
        {tab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-cream/60 text-sm">{menu.length} pozycji w menu</p>
              <button onClick={addMenuItem} className="flex items-center gap-2 bg-gold text-forest-dark rounded-full px-4 py-2 text-sm font-medium hover:shadow-lg transition-all">
                <Plus size={16} /> Dodaj danie
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {menu.map((item) => (
                <div key={item.id} className={cardCls}>
                  <div className="flex gap-4">
                    <div className="w-24 flex-shrink-0">
                      {item.image
                        ? <img src={item.image} alt="" className="w-24 h-24 rounded-lg object-cover" />
                        : <div className="w-24 h-24 rounded-lg bg-forest-dark border border-gold/20 flex items-center justify-center text-gold/40"><ImageIcon size={24} /></div>}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input className={inputCls} value={item.name} onChange={(e) => updateMenuItem(item.id, 'name', e.target.value)} placeholder="Nazwa (PL)" />
                      <input className={inputCls} value={item.name_en || ''} onChange={(e) => updateMenuItem(item.id, 'name_en', e.target.value)} placeholder="Name (EN)" />
                      <div className="grid grid-cols-2 gap-2">
                        <select className={inputCls} value={item.category} onChange={(e) => updateMenuItem(item.id, 'category', e.target.value)}>
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input className={inputCls} value={item.price} onChange={(e) => updateMenuItem(item.id, 'price', e.target.value)} placeholder="Cena" />
                      </div>
                    </div>
                  </div>
                  <textarea rows={2} className={inputCls + ' mt-2'} value={item.description} onChange={(e) => updateMenuItem(item.id, 'description', e.target.value)} placeholder="Opis (PL)" />
                  <textarea rows={2} className={inputCls + ' mt-2'} value={item.description_en || ''} onChange={(e) => updateMenuItem(item.id, 'description_en', e.target.value)} placeholder="Description (EN)" />
                  <input className={inputCls + ' mt-2'} value={item.image} onChange={(e) => updateMenuItem(item.id, 'image', e.target.value)} placeholder="URL zdjęcia" />
                  <ImgUpload token={token} onDone={(url) => updateMenuItem(item.id, 'image', url)} />
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => saveMenuItem(item)} className="flex-1 flex items-center justify-center gap-2 bg-gold/90 text-forest-dark rounded-lg py-2 text-sm font-medium hover:bg-gold transition-all"><Save size={15} /> Zapisz</button>
                    <button onClick={() => deleteMenuItem(item.id)} className="px-3 rounded-lg border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- GALLERY TAB ---- */}
        {tab === 'gallery' && (
          <div>
            <div className={cardCls + ' mb-6'}>
              <h3 className="font-serif text-lg text-gold mb-3">Dodaj zdjęcie</h3>
              <GalleryAdd token={token} onAdd={addGallery} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="relative group rounded-xl overflow-hidden border border-gold/15">
                  <img src={g.url} alt="" className="w-full h-40 object-cover" />
                  <button onClick={() => deleteGallery(g.id)} className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- REVIEWS TAB ---- */}
        {tab === 'reviews' && (
          <div>
            <div className="flex justify-end mb-5">
              <button onClick={addReview} className="flex items-center gap-2 bg-gold text-forest-dark rounded-full px-4 py-2 text-sm font-medium hover:shadow-lg transition-all">
                <Plus size={16} /> Dodaj opinię
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {reviews.map((r) => (
                <div key={r.id} className={cardCls}>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input className={inputCls} value={r.name} onChange={(e) => updateReview(r.id, 'name', e.target.value)} placeholder="Imię" />
                    <select className={inputCls} value={r.rating} onChange={(e) => updateReview(r.id, 'rating', parseInt(e.target.value))}>
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                    </select>
                  </div>
                  <textarea rows={3} className={inputCls} value={r.text} onChange={(e) => updateReview(r.id, 'text', e.target.value)} placeholder="Treść opinii (PL)" />
                  <textarea rows={3} className={inputCls + ' mt-2'} value={r.text_en || ''} onChange={(e) => updateReview(r.id, 'text_en', e.target.value)} placeholder="Review text (EN)" />
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => saveReview(r)} className="flex-1 flex items-center justify-center gap-2 bg-gold/90 text-forest-dark rounded-lg py-2 text-sm font-medium hover:bg-gold transition-all"><Save size={15} /> Zapisz</button>
                    <button onClick={() => deleteReview(r.id)} className="px-3 rounded-lg border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ImgUpload({ token, onDone }) {
  const [busy, setBusy] = useState(false)
  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const b64 = await toBase64(file)
      onDone(b64)
    } finally {
      setBusy(false)
    }
  }
  return (
    <label className="inline-flex items-center gap-2 mt-2 text-xs text-gold/80 cursor-pointer hover:text-gold">
      <ImageIcon size={14} /> {busy ? 'Wczytywanie...' : 'lub prześlij plik z dysku'}
      <input type="file" accept="image/*" className="hidden" onChange={onFile} />
    </label>
  )
}

function GalleryAdd({ token, onAdd }) {
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const b64 = await toBase64(file)
      await onAdd(b64)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Wklej URL zdjęcia" />
      <button onClick={() => { onAdd(url); setUrl('') }} className="bg-gold text-forest-dark rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap hover:shadow-lg transition-all">Dodaj z URL</button>
      <label className="inline-flex items-center justify-center gap-2 border border-gold/30 text-gold rounded-lg px-4 py-2 text-sm cursor-pointer hover:bg-gold/10 whitespace-nowrap">
        <ImageIcon size={16} /> {busy ? 'Wczytywanie...' : 'Prześlij plik'}
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
      </label>
    </div>
  )
}
