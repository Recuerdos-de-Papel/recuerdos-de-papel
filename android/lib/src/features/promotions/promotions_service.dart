import 'package:dio/dio.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

class PromotionsService {
  final ApiClient apiClient;
  
  PromotionsService(this.apiClient);
  
  Future<List<Promotion>> getPromotions() async {
    try {
      final response = await apiClient.dio.get('/promotions');
      return (response.data as List)
          .map((e) => Promotion.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Promotion> getPromotionById(String id) async {
    try {
      final response = await apiClient.dio.get('/promotions/$id');
      return Promotion.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Promotion> createPromotion(Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.post('/promotions', data: data);
      return Promotion.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Promotion> updatePromotion(String id, Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.put('/promotions/$id', data: data);
      return Promotion.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<void> deletePromotion(String id) async {
    try {
      await apiClient.dio.delete('/promotions/$id');
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