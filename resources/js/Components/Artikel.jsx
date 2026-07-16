import { useState } from "react";

const COLORS = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primary50: "#EFF6FF",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  text: "#0F172A",
  textSec: "#64748B",
  border: "#E2E8F0",
  safe: "#22C55E",
  moderate: "#FACC15",
  high: "#F97316",
  danger: "#DC2626",
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const MapPin = (p) => (<svg {...iconProps} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
const CalendarDays = (p) => (<svg {...iconProps} {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 3v4" /><path d="M16 3v4" /></svg>);
const Newspaper = (p) => (<svg {...iconProps} {...p}><rect x="3" y="5" width="14" height="16" rx="1" /><path d="M17 9h4v9a2 2 0 0 1-2 2h-2" /><path d="M7 9h6M7 13h6M7 17h4" /></svg>);
const ExternalLink = (p) => (<svg {...iconProps} {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></svg>);
const ChevronRight = (p) => (<svg {...iconProps} {...p}><path d="M9 6l6 6-6 6" /></svg>);
const ShieldAlert = (p) => (<svg {...iconProps} {...p}><path d="M12 2 4 5v6c0 5.2 3.4 9.4 8 11 4.6-1.6 8-5.8 8-11V5l-8-3Z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>);
const ImageOff = (p) => (<svg {...iconProps} {...p}><path d="M3 3l18 18" /><path d="M10.5 6H19a2 2 0 0 1 2 2v10c0 .3 0 .5-.1.8" /><path d="M5 6.3C4.4 6.6 4 7.3 4 8v10a2 2 0 0 0 2 2h13.7" /><path d="m9 13-.9 1.1L11 17l3-3.5" /></svg>);

const SAMPLE_ARTICLES = [
  {
    "id": 6,
    "url": "https://www.cnnindonesia.com/nasional/20260515164020-12-1358897/pelaku-curanmor-pembunuh-polisi-lampung-tewas-dalam-baku-tembak",
    "title": "Pelaku Curanmor Pembunuh Polisi Lampung Tewas dalam Baku Tembak",
    "source": "CNN Indonesia",
    "summary": "",
    "content": "Berakhir sudah perburuan Bahroni--pelaku pencurian motor (curanmor) bersenjata api (senpi) yang menewaskan seorangpolisi, Bripka Anumerta Arya Supena (32)--diLampung.\nDalam perburuan polisi, aparat terlibat baku tembak saat berupaya mengamankan tersangka curanmor yang menewaskan Bripka Arya tersebut.\nMulanya polisi mengendus tempat persembunyian pelaku di Teluk Hantu, Desa Pagar Jaya, Kecamatan Punduh Pidada, Kabupaten Pesawaran, Lampung.\nADVERTISEMENT\nSCROLL TO CONTINUE WITH CONTENT\nSaat akan diamankan, terjadi perlawanan dari pelaku hingga terlibat baku tembak dengan aparat.\nDalam perburuan ke tempat persembunyian di Teluk Hantu, Desa Pagar itu, tersangka tewas usai terlibat baku tembak dengan aparat di\nPolisi berhasil menangkap pelaku penembakan Bripka Anumerta Arya Supena (32). Pelaku tewas usai terlibat baku tembak dengan petugas.\nTersangka Bahroni itu tewas setelah tertembus timah panas polisi dalam baku tembak tersebut.\nKapolda Lampung Irjen Pol Helfi Assegaf mengatakan jenazah pelaku saat ini sudah dibawa ke RS Bhayangkara Polda Lampung.\n\"Benar, sudah terungkap. Penangkapan terjadi pada pukul 05.00 WIB pagi tadi,\" katanya, Jumat (15/5).\n\"Untuk jenazah telah dievakuasi oleh tim gabungan ke RS Bhayangkara Polda Lampung,\" lanjutnya.\nHelfi mengatakan dalam penangkapan tersebut, pihaknya mengamankan sejumlah barang bukti di antaranya motor hingga senjata api.\nSebelumnya pada Sabtu (9/5) pagi di depan sebuah toko roti di Jalan ZA Pagar Alam Kedaton, Bandarlampung, Arya tewas karena kepalanya ditembak pelaku curanmor.\nKorban ditembak saat bergelut dengan pelaku yang kepergok sedang mencuri motor.\nBaca berita lengkapnyadi sini.",
    "published": "2026-05-15 16:54:54",
    "image_url": "https://akcdn.detik.net.id/visual/2026/05/15/pelaku-curanmor-penembak-polisi-di-lampung-tewas-dalam-baku-tembak-1778838737653_169.jpeg?w=280&q=90",
    "province": "Lampung",
    "city": "lampung",
    "crime_type": "curanmor",
    "relevance_score": 70
  },
  {
    "id": 1,
    "url": "https://www.cnnindonesia.com/nasional/20260707120200-12-1377785/polisi-gagalkan-penyelundupan-motor-hasil-curian-ke-jambi",
    "title": "Polisi Gagalkan Penyelundupan Motor Hasil Curian ke Jambi",
    "source": "CNN Indonesia",
    "summary": "",
    "content": "Polda Metro Jayamenggagalkan pengiriman motor diduga hasil curian ke wilayah Jambi. Motor itu dilaporkan hilang di wilayah Warakas, Tanjung Priok, Jakarta Utara (Jakut).\nWadirreskrimum Polda Metro Jaya Kombes Danang Setiyo Pambudi Sukarno menerangkan kendaraan milik korban sebelumnya dilaporkan hilang pada Kamis (18/6). Dari hasil penyelidikan, tim Subdit Ranmor memperoleh informasi adanya sepeda motor yang hendak dikirim ke luar daerah melalui jasa kargo.\nADVERTISEMENT\nSCROLL TO CONTINUE WITH CONTENT\n\"Petugas kemudian berkoordinasi dengan pihak kargo dan melakukan pengecekan terhadap kendaraan tersebut. Hasilnya, data kendaraan itu sesuai dengan sepeda motor milik Haerudin yang sebelumnya dilaporkan hilang,\" kata Danang dalam keterangannya, Selasa (7/7).\nMotor hasil curian itu kemudian diamankan untuk proses penyelidikan lebih lanjut. Danang mengatakan pihaknya masih melakukan pengembangan terhadap dua orang yang diduga terlibat dan kini berstatus daftar pencarian orang (DPO).\n\"Selain itu, penyidik juga menelusuri kemungkinan adanya pihak lain yang berperan dalam proses pengiriman kendaraan hasil kejahatan tersebut,\" ucap dia.\nDanang menyebut motor hasil curian kemudian dikembalikan ke pemiliknya pada Senin (6/7).\nMenurutnya, pengembalian kendaraan tersebut merupakan komitmen kepolisian dalam menindak kasus curanmor sekaligus memastikan barang bukti dapat kembali kepada pemilik yang sah.\n\"Kami mengembalikan kendaraan milik korban yang sehari-hari digunakan untuk bekerja. Kehilangan sepeda motor tentu sangat mengganggu aktivitas korban. Alhamdulillah kendaraan berhasil ditemukan dan kami serahkan kembali kepada pemiliknya,\" ujarnya.\nLebih lanjut, Danang mengatakan pengungkapan kasus ini sejalan dengan pelaksanaan Operasi Berantas Jaya 2026 yang digelar Polda Metro Jaya untuk menekan aksi kejahatan jalanan, termasuk pencurian kendaraan bermotor.\nDalam operasi tersebut, jajaran Polda Metro Jaya meningkatkan penyelidikan, penindakan, serta penelusuran jaringan penadah kendaraan hasil curian.\nBerdasarkan data sementara Operasi Berantas Jaya 2026, jajaran Polda Metro Jaya telah mengungkap 62 laporan polisi terkait curanmor. Dari pengungkapan itu, polisi menangkap 67 tersangka dan mengamankan 50 unit sepeda motor.",
    "published": "2026-07-07 12:42:45",
    "image_url": "https://akcdn.detik.net.id/visual/2026/07/07/polda-metro-jaya-menggagalkan-pengiriman-motor-diduga-hasil-curian-ke-wilayah-jambi-1783399517988_169.jpeg?w=280&q=90",
    "province": "Lampung",
    "city": "metro",
    "crime_type": "pencurian",
    "relevance_score": 56
  },
  {
    "id": 2,
    "url": "https://www.cnnindonesia.com/nasional/20260630211703-12-1375303/polda-metro-tangkap-2054-tersangka-kejahatan-jalanan-hingga-juni-2026",
    "title": "Polda Metro Tangkap 2.054 Tersangka Kejahatan Jalanan hingga Juni 2026",
    "source": "CNN Indonesia",
    "summary": "",
    "content": "Polda Metro Jayabersama Polres jajaran berhasil mengungkap 2.216 kasuscuranmor(pencurian kendaraan bermotor), curat (pencurian dengan pemberatan), dan curas (pencurian dengan kekerasan) yang terjadi wilayah Jakarta dan sekitarnya sepanjang Januari hingga Juni 2026. Dari ribuan kasus ini, polisi menetapkan 2.054 orang sebagai tersangka.\nWadirkrimum Polda Metro Jaya, AKBP Danang Setiyo mengatakan pengungkapan tersebut berdasarkan laporan polisi yang dibuat masyarakat. Secara total, ada 5.436 laporan polisi yang diterima selama enam bulan.\n\"Dari pengungkapan tersebut, petugas berhasil mengamankan sebanyak 2.054 tersangka, yang saat ini sudah dilakukan penahanan dan sebagian sudah dilimpahkan ke Kejaksaan,\" kata Danang di Polda Metro Jaya, Selasa (30/6).\nADVERTISEMENT\nSCROLL TO CONTINUE WITH CONTENT\nAtas perbuatannya, para tersangka dijerat dengan Pasal 477 KUHP, Pasal 479 KUHP, Pasal 306, Pasal 307 KUHP serta Pasal 591 KUHP.\nSelain menangkap para tersangka, polisi juga turut menyita sejumlah barang bukti. Di antaranya, uang tunai sebanyak Rp2 miliar, 14 pucuk senjata api, 41 senjata tajam, 1.825 unit sepeda motor, 22 unit mobil, 296 unit telepon genggam, 10 unit laptop, 95 butir peluru, 4 unit airsoft gun hingga emas seberat 866,98 gram.\n\"Barang-barang tersebut dilakukan penyitaan untuk dihadirkan dalam persidangan dan yang lainnya masih dalam proses penyidikan,\" ucap Danang.\nDanang menyebut dari pengungkapan ribuan kasus itu, pihaknya melakukan evaluasi dan menyimpulkan bahwa kejahatan 3C (curanmor, curas, curat) rawan terjadi pada pukul 22.00 WIB sampai dengan pukul 05.00 WIB.\n\"Terjadi ketika aktivitas masyarakat mulai berkurang dan pengawasan lingkungan mulai menurun,\" ujarnya.\nKarenanya, kepolisian bekerja sama dengan pihak terkait untuk meningkatkan patroli pada jam-jam rawan. Selain itu, juga memperkuat kehadiran personel di lokasi yang memiliki tingkat kerawanan tinggi.\nPolda Metro Jaya juga mengajak masyarakat untuk bersinergi dengan kepolisian. Sebab, keamanan bukan hanya sebagai tanggung jawab aparat penegak hukum semata.\n\"Dengan kerja sama yang baik antara masyarakat dan kepolisian, diharapkan angka kriminalitas dapat ditekan sehingga situasi keamanan, ketertiban masyarakat dapat tercipta suasana yang nyaman, aman, dan kondusif di wilayah hukum Polda Metro Jaya,\" tutur Danang.",
    "published": "2026-07-01 00:00:45",
    "image_url": "https://akcdn.detik.net.id/visual/2026/06/30/polda-metro-jaya-mengungkap-2-ribu-lebih-kasus-kejahatan-jalanan-selama-periode-januari-juni-2026-1782816006052_169.jpeg?w=280&q=90",
    "province": "Lampung",
    "city": "metro",
    "crime_type": "curat/curas",
    "relevance_score": 48
  },
  {
    "id": 9,
    "url": "https://www.cnnindonesia.com/nasional/20260510214300-12-1357227/kronologi-polisi-ditembak-di-kepala-saat-pergoki-curanmor-di-lampung",
    "title": "Kronologi Polisi Ditembak di Kepala Saat Pergoki Curanmor di Lampung",
    "source": "CNN Indonesia",
    "summary": "",
    "content": "PeristiwapenembakanBrigadir Arya Supena (34) hingga tewas terjadi pada Sabtu (9/5) di Bandar Lampung, Lampung saat dia memergoki pelaku pencurian sepeda motor (curanmor) sedang beraksi. Arya ditembak di bagian kepala sampai nyawanya tak terselamatkan.\nBerdasarkan keterangan Kabid Humas Polda Lampung Kombes Yuni Iswandari setelah mengolah TKP dan informasi saksi, Arya saat itu sedang melintas dan melihat pelaku ingin beraksi di parkiran toko roti. Arya menegur pelaku, lalu pelaku mengeluarkan senjata api.\nADVERTISEMENT\nSCROLL TO CONTINUE WITH CONTENT\n\"Pelaku dikatakan dua orang. Usai dipergoki saat mencuri salah satu pelaku mengeluarkan senjata api dan langsung melepaskan tembakan ke arah korban,\" kata Yuni, diberitakandetik, Sabtu (9/5).\nSetelah Arya terjatuh, kedua pelaku melarikan diri.\n\"Mereka langsung pergi, tim saat ini masih melakukan penyelidikan untuk mengidentifikasi para pelaku,\" tutur Yuni.\nDia juga mengatakan Arya meninggal setelah mengalami luka di kepala.\n\"Hasil pemeriksaan almarhum ditembak di mana mengenai bagian kepalanya,\" jelasnya.\nSebelumnya diketahui Arya sempat mendapat perawatan di RS Bhayangkara Polda Lampung.",
    "published": "2026-05-10 21:50:59",
    "image_url": "https://akcdn.detik.net.id/visual/2025/09/04/ilustrasi-penembakan-1756966587846_169.jpeg?w=280&q=90",
    "province": "Lampung",
    "city": "lampung",
    "crime_type": "curanmor",
    "relevance_score": 35
  },
  {
    "id": 10,
    "url": "https://www.cnnindonesia.com/nasional/20260509172526-12-1356935/polisi-tewas-ditembak-pelaku-curanmor-di-bandar-lampung",
    "title": "Polisi Tewas Ditembak Pelaku Curanmor di Bandar Lampung",
    "source": "CNN Indonesia",
    "summary": "",
    "content": "AnggotaPolda LampungBrigadir Arya Supena (34) tewas ditembak oleh pelaku pencurian motor (curanmor) diBandar Lampung.\n\"Kami berduka atas meninggalnya Brigadir Arya Supena setelah sebelumnya sempat mendapatkan perawatan di RS Bhayangkara Polda Lampung,\" ujar Kabid Humas Polda Lampung Kombes Yuni Iswandari seperti dikutipDetikpada Sabtu (9/5).\nYuni mengungkapkan Arya dinyatakan meninggal dunia setelah mengalami luka tembak di kepala.\nADVERTISEMENT\nSCROLL TO CONTINUE WITH CONTENT\n\"Hasil pemeriksaan almarhum ditembak, di mana mengenai bagian kepalanya,\" ujarnya.\nSaat ini, sambung Yuni, korban masih berada di Rumah Sakit (RS) Bhayangkara Polda Lampung.\nPeristiwa penembakan tersebut terjadi pada Sabtu (9/5) pagi tadi di toko roti yang berada di Jalan ZA Pagar Alam Kedaton Bandar Lampung.\nDalam video yang diterima detikSumbagsel, terlihat anggota tersebut dievakuasi menggunakan mobil ambulans ke RS Bhayangkara Polda Lampung.",
    "published": "2026-05-09 17:38:04",
    "image_url": "https://akcdn.detik.net.id/visual/2024/02/04/ilustrasi-korban-tewas_169.jpeg?w=280&q=90",
    "province": "Lampung",
    "city": "lampung",
    "crime_type": "curanmor",
    "relevance_score": 40
  }
];

/* ---------------------------------------------------------------------
   Label maps
--------------------------------------------------------------------- */
const CRIME_LABELS = {
  pencurian: "Pencurian",
  curanmor: "Curanmor",
  "curat/curas": "Curat / Curas",
  pembobolan: "Pembobolan",
  begal: "Begal",
};
const crimeLabel = (raw) => CRIME_LABELS[(raw || "").toLowerCase()] || titleCase(raw || "Lainnya");

const titleCase = (str) =>
  (str || "")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");

/* ---------------------------------------------------------------------
   relevance_score (0-100 from the scraper) -> urgency status,
   reusing the same status colors used across the rest of the app
--------------------------------------------------------------------- */
function scoreToStatus(score) {
  const n = Number(score) || 0;
  if (n >= 70) return { key: "danger", label: "Urgensi Tinggi", fg: COLORS.danger, bg: "#FEF2F2" };
  if (n >= 50) return { key: "high", label: "Urgensi Sedang-Tinggi", fg: COLORS.high, bg: "#FFF7ED" };
  if (n >= 30) return { key: "moderate", label: "Urgensi Sedang", fg: "#A16207", bg: "#FEFCE8" };
  return { key: "safe", label: "Urgensi Rendah", fg: "#15803D", bg: "#F0FDF4" };
}

function formatDate(raw) {
  if (!raw) return "-";
  const d = new Date(String(raw).replace(" ", "T"));
  if (isNaN(d)) return raw;
  const date = d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  return `${date}, ${time} WIB`;
}

/* ---------------------------------------------------------------------
   Scraped articles come with leftover ad/boilerplate text from the
   source site (e.g. Detik's "ADVERTISEMENT / SCROLL TO CONTINUE WITH
   CONTENT" markers, "Baca juga:" cross-promo lines, video-ad prompts).
   This strips that noise before the content is rendered, so the UI
   never shows ad placeholders — "kalau bisa" as requested.
--------------------------------------------------------------------- */
const AD_LINE_PATTERNS = [
  /^\s*ADVERTISEMENT\s*$/i,
  /^\s*SCROLL TO (CONTINUE|RESUME) (WITH )?CONTENT\s*$/i,
  /^\s*--?\s*Advertisement\s*--?\s*$/i,
  /^\s*Baca juga\s*[:：].*$/i,
  /^\s*Lihat juga video.*$/i,
  /^\s*Simak Video.*$/i,
  /^\s*\[gambas:video.*\]\s*$/i,
];
const AD_TRAILING_PATTERNS = [/Baca berita lengkapnya\s*di sini\.?/gi];

function cleanContent(raw) {
  if (!raw) return [];
  let text = raw;
  AD_TRAILING_PATTERNS.forEach((re) => { text = text.replace(re, ""); });

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !AD_LINE_PATTERNS.some((re) => re.test(line)));
}

/* ---------------------------------------------------------------------
   Small building blocks
--------------------------------------------------------------------- */
function CoverImage({ src, alt, className, imgClassName }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div className={className} style={{ background: "#E2E8F0" }}>
        <div className="flex h-full w-full flex-col items-center justify-center gap-2" style={{ color: "#94A3B8" }}>
          <ImageOff className="h-8 w-8" />
          <span className="text-[12px] font-medium">Gambar tidak tersedia</span>
        </div>
      </div>
    );
  }
  return (
    <div className={className}>
      <img src={src} alt={alt} onError={() => setBroken(true)} className={imgClassName} />
    </div>
  );
}

function RelatedCard({ item, onSelect }) {
  const status = scoreToStatus(item.relevance_score);
  return (
    <button
      onClick={() => onSelect?.(item)}
      className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-slate-50"
    >
      <CoverImage
        src={item.image_url}
        alt={item.title}
        className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-lg"
        imgClassName="h-full w-full object-cover"
      />
      <div className="min-w-0">
        <span
          className="mb-1.5 inline-block rounded px-2 py-0.5 text-[10.5px] font-semibold"
          style={{ background: status.bg, color: status.fg }}
        >
          {crimeLabel(item.crime_type)}
        </span>
        <h5 className="line-clamp-2 text-[13px] font-bold leading-snug" style={{ color: COLORS.text }}>
          {item.title}
        </h5>
        <span className="mt-1 block text-[11px]" style={{ color: COLORS.textSec }}>
          {formatDate(item.published)}
        </span>
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------------
   Article detail page
   Props:
   - article: object matching the scraper schema (title, url, source,
     content, published, image_url, province, city, crime_type,
     relevance_score, ...). Falls back to a real sample row if omitted.
   - related: array of the same shape, shown in the sidebar.
   - onSelectRelated(item): optional callback fired when a related
     card is clicked (wire this to your router / Inertia visit).
--------------------------------------------------------------------- */
export default function Artikel({
  article = SAMPLE_ARTICLES[0],
  related = SAMPLE_ARTICLES.slice(1),
  onSelectRelated,
}) {
  const paragraphs = cleanContent(article.content);
  const status = scoreToStatus(article.relevance_score);
  const location = [titleCase(article.city), article.province].filter(Boolean).join(", ");

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Poppins', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');`}</style>

      {/* slim breadcrumb bar */}
      <div className="bg-white" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="mx-auto flex max-w-[1240px] items-center gap-1.5 px-6 py-4 text-[13px]" style={{ color: COLORS.textSec }}>
          <span>Beranda</span>
          <ChevronRight className="h-3.5 w-3.5" style={{ color: "#CBD5E1" }} />
          <span>Berita</span>
          <ChevronRight className="h-3.5 w-3.5" style={{ color: "#CBD5E1" }} />
          <span style={{ color: COLORS.text, fontWeight: 600 }}>{crimeLabel(article.crime_type)}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          {/* main column */}
          <div className="min-w-0">
            <CoverImage
              src={article.image_url}
              alt={article.title}
              className="mb-6 aspect-[16/8] w-full overflow-hidden rounded-2xl"
              imgClassName="h-full w-full object-cover"
            />

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: COLORS.primary50, color: COLORS.primaryDark }}>
                {crimeLabel(article.crime_type)}
              </span>
              <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: status.bg, color: status.fg }}>
                <ShieldAlert className="h-3.5 w-3.5" />
                {status.label}
              </span>
            </div>

            <h1 className="text-[28px] font-bold leading-tight md:text-[34px]" style={{ color: COLORS.text }}>
              {article.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-b pb-6 text-[13px]" style={{ borderColor: COLORS.border, color: COLORS.textSec }}>
              <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{formatDate(article.published)}</span>
              {location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{location}</span>}
              <span className="flex items-center gap-1.5"><Newspaper className="h-4 w-4" />Sumber: {article.source}</span>
            </div>

            <div className="mt-6 space-y-4">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => (
                  <p key={i} className="text-[15.5px] leading-relaxed" style={{ color: "#334155" }}>
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-[15px] italic" style={{ color: COLORS.textSec }}>
                  Ringkasan belum tersedia untuk artikel ini.
                </p>
              )}
            </div>

            {/* link to the original source — always visible, never hidden behind an interstitial/ad */}
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center gap-4 rounded-xl p-5 no-underline transition-colors hover:bg-slate-50"
              style={{ border: `1px solid ${COLORS.border}`, background: "#fff" }}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg" style={{ background: COLORS.primary50, color: COLORS.primary }}>
                <Newspaper className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold" style={{ color: COLORS.text }}>
                  Baca artikel asli di {article.source}
                </span>
                <span className="block truncate text-[12.5px]" style={{ color: COLORS.textSec }}>
                  {article.url}
                </span>
              </span>
              <span
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white"
                style={{ background: COLORS.primary }}
              >
                Buka <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>

          {/* sidebar — related articles */}
          <aside>
            <div className="rounded-xl p-4" style={{ background: "#fff", border: `1px solid ${COLORS.border}` }}>
              <h3 className="mb-2 px-1 text-[14.5px] font-bold" style={{ color: COLORS.text }}>
                Berita Terkait
              </h3>
              <div className="flex flex-col">
                {related.length > 0 ? (
                  related.map((item) => <RelatedCard key={item.id} item={item} onSelect={onSelectRelated} />)
                ) : (
                  <p className="px-1 py-3 text-[13px]" style={{ color: COLORS.textSec }}>
                    Belum ada berita terkait.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}