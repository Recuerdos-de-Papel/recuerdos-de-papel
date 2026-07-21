import 'package:dio/dio.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

class SubfamiliesService {
  final ApiClient apiClient;
  
  SubfamiliesService(this.apiClient);
  
  Future<List<Subfamily>> getSubfamilies() async {
    try {
      final response = await apiClient.dio.get('/subfamilies');
      return (response.data as List)
          .map((e) => Subfamily.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Subfamily> getSubfamilyById(String id) async {
    try {
      final response = await apiClient.dio.get('/subfamilies/$id');
      return Subfamily.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Subfamily> createSubfamily(Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.post('/subfamilies', data: data);
      return Subfamily.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Subfamily> updateSubfamily(String id, Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.put('/subfamilies/$id', data: data);
      return Subfamily.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<void> deleteSubfamily(String id) async {
    try {
      await apiClient.dio.delete('/subfamilies/$id');
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