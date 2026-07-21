import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const primaryImage = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || '';

  const effectivePrice = product.offerPrice ?? product.webPrice;
  const hasOffer = product.offerPrice !== undefined && product.offerPrice < product.webPrice;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
      <div className="relative">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.labels?.includes('offer') && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            OFERTA
          </span>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>
        
        <div className="text-sm text-gray-500 mb-2">
          <span>{product.category?.name || ''}</span>
          <span className="mx-1">•</span>
          <span>{product.subcategory?.name || ''}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-primary-600 font-bold text-xl">
            ${effectivePrice}
          </span>
          {hasOffer && (
            <span className="text-gray-400 line-through text-sm">
              ${product.webPrice}
            </span>
          )}
        </div>
        
        <div className="mt-auto space-y-2">
          <button
            onClick={handleAddToCart}
            className="w-full text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Agregar al Carrito
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
  );
}