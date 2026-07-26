import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const price = product.isOffer ? product.price : product.webPrice;

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition block"
    >
      <div className="aspect-square bg-gray-200 relative">
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
        {product.isOffer && (
          <div className="absolute top-2 right-2 bg-pink-600 text-white px-2 py-1 rounded text-sm font-semibold">
            OFERTA
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div>
            {product.isOffer ? (
              <>
                <span className="text-lg font-bold text-pink-600">
                  ${price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.webPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        {product.stock === 0 ? (
          <button
            disabled
            className="w-full mt-3 bg-gray-300 text-gray-500 py-2 rounded-full font-semibold cursor-not-allowed"
          >
            Sin stock
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full mt-3 bg-pink-600 text-white py-2 rounded-full font-semibold hover:bg-pink-700 transition"
          >
            Agregar al carrito
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;