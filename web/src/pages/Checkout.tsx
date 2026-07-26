import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createPaymentPreference } from '../services/paymentService';

const Checkout: React.FC = () => {
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { items, getTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    // Pre-llenar datos del usuario
    if (user) {
      setCustomerName(user.name);
      setCustomerEmail(user.email);
    }
  }, [isAuthenticated, items, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Crear preferencia de pago en Mercado Pago
      const preference = await createPaymentPreference({
        orderId: 'temp-' + Date.now(),
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.isOffer ? item.product.price : item.product.webPrice,
          name: item.product.name,
        })),
        total: getTotal(),
        customerEmail,
      });

      // Redirigir a Mercado Pago
      window.location.href = preference.initPoint;
    } catch (error) {
      setError('Error al procesar el pago. Por favor, intente nuevamente.');
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        {/* Indicador de pasos */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2">Datos de envío</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-300">
              <div className={`h-full ${step >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-pink-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2">Pago</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                  <h2 className="text-xl font-bold mb-4">Datos de contacto</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Método de entrega *
                    </label>
                    <select
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    >
                      <option value="pickup">Retiro en local</option>
                      <option value="local_delivery">Envío local</option>
                      <option value="interior_shipping">Envío al interior</option>
                    </select>
                  </div>

                  {deliveryMethod !== 'pickup' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección de envío *
                      </label>
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas adicionales
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700 transition"
                  >
                    Continuar al pago
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
                  
                  <div className="space-y-2 mb-4">
                    <p><strong>Cliente:</strong> {customerName}</p>
                    <p><strong>Email:</strong> {customerEmail}</p>
                    <p><strong>Teléfono:</strong> {customerPhone}</p>
                    <p><strong>Entrega:</strong> {deliveryMethod === 'pickup' ? 'Retiro en local' : deliveryMethod === 'local_delivery' ? 'Envío local' : 'Envío al interior'}</p>
                    {address && <p><strong>Dirección:</strong> {address}</p>}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between">
                        <span>{item.product.name} x{item.quantity}</span>
                        <span>${((item.product.isOffer ? item.product.price : item.product.webPrice) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-pink-600">${getTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      {error}
                    </div>
                  )}

                  <div className="mt-6 space-y-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700 transition disabled:opacity-50"
                    >
                      {isLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full bg-gray-200 text-gray-800 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Resumen</h2>
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
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;