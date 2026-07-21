import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getCategories, getRelatedProducts } from '../services/productService';
import type { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

type DeliveryOption = 'pickup' | 'local' | 'shipping';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('pickup');
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const productData = await getProductById(id);
        setProduct(productData);
        
        if (productData) {
          const categories = await getCategories();
          const foundCategory = categories.find(c => c.id === productData.categoryId);
          setCategory(foundCategory || null);
          
          const related = await getRelatedProducts(productData.categoryId, productData.id);
          setRelatedProducts(related);
        }
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">{error}</h1>
          <Link to="/productos" className="text-primary-600 hover:underline">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Producto no encontrado</h1>
          <Link to="/productos" className="text-primary-600 hover:underline">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const savings = product.normalPrice - product.webPrice;
  const savingsPercent = product.normalPrice > 0 ? Math.round((savings / product.normalPrice) * 100) : 0;

  const statusLabels = {
    available: 'Disponible',
    in_production: 'En Producción',
    out_of_stock: 'Sin Stock',
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Migas de pan */}
        <nav className="flex text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary-600">Inicio</Link>
          <span className="mx-2">/</span>
          <Link to="/productos" className="hover:text-primary-600">{category?.name || 'Productos'}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{product.subcategory?.name || ''}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Galería de imágenes */}
            <div>
              <div className="relative mb-4">
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[selectedImage]?.url}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                )}
                {product.labels?.includes('offer') && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    OFERTA
                  </span>
                )}
              </div>

              {/* Miniaturas */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(index)}
                      className={`border-2 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-20 h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              <div className="text-sm text-gray-500 mb-4">
                <span>{category?.name}</span>
                <span className="mx-2">•</span>
                <span>{product.subcategory?.name}</span>
                <span className="mx-2">•</span>
                <span>Código: {product.code}</span>
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Precios */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-primary-600">${product.webPrice}</span>
                  {product.labels?.includes('offer') && (
                    <>
                      <span className="text-xl text-gray-400 line-through">${product.normalPrice}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        Ahorras ${savings} ({savingsPercent}%)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Estado */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === 'available' ? 'bg-green-100 text-green-800' :
                  product.status === 'in_production' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {statusLabels[product.status]}
                </span>
              </div>

              {/* Selector de cantidad */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3 mb-6">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  AGREGAR AL CARRITO
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                >
                  COMPRAR AHORA
                </button>
                <a
                  href={`https://wa.me/5491112345678?text=Consulta%20sobre%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full border border-green-500 text-green-500 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors inline-block text-center"
                >
                  CONSULTAR POR WHATSAPP
                </a>
              </div>

              {/* Opciones de entrega */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-3">¿Cómo querés recibir tu pedido?</h3>
                <div className="space-y-2">
                  {(['pickup', 'local', 'shipping'] as DeliveryOption[]).map((option) => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="delivery"
                        value={option}
                        checked={selectedDelivery === option}
                        onChange={() => setSelectedDelivery(option)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-gray-700">
                        {option === 'pickup' && 'Retirar'}
                        {option === 'local' && 'Entrega Local'}
                        {option === 'shipping' && 'Envío al Interior'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tiempo de producción */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h3 className="font-medium text-primary-800 mb-1">Tiempo estimado de producción</h3>
                <p className="text-primary-600">{product.productionTime}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Características */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Características</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Producto personalizado:</span>
              <span>{product.labels?.includes('custom') ? 'Sí' : 'No'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Material:</span>
              <span>{product.brand || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Medidas:</span>
              <span>N/A</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Tipo de impresión:</span>
              <span>N/A</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Cuidados:</span>
              <span>N/A</span>
            </div>
          </div>
        </div>

        {/* Descripción detallada */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Descripción detallada</h2>
          <p className="text-gray-600 leading-relaxed">
            {product.description} Este producto está hecho con los mejores materiales del mercado 
            y cuenta con nuestra garantía de calidad. Puedes personalizarlo según tus necesidades 
            y preferencias. Ideal para regalar o para uso personal.
          </p>
        </div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}