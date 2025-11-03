import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Perfume, Review, Favorite } from '../types/database';
import { useAuth } from '../context/AuthContext';
import PerfumeCard from './PerfumeCard';
import PerfumeDetail from './PerfumeDetail';

export default function Home() {
  const { user } = useAuth();
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState<Perfume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Todos');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  const brands = ['Todos', ...Array.from(new Set(perfumes.map(p => p.brand)))].sort();

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    filterPerfumes();
  }, [perfumes, searchTerm, selectedBrand]);

  const fetchData = async () => {
    try {
      const [perfumesData, favoritesData, reviewsData] = await Promise.all([
        supabase.from('perfumes').select('*').order('created_at', { ascending: false }),
        user ? supabase.from('favorites').select('*').eq('user_id', user.id) : { data: [] },
        supabase.from('reviews').select('*, profiles(full_name)'),
      ]);

      if (perfumesData.data) setPerfumes(perfumesData.data);
      if (favoritesData.data) setFavorites(favoritesData.data);
      if (reviewsData.data) setReviews(reviewsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPerfumes = () => {
    let filtered = perfumes;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedBrand !== 'Todos') {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    setFilteredPerfumes(filtered);
  };

  const toggleFavorite = async (perfumeId: string) => {
    if (!user) return;

    const isFavorite = favorites.some((f) => f.perfume_id === perfumeId);

    if (isFavorite) {
      const favorite = favorites.find((f) => f.perfume_id === perfumeId);
      await supabase.from('favorites').delete().eq('id', favorite!.id);
      setFavorites(favorites.filter((f) => f.perfume_id !== perfumeId));
    } else {
      const { data } = await supabase
        .from('favorites')
        .insert({ perfume_id: perfumeId, user_id: user.id })
        .select()
        .single();
      if (data) setFavorites([...favorites, data]);
    }
  };

  const addToCart = async (perfumeId: string) => {
    if (!user) return;

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('perfume_id', perfumeId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);
    } else {
      await supabase
        .from('cart_items')
        .insert({ perfume_id: perfumeId, user_id: user.id, quantity: 1 });
    }
  };

  const getPerfumeStats = (perfumeId: string) => {
    const perfumeReviews = reviews.filter((r) => r.perfume_id === perfumeId);
    const averageRating =
      perfumeReviews.length > 0
        ? perfumeReviews.reduce((sum, r) => sum + r.rating, 0) / perfumeReviews.length
        : 0;
    return { averageRating, reviewCount: perfumeReviews.length };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (selectedPerfume) {
    return (
      <PerfumeDetail
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
        onAddToCart={() => addToCart(selectedPerfume.id)}
        isFavorite={favorites.some((f) => f.perfume_id === selectedPerfume.id)}
        onToggleFavorite={() => toggleFavorite(selectedPerfume.id)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar perfumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <SlidersHorizontal className="text-zinc-400" size={20} />
            <span className="text-zinc-300 font-medium">Filtros</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedBrand === brand
                    ? 'bg-amber-500 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 text-zinc-400">
          {filteredPerfumes.length} produtos encontrados
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPerfumes.map((perfume) => {
            const { averageRating, reviewCount } = getPerfumeStats(perfume.id);
            return (
              <PerfumeCard
                key={perfume.id}
                perfume={perfume}
                isFavorite={favorites.some((f) => f.perfume_id === perfume.id)}
                averageRating={averageRating}
                reviewCount={reviewCount}
                onToggleFavorite={() => toggleFavorite(perfume.id)}
                onAddToCart={() => addToCart(perfume.id)}
                onClick={() => setSelectedPerfume(perfume)}
              />
            );
          })}
        </div>

        {filteredPerfumes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">Nenhum perfume encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
