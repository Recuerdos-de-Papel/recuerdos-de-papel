import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCategories, getFamiliesByCategory } from '../services/productService';
import type { Category, Family } from '../types';

export default function Subcategories() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const categories = await getCategories();
        if (categoryId) {
          const found = categories.find(c => c.id === categoryId);
          setCategory(found || null);
          const familiesData = await getFamiliesByCategory(categoryId);
          setFamilies(familiesData);
        }
      } catch (err) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-600">Cargando...</p>
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
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          {category?.name || 'Familias'}
        </h1>

        {families.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No hay familias disponibles en esta categoría</p>
            <Link
              to="/categorias"
              className="inline-block mt-4 text-primary-600 hover:underline"
            >
              Ver categorías
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {families.map((family) => (
              <Link
                key={family.id}
                to={`/productos?familia=${family.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">{family.name}</h2>
                {family.description && (
                  <p className="text-gray-600">{family.description}</p>
                )}
                <div className="mt-4">
                  <span className="text-primary-600 font-medium">Ver productos →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}