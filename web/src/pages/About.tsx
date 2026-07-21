import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
          Sobre Nosotros
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Historia</h2>
          <p className="text-gray-600 mb-6">
            Recuerdos de Papel nació en 2020 con la misión de ofrecer productos personalizados 
            de la más alta calidad. Somos una papelería creativa especializada en cuadernos, 
            agendas, productos de sublimación, estampados y servicios de impresión.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nuestros Valores</h2>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Calidad garantizada en cada producto</li>
            <li>Diseños únicos y personalizados</li>
            <li>Atención personalizada a cada cliente</li>
            <li>Entregas puntuales y seguras</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contacto</h2>
          <p className="text-gray-600">
            ¿Tienes dudas? Escríbenos a <span className="text-primary-600">info@recuerdosdepapel.com</span>
          </p>
        </div>
        
        <div className="text-center mt-8">
          <Link
            to="/productos"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Ver Nuestros Productos
          </Link>
        </div>
      </div>
    </div>
  );
}