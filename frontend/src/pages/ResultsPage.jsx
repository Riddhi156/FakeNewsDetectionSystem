import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import RadialGauge from '../components/RadialGauge'
import './ResultsPage.css'

/* ── Mock analysis data ─────────────────────────────────────── */
const MOCK_RESULT = {
  id: '#VRT-8B21',
  score: 32,
  headline: 'The impact of unregulated synthetic data on global financial stability markets.',
  analysisNote:
    'Our linguistic model has identified significant patterns of unsubstantiated claims and emotional manipulation within this report.',
  alertLevel: 'HIGH SENSITIVITY DETECTED',
  paragraphs: [
    {
      id: 'p1',
      text: 'Recent shifts in market behavior suggest a direct correlation between localized synthetic dataset deployment and the volatility seen in major European indices. While traditional analysts maintain a cautious outlook, the rapid integration of these systems continues unabated.',
      risk: false,
    },
    {
      id: 'p2',
      text: 'Experts warn that a complete collapse of traditional banking structures is not only inevitable but scheduled to begin within the next fiscal quarter without any possibility of intervention.',
      risk: true,
    },
    {
      id: 'p3',
      text: 'The methodology behind these claims remains opaque, often citing non-existent whitepapers from phantom institutions. This strategy aims to build a facade of authority where none exists, leveraging the public\'s general anxiety regarding emerging technologies.',
      risk: false,
    },
    {
      id: 'p4',
      text: 'Internal documents leaked from the Central Reserve suggest that they have already begun replacing human decision-makers with untested black-box algorithms designed to prioritize institutional liquidation.',
      risk: true,
    },
  ],
  sidebar: {
    sourceReliability: { label: 'Unverified Domain', level: 'high' },
    sentimentTone:     { label: 'Alarmist / Hostile', level: 'high' },
    crossReference:    { label: '0 Matches Found',   level: 'neutral' },
    timestamp:         'Oct 24, 2024 · 15:22 GMT',
    modelVersion:      'Veritas v4.2.1-editorial',
  },
  contextCards: [
    {
      icon: '✦',
      title: 'Network Influence',
      desc: 'This narrative originated in a cluster of 42 bot-driven social accounts before surfacing on news aggregators.',
    },
    {
      icon: '📋',
      title: 'Factual Discrepancy',
      desc: 'Contains 3 specific dates that conflict with publicly available legislative schedules for the Central Reserve.',
    },
  ],
}

const LEVEL_CONFIG = {
  high:    { badge: 'badge-alert', dot: '#C44D29' },
  neutral: { badge: 'badge-navy',  dot: '#002B5B' },
  low:     { badge: 'badge-green', dot: '#228b57' },
}

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData]       = useState(null)

  useEffect(() => {
    // Simulate API processing time
    const t = setTimeout(() => {
      setData(MOCK_RESULT)
      setLoading(false)
    }, 1800)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="results-loading">
        <div className="results-loading__inner">
          <div className="spinner" aria-hidden="true" />
          <h2 className="results-loading__title">Analysing Content…</h2>
          <p className="results-loading__sub">
            Running linguistic forensics &amp; cross-referencing archives
          </p>
          <div className="results-loading__steps">
            {['Source lookup', 'Claim extraction', 'Sentiment scan', 'Cross-reference'].map((s, i) => (
              <div key={s} className="results-loading__step" style={{ animationDelay: `${i * 0.4}s` }}>
                <span className="results-loading__dot" />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const { id, score, headline, analysisNote, alertLevel, paragraphs, sidebar, contextCards } = data

  return (
    <main className="results" aria-label="Analysis results">
      <div className="container results__layout">

        {/* ── Main column ──────────────────────────────────────── */}
        <article className="results__main">

          {/* Report ID */}
          <p className="section-label results__id anim-fade-in">Analysis Report {id}</p>

          {/* Headline */}
          <h1 className="results__headline anim-fade-up anim-delay-1">{headline}</h1>

          {/* Gauge + Summary */}
          <div className="results__summary-row anim-fade-up anim-delay-2">
            <RadialGauge score={score} label="Reliability" />

            <div className="results__summary-body">
              <div className="results__alert-chip badge badge-alert">
                ⚠ {alertLevel}
              </div>
              <p className="results__analysis-note">{analysisNote}</p>
            </div>
          </div>

          <hr className="divider" />

          {/* Editorial text with risk highlights */}
          <section className="results__editorial" aria-label="Analysed content">
            <p className="section-label">Analysed Content</p>
            <div className="results__text">
              {paragraphs.map((para) =>
                para.risk ? (
                  <mark key={para.id} className="risk-highlight" role="mark" aria-label="High-risk sentence">
                    {para.text}
                  </mark>
                ) : (
                  <p key={para.id} className="results__para">{para.text}</p>
                )
              )}
            </div>
          </section>

          {/* Contextual mapping */}
          <section className="context-map" aria-label="Contextual mapping">
            <h2 className="context-map__title">Contextual Mapping</h2>
            <p className="context-map__sub">
              How this story compares to verified narratives in the financial sector over the last 30 days.
            </p>
            <div className="context-map__grid">
              {contextCards.map((c) => (
                <div key={c.title} className="card context-map__card">
                  <span className="context-map__icon">{c.icon}</span>
                  <h3 className="context-map__card-title">{c.title}</h3>
                  <p className="context-map__card-desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="results__sidebar" aria-label="Analysis details">
          <div className="sidebar__section">
            <p className="section-label">Analysis Details</p>

            {/* Source Reliability */}
            <div className="sidebar__metric">
              <span className="sidebar__metric-label">Source Reliability</span>
              <span className={`sidebar__metric-value badge ${LEVEL_CONFIG[sidebar.sourceReliability.level].badge}`}>
                {sidebar.sourceReliability.label}
                <span className="sidebar__dot" style={{ background: LEVEL_CONFIG[sidebar.sourceReliability.level].dot }} />
              </span>
            </div>
            <hr className="divider" style={{ margin: '0.75rem 0' }} />

            {/* Sentiment Tone */}
            <div className="sidebar__metric">
              <span className="sidebar__metric-label">Sentiment Tone</span>
              <span className={`sidebar__metric-value badge ${LEVEL_CONFIG[sidebar.sentimentTone.level].badge}`}>
                {sidebar.sentimentTone.label}
                <span className="sidebar__dot" style={{ background: LEVEL_CONFIG[sidebar.sentimentTone.level].dot }} />
              </span>
            </div>
            <hr className="divider" style={{ margin: '0.75rem 0' }} />

            {/* Cross-reference */}
            <div className="sidebar__metric">
              <span className="sidebar__metric-label">Cross-Reference</span>
              <span className={`sidebar__metric-value badge ${LEVEL_CONFIG[sidebar.crossReference.level].badge}`}>
                {sidebar.crossReference.label}
                <span className="sidebar__dot" style={{ background: LEVEL_CONFIG[sidebar.crossReference.level].dot }} />
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="sidebar__section">
            <p className="section-label">Metadata</p>
            <div className="sidebar__meta-row">
              <span>Timestamp</span>
              <span>{sidebar.timestamp}</span>
            </div>
            <div className="sidebar__meta-row">
              <span>Model Version</span>
              <span>{sidebar.modelVersion}</span>
            </div>
          </div>

          {/* Export */}
          <button id="export-pdf-btn" className="btn btn-primary w-full">
            📄 Export Detailed PDF Report
          </button>

          {/* Human review CTA */}
          <div className="sidebar__promo card">
            <h3 className="sidebar__promo-title">Need deeper analysis?</h3>
            <p className="sidebar__promo-body">
              Our expert editorial team provides manual verification for critical financial reporting.
            </p>
            <button id="request-review-btn" className="btn btn-accent" style={{ marginTop: '0.8rem', width: '100%' }}>
              Request Human Review →
            </button>
          </div>

          {/* Back link */}
          <button
            id="back-home-btn"
            className="btn btn-outline w-full"
            onClick={() => navigate('/')}
          >
            ← Verify Another Article
          </button>
        </aside>
      </div>
    </main>
  )
}
