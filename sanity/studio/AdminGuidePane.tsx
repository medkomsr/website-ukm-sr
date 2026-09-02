'use client'

export function AdminGuidePane() {
  return (
    <div style={{minHeight: '100%', padding: 32}}>
      <section style={{background: 'white', border: '1px solid #d1d5db', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,.08)', maxWidth: 720, padding: 32}}>
        <div style={{display: 'grid', gap: 20}}>
          <div style={{display: 'grid', gap: 12}}>
            <h1 style={{fontSize: 28, margin: 0}}>Panduan Admin Website UKM Seni Religi</h1>
            <p style={{color: '#6b7280', lineHeight: 1.6, margin: 0}}>
              Panduan ini menjelaskan cara membuat, memeriksa, menerbitkan, dan memperbarui konten tanpa perlu memahami istilah teknis.
            </p>
          </div>
          <p style={{lineHeight: 1.6, margin: 0}}>
            Mulai dari panduan singkat, lalu gunakan daftar periksa sebelum menekan tombol Terbitkan.
          </p>
          <a
            href="/panduan-admin-sanity.pdf"
            target="_blank"
            rel="noreferrer"
            style={{background: '#0d2a1a', borderRadius: 8, color: 'white', display: 'inline-block', fontWeight: 700, padding: '12px 18px', textDecoration: 'none', width: 'fit-content'}}
          >
            Buka Panduan Admin (PDF)
          </a>
        </div>
      </section>
    </div>
  )
}
