import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-pink-600">
              Recuerdos de Papel
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-600 transition">
              Inicio
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-pink-600 transition">
              Productos
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-pink-600 transition">
              Categorías
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-pink-600 transition">
              Contacto
            </Link>
          </nav>

          {/* Iconos de usuario y carrito */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-pink-600 transition">
                  {user?.name}
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-pink-600 transition">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-pink-600 transition">
                Iniciar Sesión
              </Link>
            )}
            
            <Link to="/cart" className="relative text-gray-700 hover:text-pink-600 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/" className="block text-gray-700 hover:text-pink-600 transition">
              Inicio
            </Link>
            <Link to="/products" className="block text-gray-700 hover:text-pink-600 transition">
              Productos
            </Link>
            <Link to="/categories" className="block text-gray-700 hover:text-pink-600 transition">
              Categorías
            </Link>
            <Link to="/contact" className="block text-gray-700 hover:text-pink-600 transition">
              Contacto
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block text-gray-700 hover:text-pink-600 transition">
                  Mi Perfil
                </Link>
                <button onClick={handleLogout} className="block text-gray-700 hover:text-pink-600 transition">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-gray-700 hover:text-pink-600 transition">
                Iniciar Sesión
              </Link>
            )}
            <Link to="/cart" className="block text-gray-700 hover:text-pink-600 transition">
              Carrito ({itemCount})
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;