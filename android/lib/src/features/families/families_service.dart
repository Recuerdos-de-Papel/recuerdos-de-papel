import 'package:dio/dio.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

class FamiliesService {
  final ApiClient apiClient;
  
  FamiliesService(this.apiClient);
  
  Future<List<ProductFamily>> getFamilies() async {
    try {
      final response = await apiClient.dio.get('/families');
      return (response.data as List)
          .map((e) => ProductFamily.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<ProductFamily> getFamilyById(String id) async {
    try {
      final response = await apiClient.dio.get('/families/$id');
      return ProductFamily.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<ProductFamily> createFamily(Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.post('/families', data: data);
      return ProductFamily.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<ProductFamily> updateFamily(String id, Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.put('/families/$id', data: data);
      return ProductFamily.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<void> deleteFamily(String id) async {
    try {
      await apiClient.dio.delete('/families/$id');
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