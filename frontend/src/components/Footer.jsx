import { NavLink } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="about">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">◈ Veritas Editorial</span>
          <p className="footer__tagline">
            Restoring absolute truth through sophisticated<br />
            digital curation and forensic linguistic analysis.
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <NavLink to="/methodology">Methodology</NavLink>
          <a href="#">API Documentation</a>
        </nav>

        <p className="footer__copy">© 2024 Veritas Editorial. All rights reserved.</p>
      </div>
    </footer>
  )
}
