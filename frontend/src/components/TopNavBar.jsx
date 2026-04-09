import { NavLink, useNavigate } from 'react-router-dom'
import './TopNavBar.css'

export default function TopNavBar() {
  const navigate = useNavigate()

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="container nav__inner">
        {/* Brand */}
        <NavLink to="/" className="nav__brand">
          <span className="nav__brand-icon">◈</span> Veritas
        </NavLink>

        {/* Links */}
        <ul className="nav__links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/methodology">Methodology</NavLink></li>
          <li><a href="#about">About</a></li>
          <li><a href="#archive">Archive</a></li>
        </ul>

        {/* CTA */}
        <button
          id="nav-signin-btn"
          className="nav__cta"
          onClick={() => navigate('/results')}
        >
          Sign In
        </button>
      </div>
    </nav>
  )
}
