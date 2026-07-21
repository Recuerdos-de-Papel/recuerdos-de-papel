import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { createPreference } from '../services/paymentService';
import type { DeliveryMethod } from '../types';

type DeliveryOption = 'pickup' | 'local' | 'shipping';

// Costos de envío configurados
const SHIPPING_COSTS: Record<DeliveryOption, number> = {
  pickup: 0,
  local: 1500,
  shipping: 3500,
};

// Mapeo de opciones a DeliveryMethod
const DELIVERY_METHOD_MAP: Record<DeliveryOption, DeliveryMethod> = {
  pickup: 'pickup',
  local: 'local_delivery',
  shipping: 'interior_shipping',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart, setShippingCost, shippingCost, finalTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('pickup');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    observations: '',
  });

  // Actualizar costo de envío cuando cambia la opción de entrega
  useEffect(() => {
    setShippingCost(SHIPPING_COSTS[selectedDelivery]);
  }, [selectedDelivery, setShippingCost]);

  // Cargar datos del usuario si está autenticado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // Validar formulario
  const isFormValid = () => {
    if (!isAuthenticated) return false;
    if (!formData.firstName.trim()) return false;
    if (!formData.lastName.trim()) return false;
    if (!formData.email.trim()) return false;
    if (!formData.phone.trim()) return false;
    if ((selectedDelivery === 'local' || selectedDelivery === 'shipping') && !formData.address.trim()) return false;
    if (!acceptedTerms) return false;
    return true;
  };

  const handleCreateOrder = async () => {
    if (items.length === 0) {
      throw new Error('No hay productos en el carrito');
    }

    // Crear orden en Supabase
    const order = {
      userId: user?.id || '',
      status: 'pending' as const,
      deliveryMethod: DELIVERY_METHOD_MAP[selectedDelivery],
      subtotal: total,
      discount: 0,
      total: finalTotal,
      shippingCost: shippingCost,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      address: formData.address || undefined,
      notes: formData.observations || undefined,
    };

    const orderItems = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.offerPrice ?? item.product.webPrice,
    }));

    return await createOrder(order, orderItems);
  };

  const handleMercadoPago = async () => {
    if (!isFormValid()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Crear orden primero
      const order = await handleCreateOrder();
      
      // Crear preferencia de Mercado Pago
      const preference = await createPreference(order.id);
      
      // Redirigir al checkout de Mercado Pago
      window.location.href = preference.initPoint;
    } catch (error) {
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (items.length === 0) {
      alert('No hay productos en el carrito');
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear orden en Supabase
      const order = {
        userId: user?.id || '',
        status: 'pending' as const,
        deliveryMethod: DELIVERY_METHOD_MAP[selectedDelivery],
        subtotal: total,
        discount: 0,
        total: finalTotal,
        shippingCost: shippingCost,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        address: formData.address || undefined,
        notes: formData.observations || undefined,
      };

      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.offerPrice ?? item.product.webPrice,
      }));

      await createOrder(order, orderItems);
      
      clearCart();
      navigate('/mi-cuenta/mis-pedidos');
    } catch (error) {
      alert('Error al procesar el pedido. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">No hay productos en el carrito</h1>
          <Link
            to="/productos"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Debes iniciar sesión</h1>
          <p className="text-gray-600 mb-6">Para finalizar tu compra, necesitas estar autenticado</p>
          <Link
            to="/login"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos personales */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Datos personales</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia *
                </label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              {(selectedDelivery === 'local' || selectedDelivery === 'shipping') && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Opciones de entrega */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">¿Cómo querés recibir tu pedido?</h2>
            
            <div className="space-y-3">
              {(['pickup', 'local', 'shipping'] as DeliveryOption[]).map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value={option}
                    checked={selectedDelivery === option}
                    onChange={() => setSelectedDelivery(option)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-gray-700">
                    {option === 'pickup' && 'Retiro en Local (Sin costo)'}
                    {option === 'local' && 'Entrega Córdoba Capital ($1500)'}
                    {option === 'shipping' && 'Envío Interior ($3500)'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Observaciones del pedido</h2>
            
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              placeholder="Instrucciones especiales para tu pedido..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={4}
            />
          </div>

          {/* Términos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
                className="w-4 h-4 mt-1 text-primary-600"
              />
              <span className="text-sm text-gray-700">
                Acepto que los productos personalizados solamente podrán cancelarse dentro de las primeras 2 horas posteriores a la acreditación del pago.
              </span>
            </label>
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del pedido</h2>
            
            <div className="space-y-2 mb-4">
              {items.map(({ product, quantity }) => {
                const effectivePrice = product.offerPrice ?? product.webPrice;
                return (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span>{product.name} x {quantity}</span>
                    <span>${effectivePrice * quantity}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium">${shippingCost}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Final</span>
                <span className="text-primary-600">${finalTotal}</span>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleMercadoPago}
              disabled={!isFormValid() || isProcessingPayment}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessingPayment ? 'Procesando...' : 'Pagar con Mercado Pago'}
            </button>
            
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}