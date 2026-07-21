import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1513364726-976a1a0a00b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6">
          Bienvenidos a <span className="text-primary-600">RECUERDOS DE PAPEL</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
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