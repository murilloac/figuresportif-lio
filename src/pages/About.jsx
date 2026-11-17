import { SectionTitle } from './Home'

const STEPS = [
  { icon: '🖨️', title: 'Impressão 3D', desc: 'Modelos digitais transformados em peças físicas com alta precisão e detalhamento.' },
  { icon: '🔧', title: 'Preparação', desc: 'Lixamento, aplicação de primer e preparação da superfície para receber a pintura.' },
  { icon: '🎨', title: 'Pintura Artesanal', desc: 'Pintura à mão com pincéis, detalhes finos e técnicas de sombreamento e iluminação.' },
  { icon: '💨', title: 'Aerografia', desc: 'Gradientes, névoas de cor, efeitos de luz e sombra com aerógrafo profissional.' },
]

export default function About() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <section className="paint-bg" style={{ padding: '80px 24px', textAlign: 'center', borderBottom: '1px solid rgba(168,85,247,0.1)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <SectionTitle label="Nossa História" title="A PRISMA FIGURES" />
          <p style={{ color: '#64748b', lineHeight: 1.9, fontSize: 15, marginBottom: 16 }}>
            A Prisma Figures nasceu da paixão pelo universo geek, pela escultura e pela arte de transformar personagens em peças colecionáveis.
          </p>
          <p style={{ color: '#64748b', lineHeight: 1.9, fontSize: 15, marginBottom: 16 }}>
            Cada projeto envolve criatividade, impressão 3D, preparação e pintura artesanal, com atenção especial aos detalhes, cores, texturas e efeitos que dão vida a cada escultura.
          </p>
          <p style={{ color: '#64748b', lineHeight: 1.9, fontSize: 15 }}>
            Mais do que imprimir figuras, buscamos transformar cada peça em uma experiência visual única.
          </p>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <SectionTitle label="Processo" title="COMO CRIAMOS" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {STEPS.map((s, i) => (
            <div key={i} className="neon-border" style={{
              background: 'rgba(17,17,24,0.8)',
              borderRadius: 12, padding: 28, textAlign: 'center',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 13, color: '#e2e8f0', marginBottom: 10, letterSpacing: 1 }}>{s.title}</div>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="paint-bg" style={{ padding: '60px 24px', borderTop: '1px solid rgba(168,85,247,0.1)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {[['100%', 'Artesanal'], ['3D', 'Impressão'], ['∞', 'Detalhes']].map(([n, l]) => (
              <div key={l}>
                <div className="gradient-text" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 40 }}>{n}</div>
                <div style={{ color: '#475569', fontSize: 12, letterSpacing: 2, fontFamily: 'Orbitron', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
