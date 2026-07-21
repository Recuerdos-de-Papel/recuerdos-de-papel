import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

export default function FeaturedProductsSection() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const result = await getProducts(1, 8, { isFeatured: true });
        setProducts(result.data);
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleBuy = (product: Product) => {
    addItem(product, 1);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Productos Destacados
          </h2>
          <p className="text-center text-gray-600">Cargando productos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Productos Destacados
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
            >
              <img
                src={product.images?.[0]?.url || ''}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-primary-600 font-bold text-xl">
                    ${product.webPrice}
                  </span>
                  {product.labels?.includes('offer') && (
                    <span className="text-gray-400 line-through text-sm">
                      ${product.normalPrice}
                    </span>
                  )}
                </div>
                <div className="mt-auto space-y-2">
                  <button 
                    onClick={() => handleBuy(product)}
                    className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Comprar
                  </button>
                  <Link
                    to={`/producto/${product.id}`}
                    className="w-full text-center block bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ver Producto
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}