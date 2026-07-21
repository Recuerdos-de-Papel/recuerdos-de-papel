import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <h3 className="text-2xl font-bold text-primary-400 mb-4">
              RECUERDOS DE PAPEL
            </h3>
            <p className="text-gray-300 mb-4">
              Papelería Creativa con productos personalizados, sublimación, estampados e impresiones de alta calidad.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary-400 transition-colors"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary-400 transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/promociones" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Promociones
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <span className="block">📱 WhatsApp: +54 9 11 1234-5678</span>
              </li>
              <li>
                <span className="block">📍 Dirección: Av. Corrientes 1234, CABA</span>
              </li>
              <li>
                <span className="block">✉️ Email: info@recuerdosdepapel.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} RECUERDOS DE PAPEL. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}