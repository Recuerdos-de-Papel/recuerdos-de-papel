import 'package:dio/dio.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

class SettingsService {
  final ApiClient apiClient;
  
  SettingsService(this.apiClient);
  
  Future<List<Setting>> getSettings() async {
    try {
      final response = await apiClient.dio.get('/settings');
      return (response.data as List)
          .map((e) => Setting.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Setting> getSettingByKey(String key) async {
    try {
      final response = await apiClient.dio.get('/settings/$key');
      return Setting.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<Setting> updateSetting(String key, String value) async {
    try {
      final response = await apiClient.dio.put('/settings/$key', data: {
        'value': value,
      });
      return Setting.fromJson(response.data);
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