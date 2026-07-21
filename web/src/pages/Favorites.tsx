import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import type { Product } from '../types';

interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  product: Product | null;
}

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchFavorites = async () => {
      const { data } = await supabase
        .from('favorites')
        .select(`
          id,
          user_id,
          product_id,
          product:products (
            *,
            category:categories(*),
            subcategory:subcategories(*),
            images:product_images(*)
          )
        `)
        .eq('user_id', user.id);
      
      if (data) setFavorites(data as unknown as Favorite[]);
      setLoading(false);
    };
    
    fetchFavorites();
  }, [user]);

  const handleRemove = async (id: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setFavorites(favorites.filter(f => f.id !== id));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Favoritos</h2>
            <p className="text-gray-600">Inicia sesión para ver tus favoritos.</p>
            <Link to="/login" className="text-primary-600 hover:underline mt-4 inline-block">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Favoritos</h2>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Favoritos</h2>
            <p className="text-gray-600">No tenés productos favoritos.</p>
            <Link to="/productos" className="text-primary-600 hover:underline mt-4 inline-block">
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Favoritos</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map(fav => {
              const product = fav.product;
              return (
                <div key={fav.id} className="border rounded-lg p-4">
                  {product && (
                    <>
                      <img
                        src={product.images?.[0]?.url || ''}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <h3 className="font-medium text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category?.name}</p>
                      <p className="text-primary-600 font-bold mt-2">${product.webPrice}</p>
                      <div className="flex gap-2 mt-2">
                        <Link
                          to={`/producto/${product.id}`}
                          className="text-primary-600 hover:underline text-sm"
                        >
                          Ver producto
                        </Link>
                        <button
                          onClick={() => handleRemove(fav.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Quitar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}