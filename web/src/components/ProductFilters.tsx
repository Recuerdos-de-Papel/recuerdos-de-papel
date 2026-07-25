import { useState, useEffect } from 'react';
import { getCategories, getFamiliesByCategory, getSubfamiliesByFamily } from '../services/productService';
import type { Category, Family, Subfamily } from '../types';

interface ProductFiltersProps {
  onSearch: (search: string) => void;
  onCategoryChange: (category: string) => void;
  onFamilyChange: (family: string) => void;
  onSubfamilyChange: (subfamily: string) => void;
  onSortChange: (sort: string) => void;
  selectedCategory: string;
  selectedFamily: string;
  selectedSubfamily: string;
}

export default function ProductFilters({
  onSearch,
  onCategoryChange,
  onFamilyChange,
  onSubfamilyChange,
  onSortChange,
  selectedCategory,
  selectedFamily,
  selectedSubfamily,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [subfamilies, setSubfamilies] = useState<Subfamily[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        // Error handled silently
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadFamilies = async () => {
      if (selectedCategory) {
        try {
          const data = await getFamiliesByCategory(selectedCategory);
          setFamilies(data);
          setSubfamilies([]);
        } catch (error) {
          // Error handled silently
        }
      } else {
        setFamilies([]);
        setSubfamilies([]);
      }
    };
    loadFamilies();
  }, [selectedCategory]);

  useEffect(() => {
    const loadSubfamilies = async () => {
      if (selectedFamily) {
        try {
          const data = await getSubfamiliesByFamily(selectedFamily);
          setSubfamilies(data);
        } catch (error) {
          // Error handled silently
        }
      } else {
        setSubfamilies([]);
      }
    };
    loadSubfamilies();
  }, [selectedFamily]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Buscador */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro por categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              onCategoryChange(e.target.value);
              onFamilyChange('');
              onSubfamilyChange('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por familia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Familia
          </label>
          <select
            value={selectedFamily}
            onChange={(e) => {
              onFamilyChange(e.target.value);
              onSubfamilyChange('');
            }}
            disabled={!selectedCategory}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
          >
            <option value="">Todas las familias</option>
            {families.map((fam) => (
              <option key={fam.id} value={fam.id}>
                {fam.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por subfamilia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subfamilia
          </label>
          <select
            value={selectedSubfamily}
            onChange={(e) => onSubfamilyChange(e.target.value)}
            disabled={!selectedFamily}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
          >
            <option value="">Todas las subfamilias</option>
            {subfamilies.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenamiento */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="newest">Más recientes</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="name-asc">Nombre A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}