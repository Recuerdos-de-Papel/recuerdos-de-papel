import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../services/productService';
import { Category, Product } from '../types';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRes = await getCategories();
        setCategories(categoriesRes);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) {
        setProducts([]);
        return;
      }

      try {
        const productsRes = await getProducts({ isActive: true });
        // Filtrar productos por categoría (a través de subfamilia -> familia)
        const filtered = productsRes.data.filter(() => {
          // Aquí necesitaríamos lógica adicional para filtrar por categoría
          // Por ahora mostramos todos los productos
          return true;
        });
        setProducts(filtered);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Categorías</h1>

        {!selectedCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600">{category.description}</p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-6 text-pink-600 hover:text-pink-700 font-semibold"
            >
              ← Volver a categorías
            </button>
            <h2 className="text-2xl font-bold mb-6">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            {products.length === 0 ? (
              <p className="text-gray-600">No hay productos en esta categoría</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
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
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
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
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;