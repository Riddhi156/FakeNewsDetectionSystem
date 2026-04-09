import './MethodologyPage.css'

const STEPS = [
  {
    num: '01',
    title: 'Source Provenance Analysis',
    body: 'Every URL submitted to Veritas is traced through our publisher graph — a live database of 280,000+ news entities mapped by ownership, political funding, and historical editorial accuracy. Anonymous or unregistered domains are immediately flagged.',
  },
  {
    num: '02',
    title: 'Linguistic Forensics',
    body: 'Our NLP pipeline dissects each sentence for hedging language, superlatives, emotional amplifiers, and passive-attribution patterns that are statistically overrepresented in misinformation. We compute a per-sentence risk vector.',
  },
  {
    num: '03',
    title: 'Claim Extraction & Fact Validation',
    body: 'Factual claims — names, dates, statistics, institutional quotes — are extracted and cross-referenced against 50+ years of verified archive data including Reuters, AP, legislative records, and peer-reviewed journals.',
  },
  {
    num: '04',
    title: 'Network Origin Mapping',
    body: 'Using graph-diffusion modelling we trace how a narrative spread before it reached mainstream outlets, identifying coordinated inauthentic behaviour and bot-amplification clusters that inflated viral reach.',
  },
  {
    num: '05',
    title: 'Integrity Score Synthesis',
    body: 'All signals are fused into a single 0-100 integrity score using a weighted ensemble model trained on 4.2M labelled articles. The score is explainable — every deduction is attributed to a specific linguistic or factual finding.',
  },
]

export default function MethodologyPage() {
  return (
    <main className="meth" aria-label="Methodology page">
      <div className="container">

        {/* Header */}
        <header className="meth__header anim-fade-up">
          <span className="badge badge-navy">Verification Framework</span>
          <h1 className="meth__title">The Architecture<br />of <em>Truth.</em></h1>
          <p className="meth__sub">
            A transparent, peer-reviewed methodology that turns editorial instinct into
            reproducible science. Every step is auditable, every score explainable.
          </p>
        </header>

        {/* Stats bar */}
        <div className="meth__stats anim-fade-up anim-delay-1">
          {[
            { val: '4.2M+',  label: 'Training Articles' },
            { val: '280K+',  label: 'Publisher Entities' },
            { val: '50 yrs', label: 'Archive Coverage' },
            { val: '94.7%',  label: 'Validation Accuracy' },
          ].map((s) => (
            <div key={s.label} className="meth__stat card">
              <span className="meth__stat-val">{s.val}</span>
              <span className="meth__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Steps */}
        <ol className="meth__steps" aria-label="Verification steps">
          {STEPS.map((step, i) => (
            <li
              key={step.num}
              className={`meth__step anim-fade-up anim-delay-${(i % 4) + 1}`}
            >
              <div className="meth__step-num" aria-hidden="true">{step.num}</div>
              <div className="meth__step-body">
                <h2 className="meth__step-title">{step.title}</h2>
                <p className="meth__step-desc">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Bottom CTA */}
        <div className="meth__bottom card">
          <div>
            <h3 className="meth__bottom-title">Access the Full Research Paper</h3>
            <p className="meth__bottom-body">
              Our complete methodology, model cards, and bias audits are published and
              peer-reviewed on arXiv. Transparency is non-negotiable.
            </p>
          </div>
          <button id="download-whitepaper-btn" className="btn btn-primary">
            Download Whitepaper
          </button>
        </div>
      </div>
    </main>
  )
}
