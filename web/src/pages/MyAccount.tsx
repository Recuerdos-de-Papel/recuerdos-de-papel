import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyAccount() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acceso requerido</h1>
          <Link
            to="/login"
            className="text-primary-600 hover:underline"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {user.name?.[0] || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800">
                    {user.name} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Registro: {user.id ? new Date().toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                <Link
                  to="/mi-cuenta"
                  className="block py-2 px-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                >
                  Mi Perfil
                </Link>
                <Link
                  to="/mi-cuenta/mis-pedidos"
                  className="block py-2 px-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                >
                  Mis Pedidos
                </Link>
                <Link
                  to="/mi-cuenta/mis-direcciones"
                  className="block py-2 px-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                >
                  Mis Direcciones
                </Link>
                <Link
                  to="/mi-cuenta/favoritos"
                  className="block py-2 px-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                >
                  Favoritos
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Cerrar Sesión
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}