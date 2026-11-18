import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const user = useAuth()

  useEffect(() => {
    if (user) navigate('/admin')
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin')
    } catch {
      setError('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="paint-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="neon-border" style={{ background: 'rgba(17,17,24,0.95)', borderRadius: 16, padding: '48px 40px', width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="Prisma Figures"
            style={{ height: 72, width: 'auto', objectFit: 'contain', marginBottom: 12 }}
          />
          <div style={{ color: '#475569', fontSize: 13 }}>Painel Administrativo</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', color: '#64748b', fontSize: 12, marginBottom: 6, letterSpacing: 1, fontFamily: 'Orbitron' }}>E-MAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="admin-input" required placeholder="admin@prismafigures.com" />
          </div>
          <div>
            <label style={{ display: 'block', color: '#64748b', fontSize: 12, marginBottom: 6, letterSpacing: 1, fontFamily: 'Orbitron' }}>SENHA</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="admin-input" required placeholder="••••••••" />
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  )
}
