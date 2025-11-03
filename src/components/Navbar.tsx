import { useState } from 'react'; // 👈 Importar useState
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Shield,
  Phone,
  Menu, // 👈 Importar o ícone Menu
  X, // 👈 Importar o ícone X (fechar)
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  cartCount: number;
}

export default function Navbar({ onNavigate, currentPage, cartCount }: NavbarProps) {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 👈 Estado para o menu mobile

  // Função auxiliar para navegação (fecha o menu mobile após a ação)
  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false); // Fecha o menu ao navegar
  };

  // Função auxiliar para logout (fecha o menu mobile após a ação)
  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
  };

  const navItemClass = (page: string) => `
    flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors duration-200
    hover:bg-zinc-700 hover:text-amber-400
    ${currentPage === page ? 'text-amber-400 bg-zinc-700' : 'text-white'}
  `;

  // Componente de Botão de Navegação Reutilizável
  const NavButton = ({ page, Icon, label, isAdmin = false, children }: { page: string, Icon: React.ElementType, label: string, isAdmin?: boolean, children?: React.ReactNode }) => {
    if (isAdmin && !profile?.is_admin) return null;
    return (
      <button
        onClick={() => handleNavigate(page)}
        className={navItemClass(page)}
      >
        <Icon size={20} />
        <span className="flex-1 text-left">{label}</span>
        {children}
      </button>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Título - Sempre Visível */}
          <button
            onClick={() => handleNavigate('home')}
            className="text-xl font-bold tracking-wide hover:text-amber-400 transition-colors"
          >
            VL Store Import
          </button>

          {/* Botão Hamburger (Mobile) */}
          {user && (
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu de navegação"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Itens de Navegação (Desktop) */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <NavButton page="contact" Icon={Phone} label="Contato" />
              <NavButton page="favorites" Icon={Heart} label="Favoritos" />
              <NavButton page="cart" Icon={ShoppingCart} label="Carrinho">
                {cartCount > 0 && (
                  <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2 md:relative md:top-0 md:right-0 md:ml-2">
                    {cartCount}
                  </span>
                )}
              </NavButton>

              <NavButton page="admin" Icon={Shield} label="Admin" isAdmin={true} />

              {/* Perfil e Sair (Ajuste para Desktop) */}
              <div className="flex items-center space-x-3 ml-6 border-l border-zinc-700 pl-6">
                <NavButton page="profile" Icon={User} label={profile?.full_name || 'Perfil'} />
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 p-2 rounded-lg text-sm hover:text-red-400 transition-colors bg-zinc-800 hover:bg-zinc-700"
                >
                  <LogOut size={20} />
                  <span className="hidden lg:inline">Sair</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Mobile - Aparece quando isMenuOpen é true */}
      {user && isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-zinc-800 border-t border-zinc-700">
          <NavButton page="contact" Icon={Phone} label="Contato" />
          <NavButton page="favorites" Icon={Heart} label="Favoritos" />
          <NavButton page="cart" Icon={ShoppingCart} label="Carrinho">
            {cartCount > 0 && (
              <span className="ml-auto bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </NavButton>
          <NavButton page="admin" Icon={Shield} label="Admin" isAdmin={true} />
          <NavButton page="profile" Icon={User} label={profile?.full_name || 'Perfil'} />

          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 w-full p-2 rounded-lg text-sm transition-colors duration-200 text-red-400 hover:bg-zinc-700"
          >
            <LogOut size={20} />
            <span className="flex-1 text-left">Sair</span>
          </button>
        </div>
      )}
    </nav>
  );
}