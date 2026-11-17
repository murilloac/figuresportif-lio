import { useEffect, useState } from 'react'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import MasonryGallery from '../components/MasonryGallery'
import { SectionTitle } from './Home'

const DEFAULT_CATS = ['Todas', 'Marvel', 'DC Comics', 'Games', 'Animes', 'Cinema e Séries', 'Esculturas Autorais', 'Projetos Especiais']

export default function Gallery() {
  const [items, setItems] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activecat, setActiveCat] = useState('Todas')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocs(query(
      collection(db, 'sculptures'),
      orderBy('createdAt', 'desc')
    )).then(snap => {
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(i => i.published !== false)
      setItems(data)
      setFiltered(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleFilter = (cat) => {
    setActiveCat(cat)
    setFiltered(cat === 'Todas' ? items : items.filter(i => i.category === cat))
  }

  return (
    <div style={{ paddingTop: 64 }}>
      <section style={{ padding: '60px 24px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionTitle label="Portfólio" title="GALERIA DE ESCULTURAS" />

        {/* Category filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
          {DEFAULT_CATS.map(cat => (
            <button key={cat} className={`cat-btn${activecat === cat ? ' active' : ''}`} onClick={() => handleFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(168,85,247,0.3)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
            <p style={{ fontFamily: 'Orbitron', fontSize: 14, letterSpacing: 2 }}>NENHUMA PEÇA ENCONTRADA</p>
          </div>
        ) : (
          <MasonryGallery items={filtered} />
        )}
      </section>
    </div>
  )
}
