import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/features/orders/orders_service.dart';

class OrdersScreen extends ConsumerStatefulWidget {
  const OrdersScreen({super.key});

  @override
  ConsumerState<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends ConsumerState<OrdersScreen> {
  bool _isLoading = false;
  List<AdminOrder> _orders = [];
  String? _selectedStatus;
  
  @override
  void initState() {
    super.initState();
    _loadOrders();
  }
  
  Future<void> _loadOrders() async {
    setState(() => _isLoading = true);
    try {
      final ordersService = ref.read(ordersServiceProvider);
      final orders = await ordersService.getOrders(
        status: _selectedStatus,
      );
      setState(() => _orders = orders);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
  
  void _showOrderDetails(AdminOrder order) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        expand: false,
        builder: (context, scrollController) => SingleChildScrollView(
          controller: scrollController,
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Pedido #${order.id.substring(0, 8)}',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 16),
              _buildOrderDetail('Cliente', order.customerName),
              _buildOrderDetail('Teléfono', order.customerPhone),
              _buildOrderDetail('Email', order.customerEmail),
              if (order.address != null)
                _buildOrderDetail('Dirección', order.address!),
              if (order.notes != null)
                _buildOrderDetail('Notas', order.notes!),
              const SizedBox(height: 16),
              Text(
                'Productos',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              ...order.items.map((item) => ListTile(
                title: Text(item.productName),
                subtitle: Text('Cantidad: ${item.quantity}'),
                trailing: Text('\$${item.price.toStringAsFixed(2)}'),
              )),
              const SizedBox(height: 16),
              _buildOrderDetail(
                'Subtotal',
                '\$${order.subtotal.toStringAsFixed(2)}',
              ),
              _buildOrderDetail(
                'Descuento',
                '\$${order.discount.toStringAsFixed(2)}',
              ),
              _buildOrderDetail(
                'Total',
                '\$${order.total.toStringAsFixed(2)}',
              ),
              const SizedBox(height: 16),
              Text(
                'Cambiar Estado',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: [
                  'pending',
                  'payment_pending',
                  'paid',
                  'in_production',
                  'ready',
                  'shipped',
                  'delivered',
                ].map((status) => ChoiceChip(
                  label: Text(_getStatusLabel(status)),
                  selected: order.status == status,
                  onSelected: (selected) {
                    if (selected) {
                      _changeOrderStatus(order, status);
                    }
                  },
                )).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Future<void> _changeOrderStatus(AdminOrder order, String status) async {
    try {
      final ordersService = ref.read(ordersServiceProvider);
      await ordersService.updateOrderStatus(order.id, status);
      _loadOrders();
      if (mounted) {
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }
  
  String _getStatusLabel(String status) {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'payment_pending':
        return 'Pago Pendiente';
      case 'paid':
        return 'Pago Aprobado';
      case 'in_production':
        return 'En Producción';
      case 'ready':
        return 'Listo';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      default:
        return status;
    }
  }
  
  Widget _buildOrderDetail(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$label: ',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pedidos'),
        actions: [
          PopupMenuButton<String?>(
            onSelected: (status) {
              setState(() => _selectedStatus = status);
              _loadOrders();
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: null,
                child: Text('Todos'),
              ),
              const PopupMenuItem(
                value: 'pending',
                child: Text('Pendientes'),
              ),
              const PopupMenuItem(
                value: 'payment_pending',
                child: Text('Pago Pendiente'),
              ),
              const PopupMenuItem(
                value: 'paid',
                child: Text('Pagos Aprobados'),
              ),
              const PopupMenuItem(
                value: 'in_production',
                child: Text('En Producción'),
              ),
              const PopupMenuItem(
                value: 'ready',
                child: Text('Listos'),
              ),
              const PopupMenuItem(
                value: 'delivered',
                child: Text('Entregados'),
              ),
            ],
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadOrders,
              child: ListView.builder(
                itemCount: _orders.length,
                itemBuilder: (context, index) {
                  final order = _orders[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 4,
                    ),
                    child: ListTile(
                      title: Text(
                        'Pedido #${order.id.substring(0, 8)}',
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(order.customerName),
                          Text(
                            '\$${order.total.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      trailing: Chip(
                        label: Text(_getStatusLabel(order.status)),
                        backgroundColor: _getStatusColor(order.status),
                      ),
                      onTap: () => _showOrderDetails(order),
                    ),
                  );
                },
              ),
            ),
    );
  }
  
  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return Colors.grey;
      case 'payment_pending':
        return Colors.amber;
      case 'paid':
        return Colors.blue;
      case 'in_production':
        return Colors.orange;
      case 'ready':
        return Colors.teal;
      case 'shipped':
        return Colors.indigo;
      case 'delivered':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}