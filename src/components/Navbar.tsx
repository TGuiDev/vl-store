import { ShoppingCart, Heart, User, LogOut, Shield, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  cartCount: number;
}

export default function Navbar({ onNavigate, currentPage, cartCount }: NavbarProps) {
  const { user, profile, signOut } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="text-xl font-bold tracking-wide hover:text-amber-400 transition-colors"
          >
            VL Store Import
          </button>

          {user && (
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onNavigate('contact')}
                className={`flex items-center space-x-1 hover:text-amber-400 transition-colors ${
                  currentPage === 'contact' ? 'text-amber-400' : ''
                }`}
              >
                <Phone size={20} />
                <span>Contato</span>
              </button>

              <button
                onClick={() => onNavigate('favorites')}
                className={`flex items-center space-x-1 hover:text-amber-400 transition-colors ${
                  currentPage === 'favorites' ? 'text-amber-400' : ''
                }`}
              >
                <Heart size={20} />
                <span>Favoritos</span>
              </button>

              <button
                onClick={() => onNavigate('cart')}
                className={`flex items-center space-x-1 hover:text-amber-400 transition-colors relative ${
                  currentPage === 'cart' ? 'text-amber-400' : ''
                }`}
              >
                <ShoppingCart size={20} />
                <span>Carrinho</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {profile?.is_admin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`flex items-center space-x-1 hover:text-amber-400 transition-colors ${
                    currentPage === 'admin' ? 'text-amber-400' : ''
                  }`}
                >
                  <Shield size={20} />
                  <span>Admin</span>
                </button>
              )}

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('profile')}
                  className={`flex items-center space-x-1 hover:text-amber-400 transition-colors ${
                    currentPage === 'profile' ? 'text-amber-400' : ''
                  }`}
                >
                  <User size={20} />
                  <span className="hidden md:inline">{profile?.full_name || 'Perfil'}</span>
                </button>

                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 hover:text-red-400 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="hidden md:inline">Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
