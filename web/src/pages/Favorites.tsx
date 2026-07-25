import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFavorites, removeFromFavorites } from '../services/favoriteService';
import type { Favorite } from '../types';

function getProductImage(images: string | undefined): string {
  if (!images) return '';
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0]?.url || parsed[0] || '';
    }
    return typeof parsed === 'string' ? parsed : '';
  } catch {
    return images;
  }
}

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (user?.id) {
        try {
          const data = await getFavorites(user.id);
          setFavorites(data);
        } catch (error) {
          console.error('Error loading favorites:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadFavorites();
  }, [user]);

  const handleRemove = async (favoriteId: string) => {
    try {
      await removeFromFavorites(favoriteId);
      setFavorites(favorites.filter(f => f.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-600">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No tienes favoritos</h1>
          <p className="text-gray-600 mb-6">Agrega productos a tu lista de favoritos</p>
          <Link
            to="/productos"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Favoritos</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((fav) => {
            const product = fav.product;
            if (!product) return null;
            return (
              <div key={fav.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={getProductImage(product.images)}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-primary-600 font-bold text-xl mb-4">${product.webPrice}</p>
                  <div className="flex gap-2">
                    <Link
                      to={`/producto/${product.id}`}
                      className="flex-1 text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => handleRemove(fav.id)}
                      className="px-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}