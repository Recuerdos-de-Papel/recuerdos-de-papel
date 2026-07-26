import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de la empresa */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recuerdos de Papel</h3>
            <p className="text-gray-300">
              Papelería Creativa - Regalos personalizados para cada momento especial.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-white transition">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📧 info@recuerdosdepapel.com</li>
              <li>📱 +54 9 351 123 4567</li>
              <li>📍 Córdoba, Argentina</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; 2024 Recuerdos de Papel. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;