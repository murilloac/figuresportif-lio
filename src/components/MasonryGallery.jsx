import { useState } from 'react'
import ImageModal from './ImageModal'

// Padrão de tamanhos que se repete — cria ritmo visual variado
const SIZE_PATTERN = [
  'tall',    // alta
  'normal',  // normal
  'wide',    // larga (2 colunas)
  'normal',
  'tall',
  'normal',
  'normal',
  'wide',
  'normal',
  'tall',
]

export default function MasonryGallery({ items }) {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gridAutoRows: '10px',
        gap: 10,
      }}>
        {items.map((item, i) => {
          const size = SIZE_PATTERN[i % SIZE_PATTERN.length]
          return (
            <GalleryCard
              key={item.id}
              item={item}
              size={size}
              onClick={() => setSelected(i)}
            />
          )
        })}
      </div>

      {selected !== null && (
        <ImageModal
          items={items}
          index={selected}
          onClose={() => setSelected(null)}
          onChange={setSelected}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .g-card-tall   { grid-row: span 40; }
        .g-card-normal { grid-row: span 28; }
        .g-card-wide   { grid-column: span 2; grid-row: span 28; }

        @media (max-width: 600px) {
          .g-card-wide { grid-column: span 1; }
        }
      `}</style>
    </>
  )
}

function GalleryCard({ item, size, onClick }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div
      className={`gallery-card g-card-${size}`}
      onClick={onClick}
      style={{ minHeight: size === 'tall' ? 380 : 240 }}
    >
      {/* Skeleton enquanto carrega */}
      {!loaded && !error && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(59,130,246,0.06))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 28, height: 28,
            border: '2px solid rgba(168,85,247,0.3)',
            borderTopColor: '#a855f7',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#334155', fontSize: 12, flexDirection: 'column', gap: 8,
        }}>
          <span style={{ fontSize: 28 }}>🖼️</span>
          <span>Imagem indisponível</span>
        </div>
      )}

      <img
        src={item.imageUrl}
        alt={item.name}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true) }}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: loaded && !error ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      <div className="overlay">
        <div>
          <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 13, color: '#e2e8f0', letterSpacing: 1 }}>
            {item.name}
          </div>
          {item.franchise && (
            <div style={{ fontSize: 11, color: '#a855f7', marginTop: 3 }}>{item.franchise}</div>
          )}
        </div>
      </div>

      {item.featured && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: 'linear-gradient(135deg, #a80aee, #0eb8f1)',
          borderRadius: 4, padding: '3px 8px',
          fontSize: 9, fontFamily: 'Orbitron', color: 'white', letterSpacing: 1,
        }}>★ DESTAQUE</div>
      )}
    </div>
  )
}
