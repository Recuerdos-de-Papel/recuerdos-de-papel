import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentPending() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const preferenceId = searchParams.get('preference_id');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Pago Pendiente</h1>
          
          <p className="text-gray-600 mb-6">
            Tu pago está pendiente de confirmación. Te notificaremos cuando se acredite.
          </p>

          {paymentId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500">ID de Pago: <span className="font-mono">{paymentId}</span></p>
              {preferenceId && (
                <p className="text-sm text-gray-500">ID de Preferencia: <span className="font-mono">{preferenceId}</span></p>
              )}
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/mi-cuenta/mis-pedidos"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Ver Mis Pedidos
            </Link>
            
            <div>
              <Link
                to="/productos"
                className="text-primary-600 hover:underline text-sm"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}