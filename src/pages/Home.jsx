import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import MasonryGallery from '../components/MasonryGallery'

export default function Home() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    getDocs(query(
      collection(db, 'sculptures'),
      orderBy('createdAt', 'desc'),
      limit(20)
    )).then(snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setFeatured(all.filter(i => i.published !== false).slice(0, 6))
    }).catch(() => {})
  }, [])

  return (
    <div style={{ paddingTop: 64 }}>
      <Hero />
      <FeaturedSection items={featured} />
      <AboutTeaser />
      <ContactTeaser />
    </div>
  )
}

function Hero() {
  return (
    <section className="paint-bg" style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden', padding: '80px 24px',
    }}>
      {/* Decorative neon lines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '15%', left: '-5%', width: '40%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)', transform: 'rotate(-15deg)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '-5%', width: '35%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)', transform: 'rotate(10deg)' }} />
        {/* Spray dots */}
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            borderRadius: '50%',
            background: ['#a80aee', '#0eb8f1', '#ff2710', '#e3b812'][i % 4],
            opacity: Math.random() * 0.4 + 0.1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }} />
        ))}
      </div>

      <div style={{ maxWidth: 800, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-block', padding: '4px 16px', borderRadius: 20, border: '1px solid rgba(168,10,238,0.4)', marginBottom: 24, fontSize: 11, letterSpacing: 3, color: '#a80aee', fontFamily: 'Orbitron', textTransform: 'uppercase' }}>
          Impressão 3D · Pintura Artesanal · Aerografia
        </div>

        <h1 style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(28px, 6vw, 64px)', lineHeight: 1.1, margin: '0 0 24px', color: '#e2e8f0' }}>
          ARTE EM CADA{' '}
          <span className="gradient-text">DETALHE.</span>
          <br />
          PERSONALIDADE EM{' '}
          <span className="gradient-text">CADA PEÇA.</span>
        </h1>

        <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: '#64748b', lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
          Esculturas 3D, colecionáveis e pinturas artesanais que transformam personagens em verdadeiras obras de arte.
        </p>

        <Link to="/galeria">
          <button className="btn-primary" style={{ fontSize: 14, padding: '14px 36px', letterSpacing: 2 }}>
            EXPLORAR GALERIA
          </button>
        </Link>
      </div>
    </section>
  )
}

function FeaturedSection({ items }) {
  if (!items.length) return null
  return (
    <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <SectionTitle label="Destaques" title="PEÇAS EM DESTAQUE" />
      <MasonryGallery items={items} />
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Link to="/galeria">
          <button className="btn-primary">VER GALERIA COMPLETA</button>
        </Link>
      </div>
    </section>
  )
}

function AboutTeaser() {
  return (
    <section className="paint-bg" style={{ padding: '80px 24px', borderTop: '1px solid rgba(168,85,247,0.1)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <SectionTitle label="Sobre" title="A PRISMA FIGURES" />
        <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: 15 }}>
          A Prisma Figures nasceu da paixão pelo universo geek, pela escultura e pela arte de transformar personagens em peças colecionáveis.
          Cada projeto envolve criatividade, impressão 3D, preparação e pintura artesanal, com atenção especial aos detalhes, cores, texturas e efeitos que dão vida a cada escultura.
        </p>
        <Link to="/sobre" style={{ display: 'inline-block', marginTop: 24, color: '#a80aee', fontFamily: 'Orbitron', fontSize: 12, letterSpacing: 2, textDecoration: 'none', borderBottom: '1px solid rgba(168,10,238,0.4)', paddingBottom: 2 }}>
          SAIBA MAIS →
        </Link>
      </div>
    </section>
  )
}

function ContactTeaser() {
  return (
    <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(168,85,247,0.1)', textAlign: 'center' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <p style={{ fontFamily: 'Orbitron', fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 700, color: '#e2e8f0', marginBottom: 12 }}>
          Gostou de alguma peça?
        </p>
        <p style={{ color: '#64748b', marginBottom: 32 }}>Entre em contato e solicite o seu colecionável personalizado.</p>
        <Link to="/contato">
          <button className="btn-primary">ENTRAR EM CONTATO</button>
        </Link>
      </div>
    </section>
  )
}

export function SectionTitle({ label, title }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <div style={{ fontSize: 11, letterSpacing: 3, color: '#a80aee', fontFamily: 'Orbitron', marginBottom: 8 }}>{label}</div>
      <h2 style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(20px, 4vw, 36px)', color: '#e2e8f0', margin: 0 }}>{title}</h2>
      <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, #a80aee, #0eb8f1, #e3b812, #ff2710)', margin: '16px auto 0', borderRadius: 1 }} />
    </div>
  )
}
