import { Link } from 'react-router-dom';

export default function OrderConfirmed() {
  // Obtener el último pedido del localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const lastOrder = orders[orders.length - 1];

  if (!lastOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No hay pedidos recientes</h1>
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

  const deliveryLabels = {
    pickup: 'Retirar',
    local: 'Entrega Local',
    shipping: 'Envío al Interior',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pedido confirmado!</h1>
          <p className="text-gray-600 mb-6">Tu pedido fue registrado correctamente.</p>
          
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <span className="text-sm text-gray-600">Número de pedido</span>
            <p className="text-2xl font-bold text-primary-600">#{lastOrder.id}</p>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>
          
          <div className="space-y-3 mb-4">
            {lastOrder.items.map((item: { product: { id: number; name: string; webPrice: number }; quantity: number }) => (
              <div key={item.product.id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.product.name} x {item.quantity}
                </span>
                <span className="font-medium">${item.product.webPrice * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary-600">${lastOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Forma de entrega */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Forma de entrega</h2>
          <p className="text-gray-600">{deliveryLabels[lastOrder.delivery as keyof typeof deliveryLabels]}</p>
        </div>

        {/* Datos del cliente */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Datos del cliente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-sm text-gray-500">Nombre completo</span>
              <p className="font-medium">{lastOrder.customer.firstName} {lastOrder.customer.lastName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Correo</span>
              <p className="font-medium">{lastOrder.customer.email}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Teléfono</span>
              <p className="font-medium">{lastOrder.customer.phone}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Ubicación</span>
              <p className="font-medium">{lastOrder.customer.province}, {lastOrder.customer.city}</p>
            </div>
            {lastOrder.customer.address && (
              <div className="md:col-span-2">
                <span className="text-sm text-gray-500">Dirección</span>
                <p className="font-medium">{lastOrder.customer.address}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}