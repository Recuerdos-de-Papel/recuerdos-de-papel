import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

function getProductImage(product: Product): string {
  if (!product.images) return '';
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const firstImage = parsed[0];
      if (typeof firstImage === 'string') {
        // Si es un string, puede ser un nombre de archivo o una URL completa
        if (firstImage.startsWith('http')) {
          return firstImage;
        }
        // Construir URL de Supabase Storage
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const bucketName = 'product-images'; // Nombre del bucket en Supabase
        return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${firstImage}`;
      }
      return firstImage?.url || '';
    }
    return typeof parsed === 'string' ? parsed : '';
  } catch {
    return product.images;
  }
}

function hasLabel(product: Product, label: string): boolean {
  if (!product.labels) return false;
  try {
    const parsed = JSON.parse(product.labels);
    return Array.isArray(parsed) && parsed.includes(label);
  } catch {
    return product.labels.includes(label);
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  const primaryImage = getProductImage(product);
  const categoryName = product.subfamily?.family?.category?.name || '';
  const subfamilyName = product.subfamily?.name || '';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
      <div className="relative">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {hasLabel(product, 'offer') && (
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
          <span>{categoryName}</span>
          {subfamilyName && <><span className="mx-1">•</span><span>{subfamilyName}</span></>}
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-primary-600 font-bold text-xl">
            ${product.webPrice}
          </span>
          {hasLabel(product, 'offer') && (
            <span className="text-gray-400 line-through text-sm">
              ${product.normalPrice}
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