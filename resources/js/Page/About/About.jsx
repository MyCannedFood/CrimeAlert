import { useState } from "react";
import Footer from '../../Components/Footer';
import { useDarkMode } from '../../utils/DarkModeProvider';

/* ---------------------------------------------------------------------
   Design tokens (same system used across Map / News / Artikel pages)
--------------------------------------------------------------------- */
const COLORS = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primary50: "#EFF6FF",
  bg: "#F8FAFC",
  bgDark: "#0a0f1e",
  card: "#FFFFFF",
  cardDark: "#1e293b",
  text: "#0F172A",
  textDark: "#f1f5f9",
  textSec: "#64748B",
  textSecDark: "#94a3b8",
  border: "#E2E8F0",
  borderDark: "#334155",
};

/* ---------------------------------------------------------------------
   Inline icons (no external dependency)
--------------------------------------------------------------------- */
const iconProps = {
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const Shield = (p) => (<svg {...iconProps} {...p}><path d="M12 2 4 5v6c0 5.2 3.4 9.4 8 11 4.6-1.6 8-5.8 8-11V5l-8-3Z" /><path d="M9 12l2 2 4-4" /></svg>);
const Database = (p) => (<svg {...iconProps} {...p}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></svg>);
const Newspaper = (p) => (<svg {...iconProps} {...p}><rect x="3" y="5" width="14" height="16" rx="1" /><path d="M17 9h4v9a2 2 0 0 1-2 2h-2" /><path d="M7 9h6M7 13h6M7 17h4" /></svg>);
const Info = (p) => (<svg {...iconProps} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 16v-5" /><path d="M12 8h.01" /></svg>);
const Mail = (p) => (<svg {...iconProps} {...p}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 6 10-6" /></svg>);
const Phone = (p) => (<svg {...iconProps} {...p}><path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.1 2.4Z" /></svg>);
const MapPin = (p) => (<svg {...iconProps} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
const ArrowRight = (p) => (<svg {...iconProps} {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>);
const ChevronDown = (p) => (<svg {...iconProps} {...p}><path d="M6 9l6 6 6-6" /></svg>);
const ExternalLink = (p) => (<svg {...iconProps} {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></svg>);

/* ---------------------------------------------------------------------
   Content data
--------------------------------------------------------------------- */
const STEPS = [
  { num: "01", icon: Database, title: "Pengumpulan Otomatis", desc: "Sistem menelusuri berita kriminal terbaru dari media nasional terpercaya secara berkala." },
  { num: "02", icon: Shield, title: "Verifikasi Sumber", desc: "Setiap artikel diperiksa keabsahan sumber dan kesesuaian faktanya sebelum diproses lebih lanjut." },
  { num: "03", icon: Info, title: "Kategorisasi & Pemetaan", desc: "Berita dikelompokkan berdasarkan jenis kejahatan dan dipetakan ke lokasi kejadian secara akurat." },
  { num: "04", icon: Newspaper, title: "Publikasi Transparan", desc: "Data yang telah diproses ditampilkan lengkap dengan tautan menuju artikel asli dari media sumber." },
];

const SOURCES = [
  { name: "Sindonews", url: "https://www.sindonews.com" },
  { name: "CNN Indonesia", url: "https://www.cnnindonesia.com" },
  { name: "Detik.com", url: "https://www.detik.com" },
];

const FAQS = [
  { q: "Apakah data di CrimeAlert Indonesia akurat?", a: "Seluruh berita yang tampil telah melalui proses verifikasi sumber. Namun kami tetap menyarankan pengguna untuk membaca artikel asli guna informasi yang lebih lengkap." },
  { q: "Seberapa sering data diperbarui?", a: "Sistem kami memperbarui data secara otomatis dari seluruh sumber media yang terhubung." },
  { q: "Apakah platform ini gratis digunakan?", a: "Ya, seluruh fitur pemantauan, peta interaktif, dan statistik dapat diakses tanpa biaya oleh masyarakat umum." },
  { q: "Bagaimana cara melaporkan kesalahan data?", a: "Pengguna dapat menghubungi tim kami melalui formulir kontak di bawah untuk melaporkan ketidaksesuaian data." },
  { q: "Apakah CrimeAlert Indonesia terafiliasi dengan kepolisian?", a: "Kami adalah platform agregasi berita independen yang mengumpulkan artikel dari Sindonews, CNN Indonesia, dan Detik.com, dan tidak terafiliasi secara resmi dengan institusi kepolisian manapun." },
];

/* ---------------------------------------------------------------------
   Small building blocks
--------------------------------------------------------------------- */
function Eyebrow({ icon: Icon, children }) {
  return (
    <span className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide" style={{ color: COLORS.primary }}>
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}

function StepCard({ step, isLast }) {
  const Icon = step.icon;
  return (
    <div className="relative rounded-xl p-6" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg text-[12px] font-bold" style={{ background: COLORS.primary50, color: COLORS.primary }}>
        {step.num}
      </div>
      <h4 className="mb-2 text-[15px] font-bold" style={{ color: 'var(--color-text)' }}>{step.title}</h4>
      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{step.desc}</p>
      {!isLast && (
        <ArrowRight className="absolute -right-[22px] top-6 hidden h-5 w-5 lg:block" style={{ color: "#CBD5E1" }} />
      )}
    </div>
  );
}

function SourcePill({ name, url }) {
  return (
    <button
      type="button"
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
      className="group inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold transition-colors"
      style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.primary; e.currentTarget.style.color = COLORS.primary; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
    >
      {name}
      <ExternalLink className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div style={{ borderBottom: '1px solid var(--color-border)' }}>
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 py-4 text-left">
        <span className="text-[14.5px] font-bold" style={{ color: 'var(--color-text)' }}>{item.q}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 transition-transform"
          style={{ color: open ? COLORS.primary : 'var(--color-text-secondary)', transform: open ? "rotate(180deg)" : "none" }}
        />
      </button>
      {open && (
        <p className="max-w-[760px] pb-4 text-[13.5px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {item.a}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------
   About page
--------------------------------------------------------------------- */
export default function About() {
  const [openFaq, setOpenFaq] = useState(0);
  const { isDark } = useDarkMode();

  return (
    <div style={{ minHeight: "100vh", background: isDark ? COLORS.bgDark : COLORS.bg, fontFamily: "'Poppins', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Hero */}
      <div
        className="relative overflow-hidden border-b border-gray-200 dark:border-slate-700 px-6 py-16 text-center md:px-16"
        style={{ background: "linear-gradient(135deg, var(--color-hero-start) 0%, var(--color-hero-end) 100%)" }}
      >
        <div className="relative mx-auto max-w-[720px]">
          <Eyebrow icon={Shield}>Tentang Kami</Eyebrow>
          <h1 className="text-[30px] font-bold leading-tight md:text-[36px]" style={{ color: 'var(--color-text)' }}>
            Membantu Masyarakat Indonesia Menjadi Lebih Aman
          </h1>
          <p className="mx-auto mt-4 max-w-[600px] text-[15px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            CrimeAlert Indonesia adalah platform pemantauan dan agregasi berita kriminal yang mengumpulkan
            informasi dari media terpercaya, memverifikasinya, lalu menyajikannya secara transparan dan mudah
            dipahami oleh semua kalangan.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-6">
        {/* How data is collected */}
        <section className="py-16 text-center">
          <div className="mx-auto mb-10 flex max-w-[520px] flex-col items-center">
            <Eyebrow icon={Database}>Metodologi</Eyebrow>
            <h2 className="text-[24px] font-bold" style={{ color: 'var(--color-text)' }}>Bagaimana Data Dikumpulkan</h2>
            <p className="mt-2 text-[14px]" style={{ color: 'var(--color-text-secondary)' }}>
              Setiap berita melewati proses berlapis sebelum ditampilkan kepada pengguna.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <StepCard key={s.num} step={s} isLast={i === STEPS.length - 1} />
            ))}
          </div>
        </section>

        {/* Trusted sources — each pill links out to the real source site */}
        <section className="pb-16 text-center">
          <div className="mx-auto mb-8 flex max-w-[520px] flex-col items-center">
            <Eyebrow icon={Newspaper}>Media</Eyebrow>
            <h2 className="text-[24px] font-bold" style={{ color: 'var(--color-text)' }}>Sumber Berita Terpercaya Kami</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3.5">
            {SOURCES.map((s) => (
              <SourcePill key={s.name} name={s.name} url={s.url} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-16">
          <div className="mb-6">
            <Eyebrow icon={Info}>FAQ</Eyebrow>
            <h2 className="text-[24px] font-bold" style={{ color: 'var(--color-text)' }}>Pertanyaan yang Sering Diajukan</h2>
          </div>
          <div className="rounded-xl px-6" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="pb-16">
          <div className="mb-6">
            <Eyebrow icon={Mail}>Kontak</Eyebrow>
            <h2 className="text-[24px] font-bold" style={{ color: 'var(--color-text)' }}>Hubungi Tim Kami</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-xl p-6" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              {[
                { icon: Mail, label: "Email", value: "savero2605@gmail.com" },
                { icon: Phone, label: "Telepon", value: "+62 878-8605-4252" },
              ].map(({ icon: Icon, label, value }, i, arr) => (
                <div
                  key={label}
                  className="flex items-center gap-3.5 py-3.5"
                  style={i < arr.length - 1 ? { borderBottom: '1px solid var(--color-border)' } : undefined}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: COLORS.primary50, color: COLORS.primary }}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="block text-[13px] font-bold" style={{ color: 'var(--color-text)' }}>{label}</span>
                    <span className="block text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>{value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-6" style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold" style={{ color: 'var(--color-text-secondary)' }}>Nama Lengkap</label>
                  <input type="text" placeholder="Nama Anda" className="w-full rounded-lg px-3.5 py-2.5 text-[14px] outline-none dark:text-slate-200" style={{ border: '1px solid var(--color-border)', background: 'var(--color-input-bg)' }} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
                  <input type="email" placeholder="email@contoh.com" className="w-full rounded-lg px-3.5 py-2.5 text-[14px] outline-none dark:text-slate-200" style={{ border: '1px solid var(--color-border)', background: 'var(--color-input-bg)' }} />
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-1.5 block text-[12px] font-bold" style={{ color: 'var(--color-text-secondary)' }}>Pesan</label>
                <textarea rows={4} placeholder="Tulis pesan Anda..." className="w-full rounded-lg px-3.5 py-2.5 text-[14px] outline-none dark:text-slate-200" style={{ border: '1px solid var(--color-border)', background: 'var(--color-input-bg)' }} />
              </div>
              <button className="rounded-lg px-6 py-2.5 text-[14px] font-semibold text-white" style={{ background: COLORS.primary }}>
                Kirim Pesan
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}