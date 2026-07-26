import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFavorites } from '../services/favoriteService';
import { getProductById } from '../services/productService';
import { Favorite, Product } from '../types';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const favoritesRes = await getFavorites();
        setFavorites(favoritesRes);

        // Cargar detalles de cada producto
        const productMap = new Map<string, Product>();
        for (const fav of favoritesRes) {
          try {
            const product = await getProductById(fav.productId);
            productMap.set(fav.productId, product);
          } catch (error) {
            console.error(`Error al cargar producto ${fav.productId}:`, error);
          }
        }
        setProductsMap(productMap);
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Mis Favoritos</h1>
          <p className="text-gray-600 mb-8">Debes iniciar sesión para ver tus favoritos</p>
          <Link to="/login" className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando favoritos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Mis Favoritos</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No tienes productos favoritos</p>
            <Link to="/products" className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition">
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((favorite) => {
              const product = productsMap.get(favorite.productId);
              if (!product) return null;

              return (
                <Link
                  key={favorite.id}
                  to={`/products/${favorite.productId}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="aspect-square bg-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.isOffer ? (
                          <>
                            <span className="text-lg font-bold text-pink-600">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${product.webPrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-800">
                            ${product.webPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;