import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function Contact() {
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
  const socialLinks: { name: string; href: string | null }[] = [
    { name: 'Facebook', href: facebook },
    { name: 'Instagram', href: instagram },
    { name: 'Twitter', href: twitter },
    { name: 'TikTok', href: tiktok },
    { name: 'YouTube', href: youtube },
  ];

  const activeSocialLinks = socialLinks.filter((link) => link.href);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Contacto
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Información de Contacto</h2>
              <ul className="space-y-3 text-gray-600">
                {displayPhone && (
                  <li>
                    <span className="font-medium">WhatsApp:</span> {displayPhone}
                  </li>
                )}
                {displayEmail && (
                  <li>
                    <span className="font-medium">Email:</span> {displayEmail}
                  </li>
                )}
                {displayAddress && (
                  <li>
                    <span className="font-medium">Dirección:</span> {displayAddress}
                  </li>
                )}
              </ul>

              {activeSocialLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Redes Sociales</h3>
                  <div className="flex flex-col gap-2">
                    {activeSocialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        {social.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Envíanos un Mensaje</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
