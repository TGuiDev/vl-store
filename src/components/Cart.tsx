import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CartItem } from '../types/database';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('cart_items')
      .select('*, perfumes(*)')
      .eq('user_id', user.id);

    if (data) setCartItems(data);
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);

    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = async (itemId: string) => {
    await supabase.from('cart_items').delete().eq('id', itemId);
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => {
    const price = item.perfumes?.promotion_price || item.perfumes?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const generateWhatsAppMessage = () => {
    const items = cartItems
      .map(
        (item) =>
          `• ${item.perfumes?.name} - ${item.perfumes?.brand} (${item.quantity}x) - R$ ${(
            (item.perfumes?.promotion_price || item.perfumes?.price || 0) * item.quantity
          ).toFixed(2)}`
      )
      .join('\n');

    const message = `Olá! Gostaria de fazer um pedido:\n\n${items}\n\nTotal: R$ ${total.toFixed(2)}`;
    return encodeURIComponent(message);
  };

  const handleCheckout = (platform: 'whatsapp' | 'instagram') => {
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/5519992483502?text=${generateWhatsAppMessage()}`, '_blank');
    } else {
      window.open('https://www.instagram.com/viniciuss.lucas', '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Carrinho de Compras</h1>

        {cartItems.length === 0 ? (
          <div className="bg-zinc-800 rounded-lg p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-zinc-600 mb-4" />
            <p className="text-zinc-400 text-lg">Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-800 rounded-lg p-4 flex items-center space-x-4"
                >
                  <img
                    src={item.perfumes?.image_base64}
                    alt={item.perfumes?.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.perfumes?.name}</h3>
                    <p className="text-zinc-400 text-sm">{item.perfumes?.brand}</p>
                    <p className="text-amber-400 font-bold mt-1">
                      R${' '}
                      {(item.perfumes?.promotion_price || item.perfumes?.price || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-white font-semibold w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-zinc-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl text-white font-semibold">Total:</span>
                <span className="text-3xl text-amber-400 font-bold">
                  R$ {total.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleCheckout('whatsapp')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Finalizar pelo WhatsApp
                </button>

                <button
                  onClick={() => handleCheckout('instagram')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Finalizar pelo Instagram
                </button>

                <button
                  onClick={clearCart}
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
