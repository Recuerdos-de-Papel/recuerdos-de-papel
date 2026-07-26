import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Aquí iría la llamada a la API para enviar el mensaje
    // Por ahora solo mostramos un mensaje de éxito
    setTimeout(() => {
      setSubmitMessage('Mensaje enviado correctamente. Te contactaremos pronto.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-8">Contacto</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Información de contacto */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Información de Contacto</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="text-2xl mr-3">📍</div>
                <div>
                  <h3 className="font-semibold">Dirección</h3>
                  <p className="text-gray-600">Córdoba, Argentina</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-2xl mr-3">📱</div>
                <div>
                  <h3 className="font-semibold">Teléfono</h3>
                  <p className="text-gray-600">+54 9 351 123 4567</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-2xl mr-3">📧</div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">info@recuerdosdepapel.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-2xl mr-3">🕐</div>
                <div>
                  <h3 className="font-semibold">Horario de Atención</h3>
                  <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                  <p className="text-gray-600">Sábados: 9:00 - 13:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Envíanos un Mensaje</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {submitMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asunto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;