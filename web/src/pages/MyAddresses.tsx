import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Address {
  id: string;
  userId: string;
  name: string;
  province: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  postalCode: string;
  references?: string;
  isPrimary: boolean;
}

export default function MyAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    city: '',
    neighborhood: '',
    street: '',
    number: '',
    floor: '',
    apartment: '',
    postalCode: '',
    references: '',
  });

  useEffect(() => {
    if (!user) return;

    const fetchAddresses = async () => {
      const { data } = await supabase
        .from('addresses')
        .select('*')
        .eq('userId', user.id);

      if (data) setAddresses(data);
    };

    fetchAddresses();
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { data } = await supabase
      .from('addresses')
      .insert([{
        userId: user.id,
        ...formData,
        isPrimary: addresses.length === 0,
      }])
      .select();

    if (data) {
      setAddresses([...addresses, data[0]]);
      setFormData({
        name: '',
        province: '',
        city: '',
        neighborhood: '',
        street: '',
        number: '',
        floor: '',
        apartment: '',
        postalCode: '',
        references: '',
      });
      setShowForm(false);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await supabase
      .from('addresses')
      .delete()
      .eq('id', id);

    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSetPrimary = async (id: string) => {
    if (!user) return;

    // Quitar primary de todas
    await supabase
      .from('addresses')
      .update({ isPrimary: false })
      .eq('userId', user.id);

    // Set primary en la seleccionada
    await supabase
      .from('addresses')
      .update({ isPrimary: true })
      .eq('id', id);

    setAddresses(addresses.map(a => ({
      ...a,
      isPrimary: a.id === id,
    })));
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Inicia sesión para ver tus direcciones.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Mis Direcciones</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-primary-600 hover:underline"
        >
          {showForm ? 'Cancelar' : 'Agregar'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="space-y-4 mb-6 p-4 border rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la dirección
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provincia
              </label>
              <input
                type="text"
                required
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Barrio
            </label>
            <input
              type="text"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calle
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Piso
              </label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referencias
            </label>
            <textarea
              value={formData.references}
              onChange={(e) => setFormData({ ...formData, references: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar dirección'}
          </button>
        </form>
      )}

      {addresses.length === 0 ? (
        <p className="text-gray-600">No tenés direcciones guardadas.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{addr.name}</p>
                    {addr.isPrimary && (
                      <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
                        Principal
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {addr.street} {addr.number}
                    {addr.floor && `, Piso ${addr.floor}`}
                    {addr.apartment && `, Depto ${addr.apartment}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.neighborhood && `${addr.neighborhood}, `}
                    {addr.city}, {addr.province}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!addr.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(addr.id)}
                      className="text-primary-600 hover:underline text-sm"
                    >
                      Hacer principal
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
