import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Página no encontrada</h2>
          <p className="text-gray-600 mb-6">
            La página que estás buscando no existe o fue movida.
          </p>
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