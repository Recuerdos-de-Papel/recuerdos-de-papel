import { 
  SparklesIcon, 
  CheckBadgeIcon, 
  UserGroupIcon, 
  TruckIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    id: 1,
    name: 'Productos Personalizados',
    description: 'Diseños únicos hechos a tu medida con los mejores materiales del mercado',
    icon: SparklesIcon,
  },
  {
    id: 2,
    name: 'Calidad Garantizada',
    description: 'Trabajamos con los más altos estándares de calidad en cada producto',
    icon: CheckBadgeIcon,
  },
  {
    id: 3,
    name: 'Atención Personalizada',
    description: 'Asesoría completa para que encuentres exactamente lo que necesitas',
    icon: UserGroupIcon,
  },
  {
    id: 4,
    name: 'Entrega Responsable',
    description: 'Envíos seguros y puntuales con garantía de satisfacción',
    icon: TruckIcon,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          ¿Por qué elegirnos?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}