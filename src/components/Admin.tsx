import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Perfume, Profile } from '../types/database';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'perfumes' | 'users'>('perfumes');
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
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
      await supabase.from('perfumes').update(perfumeData).eq('id', editingPerfume.id);
    } else {
      await supabase.from('perfumes').insert(perfumeData);
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

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este perfume?')) {
      await supabase.from('perfumes').delete().eq('id', id);
      fetchPerfumes();
    }
  };

  const toggleUserAdmin = async (userId: string, currentStatus: boolean) => {
    await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Painel Administrativo</h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('perfumes')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'perfumes'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Package size={20} />
            <span>Perfumes</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'users'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Users size={20} />
            <span>Usuários</span>
          </button>
        </div>

        {activeTab === 'perfumes' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => {
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
                  setShowModal(true);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Adicionar Perfume</span>
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Imagem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Marca
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {perfumes.map((perfume) => (
                    <tr key={perfume.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={perfume.image_base64}
                          alt={perfume.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {perfume.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {perfume.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        <div>
                          R$ {perfume.price.toFixed(2)}
                          {perfume.promotion_price && (
                            <div className="text-amber-400 text-sm">
                              Promoção: R$ {perfume.promotion_price.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            perfume.status === 'available'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {perfume.status === 'available' ? 'Disponível' : 'Indisponível'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(perfume)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(perfume.id)}
                            className="text-red-400 hover:text-red-300"
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

        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Data de Cadastro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {user.full_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.is_admin
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {user.is_admin ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleUserAdmin(user.id, user.is_admin)}
                        className="text-amber-400 hover:text-amber-300 text-sm font-semibold"
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

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPerfume ? 'Editar Perfume' : 'Adicionar Perfume'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Perfume
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Marca
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preço Promocional (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.promotion_price}
                    onChange={(e) =>
                      setFormData({ ...formData, promotion_price: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="available">Disponível</option>
                  <option value="unavailable">Indisponível</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Imagem do Produto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
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

              <div className="flex space-x-4">
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
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
