import 'package:dio/dio.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

class ProductsService {
  final ApiClient apiClient;
  
  ProductsService(this.apiClient);
  
  Future<List<Product>> getProducts() async {
    try {
      final response = await apiClient.dio.get('/products');
      return (response.data as List)
          .map((e) => Product.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Product> getProductById(String id) async {
    try {
      final response = await apiClient.dio.get('/products/$id');
      return Product.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Product> createProduct(Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.post('/products', data: data);
      return Product.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Product> updateProduct(String id, Map<String, dynamic> data) async {
    try {
      final response = await apiClient.dio.put('/products/$id', data: data);
      return Product.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<void> deleteProduct(String id) async {
    try {
      await apiClient.dio.delete('/products/$id');
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Product> updateProductState(String id, bool isActive) async {
    try {
      final response = await apiClient.dio.patch(
        '/products/$id/state',
        data: {'isActive': isActive},
      );
      return Product.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Product> updateProductFeatured(String id, bool isOffer) async {
    try {
      final response = await apiClient.dio.patch(
        '/products/$id/featured',
        data: {'isOffer': isOffer},
      );
      return Product.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Product> updateProductOrder(String id, int order) async {
    try {
      final response = await apiClient.dio.patch(
        '/products/$id/order',
        data: {'order': order},
      );
      return Product.fromJson(response.data);
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