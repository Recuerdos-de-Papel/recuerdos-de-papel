import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { getCategories } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import type { Category } from '../types';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { logo, businessName, loading: settingsLoading } = useSettings();
  const navigate = useNavigate();

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

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Promociones', path: '/promociones' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Contacto', path: '/contacto' },
  ];

  const handleAuthClick = () => {
    if (isAuthenticated) {
      navigate('/mi-cuenta');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayName = businessName || 'RECUERDOS DE PAPEL';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - desde settingsService */}
          <Link to="/" className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={displayName}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-primary-600">{displayName}</span>
            )}
            {!logo && (
              <span className="text-sm text-gray-500">Papelería Creativa</span>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {/* Menú desplegable de categorías */}
            <div 
              className="relative"
              onMouseEnter={() => setOpenCategory('all')}
              onMouseLeave={() => setOpenCategory(null)}
            >
              <NavLink
                to="/productos"
                className={({ isActive }) =>
                  `text-gray-700 hover:text-primary-600 transition-colors font-medium ${
                    isActive ? 'text-primary-600' : ''
                  }`
                }
              >
                Productos
              </NavLink>
              
              {/* Dropdown de categorías */}
              {openCategory && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                  {categories.map((cat) => (
                    <div key={cat.id} className="relative group">
                      <Link
                        to={`/productos?categoria=${cat.id}`}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-gray-700 hover:text-primary-600 transition-colors font-medium ${
                    isActive ? 'text-primary-600' : ''
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Cart and Auth Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to="/carrito"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAuthClick}
                  className="flex items-center gap-2 p-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6" />
                  )}
                  <span className="text-sm font-medium">{user?.name || 'Cuenta'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <UserIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {/* Productos con acordeón en móvil */}
            <div>
              <button
                onClick={() => setOpenCategory(openCategory === 'mobile-products' ? null : 'mobile-products')}
                className="w-full text-left py-2 text-gray-700 font-medium"
              >
                Productos
              </button>
              
              {openCategory === 'mobile-products' && (
                <div className="pl-4 space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id}>
                      <div className="font-medium text-gray-600 py-1">{cat.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block py-2 text-gray-700 hover:text-primary-600 transition-colors ${
                    isActive ? 'text-primary-600' : ''
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate('/mi-cuenta');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Mi Cuenta
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
