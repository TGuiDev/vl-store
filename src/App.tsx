import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Cart from './components/Cart';
import Favorites from './components/Favorites';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Profile from './components/Profile';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchCartCount();
      const subscription = supabase
        .channel('cart_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cart_items',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchCartCount();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const fetchCartCount = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id);

    const count = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    setCartCount(count);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Espere. Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} cartCount={cartCount} />

      {currentPage === 'home' && <Home />}
      {currentPage === 'cart' && <Cart />}
      {currentPage === 'favorites' && <Favorites />}
      {currentPage === 'contact' && <Contact />}
      {currentPage === 'admin' && <Admin />}
      {currentPage === 'profile' && <Profile />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
