import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import Artikel from '../../Components/Artikel';

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.crimes.show(id),
      api.crimes.latest(5),
    ])
      .then(([articleData, latest]) => {
        setArticle(articleData);
        setRelated((latest || []).filter((a) => a.id !== Number(id)).slice(0, 4));
      })
      .catch(() => { setArticle(null); setRelated([]); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <p className="text-gray-400">Berita tidak ditemukan</p>
        <button onClick={() => navigate('/news')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Kembali ke Berita
        </button>
      </div>
    );
  }

  return (
    <Artikel
      article={article}
      related={related}
      onSelectRelated={(item) => navigate(`/berita/${item.id}`)}
    />
  );
}
