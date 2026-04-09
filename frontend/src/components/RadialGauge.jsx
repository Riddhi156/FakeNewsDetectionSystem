import { useEffect, useRef } from 'react'
import './RadialGauge.css'

/**
 * RadialGauge — SVG circular progress showing a 0-100 reliability score.
 * @param {number} score  — 0 to 100
 * @param {string} label  — text below the number
 */
export default function RadialGauge({ score = 68, label = 'Reliability' }) {
  const circleRef = useRef(null)

  const size    = 160
  const stroke  = 10
  const r       = (size - stroke) / 2
  const circ    = 2 * Math.PI * r
  const offset  = circ - (score / 100) * circ

  // Color interpolation: green→amber→red
  const getColor = (s) => {
    if (s >= 70) return '#228b57'
    if (s >= 40) return '#c49a22'
    return '#C44D29'
  }

  const color = getColor(score)
  const risk  = score < 40 ? 'HIGH RISK' : score < 70 ? 'MODERATE' : 'RELIABLE'

  useEffect(() => {
    const el = circleRef.current
    if (!el) return
    el.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)'
    el.style.strokeDashoffset = offset
  }, [offset])

  return (
    <div className="gauge" aria-label={`${label}: ${score}%`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="gauge__svg"
      >
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ}       /* starts at 0, animates in */
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>

      {/* Centre label */}
      <div className="gauge__center">
        <span className="gauge__score" style={{ color }}>
          {score}<span className="gauge__pct">%</span>
        </span>
        <span className="gauge__risk badge" style={{ background: `${color}22`, color }}>
          {risk}
        </span>
      </div>
    </div>
  )
}
