import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const {
    businessName,
    businessAddress,
    businessEmail,
    businessPhone,
    whatsapp,
    facebook,
    instagram,
    twitter,
    tiktok,
    youtube,
  } = useSettings();

  const displayName = businessName || 'RECUERDOS DE PAPEL';
  const displayPhone = businessPhone || whatsapp || '';
  const displayAddress = businessAddress || '';
  const displayEmail = businessEmail || '';

  // Construir enlaces de redes sociales dinámicamente
  const socialLinks: { name: string; href: string | null; icon: string }[] = [
    { name: 'Facebook', href: facebook, icon: 'facebook' },
    { name: 'Instagram', href: instagram, icon: 'instagram' },
    { name: 'Twitter', href: twitter, icon: 'twitter' },
    { name: 'TikTok', href: tiktok, icon: 'tiktok' },
    { name: 'YouTube', href: youtube, icon: 'youtube' },
  ];

  const activeSocialLinks = socialLinks.filter((link) => link.href);

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <h3 className="text-2xl font-bold text-primary-400 mb-4">
              {displayName}
            </h3>
            <p className="text-gray-300 mb-4">
              Papelería Creativa con productos personalizados, sublimación, estampados e impresiones de alta calidad.
            </p>
            {activeSocialLinks.length > 0 && (
              <div className="flex space-x-4">
                {activeSocialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            )}
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

          {/* Contacto - desde settingsService */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-300">
              {displayPhone && (
                <li>
                  <span className="block">📱 WhatsApp: {displayPhone}</span>
                </li>
              )}
              {displayAddress && (
                <li>
                  <span className="block">📍 Dirección: {displayAddress}</span>
                </li>
              )}
              {displayEmail && (
                <li>
                  <span className="block">✉️ Email: {displayEmail}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {displayName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
