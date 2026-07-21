import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  final FlutterLocalNotificationsPlugin _notifications = 
      FlutterLocalNotificationsPlugin();
  
  Future<void> init() async {
    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iOS = DarwinInitializationSettings();
    
    await _notifications.initialize(
      const InitializationSettings(android: android, iOS: iOS),
    );
  }
  
  Future<void> showNewOrderNotification(String orderId) async {
    const android = AndroidNotificationDetails(
      'orders',
      'Pedidos',
      channelDescription: 'Notificaciones de nuevos pedidos',
      importance: Importance.max,
      priority: Priority.high,
    );
    
    await _notifications.show(
      0,
      'Nuevo Pedido',
      'Se ha recibido un nuevo pedido #$orderId',
      NotificationDetails(android: android),
    );
  }
  
  Future<void> showPaymentApprovedNotification(String orderId) async {
    const android = AndroidNotificationDetails(
      'payments',
      'Pagos',
      channelDescription: 'Notificaciones de pagos aprobados',
      importance: Importance.max,
      priority: Priority.high,
    );
    
    await _notifications.show(
      1,
      'Pago Aprobado',
      'El pago del pedido #$orderId ha sido aprobado',
      NotificationDetails(android: android),
    );
  }
  
  Future<void> showOrderCancelledNotification(String orderId) async {
    const android = AndroidNotificationDetails(
      'orders',
      'Pedidos',
      channelDescription: 'Notificaciones de pedidos cancelados',
      importance: Importance.max,
      priority: Priority.high,
    );
    
    await _notifications.show(
      2,
      'Pedido Cancelado',
      'El pedido #$orderId ha sido cancelado',
      NotificationDetails(android: android),
    );
  }
  
  Future<void> showOrderReadyNotification(String orderId) async {
    const android = AndroidNotificationDetails(
      'orders',
      'Pedidos',
      channelDescription: 'Notificaciones de pedidos listos',
      importance: Importance.max,
      priority: Priority.high,
    );
    
    await _notifications.show(
      3,
      'Pedido Listo',
      'El pedido #$orderId está listo para entregar',
      NotificationDetails(android: android),
    );
  }
}