import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

class AuthService {
  final ApiClient apiClient;
  final _storage = const FlutterSecureStorage();
  
  AuthService(this.apiClient);
  
  Future<AuthResponse> login(String email, String password) async {
    try {
      final response = await apiClient.dio.post(
        '/auth/login',
        data: {
          'email': email,
          'password': password,
        },
      );
      
      final data = response.data;
      final authResponse = AuthResponse.fromJson(data);
      
      // 🔥 FIX: Inyectar el token en ApiClient inmediatamente después del login
      apiClient.setToken(authResponse.token);
      
      // Save token securely
      await _storage.write(key: 'auth_token', value: authResponse.token);
      await _storage.write(key: 'admin_name', value: authResponse.admin.name);
      await _storage.write(key: 'admin_email', value: authResponse.admin.email);
      
      return authResponse;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  Future<void> logout() async {
    await _storage.delete(key: 'auth_token');
    await _storage.delete(key: 'admin_name');
    await _storage.delete(key: 'admin_email');
    apiClient.clearToken();
  }
  
  Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }
  
  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }
  
  Future<AdminProfile> getProfile() async {
    try {
      final response = await apiClient.dio.get('/auth/profile');
      return AdminProfile.fromJson(response.data);
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

class AuthResponse {
  final String token;
  final AdminProfile admin;
  
  AuthResponse({required this.token, required this.admin});
  
  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'] ?? '',
      admin: AdminProfile.fromJson(json['admin'] ?? {}),
    );
  }
}

class AdminProfile {
  final String id;
  final String email;
  final String name;
  
  AdminProfile({
    required this.id,
    required this.email,
    required this.name,
  });
  
  factory AdminProfile.fromJson(Map<String, dynamic> json) {
    return AdminProfile(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
    );
  }
}