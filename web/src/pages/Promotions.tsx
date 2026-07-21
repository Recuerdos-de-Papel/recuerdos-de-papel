import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPromotions } from '../services/promotionService';
import type { Promotion } from '../types';

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const data = await getPromotions();
        setPromotions(data);
      } catch (err) {
        setError('Error al cargar las promociones');
      } finally {
        setLoading(false);
      }
    };
    loadPromotions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-600">Cargando promociones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Promociones
        </h1>
        
        {promotions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No hay promociones disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">
                  {promo.discount > 0 ? `-${promo.discount}%` : 'ENVÍO GRATIS'}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{promo.title}</h2>
                <p className="text-gray-600 mb-4">{promo.description}</p>
                <div className="border-t pt-4">
                  {promo.code && (
                    <p className="text-sm text-gray-500">Código: <span className="font-bold">{promo.code}</span></p>
                  )}
                  <p className="text-sm text-gray-500">Válido hasta: {new Date(promo.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link
            to="/productos"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    </div>
  );
}
