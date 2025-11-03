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

// 💡 Função auxiliar para formatar preço (Padrão profissional)
const formatPrice = (price: number) => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

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
  const isUnavailable = perfume.status === 'unavailable';

  return (
    <div
      className={`
        bg-zinc-800 rounded-xl overflow-hidden shadow-xl border border-zinc-700
        hover:shadow-amber-500/20 transition-all duration-300 transform
        ${!isUnavailable ? 'hover:scale-[1.03]' : 'opacity-70'}
      `}
    >
      {/* Área da Imagem e Botões Flutuantes */}
      <div
        className={`relative aspect-square overflow-hidden bg-zinc-900 ${!isUnavailable ? 'cursor-pointer' : ''}`}
        onClick={!isUnavailable ? onClick : undefined} // Só clica se estiver disponível
      >
        <img
          src={perfume.image_base64}
          alt={perfume.name}
          className="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
        />

        {/* Botão de Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          // Estilo mais refinado e com foco
          className="absolute top-4 right-4 bg-zinc-900/60 backdrop-blur-sm p-2 rounded-full ring-2 ring-zinc-800 hover:bg-zinc-900/80 transition-colors focus:outline-none focus:ring-amber-400"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            size={20}
            // Animação sutil ao preencher/esvaziar
            className={`transition-all duration-200 ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-white hover:text-red-500'
            }`}
          />
        </button>

        {/* Tag de Status: Indisponível */}
        {isUnavailable && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="bg-zinc-700 text-white px-4 py-2 rounded-full text-lg font-bold tracking-wider">
              INDISPONÍVEL
            </span>
          </div>
        )}

        {/* Tag de Status: Promoção */}
        {hasPromotion && !isUnavailable && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
            OFERTA
          </div>
        )}
      </div>

      {/* Detalhes do Produto */}
      <div className="p-5 flex flex-col justify-between min-h-[160px]">
        <div onClick={!isUnavailable ? onClick : undefined} className={!isUnavailable ? 'cursor-pointer' : ''}>
            <p className="text-zinc-400 text-xs uppercase font-medium tracking-wider mb-1">{perfume.brand}</p>
            <h3 className="text-xl font-extrabold text-white mb-3 hover:text-amber-400 transition-colors">
              {perfume.name}
            </h3>
        </div>

        {/* Área de Avaliações */}
        <div className="flex items-center space-x-2 mb-4">
          {reviewCount > 0 ? (
            <>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.round(averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-600'
                  }
                />
              ))}
              <span className="text-sm text-zinc-400 font-medium">
                {averageRating.toFixed(1)} ({reviewCount})
              </span>
            </>
          ) : (
            <span className="text-sm text-zinc-500 italic">
                Sem avaliações
            </span>
          )}
        </div>

        {/* Área de Preço */}
        <div className="flex flex-col items-start mb-4">
          {hasPromotion && (
            <span className="text-base text-red-400 line-through font-medium opacity-80">
              {formatPrice(perfume.price)}
            </span>
          )}
          <span className="text-3xl font-extrabold text-amber-400">
            {formatPrice(displayPrice)}
          </span>
        </div>

        {/* Botão de Ação */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          disabled={isUnavailable}
          className={`
            w-full py-3 rounded-xl flex items-center justify-center space-x-2 font-bold uppercase tracking-wider
            transition-all duration-200 ease-in-out transform shadow-lg
            ${isUnavailable
              ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 text-zinc-900 hover:scale-[1.01] active:scale-95'
            }
          `}
        >
          <ShoppingCart size={20} />
          <span>{isUnavailable ? 'Indisponível' : 'Adicionar ao Carrinho'}</span>
        </button>
      </div>
    </div>
  );
}