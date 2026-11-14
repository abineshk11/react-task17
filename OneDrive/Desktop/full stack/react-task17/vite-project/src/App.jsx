import { useEffect, useReducer, useRef, useState } from 'react'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays,
  Bookmark, Check, ChevronDown, CircleHelp, CloudMoon, Compass, Eye,
  Filter, Focus, MapPin, Menu, Plus, Search, Sparkles, Star,
  Telescope, Trash2, Wind, X,
} from 'lucide-react'
import {
  Link, NavLink, Outlet, Route, Routes, useNavigate, useParams,
  useSearchParams,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from './context/useToast.js'
import { useSkyForecast } from './hooks/useSkyForecast.js'
import { addObservation, deleteObservation, updateObservation } from './store/sightingsSlice.js'
import './App.css'

const targets = [
  { slug: 'orion-nebula', name: 'Orion Nebula', type: 'Nebula', season: 'Winter', difficulty: 'Easy', distance: '1,344 light-years', constellation: 'Orion', note: 'A stellar nursery glowing in the hunter’s sword. Even small binoculars reveal its misty heart.', icon: '✳', color: 'coral', best: '9:30 PM – 1:00 AM' },
  { slug: 'pleiades', name: 'The Pleiades', type: 'Star cluster', season: 'Winter', difficulty: 'Easy', distance: '444 light-years', constellation: 'Taurus', note: 'Seven sisters, thousands of years of stories. Look for a tiny dipper-shaped cluster, bright even from town.', icon: '✦', color: 'blue', best: '7:00 PM – 11:00 PM' },
  { slug: 'andromeda-galaxy', name: 'Andromeda Galaxy', type: 'Galaxy', season: 'Autumn', difficulty: 'Easy', distance: '2.5 million light-years', constellation: 'Andromeda', note: 'The farthest thing most people will ever see with the naked eye. Find the smudge just beyond Cassiopeia.', icon: '◉', color: 'lilac', best: '10:00 PM – 2:00 AM' },
  { slug: 'jupiter', name: 'Jupiter', type: 'Planet', season: 'All year', difficulty: 'Easy', distance: '628 million km', constellation: 'Varies', note: 'A bright, steady beacon. Binoculars can reveal its four largest moons lined up beside it.', icon: '◌', color: 'gold', best: 'After sunset' },
  { slug: 'double-cluster', name: 'Double Cluster', type: 'Star cluster', season: 'Autumn', difficulty: 'Medium', distance: '7,500 light-years', constellation: 'Perseus', note: 'Two sparkling cities of stars side by side. A wide-field view makes this one unforgettable.', icon: '⁖', color: 'blue', best: '8:00 PM – midnight' },
  { slug: 'moon', name: 'The Moon', type: 'Moon', season: 'All year', difficulty: 'Easy', distance: '384,400 km', constellation: 'Varies', note: 'Follow the terminator line where lunar night meets day. Craters there cast beautiful long shadows.', icon: '☾', color: 'lilac', best: 'First quarter' },
]

function readPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem('nightjar-plan') ?? '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

const navigation = [
  { to: '/', label: 'Home', end: true },
  { to: '/guide', label: 'Sky guide' },
  { to: '/forecast', label: 'Forecast' },
  { to: '/logbook', label: 'Logbook' },
  { to: '/plans', label: 'My plans' },
]

function PageFrame({ children, eyebrow, title, description, action }) {
  return (
    <main className="page-wrap">
      <div className="page-heading">
        <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>
        {action}
      </div>
      {children}
    </main>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="Nightjar home">
        <span className="brand-mark"><Telescope size={19} strokeWidth={1.8} /></span>
        <span>nightjar<span className="brand-period">.</span></span>
      </Link>
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
        {navigation.map((item) => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setMenuOpen(false)}>{item.label}</NavLink>)}
      </nav>
      <Link to="/plans" className="header-cta"><Plus size={16} /> Plan a night</Link>
    </header>
  )
}

function Footer() {
  return <footer className="site-footer"><Link to="/" className="footer-brand"><Telescope size={17} /> nightjar.</Link><span>A little more wonder, after dark.</span><Link to="/about" className="footer-about">About Nightjar</Link><span className="footer-note">Made for looking up <span>✦</span></span></footer>
}

function SiteLayout() {
  return <div className="app-shell"><Header /><Outlet /><Footer /></div>
}

function TargetCard({ target, compact = false }) {
  return (
    <Link to={`/guide/${target.slug}`} className={`target-card ${compact ? 'compact' : ''}`}>
      <div className={`target-art art-${target.color}`}><span className="target-symbol">{target.icon}</span><span className="target-type">{target.type}</span><span className="art-glow" /></div>
      <div className="target-card-copy"><div><h3>{target.name}</h3><span className="target-meta">{target.constellation} <span>·</span> {target.season}</span></div><span className="round-arrow"><ArrowUpRight size={17} /></span></div>
    </Link>
  )
}

function HomePage() {
  const forecast = useSkyForecast('Edinburgh')
  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="hero-copy">
          <div className="live-pill"><span /> YOUR WINDOW TO THE NIGHT SKY</div>
          <h1>There’s a whole<br />universe <em>out there.</em></h1>
          <p>Find your next celestial moment. We’ll help you know what’s up, when to look, and where to begin.</p>
          <div className="hero-actions"><Link to="/guide" className="button button-light">Explore the sky <ArrowRight size={17} /></Link><Link to="/forecast" className="text-link">Check tonight’s sky <ArrowUpRight size={16} /></Link></div>
        </div>
        <div className="hero-sky" aria-hidden="true">
          <span className="star-field star-a">✦</span><span className="star-field star-b">·</span><span className="star-field star-c">✧</span><span className="star-field star-d">·</span><span className="star-field star-e">✦</span><span className="star-field star-f">·</span>
          <div className="moon-art"><span /></div>
          <div className="hero-caption"><span className="caption-rule" /> waxing crescent <span>·</span> 34% illuminated</div>
        </div>
        <div className="hero-index"><span>01</span><span className="index-line" /><span>THE NIGHT IS YOURS</span></div>
      </section>

      <section className="quick-stats">
        <div className="stat-label"><span className="tiny-star">✦</span><span>TONIGHT, IN<br />YOUR CORNER</span></div>
        <div className="stat-block"><span className="stat-icon"><Eye size={16} /></span><span className="stat-name">Sky clarity</span><strong>{forecast.data?.clarity ?? '—'}<small>/ 10</small></strong></div>
        <div className="stat-block"><span className="stat-icon"><CloudMoon size={16} /></span><span className="stat-name">Cloud cover</span><strong>{forecast.data ? `${forecast.data.cloud}%` : '—'}</strong></div>
        <div className="stat-block"><span className="stat-icon"><Wind size={16} /></span><span className="stat-name">Conditions</span><strong className="condition">{forecast.loading ? 'Checking…' : forecast.data?.condition ?? 'Check forecast'}</strong></div>
        <Link to="/forecast" className="stat-more">See your forecast <ArrowRight size={15} /></Link>
      </section>

      <section className="content-section">
        <div className="section-top"><div><p className="eyebrow">A GOOD PLACE TO START</p><h2>Tonight’s highlights<span className="heading-star">✦</span></h2></div><Link to="/guide" className="text-link dark-link">Full sky guide <ArrowRight size={16} /></Link></div>
        <div className="target-grid">{targets.slice(0, 3).map((target) => <TargetCard key={target.slug} target={target} />)}</div>
      </section>

      <section className="quote-banner"><div className="quote-star">✦</div><div><p>“The sky is not the limit. Your imagination is.”</p><span>— Mae Jemison</span></div><Link to="/guide" className="quote-link" aria-label="Explore the sky guide"><ArrowUpRight size={20} /></Link></section>
    </main>
  )
}

function GuidePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchInput = useRef(null)
  const query = searchParams.get('q') ?? ''
  const category = searchParams.get('type') ?? 'All'
  const categories = ['All', 'Planet', 'Nebula', 'Galaxy', 'Star cluster', 'Moon']
  const filtered = targets.filter((target) => {
    const matchesText = `${target.name} ${target.constellation} ${target.type}`.toLowerCase().includes(query.toLowerCase())
    return matchesText && (category === 'All' || category === target.type)
  })
  const updateQuery = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }
  return (
    <PageFrame eyebrow="YOUR POCKET PLANETARIUM" title="The sky, made closer." description="A field guide to the objects worth staying up for. No telescope required to get started.">
      <div className="guide-toolbar">
        <label className="search-box"><Search size={17} /><input ref={searchInput} value={query} onChange={(event) => updateQuery('q', event.target.value)} placeholder="Search the sky…" aria-label="Search sky objects" /><button className="search-focus" onClick={() => searchInput.current?.focus()} aria-label="Focus search"><Focus size={16} /></button></label>
        <div className="filter-label"><Filter size={15} /> FILTER</div>
        <div className="filter-chips">{categories.map((item) => <button key={item} className={category === item ? 'filter-chip active' : 'filter-chip'} onClick={() => updateQuery('type', item === 'All' ? '' : item)}>{item}</button>)}</div>
      </div>
      {filtered.length ? <div className="target-grid guide-grid">{filtered.map((target) => <TargetCard key={target.slug} target={target} />)}</div> : <div className="empty-state"><Sparkles size={25} /><h3>No stars in this patch of sky</h3><p>Try a different search or category.</p><button className="text-link dark-link" onClick={() => setSearchParams({})}>Clear filters <ArrowRight size={15} /></button></div>}
      <Outlet />
    </PageFrame>
  )
}

function TargetDetail() {
  const { slug } = useParams()
  const target = targets.find((item) => item.slug === slug)
  const navigate = useNavigate()
  if (!target) return <div className="not-found"><CircleHelp size={25} /><h2>That object is off the map.</h2><button className="text-link dark-link" onClick={() => navigate('/guide')}>Back to the sky guide <ArrowLeft size={16} /></button></div>
  return (
    <div className="detail-backdrop" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <button className="detail-scrim" onClick={() => navigate('/guide')} aria-label="Close details" />
      <article className="detail-card">
        <button className="icon-button detail-close" onClick={() => navigate('/guide')} aria-label="Close"><X size={18} /></button>
        <div className={`detail-art art-${target.color}`}><span>{target.icon}</span><i className="art-glow" /></div>
        <div className="detail-copy"><p className="eyebrow">{target.type} · {target.constellation}</p><h2 id="detail-title">{target.name}</h2><p>{target.note}</p><div className="detail-facts"><span><MapPin size={15} /> {target.distance}</span><span><Eye size={15} /> {target.difficulty} to spot</span><span><CalendarDays size={15} /> {target.best}</span></div><button className="button button-dark" onClick={() => { const saved = readPlan(); if (!saved.some((item) => item.slug === target.slug)) localStorage.setItem('nightjar-plan', JSON.stringify([...saved, target])); navigate('/plans') }}>Add to a plan <ArrowRight size={16} /></button></div>
      </article>
    </div>
  )
}

function ForecastPage() {
  const [location, setLocation] = useState('Edinburgh')
  const [input, setInput] = useState('Edinburgh')
  const forecast = useSkyForecast(location)
  const searchRef = useRef(null)
  const submit = (event) => { event.preventDefault(); const trimmed = input.trim(); if (trimmed) setLocation(trimmed) }
  return (
    <PageFrame eyebrow="LOOK BEFORE YOU LEAVE" title="A forecast for stargazers." description="Clouds, visibility, and a little context for your next night outside.">
      <form className="location-form" onSubmit={submit}><label htmlFor="location">YOUR LOCATION</label><div><MapPin size={17} /><input id="location" ref={searchRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="City or town" /><button className="button button-dark" type="submit">Update forecast <ArrowRight size={16} /></button></div></form>
      {forecast.loading && <div className="forecast-message"><span className="loading-dot" /> Looking up the sky over {location}…</div>}
      {forecast.error && <div className="forecast-error" role="alert">{forecast.error}</div>}
      {forecast.data && <div className="forecast-layout">
        <section className="forecast-feature"><div className="forecast-feature-top"><span className="live-pill dark-pill"><span /> LIVE FORECAST</span><span className="forecast-location"><MapPin size={14} /> {forecast.data.location}</span></div><div className="forecast-score"><div><p className="eyebrow">TONIGHT’S OBSERVING SCORE</p><strong>{forecast.data.clarity}<small>/10</small></strong><p>{forecast.data.clarity >= 7 ? 'A promising night to look up.' : forecast.data.clarity >= 4 ? 'Some breaks in the clouds. Keep an eye out.' : 'Cloud cover may have other plans tonight.'}</p></div><div className="forecast-moon">☾<small>MOONLIT SKY</small></div></div><div className="forecast-summary"><span><CloudMoon size={16} /> {forecast.data.cloud}% cloud cover</span><span><Wind size={16} /> {forecast.data.wind} km/h wind</span><span><Eye size={16} /> {forecast.data.condition}</span></div></section>
        <section className="hourly-card"><div className="hourly-heading"><div><p className="eyebrow">THE NEXT FEW HOURS</p><h2>After sunset</h2></div><span className="small-date">{new Date().toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</span></div><div className="hourly-list">{forecast.data.hours.map((hour) => <div className="hour-row" key={hour.time}><span>{hour.time}</span><span className="hour-cloud"><CloudMoon size={16} /></span><span>{hour.cloud}% cloud</span><strong>{hour.score}<small>/10</small></strong></div>)}</div><p className="data-note">Weather data by Open-Meteo · Conditions can change quickly.</p></section>
      </div>}
      {!forecast.loading && !forecast.error && !forecast.data && <div className="forecast-message">Enter a location to see its sky conditions.</div>}
      <div className="forecast-footnote"><Sparkles size={16} /><p>Cloud cover is only one part of the picture. Give your eyes 20 minutes to adjust, find a dark horizon, and check local conditions before heading out.</p></div>
    </PageFrame>
  )
}

function ObservationForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? { object: '', date: new Date().toISOString().slice(0, 10), equipment: '', notes: '', rating: '4' })
  const [errors, setErrors] = useState({})
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.object.trim()) next.object = 'Give this observation a name.'
    if (!form.date) next.date = 'Choose when you looked up.'
    if (form.notes.trim().length < 8) next.notes = 'Add a few more details (at least 8 characters).'
    setErrors(next)
    if (Object.keys(next).length === 0) onSave({ ...form, object: form.object.trim(), notes: form.notes.trim(), rating: Number(form.rating) })
  }
  return <form className="observation-form" onSubmit={submit} noValidate>
    <div className="form-top"><div><p className="eyebrow">{initial ? 'EDIT YOUR ENTRY' : 'A MOMENT WORTH KEEPING'}</p><h2>{initial ? 'Update observation' : 'New observation'}</h2></div><button type="button" className="icon-button" onClick={onCancel} aria-label="Close form"><X size={18} /></button></div>
    <label>What did you see?<input value={form.object} onChange={(event) => update('object', event.target.value)} placeholder="e.g. Saturn’s rings" aria-invalid={Boolean(errors.object)} />{errors.object && <small className="field-error">{errors.object}</small>}</label>
    <div className="form-pair"><label>When?<input type="date" value={form.date} onChange={(event) => update('date', event.target.value)} aria-invalid={Boolean(errors.date)} />{errors.date && <small className="field-error">{errors.date}</small>}</label><label>Gear (optional)<input value={form.equipment} onChange={(event) => update('equipment', event.target.value)} placeholder="Binoculars, 10×50" /></label></div>
    <label>Your field notes<textarea rows="4" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="What did it look like? What surprised you?" aria-invalid={Boolean(errors.notes)} />{errors.notes && <small className="field-error">{errors.notes}</small>}</label>
    <label className="rating-label">How was the view? <span>{'★'.repeat(Number(form.rating))}{'☆'.repeat(5 - Number(form.rating))}</span><input type="range" min="1" max="5" value={form.rating} onChange={(event) => update('rating', event.target.value)} aria-label="View rating" /></label>
    <div className="form-actions"><button type="button" className="text-link dark-link" onClick={onCancel}>Cancel</button><button type="submit" className="button button-dark"><Check size={16} /> Save to logbook</button></div>
  </form>
}

function LogbookPage() {
  const observations = useSelector((state) => state.sightings.items)
  const dispatch = useDispatch()
  const toast = useToast()
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState('')
  const visible = observations.filter((item) => `${item.object} ${item.notes} ${item.equipment}`.toLowerCase().includes(query.toLowerCase()))
  const save = (entry) => {
    if (editing) { dispatch(updateObservation({ ...entry, id: editing.id })); toast('Observation updated') }
    else { dispatch(addObservation(entry)); toast('Added to your logbook') }
    setShowForm(false); setEditing(null)
  }
  const edit = (entry) => { setEditing(entry); setShowForm(true) }
  const remove = (entry) => { dispatch(deleteObservation(entry.id)); toast(`${entry.object} removed from your logbook`) }
  return (
    <PageFrame eyebrow="YOUR PERSONAL FIELD NOTES" title="The things you’ve seen." description="Every clear night leaves a story. Keep yours somewhere you can find it.">
      <div className="logbook-tools"><label className="search-box log-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your observations…" aria-label="Search observations" /></label><button className="button button-dark" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={17} /> New observation</button></div>
      <div className="logbook-layout"><section className="entries-list">
        {visible.length ? visible.map((entry) => <article className="observation-card" key={entry.id}><div className="entry-icon"><Star size={19} /></div><div className="entry-main"><div className="entry-heading"><div><h3>{entry.object}</h3><span className="entry-date"><CalendarDays size={13} /> {new Date(`${entry.date}T12:00:00`).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</span></div><div className="entry-rating">{'★'.repeat(entry.rating)}<span>{'★'.repeat(5 - entry.rating)}</span></div></div><p>{entry.notes}</p><div className="entry-bottom"><span className="gear-tag"><Telescope size={13} /> {entry.equipment || 'Naked eye'}</span><div className="entry-actions"><button onClick={() => edit(entry)}>Edit</button><button onClick={() => remove(entry)} aria-label={`Delete ${entry.object}`}><Trash2 size={14} /></button></div></div></div></article>) : <div className="empty-state log-empty"><Bookmark size={25} /><h3>{query ? 'Nothing in your logbook matches.' : 'Your next favorite sight starts here.'}</h3><p>{query ? 'Try another search.' : 'Add your first observation after a night under the stars.'}</p>{!query && <button className="button button-dark" onClick={() => setShowForm(true)}><Plus size={16} /> Add an observation</button>}</div>}
      </section><aside className="logbook-aside"><div className="aside-stat"><span className="eyebrow">YOUR NIGHT SKY, SO FAR</span><strong>{observations.length.toString().padStart(2, '0')}</strong><span>moments logged</span><div className="aside-stars">✦ · ✧ · ✦</div></div><div className="aside-tip"><Sparkles size={18} /><h3>A note for next time</h3><p>Try sketching the shape you see, even if it’s just a few dots. Your future self will thank you.</p></div></aside></div>
      {showForm && <div className="modal-backdrop" role="presentation"><button className="modal-scrim" onClick={() => { setShowForm(false); setEditing(null) }} aria-label="Close form" /><ObservationForm initial={editing} onSave={save} onCancel={() => { setShowForm(false); setEditing(null) }} /></div>}
    </PageFrame>
  )
}

function planReducer(state, action) {
  if (action.type === 'add') {
    if (state.find((item) => item.slug === action.target.slug)) return state
    return [...state, action.target]
  }
  if (action.type === 'remove') return state.filter((item) => item.slug !== action.slug)
  if (action.type === 'clear') return []
  return state
}

function PlansPage() {
  const [plan, dispatch] = useReducer(planReducer, undefined, readPlan)
  const [selected, setSelected] = useState('')
  const { data } = useSkyForecast('Edinburgh')
  const toast = useToast()
  const pickerRef = useRef(null)
  useEffect(() => localStorage.setItem('nightjar-plan', JSON.stringify(plan)), [plan])
  const addTarget = () => {
    const target = targets.find((item) => item.slug === selected)
    if (!target) { pickerRef.current?.focus(); return }
    if (plan.some((item) => item.slug === target.slug)) { toast('That object is already on your list'); return }
    dispatch({ type: 'add', target }); toast(`${target.name} added to your plan`); setSelected('')
  }
  return (
    <PageFrame eyebrow="MAKE ROOM FOR WONDER" title="A night under the stars." description="A tiny bit of planning makes it easier to be present once you’re out there." action={<span className="saved-badge"><Check size={14} /> SAVED ON THIS DEVICE</span>}>
      <div className="plan-intro"><div className="plan-intro-icon"><Compass size={22} /></div><div><h2>Your observing list</h2><p>Pick a few things to look for. The best plans leave plenty of room for surprises.</p></div></div>
      <div className="add-to-plan"><label htmlFor="target-picker">ADD SOMETHING TO LOOK FOR</label><div><select id="target-picker" ref={pickerRef} value={selected} onChange={(event) => setSelected(event.target.value)}><option value="">Choose from the sky guide…</option>{targets.map((target) => <option value={target.slug} key={target.slug}>{target.name} · {target.type}</option>)}</select><button className="button button-dark" onClick={addTarget}><Plus size={16} /> Add to list</button></div></div>
      <div className="plan-grid"><section className="plan-list">{plan.length ? <>{plan.map((target, index) => <article className="plan-item" key={target.slug}><span className={`plan-number art-${target.color}`}>{String(index + 1).padStart(2, '0')}</span><div><h3>{target.name}</h3><span>{target.type} <span>·</span> {target.best}</span></div><Link className="icon-button plan-detail" to={`/guide/${target.slug}`} aria-label={`Read about ${target.name}`}><ArrowUpRight size={16} /></Link><button className="icon-button" onClick={() => { dispatch({ type: 'remove', slug: target.slug }); toast(`${target.name} removed from your plan`) }} aria-label={`Remove ${target.name}`}><X size={16} /></button></article>)}<button className="clear-plan" onClick={() => { dispatch({ type: 'clear' }); toast('Plan cleared') }}>Clear this list <Trash2 size={14} /></button></> : <div className="empty-plan"><div className="empty-plan-icon"><Sparkles size={22} /></div><h3>A blank page is a lovely start.</h3><p>Add a few celestial objects above and your plan will take shape.</p><button className="text-link dark-link" onClick={() => pickerRef.current?.focus()}>Choose your first target <ArrowDownRight size={15} /></button></div>}</section>
        <aside className="plan-night-card"><div className="plan-night-icon">☾</div><p className="eyebrow">A LITTLE PREPARATION</p><h2>Make it a<br />night to remember.</h2><div className="plan-weather"><span><CloudMoon size={16} /> Tonight in Edinburgh</span><strong>{data ? `${data.clarity}/10 clarity` : 'Checking conditions…'}</strong></div><ul><li><Check size={14} /> Let your eyes adjust for 20 minutes</li><li><Check size={14} /> Bring a warm layer, even in summer</li><li><Check size={14} /> Put your phone on night mode</li></ul><Link to="/forecast" className="night-link">Check your local forecast <ArrowRight size={15} /></Link></aside></div>
    </PageFrame>
  )
}

function AboutPage() {
  const [expanded, setExpanded] = useState(null)
  const faqs = [
    ['Do I need a telescope?', 'Not at all. Many of the most beautiful things in the sky are visible to the naked eye. Start with the Moon, bright planets, and star clusters.'],
    ['Where should I go?', 'Step away from bright streetlights if you can, but you don’t need to travel far. A park, garden, or even a clear window can be a good beginning.'],
    ['Where does the forecast come from?', 'Nightjar uses the Open-Meteo forecast and geocoding APIs to show cloud cover and wind for a location you choose. Forecasts are guidance, not a guarantee.'],
  ]
  return <PageFrame eyebrow="A SMALL INVITATION TO LOOK UP" title="The sky belongs to everyone." description="Nightjar is a friendly field companion for the curious, the beginners, and anyone who’s ever paused to look up.">
    <div className="about-hero"><div className="about-illustration"><div className="about-moon">☾</div><span className="about-dot dot-1">✦</span><span className="about-dot dot-2">·</span><span className="about-dot dot-3">✧</span><span className="about-horizon" /></div><div><p className="eyebrow">OUR LITTLE PHILOSOPHY</p><h2>Curiosity is a pretty good compass.</h2><p>You don’t need a degree in astronomy, expensive gear, or a perfectly dark sky. You just need a moment, a little patience, and a reason to look up.</p><Link to="/guide" className="button button-dark">Meet the night sky <ArrowRight size={16} /></Link></div></div>
    <section className="about-values"><article><span>01</span><h3>Start where you are.</h3><p>A balcony, a back garden, a favorite window. Wonder doesn’t require a road trip.</p></article><article><span>02</span><h3>Learn at your own pace.</h3><p>One constellation tonight. One new question tomorrow. There’s no rush.</p></article><article><span>03</span><h3>Keep the good bits.</h3><p>Write it down, bring a friend, remember how it felt. The sky is better shared.</p></article></section>
    <section className="faq-section"><div><p className="eyebrow">A FEW THINGS YOU MIGHT WONDER</p><h2>Good questions.</h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <div className="faq-item" key={question}><button onClick={() => setExpanded(expanded === index ? null : index)} aria-expanded={expanded === index}><span>{question}</span><ChevronDown size={17} className={expanded === index ? 'rotated' : ''} /></button>{expanded === index && <p>{answer}</p>}</div>)}</div></section>
    <div className="about-signoff"><span>✦</span><p>Clear skies. Whenever they find you.</p></div>
  </PageFrame>
}

function NotFound() {
  return <PageFrame eyebrow="A LITTLE COSMIC DETOUR" title="Nothing to see here." description="Looks like this page drifted out of orbit."><Link to="/" className="button button-dark"><ArrowLeft size={16} /> Back home</Link></PageFrame>
}

export default function App() {
  return <Routes><Route element={<SiteLayout />}><Route index element={<HomePage />} /><Route path="guide" element={<GuidePage />}><Route path=":slug" element={<TargetDetail />} /></Route><Route path="forecast" element={<ForecastPage />} /><Route path="logbook" element={<LogbookPage />} /><Route path="plans" element={<PlansPage />} /><Route path="about" element={<AboutPage />} /><Route path="*" element={<NotFound />} /></Route></Routes>
}
