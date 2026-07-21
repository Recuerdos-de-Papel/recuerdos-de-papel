import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/categoryService';
import type { Category } from '../types';
import {
  PencilIcon, 
  PrinterIcon, 
  PhotoIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

const iconMap: Record<string, typeof PencilIcon> = {
  papeleria: PencilIcon,
  sublimacion: PrinterIcon,
  estampados: PhotoIcon,
  impresiones: DocumentTextIcon,
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Nuestras Categorías
          </h2>
          <p className="text-center text-gray-600">Cargando categorías...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Nuestras Categorías
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category: Category) => {
            const Icon = iconMap[category.id] || PencilIcon;
            return (
              <div
                key={category.id}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description || 'Ver productos'}
                </p>
                <Link
                  to={`/productos?categoria=${category.id}`}
                  className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Ver
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}