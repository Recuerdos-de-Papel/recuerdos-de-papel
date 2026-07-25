import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

function getProductImage(product: Product): string {
  if (!product.images) return '';
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0]?.url || parsed[0] || '';
    }
    return typeof parsed === 'string' ? parsed : '';
  } catch {
    return product.images;
  }
}

export default function Cart() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    webDiscount,
    offerDiscount,
    totalSaved,
    total,
  } = useCart();

  const getEffectivePrice = (product: Product) => {
    return product.offerPrice ?? product.webPrice;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-6">Agrega productos para continuar con tu compra</p>
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Producto</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Precio Normal</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Precio Web</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Descuento</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Cantidad</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Subtotal</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(({ product, quantity }) => {
                    const effectivePrice = getEffectivePrice(product);
                    const hasOffer = product.offerPrice !== undefined && product.offerPrice < product.webPrice;
                    
                    return (
                      <tr key={product.id} className="border-t">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-medium text-gray-800">{product.name}</h3>
                              <p className="text-sm text-gray-500">
                                Subfamilia: {product.subfamily?.name || ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-gray-600">${product.normalPrice}</span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-primary-600 font-bold">${product.webPrice}</span>
                          {hasOffer && (
                            <span className="block text-xs text-green-600 font-medium">
                              Oferta: ${product.offerPrice}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="text-green-600 font-medium">
                            -${(product.normalPrice - effectivePrice) * quantity}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              disabled={quantity <= 1}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 1;
                                if (newQty >= 1) {
                                  updateQuantity(product.id, newQty);
                                }
                              }}
                              className="w-12 text-center border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-medium">
                          ${effectivePrice * quantity}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => removeItem(product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="p-4 border-t flex justify-between">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Vaciar carrito
                </button>
                <Link
                  to="/productos"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cantidad de productos</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Descuento Web</span>
                  <span className="font-medium text-green-600">-${webDiscount}</span>
                </div>
                {offerDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Descuento Oferta</span>
                    <span className="font-medium text-green-600">-${offerDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Ahorrado</span>
                  <span className="font-medium text-green-600">-${totalSaved}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-primary-600">${total}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full block text-center bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Finalizar compra
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}