export const NATIONAL_CONTACTS = [
  { name: 'Polisi', phone: '110', icon: 'shield' },
  { name: 'Ambulans / PMI', phone: '118', icon: 'ambulance' },
  { name: 'Pemadam Kebakaran', phone: '113', icon: 'flame' },
  { name: 'BASARNAS (Search & Rescue)', phone: '115', icon: 'search' },
  { name: 'PLN (Listrik Darurat)', phone: '123', icon: 'zap' },
];

export const PROVINCE_CONTACTS = {
  'DKI Jakarta': [
    { name: 'Polda Metro Jaya', phone: '021-5201110', type: 'police' },
    { name: 'RS Polri Kramat Jati', phone: '021-8092524', type: 'hospital' },
    { name: 'Dinas Gulkarmat Jakarta', phone: '021-3447777', type: 'fire' },
  ],
  'Jawa Barat': [
    { name: 'Polda Jawa Barat', phone: '022-5202222', type: 'police' },
    { name: 'RS Hasan Sadikin', phone: '022-2034953', type: 'hospital' },
    { name: 'Damkar Bandung', phone: '022-7206113', type: 'fire' },
  ],
  'Jawa Timur': [
    { name: 'Polda Jawa Timur', phone: '031-8444000', type: 'police' },
    { name: 'RS Dr. Soetomo', phone: '031-5501000', type: 'hospital' },
    { name: 'Damkar Surabaya', phone: '031-5456113', type: 'fire' },
  ],
  'Banten': [
    { name: 'Polda Banten', phone: '0254-210110', type: 'police' },
    { name: 'RS Sakinah', phone: '021-1234567', type: 'hospital' },
    { name: 'Damkar Serang', phone: '0254-200113', type: 'fire' },
  ],
  'default': [
    { name: 'Kantor Polisi Terdekat', phone: '110', type: 'police' },
    { name: 'RS Umum Daerah', phone: '118', type: 'hospital' },
    { name: 'Pemadam Kebakaran', phone: '113', type: 'fire' },
  ],
};
