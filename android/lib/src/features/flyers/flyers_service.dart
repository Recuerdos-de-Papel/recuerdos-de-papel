import 'package:dio/dio.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

class FlyersService {
  final ApiClient apiClient;
  
  FlyersService(this.apiClient);
  
  Future<List<Flyer>> getFlyers() async {
    try {
      final response = await apiClient.dio.get('/flyers');
      return (response.data as List)
          .map((e) => Flyer.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Flyer> getFlyerById(String id) async {
    try {
      final response = await apiClient.dio.get('/flyers/$id');
      return Flyer.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Flyer> createFlyer(Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.post('/flyers', data: data);
      return Flyer.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Flyer> updateFlyer(String id, Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.put('/flyers/$id', data: data);
      return Flyer.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<void> deleteFlyer(String id) async {
    try {
      await apiClient.dio.delete('/flyers/$id');
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