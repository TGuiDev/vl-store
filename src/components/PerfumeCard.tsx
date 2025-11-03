import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Perfume } from '../types/database';

interface PerfumeCardProps {
  perfume: Perfume;
  isFavorite: boolean;
  averageRating: number;
  reviewCount: number;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onClick: () => void;
}

export default function PerfumeCard({
  perfume,
  isFavorite,
  averageRating,
  reviewCount,
  onToggleFavorite,
  onAddToCart,
  onClick,
}: PerfumeCardProps) {
  const displayPrice = perfume.promotion_price || perfume.price;
  const hasPromotion = perfume.promotion_price !== null;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <div className="relative aspect-square overflow-hidden bg-gray-900 cursor-pointer" onClick={onClick}>
        <img
          src={perfume.image_base64}
          alt={perfume.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}
          />
        </button>
        {perfume.status === 'unavailable' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold">
              Indisponível
            </span>
          </div>
        )}
        {hasPromotion && perfume.status === 'available' && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Promoção
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 cursor-pointer hover:text-amber-400 transition-colors" onClick={onClick}>
          {perfume.name}
        </h3>
        <p className="text-gray-400 text-sm mb-3">{perfume.brand}</p>

        {reviewCount > 0 && (
          <div className="flex items-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-600'
                }
              />
            ))}
            <span className="text-sm text-gray-400 ml-2">
              ({reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-baseline space-x-2 mb-4">
          <span className="text-2xl font-bold text-amber-400">
            R$ {displayPrice.toFixed(2)}
          </span>
          {hasPromotion && (
            <span className="text-sm text-gray-500 line-through">
              R$ {perfume.price.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={onAddToCart}
          disabled={perfume.status === 'unavailable'}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <ShoppingCart size={18} />
          <span>Adicionar ao Carrinho</span>
        </button>
      </div>
    </div>
  );
}
