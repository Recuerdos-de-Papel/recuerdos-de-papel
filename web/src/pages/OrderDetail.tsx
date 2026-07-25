import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrderById, cancelOrder } from '../services/orderService';
import type { Order, OrderStatus } from '../types';
import { ORDER_STATUS_LABELS, DELIVERY_METHOD_LABELS } from '../types';

function getProductImage(images: string | undefined): string {
  if (!images) return '';
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0]?.url || parsed[0] || '';
    }
    return typeof parsed === 'string' ? parsed : '';
  } catch {
    return images;
  }
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id, user?.id);
        setOrder(data);
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, user?.id]);

  const canCancel = (order: Order) => {
    return order.status === 'pending' || order.status === 'payment_pending';
  };

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm('¿Estás seguro de cancelar este pedido?')) return;
    
    setCancelling(true);
    
    try {
      await cancelOrder(order.id);
      setOrder({ ...order, status: 'cancelled' as OrderStatus });
    } catch (error) {
      alert('Error al cancelar el pedido');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Pedido no encontrado</h1>
            <Link to="/mi-cuenta/mis-pedidos" className="text-primary-600 hover:underline">
              Volver a mis pedidos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Detalle del Pedido #{order.id.slice(0, 8)}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'paid' ? 'bg-green-100 text-green-800' :
              order.status === 'payment_pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'in_production' ? 'bg-blue-100 text-blue-800' :
              order.status === 'ready' ? 'bg-indigo-100 text-indigo-800' :
              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Fecha</span>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Método de Entrega</span>
              <p className="font-medium">{DELIVERY_METHOD_LABELS[order.deliveryMethod]}</p>
            </div>
          </div>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Productos</h2>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
                {item.product?.images && (() => {
                  const img = getProductImage(item.product!.images);
                  return img ? (
                    <img 
                      src={img} 
                      alt={item.product!.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : null;
                })()}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.product?.name}</h3>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  <p className="text-sm text-gray-500">Precio unitario: ${item.price}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Descuento Web</span>
                <span className="font-medium text-green-600">-${order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Costo Envío</span>
              <span className="font-medium">${order.shippingCost}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary-600">${order.total}</span>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Observaciones</h2>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-4">
          <Link
            to="/mi-cuenta/mis-pedidos"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Volver
          </Link>
          {canCancel(order) && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelando...' : 'Cancelar Pedido'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}