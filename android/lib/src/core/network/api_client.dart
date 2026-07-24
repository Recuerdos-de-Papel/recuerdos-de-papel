import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:recuerdos_de_papel_admin/src/features/auth/auth_service.dart';
import 'package:recuerdos_de_papel_admin/src/features/products/products_service.dart';
import 'package:recuerdos_de_papel_admin/src/features/categories/categories_service.dart';
import 'package:recuerdos_de_papel_admin/src/features/subfamilies/subfamilies_service.dart';
import 'package:recuerdos_de_papel_admin/src/features/promotions/promotions_service.dart';
import 'package:recuerdos_de_papel_admin/src/features/flyers/flyers_service.dart';
import 'package:recuerdos_de_papel_admin/src/features/orders/orders_service.dart';
import 'package:recuerdos_de_papel_admin/src/features/settings/settings_service.dart';
import 'package:recuerdos_de_papel_admin/src/features/statistics/statistics_service.dart';

class ApiClient {
  static const String baseUrl =
      'https://recuerdos-de-papel-backend.onrender.com/api/admin';

  static final Dio _dio = Dio();

  static final ApiClient _instance = ApiClient._internal();

  factory ApiClient() {
    return _instance;
  }

  ApiClient._internal() {
    _dio.options = BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );

    // 🔍 LOGS DE VERIFICACIÓN: Imprime explícitamente el Authorization header en cada request
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final authHeader = options.headers['Authorization'];
          if (authHeader != null) {
            debugPrint("🔐 API REQUEST Authorization: Bearer ${(authHeader as String).substring(0, 20)}...");
          } else {
            debugPrint("⚠️ API REQUEST SIN Authorization HEADER");
          }
          handler.next(options);
        },
        onResponse: (response, handler) {
          debugPrint("✅ API RESPONSE ${response.statusCode} ${response.requestOptions.path}");
          handler.next(response);
        },
        onError: (error, handler) {
          debugPrint("❌ API ERROR ${error.response?.statusCode} ${error.requestOptions.path}: ${error.message}");
          handler.next(error);
        },
      ),
    );

    _dio.interceptors.add(
      LogInterceptor(
        request: true,
        requestHeader: true,
        requestBody: true,
        responseHeader: true,
        responseBody: true,
        error: true,
      ),
    );
  }

  Dio get dio => _dio;

  void setToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  void clearToken() {
    _dio.options.headers.remove('Authorization');
  }
}


// API Service providers

final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient();
});


final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ApiClient());
});


final productsServiceProvider = Provider<ProductsService>((ref) {
  return ProductsService(ApiClient());
});


final categoriesServiceProvider = Provider<CategoriesService>((ref) {
  return CategoriesService(ApiClient());
});


final subfamiliesServiceProvider = Provider<SubfamiliesService>((ref) {
  return SubfamiliesService(ApiClient());
});


final promotionsServiceProvider = Provider<PromotionsService>((ref) {
  return PromotionsService(ApiClient());
});


final flyersServiceProvider = Provider<FlyersService>((ref) {
  return FlyersService(ApiClient());
});


final ordersServiceProvider = Provider<OrdersService>((ref) {
  return OrdersService(ApiClient());
});


final settingsServiceProvider = Provider<SettingsService>((ref) {
  return SettingsService(ApiClient());
});


final statisticsServiceProvider = Provider<StatisticsService>((ref) {
  return StatisticsService(ApiClient());
});