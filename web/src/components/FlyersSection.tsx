import { useState, useEffect } from 'react';
import { getFlyers } from '../services/flyersService';
import type { Flyer } from '../types';

export default function FlyersSection() {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlyers = async () => {
      try {
        // flyersService.getFlyers() filtra por isActive: true y ordena por order
        const data = await getFlyers();
        setFlyers(data);
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    loadFlyers();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Nuestros Flyers
          </h2>
          <p className="text-center text-gray-600">Cargando flyers...</p>
        </div>
      </section>
    );
  }

  if (flyers.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Nuestros Flyers
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flyers.map((flyer) => (
            <div
              key={flyer.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              {flyer.imageUrl && (
                <img
                  src={flyer.imageUrl}
                  alt={flyer.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {flyer.title}
                </h3>
                {(flyer.startDate || flyer.endDate) && (
                  <p className="text-sm text-gray-500">
                    Válido: {flyer.startDate && new Date(flyer.startDate).toLocaleDateString()} 
                    {' - '}
                    {flyer.endDate && new Date(flyer.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
