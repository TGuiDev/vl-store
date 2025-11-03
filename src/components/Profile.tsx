import { useState, useEffect } from 'react';
import { User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user?.id);

      if (error) throw error;
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Meu Perfil</h1>

        <div className="bg-zinc-800 rounded-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-6">
              <User size={64} className="text-white" />
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-zinc-300 mb-2">
                <User size={18} />
                <span>Nome Completo</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-zinc-300 mb-2">
                <Mail size={18} />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-500 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-500 mt-1">O email não pode ser alterado</p>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-zinc-300 mb-2">
                <Calendar size={18} />
                <span>Membro desde</span>
              </label>
              <input
                type="text"
                value={
                  profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('pt-BR')
                    : ''
                }
                disabled
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-500 cursor-not-allowed"
              />
            </div>

            {profile?.is_admin && (
              <div className="bg-amber-500/10 border border-amber-500 rounded-lg p-4">
                <p className="text-amber-400 font-semibold text-center">
                  Você é um administrador da plataforma
                </p>
              </div>
            )}

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.includes('sucesso')
                    ? 'bg-green-500/10 border border-green-500 text-green-400'
                    : 'bg-red-500/10 border border-red-500 text-red-400'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Atualizando...' : 'Atualizar Perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
