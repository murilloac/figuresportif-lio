import { useEffect } from 'react'

export default function ImageModal({ items, index, onClose, onChange }) {
  const item = items[index]

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onChange(i => Math.min(i + 1, items.length - 1))
      if (e.key === 'ArrowLeft') onChange(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [items.length, onClose, onChange])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: -40, right: 0,
          background: 'none', border: 'none', color: '#94a3b8',
          fontSize: 28, cursor: 'pointer', lineHeight: 1, zIndex: 10,
        }}>×</button>

        {/* Image */}
        <div style={{ position: 'relative' }}>
          <img
            src={item.imageUrl}
            alt={item.name}
            style={{ maxWidth: '85vw', maxHeight: '75vh', objectFit: 'contain', borderRadius: 8, display: 'block', border: '1px solid rgba(168,85,247,0.3)' }}
          />

          {/* Prev */}
          {index > 0 && (
            <button onClick={() => onChange(index - 1)} style={navBtnStyle('left')}>‹</button>
          )}
          {/* Next */}
          {index < items.length - 1 && (
            <button onClick={() => onChange(index + 1)} style={navBtnStyle('right')}>›</button>
          )}
        </div>

        {/* Info */}
        <div style={{ marginTop: 16, textAlign: 'center', maxWidth: 500 }}>
          <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 16, color: '#e2e8f0', letterSpacing: 1 }}>{item.name}</div>
          {item.franchise && <div style={{ color: '#a855f7', fontSize: 13, marginTop: 4 }}>{item.franchise}</div>}
          {item.description && <div style={{ color: '#64748b', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>{item.description}</div>}
          <div style={{ color: '#334155', fontSize: 11, marginTop: 8 }}>{index + 1} / {items.length}</div>
        </div>
      </div>
    </div>
  )
}

const navBtnStyle = (side) => ({
  position: 'absolute',
  top: '50%',
  [side]: -52,
  transform: 'translateY(-50%)',
  background: 'rgba(168,85,247,0.15)',
  border: '1px solid rgba(168,85,247,0.3)',
  color: '#e2e8f0',
  width: 40, height: 40,
  borderRadius: '50%',
  fontSize: 24, lineHeight: '38px', textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
})
