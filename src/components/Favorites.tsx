import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Favorite, Perfume, Review } from '../types/database';
import { useAuth } from '../context/AuthContext';
import PerfumeCard from './PerfumeCard';
import PerfumeDetail from './PerfumeDetail';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<(Favorite & { perfumes: Perfume })[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);

  useEffect(() => {
    fetchFavorites();
    fetchReviews();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('favorites')
      .select('*, perfumes(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setFavorites(data);
    setLoading(false);
  };

  const fetchReviews = async () => {
    const { data } = await supabase.from('reviews').select('*');
    if (data) setReviews(data);
  };

  const toggleFavorite = async (perfumeId: string) => {
    if (!user) return;

    const favorite = favorites.find((f) => f.perfume_id === perfumeId);
    if (favorite) {
      await supabase.from('favorites').delete().eq('id', favorite.id);
      setFavorites(favorites.filter((f) => f.perfume_id !== perfumeId));
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
        isFavorite={true}
        onToggleFavorite={() => {
          toggleFavorite(selectedPerfume.id);
          setSelectedPerfume(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Meus Favoritos</h1>

        {favorites.length === 0 ? (
          <div className="bg-zinc-800 rounded-lg p-12 text-center">
            <Heart size={64} className="mx-auto text-zinc-600 mb-4" />
            <p className="text-zinc-400 text-lg">Você ainda não tem favoritos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const { averageRating, reviewCount } = getPerfumeStats(favorite.perfumes.id);
              return (
                <PerfumeCard
                  key={favorite.id}
                  perfume={favorite.perfumes}
                  isFavorite={true}
                  averageRating={averageRating}
                  reviewCount={reviewCount}
                  onToggleFavorite={() => toggleFavorite(favorite.perfumes.id)}
                  onAddToCart={() => addToCart(favorite.perfumes.id)}
                  onClick={() => setSelectedPerfume(favorite.perfumes)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
