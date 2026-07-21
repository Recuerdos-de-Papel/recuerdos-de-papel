import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getOrders, cancelOrder } from '../services/orderService';
import type { Order, OrderStatus, PaymentStatus } from '../types';
import { ORDER_STATUS_LABELS, DELIVERY_METHOD_LABELS } from '../types';

// Payment status labels
const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
};

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchOrders = async () => {
      try {
        const data = await getOrders(user.id);
        setOrders(data);
      } catch (error) {
        // Error handled silently
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  const canCancel = (order: Order) => {
    return order.status === 'pending' || order.status === 'payment_pending';
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('¿Estás seguro de cancelar este pedido?')) return;
    
    setCancelling(orderId);
    
    try {
      await cancelOrder(orderId);
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o
      ));
    } catch (error) {
      alert('Error al cancelar el pedido');
    } finally {
      setCancelling(null);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Pedidos</h2>
        <p className="text-gray-600">Inicia sesión para ver tus pedidos.</p>
        <Link to="/login" className="text-primary-600 hover:underline mt-4 inline-block">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Pedidos</h2>
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Pedidos</h2>
        <p className="text-gray-600">No tenés pedidos realizados.</p>
        <Link to="/productos" className="text-primary-600 hover:underline mt-4 inline-block">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Pedidos</h2>

      <div className="space-y-4">
        {orders.map(order => {
          const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
          const status = order.status;
          
          return (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-800">Pedido #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === 'paid' ? 'bg-green-100 text-green-800' :
                  status === 'payment_pending' ? 'bg-yellow-100 text-yellow-800' :
                  status === 'in_production' ? 'bg-blue-100 text-blue-800' :
                  status === 'ready' ? 'bg-indigo-100 text-indigo-800' :
                  status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                  status === 'delivered' ? 'bg-green-100 text-green-800' :
                  status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ORDER_STATUS_LABELS[status] || 'Pendiente'}
                </span>
              </div>

              {/* Payment info */}
              {order.paymentId && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Estado del pago:</span>
                      <span className={`ml-2 font-medium ${
                        order.paymentStatus === 'approved' ? 'text-green-600' :
                        order.paymentStatus === 'rejected' ? 'text-red-600' :
                        order.paymentStatus === 'cancelled' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {order.paymentStatus ? PAYMENT_STATUS_LABELS[order.paymentStatus] : 'Pendiente'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Número de operación:</span>
                      <span className="ml-2 font-mono text-xs">{order.paymentId}</span>
                    </div>
                    {order.dateApproved && (
                      <div className="col-span-2">
                        <span className="text-gray-500">Fecha del pago:</span>
                        <span className="ml-2">{new Date(order.dateApproved).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <div>
                  <span className="text-sm text-gray-500">Cant: {totalItems} | {DELIVERY_METHOD_LABELS[order.deliveryMethod]}</span>
                  <p className="font-bold">Total: ${order.total}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/mi-cuenta/mis-pedidos/${order.id}`}
                    className="text-primary-600 hover:underline text-sm"
                  >
                    Ver detalle
                  </Link>
                  {canCancel(order) && (
                    <button 
                      onClick={() => handleCancel(order.id)}
                      disabled={cancelling === order.id}
                      className="text-red-600 hover:underline text-sm disabled:opacity-50"
                    >
                      {cancelling === order.id ? 'Cancelando...' : 'Cancelar Pedido'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}