import 'package:dio/dio.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

class OrdersService {
  final ApiClient apiClient;
  
  OrdersService(this.apiClient);
  
  Future<List<AdminOrder>> getOrders({String? status}) async {
    try {
      final response = await apiClient.dio.get(
        '/orders',
        queryParameters: status != null ? {'status': status} : null,
      );
      return (response.data as List)
          .map((e) => AdminOrder.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<AdminOrder> getOrderById(String id) async {
    try {
      final response = await apiClient.dio.get('/orders/$id');
      return AdminOrder.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<AdminOrder> updateOrderStatus(
    String id,
    String status,
  ) async {
    try {
      final response = await apiClient.dio.patch(
        '/orders/$id/status',
        data: {'status': status},
      );
      return AdminOrder.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  String _handleError(DioException e) {
    if (e.response?.data != null) {
      return e.response!.data['error'] ?? 'Error desconocido';
    }
    return 'Error de conexión';
  }
}