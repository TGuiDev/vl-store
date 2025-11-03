import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Package, X, AlertTriangle } from 'lucide-react'; // 👈 Adicionado X e AlertTriangle
import { supabase } from '../lib/supabase';
import { Perfume, Profile } from '../types/database';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'perfumes' | 'users'>('perfumes');
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);

  // Modal de Adição/Edição de Perfume
  const [showModal, setShowModal] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);

  // 👈 Novo Estado: Modal de Confirmação de Exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [perfumeToDelete, setPerfumeToDelete] = useState<string | null>(null);
  const [perfumeNameToDelete, setPerfumeNameToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    promotion_price: '',
    status: 'available' as 'available' | 'unavailable',
    description: '',
    image_base64: '',
  });

  useEffect(() => {
    fetchPerfumes();
    fetchUsers();
  }, []);

  // ... (funções fetchPerfumes, fetchUsers, handleImageUpload, handleSubmit permanecem as mesmas)

  const fetchPerfumes = async () => {
    const { data } = await supabase
      .from('perfumes')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPerfumes(data);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image_base64: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const perfumeData = {
      name: formData.name,
      brand: formData.brand,
      price: parseFloat(formData.price),
      promotion_price: formData.promotion_price ? parseFloat(formData.promotion_price) : null,
      status: formData.status,
      description: formData.description || null,
      image_base64: formData.image_base64,
    };

    if (editingPerfume) {
      // Melhoria: Adicionar tratamento de erro simples
      const { error } = await supabase.from('perfumes').update(perfumeData).eq('id', editingPerfume.id);
      if (error) alert('Erro ao atualizar perfume: ' + error.message);
    } else {
      const { error } = await supabase.from('perfumes').insert(perfumeData);
      if (error) alert('Erro ao adicionar perfume: ' + error.message);
    }

    setShowModal(false);
    setEditingPerfume(null);
    setFormData({
      name: '',
      brand: '',
      price: '',
      promotion_price: '',
      status: 'available',
      description: '',
      image_base64: '',
    });
    fetchPerfumes();
  };


  const handleEdit = (perfume: Perfume) => {
    setEditingPerfume(perfume);
    setFormData({
      name: perfume.name,
      brand: perfume.brand,
      price: perfume.price.toString(),
      promotion_price: perfume.promotion_price?.toString() || '',
      status: perfume.status,
      description: perfume.description || '',
      image_base64: perfume.image_base64,
    });
    setShowModal(true);
  };

  // 👈 Função para abrir o modal de exclusão
  const openDeleteModal = (perfumeId: string, perfumeName: string) => {
    setPerfumeToDelete(perfumeId);
    setPerfumeNameToDelete(perfumeName);
    setShowDeleteModal(true);
  };

  // 👈 Função de exclusão que será chamada pelo modal de confirmação
  const confirmDelete = async () => {
    if (perfumeToDelete) {
      const { error } = await supabase.from('perfumes').delete().eq('id', perfumeToDelete);

      if (error) {
        alert('Erro ao excluir perfume: ' + error.message);
      } else {
        // Opcional: Adicionar feedback de sucesso
      }

      setShowDeleteModal(false);
      setPerfumeToDelete(null);
      setPerfumeNameToDelete(null);
      fetchPerfumes();
    }
  };

  const toggleUserAdmin = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);

    if (error) alert('Erro ao alterar status de admin: ' + error.message);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-white mb-8 border-b border-zinc-700 pb-2">
          Painel Administrativo 💻
        </h1>

        {/* Abas de Navegação */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('perfumes')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg ${
              activeTab === 'perfumes'
                ? 'bg-amber-500 text-zinc-900 shadow-amber-500/30'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <Package size={20} />
            <span>Gestão de Produtos ({perfumes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg ${
              activeTab === 'users'
                ? 'bg-amber-500 text-zinc-900 shadow-amber-500/30'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            <Users size={20} />
            <span>Gestão de Usuários ({users.length})</span>
          </button>
        </div>

        {/* Tabela de Perfumes */}
        {activeTab === 'perfumes' && (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => {
                  setEditingPerfume(null);
                  setFormData({
                    name: '', brand: '', price: '', promotion_price: '',
                    status: 'available', description: '', image_base64: '',
                  });
                  setShowModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors font-semibold"
              >
                <Plus size={20} />
                <span>Adicionar Novo Perfume</span>
              </button>
            </div>

            <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              <table className="min-w-full divide-y divide-zinc-700">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Imagem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Nome / Marca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Preço (R$)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-zinc-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {perfumes.map((perfume) => (
                    <tr key={perfume.id} className="hover:bg-zinc-700 transition-colors">
                      <td className="px-6 py-4">
                        <img
                          src={perfume.image_base64}
                          alt={perfume.name}
                          className="w-16 h-16 object-cover rounded-md border border-zinc-700"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-white">{perfume.name}</p>
                        <p className="text-zinc-400 text-sm">{perfume.brand}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                        <div className="flex flex-col">
                          <span className={`${perfume.promotion_price ? 'line-through text-red-400 text-sm' : 'text-white font-bold'}`}>
                            R$ {perfume.price.toFixed(2)}
                          </span>
                          {perfume.promotion_price !== null && (
                            <span className="text-amber-400 font-bold">
                              R$ {perfume.promotion_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            perfume.status === 'available'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {perfume.status === 'available' ? 'Disponível' : 'Indisponível'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex space-x-3 justify-center">
                          <button
                            onClick={() => handleEdit(perfume)}
                            className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-zinc-700 transition-colors"
                            title="Editar Produto"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            // 👈 Chamada para abrir o novo modal
                            onClick={() => openDeleteModal(perfume.id, perfume.name)}
                            className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-zinc-700 transition-colors"
                            title="Excluir Produto"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Tabela de Usuários */}
        {activeTab === 'users' && (
          <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Data de Cadastro
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {user.full_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          user.is_admin
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-zinc-600/20 text-zinc-400'
                        }`}
                      >
                        {user.is_admin ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => toggleUserAdmin(user.id, user.is_admin)}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors
                            ${user.is_admin
                              ? 'bg-red-700/50 text-red-400 hover:bg-red-700'
                              : 'bg-green-700/50 text-green-400 hover:bg-green-700'
                            }`}
                      >
                        {user.is_admin ? 'Remover Admin' : 'Tornar Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Adição/Edição de Perfume (Não Alterado) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
                onClick={() => {
                    setShowModal(false);
                    setEditingPerfume(null);
                }}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                aria-label="Fechar"
            >
                <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPerfume ? 'Editar Perfume' : 'Adicionar Perfume'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... (Seus campos de formulário aqui) */}
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Nome do Perfume
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Marca
                    </label>
                    <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Preço (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Preço Promocional (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.promotion_price}
                            onChange={(e) =>
                                setFormData({ ...formData, promotion_price: e.target.value })
                            }
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Status
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                status: e.target.value as 'available' | 'unavailable',
                            })
                        }
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    >
                        <option value="available">Disponível</option>
                        <option value="unavailable">Indisponível</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Descrição
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Imagem do Produto
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                        required={!editingPerfume}
                    />
                    {formData.image_base64 && (
                        <img
                            src={formData.image_base64}
                            alt="Preview"
                            className="mt-4 w-32 h-32 object-cover rounded"
                        />
                    )}
                </div>

                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                        {editingPerfume ? 'Atualizar' : 'Adicionar'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowModal(false);
                            setEditingPerfume(null);
                        }}
                        className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {/* 💥 NOVO: Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-800 rounded-lg p-8 max-w-sm w-full shadow-2xl border border-red-700">
            <div className="flex flex-col items-center text-center">
              <AlertTriangle size={48} className="text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Confirmar Exclusão
              </h2>
              <p className="text-zinc-300 mb-6">
                Você tem certeza que deseja excluir permanentemente o perfume:
                <span className="font-semibold text-white block mt-1">
                  "{perfumeNameToDelete}"?
                </span>
                Esta ação não pode ser desfeita.
              </p>

              <div className="flex space-x-4 w-full">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition-colors shadow-lg shadow-red-500/20"
                >
                  Excluir
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-zinc-600 hover:bg-zinc-700 text-white py-3 rounded-lg font-bold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}