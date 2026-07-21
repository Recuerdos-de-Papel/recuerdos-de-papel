import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import ProductPagination from '../components/ProductPagination';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('categoria') || '';
  const subcategory = searchParams.get('subcategoria') || '';
  const validSortOptions = ['newest', 'price-asc', 'price-desc', 'name-asc'] as const;
  const sortBy = validSortOptions.includes(searchParams.get('sort') as typeof validSortOptions[number]) 
    ? searchParams.get('sort') as 'newest' | 'price-asc' | 'price-desc' | 'name-asc' 
    : 'newest';

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getProducts(page, 12, {
          search,
          category,
          subcategory,
        });
        setProducts(result.data);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      } catch (err) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [page, search, category, subcategory, sortBy]);

  const handleSearch = (searchTerm: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('search', searchTerm);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (newCategory: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('categoria', newCategory);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSubcategoryChange = (newSubcategory: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('subcategoria', newSubcategory);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Nuestro Catálogo
        </h1>

        <ProductFilters
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onSortChange={handleSortChange}
          selectedCategory={category}
          selectedSubcategory={subcategory}
        />

        {loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Mostrando {products.length} de {total} productos
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No se encontraron productos</p>
              </div>
            )}

            <ProductPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}