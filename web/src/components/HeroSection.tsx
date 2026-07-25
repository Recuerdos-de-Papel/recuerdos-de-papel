import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export default function HeroSection() {
  const { banner, businessName } = useSettings();

  const displayName = businessName || 'RECUERDOS DE PAPEL';

  // Si existe banner en settings, usarlo como background; si no, usar gradiente
  const backgroundStyle = banner
    ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${banner}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {
        backgroundImage: 'linear-gradient(to-br, #f0f9ff, #e0f2fe)',
      };

  return (
    <section
      className="relative h-screen flex items-center justify-center"
      style={backgroundStyle}
    >
      <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          Bienvenidos a <span className="text-primary-300">{displayName}</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
          Papelería Creativa con productos personalizados, sublimación, estampados e impresiones de alta calidad
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/productos"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 text-lg"
          >
            Ver Catálogo
          </Link>
          <Link
            to="/promociones"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 text-lg"
          >
            Promociones
          </Link>
        </div>
      </div>
    </section>
  );
}
