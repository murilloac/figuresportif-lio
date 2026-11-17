import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Início' },
  { to: '/galeria', label: 'Galeria' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(168,85,247,0.15)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 6,
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(124,58,237,0.6)',
          }}>
            <span style={{ color: 'white', fontFamily: 'Orbitron', fontWeight: 900, fontSize: 16 }}>P</span>
          </div>
          <span style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 15, color: '#e2e8f0', letterSpacing: 2 }}>
            PRISMA <span style={{ color: '#a855f7' }}>FIGURES</span>
          </span>
        </NavLink>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-nav">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'none' }}
          className="hamburger"
          aria-label="Menu"
        >
          <div style={{ width: 22, height: 2, background: '#a855f7', marginBottom: 5, transition: 'all 0.2s', transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <div style={{ width: 22, height: 2, background: '#a855f7', marginBottom: 5, opacity: open ? 0 : 1, transition: 'all 0.2s' }} />
          <div style={{ width: 22, height: 2, background: '#a855f7', transition: 'all 0.2s', transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'rgba(10,10,15,0.98)',
          borderTop: '1px solid rgba(168,85,247,0.15)',
          padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </header>
  )
}
