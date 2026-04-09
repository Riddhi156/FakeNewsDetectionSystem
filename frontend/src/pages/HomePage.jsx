import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

const FEATURES = [
  {
    icon: '🏛️',
    title: 'Source Provenance',
    desc: 'Trace information back to its origin. We identify the fiscal and political anchors of every news publisher in our database.',
  },
  {
    icon: '📊',
    title: 'Bias Quantification',
    desc: 'Our AI identifies emotive language and logical fallacies, providing a clear map of the article\'s intended influence.',
  },
  {
    icon: '✅',
    title: 'Fact Validation',
    desc: 'Claims are automatically verified against a 50-year archive of historical data and peer-reviewed documentation.',
  },
  {
    icon: '🛡️',
    title: 'Integrity Shield',
    desc: 'Protect your cognitive space from misinformation campaigns and bot-generated narrative distortion.',
  },
]

export default function HomePage() {
  const [input, setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleVerify = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    // Simulate a short processing delay
    setTimeout(() => {
      navigate('/results', { state: { query: input.trim() } })
    }, 1600)
  }

  return (
    <main className="home" aria-label="Home page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero container">
        <div className="hero__left">
          <span className="badge badge-navy anim-fade-up anim-delay-1">Truth Engine v2.0</span>

          <h1 className="hero__title anim-fade-up anim-delay-2">
            Clarifying the<br />
            <em>Digital Discourse.</em>
          </h1>

          <p className="hero__sub anim-fade-up anim-delay-3">
            A sophisticated verification environment designed for the modern reader.
            We dissect complexity to reveal the structural integrity of every story.
          </p>

          {/* Search Form */}
          <form
            id="verify-form"
            className="hero__form anim-fade-up anim-delay-4"
            onSubmit={handleVerify}
            aria-label="News verification input"
          >
            <div className="hero__input-wrap">
              <span className="hero__input-icon" aria-hidden="true">🔗</span>
              <input
                id="news-input"
                type="text"
                className="hero__input"
                placeholder="Paste news URL or text here…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="News URL or text"
                autoComplete="off"
              />
            </div>
            <button
              id="verify-btn"
              type="submit"
              className="btn btn-primary hero__verify-btn"
              disabled={loading}
            >
              {loading ? (
                <><span className="btn-spinner" /> Analysing…</>
              ) : 'Verify'}
            </button>
          </form>
        </div>

        {/* Right: floating ui cards */}
        <div className="hero__right" aria-hidden="true">
          {/* Hero generated image */}
          <div className="hero__img-wrap anim-float">
            <img
              src="/hero-image.png"
              alt="Digital Forensic Newsroom"
              className="hero__img"
            />
          </div>

          {/* Floating verified card */}
          <div className="hero__float-card hero__float-card--top card">
            <span className="badge badge-green">
              <span>✔</span> Source Verified
            </span>
            <p className="hero__float-quote">
              "The structural logic of this report remains consistent across three cross-referenced archives."
            </p>
          </div>

          {/* Floating spectrum card */}
          <div className="hero__float-card hero__float-card--bot card">
            <div className="hero__spectrum-label section-label">Bias Spectrum</div>
            <div className="hero__spectrum-bar">
              <div className="hero__spectrum-fill" style={{ width: '84%' }} />
            </div>
            <span className="hero__spectrum-val">Neutrality Index: 84%</span>
          </div>
        </div>
      </section>

      {/* ── Methodology Section ───────────────────────────────── */}
      <section className="methods" id="methodology">
        <div className="container methods__inner">
          <div className="methods__intro">
            <h2 className="methods__heading">The Methodology<br />of Truth.</h2>
            <p className="methods__body">
              Analyse sources, check facts, and identify bias in seconds. Veritas uses
              linguistic forensics and deep-web cross-referencing to quantify editorial integrity.
            </p>
            <a href="/methodology" className="methods__link">
              — Read our full verification whitepaper
            </a>
          </div>

          <div className="methods__grid">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card methods__card anim-fade-up anim-delay-${i + 1}`}
              >
                <span className="methods__icon" aria-hidden="true">{f.icon}</span>
                <h3 className="methods__card-title">{f.title}</h3>
                <p className="methods__card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial CTA Banner ─────────────────────────────── */}
      <section className="cta-banner" id="archive">
        <div className="cta-banner__img-wrap">
          <img src="/hero-image.png" alt="" className="cta-banner__img" aria-hidden="true" />
          <div className="cta-banner__overlay" />
        </div>
        <div className="container cta-banner__content">
          <h2 className="cta-banner__heading">
            Designed for the Editorial<br />Professional.
          </h2>
          <p className="cta-banner__body">
            Integrate Veritas directly into your research workflow. Our API provides
            real-time verification for newsrooms, researchers, and public policy makers.
          </p>
          <div className="cta-banner__actions">
            <button id="api-access-btn" className="btn btn-primary">Get API Access</button>
            <button id="learn-more-btn" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
              Learn More
            </button>
          </div>
        </div>
      </section>

    </main>
  )
}
