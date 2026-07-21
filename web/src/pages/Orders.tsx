import { Link } from 'react-router-dom';

export default function Orders() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Seguimiento de Pedidos
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-center text-gray-600 mb-6">
            Ingresa el código de tu pedido para ver su estado
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Código de pedido"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Buscar
              </button>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/login"
              className="text-primary-600 hover:underline"
            >
              Inicia sesión para ver tus pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}