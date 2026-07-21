import 'package:dio/dio.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

class CategoriesService {
  final ApiClient apiClient;
  
  CategoriesService(this.apiClient);
  
  Future<List<Category>> getCategories() async {
    try {
      final response = await apiClient.dio.get('/categories');
      return (response.data as List)
          .map((e) => Category.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Category> getCategoryById(String id) async {
    try {
      final response = await apiClient.dio.get('/categories/$id');
      return Category.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Category> createCategory(Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.post('/categories', data: data);
      return Category.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Category> updateCategory(String id, Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.put('/categories/$id', data: data);
      return Category.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<void> deleteCategory(String id) async {
    try {
      await apiClient.dio.delete('/categories/$id');
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