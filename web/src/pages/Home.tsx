import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories, getPromotions, getFlyers } from '../services/productService';
import { Product, Category, Promotion, Flyer } from '../types';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, promotionsRes, flyersRes] = await Promise.all([
          getProducts({ limit: 8, isActive: true }),
          getCategories(),
          getPromotions(),
          getFlyers(),
        ]);

        setFeaturedProducts(productsRes.data.filter(p => p.isOffer || p.isActive).slice(0, 8));
        setCategories(categoriesRes);
        setPromotions(promotionsRes.filter(p => p.isActive && p.isWeb));
        setFlyers(flyersRes.filter(f => f.isActive));
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Recuerdos de Papel
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Papelería Creativa - Regalos personalizados para cada momento especial
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Ver Productos
          </Link>
        </div>
      </section>

      {/* Flyers */}
      {flyers.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flyers.map((flyer) => (
                <div key={flyer.id} className="rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={flyer.imageUrl}
                    alt={flyer.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{flyer.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categorías */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Promociones */}
      {promotions.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-pink-600">
              Promociones Especiales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold mb-2">{promotion.title}</h3>
                  {promotion.description && (
                    <p className="text-gray-600 mb-4">{promotion.description}</p>
                  )}
                  <div className="text-3xl font-bold text-pink-600 mb-2">
                    {promotion.discount}% OFF
                  </div>
                  {promotion.code && (
                    <div className="bg-white rounded px-3 py-1 inline-block">
                      Código: <span className="font-mono font-bold">{promotion.code}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productos Destacados */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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
                    {product.stock === 0 && (
                      <span className="text-red-600 text-sm">Sin stock</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;