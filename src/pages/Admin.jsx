import { useState, useEffect, useRef } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp
} from 'firebase/firestore'
import { uploadToCloudinary } from '../cloudinary'
import { useNavigate } from 'react-router-dom'

const CATS = ['Marvel', 'DC Comics', 'Games', 'Animes', 'Cinema e Séries', 'Esculturas Autorais', 'Projetos Especiais']

const EMPTY_FORM = { name: '', franchise: '', description: '', category: 'Marvel', featured: false, published: true, order: 0 }

export default function Admin() {
  const [sculptures, setSculptures] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [tab, setTab] = useState('list')
  const fileRef = useRef()
  const navigate = useNavigate()

  const load = async () => {
    const snap = await getDocs(query(collection(db, 'sculptures'), orderBy('order', 'asc')))
    setSculptures(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { load() }, [])

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files)
    setFiles(selected)
    setPreviews(selected.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      if (editId) {
        await updateDoc(doc(db, 'sculptures', editId), { ...form })
        if (files.length > 0) {
          const { url } = await uploadToCloudinary(files[0], setProgress)
          await updateDoc(doc(db, 'sculptures', editId), { imageUrl: url })
        }
      } else {
        for (let i = 0; i < files.length; i++) {
          const { url } = await uploadToCloudinary(files[i], setProgress)
          await addDoc(collection(db, 'sculptures'), {
            ...form,
            name: files.length > 1 ? `${form.name} ${i + 1}` : form.name,
            imageUrl: url,
            createdAt: serverTimestamp(),
            order: Date.now() + i,
          })
        }
      }
      resetForm()
      await load()
      setTab('list')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleDelete = async (item) => {
    if (!confirm(`Excluir "${item.name}"?`)) return
    // Imagem permanece no Cloudinary (gerenciar pelo painel deles se necessário)
    await deleteDoc(doc(db, 'sculptures', item.id))
    await load()
  }

  const handleEdit = (item) => {
    setEditId(item.id)
    setForm({ name: item.name, franchise: item.franchise || '', description: item.description || '', category: item.category || 'Marvel', featured: item.featured || false, published: item.published !== false, order: item.order || 0 })
    setFiles([])
    setPreviews([])
    setTab('form')
  }

  const togglePublish = async (item) => {
    await updateDoc(doc(db, 'sculptures', item.id), { published: !item.published })
    await load()
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setFiles([])
    setPreviews([])
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0' }}>
      {/* Top bar */}
      <div style={{ background: 'rgba(17,17,24,0.95)', borderBottom: '1px solid rgba(168,85,247,0.2)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 14, letterSpacing: 2 }}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Prisma Figures" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" style={{ color: '#64748b', fontSize: 12, textDecoration: 'none' }}>← Ver site</a>
          <button onClick={() => signOut(auth).then(() => navigate('/login'))} style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'Orbitron' }}>
            SAIR
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {[['list', `Peças (${sculptures.length})`], ['form', editId ? 'Editar Peça' : 'Adicionar Peça']].map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); if (id === 'list') resetForm() }}
              style={{ padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'Orbitron', fontSize: 12, letterSpacing: 1,
                background: tab === id ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'rgba(255,255,255,0.05)',
                color: tab === id ? 'white' : '#64748b',
              }}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'list' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {sculptures.map(item => (
                <div key={item.id} style={{ background: 'rgba(17,17,24,0.8)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                      {item.featured && <span style={{ background: 'linear-gradient(135deg,#a80aee,#0eb8f1)', borderRadius: 4, padding: '2px 6px', fontSize: 9, fontFamily: 'Orbitron', color: 'white' }}>★</span>}
                      <span style={{ background: item.published ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${item.published ? '#22c55e' : '#ef4444'}44`, borderRadius: 4, padding: '2px 6px', fontSize: 9, color: item.published ? '#22c55e' : '#ef4444' }}>
                        {item.published ? 'PUB' : 'OCU'}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ fontFamily: 'Orbitron', fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: '#a855f7', marginBottom: 12 }}>{item.category}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleEdit(item)} style={{ flex: 1, background: 'rgba(168,10,238,0.15)', border: '1px solid rgba(168,10,238,0.3)', color: '#a80aee', borderRadius: 5, padding: '6px 0', fontSize: 11, cursor: 'pointer', fontFamily: 'Orbitron' }}>EDITAR</button>
                      <button onClick={() => togglePublish(item)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', borderRadius: 5, padding: '6px 0', fontSize: 11, cursor: 'pointer', fontFamily: 'Orbitron' }}>{item.published ? 'OCULTAR' : 'PUBLICAR'}</button>
                      <button onClick={() => handleDelete(item)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 5, padding: '6px 10px', fontSize: 11, cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {sculptures.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#334155' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎨</div>
                <p style={{ fontFamily: 'Orbitron', fontSize: 13, letterSpacing: 2 }}>NENHUMA PEÇA CADASTRADA</p>
                <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => setTab('form')}>ADICIONAR PRIMEIRA PEÇA</button>
              </div>
            )}
          </div>
        )}

        {tab === 'form' && (
          <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
            <div style={{ display: 'grid', gap: 16 }}>
              <Field label="NOME DA ESCULTURA *">
                <input className="admin-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Ex: Spider-Man Miles Morales" />
              </Field>
              <Field label="PERSONAGEM / FRANQUIA">
                <input className="admin-input" value={form.franchise} onChange={e => setForm(f => ({ ...f, franchise: e.target.value }))} placeholder="Ex: Marvel Comics" />
              </Field>
              <Field label="CATEGORIA">
                <select className="admin-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="DESCRIÇÃO">
                <textarea className="admin-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Detalhes sobre a peça, técnicas utilizadas..." style={{ resize: 'vertical' }} />
              </Field>
              <Field label="ORDEM DE EXIBIÇÃO">
                <input type="number" className="admin-input" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
              </Field>

              <div style={{ display: 'flex', gap: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#94a3b8', fontSize: 13 }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ accentColor: '#a855f7' }} />
                  Destaque
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#94a3b8', fontSize: 13 }}>
                  <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} style={{ accentColor: '#a855f7' }} />
                  Publicado
                </label>
              </div>

              <Field label={editId ? 'NOVA IMAGEM (opcional)' : 'IMAGENS *'}>
                <div
                  onClick={() => fileRef.current.click()}
                  style={{ border: '2px dashed rgba(168,85,247,0.3)', borderRadius: 8, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.6)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)'}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                  <div style={{ color: '#64748b', fontSize: 13 }}>Clique para selecionar {editId ? 'imagem' : 'imagens'}</div>
                  <div style={{ color: '#334155', fontSize: 11, marginTop: 4 }}>JPG, PNG, WEBP</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple={!editId} onChange={handleFiles} style={{ display: 'none' }} required={!editId} />
              </Field>

              {previews.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {previews.map((p, i) => (
                    <img key={i} src={p} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(168,85,247,0.3)' }} />
                  ))}
                </div>
              )}

              {uploading && (
                <div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #2563eb)', transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ color: '#64748b', fontSize: 12, marginTop: 4, textAlign: 'center' }}>Enviando... {progress}%</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? 'SALVANDO...' : editId ? 'SALVAR ALTERAÇÕES' : 'PUBLICAR PEÇA'}
                </button>
                <button type="button" onClick={() => { resetForm(); setTab('list') }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', padding: '12px 20px', borderRadius: 6, cursor: 'pointer', fontFamily: 'Orbitron', fontSize: 12 }}>
                  CANCELAR
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#64748b', fontSize: 11, marginBottom: 6, letterSpacing: 1, fontFamily: 'Orbitron' }}>{label}</label>
      {children}
    </div>
  )
}
