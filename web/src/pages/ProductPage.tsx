import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const [productRes, productsRes] = await Promise.all([
          getProductById(id),
          getProducts({ limit: 4, isActive: true }),
        ]);

        setProduct(productRes);
        setRelatedProducts(productsRes.data.filter(p => p.id !== id).slice(0, 4));
      } catch (error) {
        console.error('Error al cargar producto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Producto no encontrado</div>
      </div>
    );
  }

  const price = product.isOffer ? product.price : product.webPrice;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-pink-600">Inicio</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-pink-600">Productos</Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        {/* Producto principal */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Imagen */}
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
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

            {/* Información */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              {product.description && (
                <p className="text-gray-600 mb-6">{product.description}</p>
              )}

              <div className="mb-6">
                {product.isOffer ? (
                  <>
                    <span className="text-4xl font-bold text-pink-600">
                      ${price.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through ml-4">
                      ${product.webPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-gray-800">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-green-600 font-semibold">✓ En stock ({product.stock} disponibles)</p>
                ) : (
                  <p className="text-red-600 font-semibold">✗ Sin stock</p>
                )}
              </div>

              {product.stock > 0 && (
                <button
                  onClick={() => addToCart(product, 1)}
                  className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700 transition mb-4"
                >
                  Agregar al carrito
                </button>
              )}

              <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                {product.code && <p><strong>Código:</strong> {product.code}</p>}
                <p><strong>Disponibilidad:</strong> {product.stock > 0 ? 'En stock' : 'Sin stock'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                >
                  <div className="aspect-square bg-gray-200">
                    {relatedProduct.images && relatedProduct.images.length > 0 ? (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        {relatedProduct.isOffer ? (
                          <>
                            <span className="text-lg font-bold text-pink-600">
                              ${relatedProduct.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${relatedProduct.webPrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-800">
                            ${relatedProduct.webPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;