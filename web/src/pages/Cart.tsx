import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

  const handleCheckout = () => {
    // Redirigir a checkout
    window.location.href = '/checkout';
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Tu Carrito</h1>
          <p className="text-gray-600 mb-8">Tu carrito está vacío</p>
          <Link
            to="/products"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <Link to={`/products/${item.product.id}`} className="text-lg font-semibold hover:text-pink-600 transition">
                    {item.product.name}
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">
                    Precio: ${(item.product.isOffer ? item.product.price : item.product.webPrice).toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-4 text-red-600 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-pink-600">
                    ${((item.product.isOffer ? item.product.price : item.product.webPrice) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>Por calcular</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-pink-600">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700 transition mb-2"
              >
                Proceder al Pago
              </button>
              
              <button
                onClick={clearCart}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;