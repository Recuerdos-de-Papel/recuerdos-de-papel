import 'package:dio/dio.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

class StatisticsService {
  final ApiClient apiClient;
  
  StatisticsService(this.apiClient);
  
  Future<Map<String, dynamic>> getSalesStats({
    DateTime? from,
    DateTime? to,
  }) async {
    try {
      final response = await apiClient.dio.get(
        '/statistics/sales',
        queryParameters: {
          if (from != null) 'from': from.toIso8601String(),
          if (to != null) 'to': to.toIso8601String(),
        },
      );
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<List<TopProduct>> getTopProducts({
    DateTime? from,
    DateTime? to,
    int limit = 10,
  }) async {
    try {
      final response = await apiClient.dio.get(
        '/statistics/top-products',
        queryParameters: {
          if (from != null) 'from': from.toIso8601String(),
          if (to != null) 'to': to.toIso8601String(),
          'limit': limit,
        },
      );
      return (response.data as List)
          .map((e) => TopProduct.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<List<TopCategory>> getTopCategories({
    DateTime? from,
    DateTime? to,
    int limit = 10,
  }) async {
    try {
      final response = await apiClient.dio.get(
        '/statistics/top-categories',
        queryParameters: {
          if (from != null) 'from': from.toIso8601String(),
          if (to != null) 'to': to.toIso8601String(),
          'limit': limit,
        },
      );
      return (response.data as List)
          .map((e) => TopCategory.fromJson(e as Map<String, dynamic>))
          .toList();
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