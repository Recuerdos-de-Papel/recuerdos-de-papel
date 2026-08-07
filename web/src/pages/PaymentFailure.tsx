import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-red-600">Pago Rechazado</h1>
          <p className="text-gray-600 mb-8">Tu pago no pudo ser procesado. Por favor, intenta nuevamente.</p>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-700 transition"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;