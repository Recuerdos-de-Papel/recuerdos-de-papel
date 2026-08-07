import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PaymentSuccess: React.FC = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar carrito solo después de confirmar pago exitoso
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-green-600">¡Pago Exitoso!</h1>
          <p className="text-gray-600 mb-8">Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación.</p>
          <button
            onClick={() => navigate('/orders')}
            className="bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition"
          >
            Ver mis pedidos
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;