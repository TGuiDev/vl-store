import { useState, useEffect } from 'react';
import { X, Heart, ShoppingCart, Star } from 'lucide-react';
import { Perfume, Review } from '../types/database';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface PerfumeDetailProps {
  perfume: Perfume;
  onClose: () => void;
  onAddToCart: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function PerfumeDetail({
  perfume,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}: PerfumeDetailProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userReview, setUserReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [perfume.id]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('perfume_id', perfume.id)
      .order('created_at', { ascending: false });

    if (data) {
      setReviews(data);
      const myReview = data.find((r) => r.user_id === user?.id);
      if (myReview) {
        setUserReview(myReview);
        setRating(myReview.rating);
        setComment(myReview.comment || '');
      }
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (userReview) {
      await supabase
        .from('reviews')
        .update({ rating, comment })
        .eq('id', userReview.id);
    } else {
      await supabase.from('reviews').insert({
        perfume_id: perfume.id,
        user_id: user.id,
        rating,
        comment,
      });
    }

    setComment('');
    setRating(5);
    fetchReviews();
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const displayPrice = perfume.promotion_price || perfume.price;
  const hasPromotion = perfume.promotion_price !== null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto bg-zinc-800 rounded-lg shadow-2xl">
          <div className="sticky top-0 bg-zinc-800 z-10 flex items-center justify-between p-6 border-b border-zinc-700">
            <h2 className="text-2xl font-bold text-white">Detalhes do Produto</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900">
                <img
                  src={perfume.image_base64}
                  alt={perfume.name}
                  className="w-full h-full object-cover"
                />
                {perfume.status === 'unavailable' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold text-lg">
                      Indisponível
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{perfume.name}</h1>
                <p className="text-xl text-zinc-400 mb-4">{perfume.brand}</p>

                {reviews.length > 0 && (
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={
                            i < Math.round(averageRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-600'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-zinc-400">
                      {averageRating.toFixed(1)} ({reviews.length} avaliações)
                    </span>
                  </div>
                )}

                {perfume.description && (
                  <p className="text-zinc-300 mb-6">{perfume.description}</p>
                )}

                <div className="flex items-baseline space-x-3 mb-6">
                  <span className="text-4xl font-bold text-amber-400">
                    R$ {displayPrice.toFixed(2)}
                  </span>
                  {hasPromotion && (
                    <span className="text-xl text-zinc-500 line-through">
                      R$ {perfume.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={onToggleFavorite}
                    className="flex items-center space-x-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                  >
                    <Heart
                      size={20}
                      className={isFavorite ? 'fill-red-500 text-red-500' : ''}
                    />
                    <span>{isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onAddToCart();
                      onClose();
                    }}
                    disabled={perfume.status === 'unavailable'}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <ShoppingCart size={20} />
                    <span>Adicionar ao Carrinho</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-700 pt-8">
              <h3 className="text-2xl font-bold text-white mb-6">Avaliações</h3>

              <form onSubmit={handleSubmitReview} className="mb-8 bg-zinc-900 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-4">
                  {userReview ? 'Editar sua avaliação' : 'Deixe sua avaliação'}
                </h4>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Nota
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-600'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Comentário (opcional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    placeholder="Conte sua experiência com este perfume..."
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                  {userReview ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
                </button>
              </form>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-zinc-900 p-6 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">
                          {review.profiles?.full_name || 'Usuário'}
                        </p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-zinc-600'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-zinc-500">
                        {new Date(review.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-zinc-300">{review.comment}</p>
                    )}
                  </div>
                ))}

                {reviews.length === 0 && (
                  <p className="text-center text-zinc-400 py-8">
                    Seja o primeiro a avaliar este perfume!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
