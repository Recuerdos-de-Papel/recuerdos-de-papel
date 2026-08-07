import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';

// Theme Provider
final themeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);

// Auth Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

class AuthState {
  final bool isAuthenticated;
  final String? token;
  final String? adminName;
  final String? adminEmail;
  
  AuthState({
    this.isAuthenticated = false,
    this.token,
    this.adminName,
    this.adminEmail,
  });
  
  AuthState copyWith({
    bool? isAuthenticated,
    String? token,
    String? adminName,
    String? adminEmail,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      token: token ?? this.token,
      adminName: adminName ?? this.adminName,
      adminEmail: adminEmail ?? this.adminEmail,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState());
  
  void login(String token, String name, String email) {
    state = state.copyWith(
      isAuthenticated: true,
      token: token,
      adminName: name,
      adminEmail: email,
    );
  }
  
  void logout() {
    state = AuthState();
  }
}

// Connectivity Provider
final connectivityProvider = StateProvider<bool>((ref) => true);

// Pending Actions Provider (for offline sync)
final pendingActionsProvider = StateProvider<List<PendingAction>>((ref) => []);

class PendingAction {
  final String id;
  final String type;
  final String endpoint;
  final Map<String, dynamic> data;
  final DateTime timestamp;
  
  PendingAction({
    required this.id,
    required this.type,
    required this.endpoint,
    required this.data,
    required this.timestamp,
  });
}

// Dashboard Stats Provider - Llama a la API real
final dashboardStatsProvider = FutureProvider<DashboardStats>((ref) async {
  final apiClient = ref.read(apiClientProvider);
  try {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final weekAgo = today.subtract(const Duration(days: 7));
    final monthAgo = DateTime(now.year, now.month - 1, now.day);
    
    // Obtener estadísticas desde la API de administración
    final statisticsService = ref.read(statisticsServiceProvider);
    
    final dayStats = await statisticsService.getSalesStats(from: today, to: now);
    final weekStats = await statisticsService.getSalesStats(from: weekAgo, to: now);
    final monthStats = await statisticsService.getSalesStats(from: monthAgo, to: now);
    
    // Obtener pedidos
    final ordersResponse = await apiClient.dio.get('/orders');
    final orders = ordersResponse.data as List;
    
    return DashboardStats(
      salesToday: (dayStats['totalSales'] ?? 0).toDouble(),
      salesWeek: (weekStats['totalSales'] ?? 0).toDouble(),
      salesMonth: (monthStats['totalSales'] ?? 0).toDouble(),
      pendingOrders: orders.where((o) => o['status'] == 'pending').length,
      productionOrders: orders.where((o) => o['status'] == 'in_production').length,
      readyOrders: orders.where((o) => o['status'] == 'ready').length,
      deliveredOrders: orders.where((o) => o['status'] == 'delivered').length,
      totalIncome: (monthStats['totalSales'] ?? 0).toDouble(),
    );
  } catch (e) {
    // Si falla la API, retornar datos por defecto
    return DashboardStats(
      salesToday: 0,
      salesWeek: 0,
      salesMonth: 0,
      pendingOrders: 0,
      productionOrders: 0,
      readyOrders: 0,
      deliveredOrders: 0,
      totalIncome: 0,
    );
  }
});

class DashboardStats {
  final double salesToday;
  final double salesWeek;
  final double salesMonth;
  final int pendingOrders;
  final int productionOrders;
  final int readyOrders;
  final int deliveredOrders;
  final double totalIncome;
  
  DashboardStats({
    required this.salesToday,
    required this.salesWeek,
    required this.salesMonth,
    required this.pendingOrders,
    required this.productionOrders,
    required this.readyOrders,
    required this.deliveredOrders,
    required this.totalIncome,
  });
}

// Products Provider
final productsProvider = StateNotifierProvider<ProductsNotifier, ProductsState>((ref) {
  return ProductsNotifier();
});

class ProductsState {
  final List<Product> products;
  final bool isLoading;
  final String? error;
  
  ProductsState({
    this.products = const [],
    this.isLoading = false,
    this.error,
  });
}

class ProductsNotifier extends StateNotifier<ProductsState> {
  ProductsNotifier() : super(ProductsState());
}

// Product Model
class Product {
  final String id;
  final String subfamilyId;
  final String name;
  final String? code;
  final String? description;
  final double price;
  final double webPrice;
  final List<String> images;
  final bool isOffer;
  final String status;
  final bool isActive;
  final int stock;
  final double? cost;
  final int displayOrder;
  
  Product({
    required this.id,
    required this.subfamilyId,
    required this.name,
    this.code,
    this.description,
    required this.price,
    required this.webPrice,
    this.images = const [],
    this.isOffer = false,
    this.status = 'available',
    this.isActive = true,
    this.stock = 0,
    this.cost,
    this.displayOrder = 0,
  });
  
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      subfamilyId: json['subfamilyId'] ?? '',
      name: json['name'] ?? '',
      code: json['code'],
      description: json['description'],
      price: (json['price'] ?? 0).toDouble(),
      webPrice: (json['webPrice'] ?? 0).toDouble(),
      images: json['images'] != null 
          ? (json['images'] is String 
              ? List<String>.from(json['images'].replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').split(','))
              : List<String>.from(json['images']))
          : [],
      isOffer: json['isOffer'] ?? false,
      status: json['status'] ?? 'available',
      isActive: json['isActive'] ?? true,
      stock: json['stock'] ?? 0,
      cost: json['cost'] != null ? (json['cost'] as num).toDouble() : null,
      displayOrder: json['displayOrder'] ?? 0,
    );
  }
}

// Category Model
class Category {
  final String id;
  final String name;
  final String? description;
  final int order;
  final bool isActive;
  
  Category({
    required this.id,
    required this.name,
    this.description,
    this.order = 0,
    this.isActive = true,
  });
  
  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      order: json['order'] ?? 0,
      isActive: json['isActive'] ?? true,
    );
  }
}

// Family Model - Renamed to avoid conflict with riverpod's Family
class ProductFamily {
  final String id;
  final String categoryId;
  final String name;
  final String? description;
  final int order;
  final bool isActive;
  
  ProductFamily({
    required this.id,
    required this.categoryId,
    required this.name,
    this.description,
    this.order = 0,
    this.isActive = true,
  });
  
  factory ProductFamily.fromJson(Map<String, dynamic> json) {
    return ProductFamily(
      id: json['id'] ?? '',
      categoryId: json['categoryId'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      order: json['order'] ?? 0,
      isActive: json['isActive'] ?? true,
    );
  }
}

// Subfamily Model
class Subfamily {
  final String id;
  final String familyId;
  final String name;
  final String? description;
  final int order;
  final bool isActive;
  
  Subfamily({
    required this.id,
    required this.familyId,
    required this.name,
    this.description,
    this.order = 0,
    this.isActive = true,
  });
  
  factory Subfamily.fromJson(Map<String, dynamic> json) {
    return Subfamily(
      id: json['id'] ?? '',
      familyId: json['familyId'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      order: json['order'] ?? 0,
      isActive: json['isActive'] ?? true,
    );
  }
}

// Promotion Model
class Promotion {
  final String id;
  final String title;
  final String? description;
  final double discount;
  final String? code;
  final DateTime startDate;
  final DateTime endDate;
  final bool isActive;
  final bool isWeb;
  
  Promotion({
    required this.id,
    required this.title,
    this.description,
    required this.discount,
    this.code,
    required this.startDate,
    required this.endDate,
    this.isActive = true,
    this.isWeb = false,
  });
  
  factory Promotion.fromJson(Map<String, dynamic> json) {
    return Promotion(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'],
      discount: (json['discount'] ?? 0).toDouble(),
      code: json['code'],
      startDate: DateTime.parse(json['startDate'] ?? DateTime.now().toIso8601String()),
      endDate: DateTime.parse(json['endDate'] ?? DateTime.now().toIso8601String()),
      isActive: json['isActive'] ?? true,
      isWeb: json['isWeb'] ?? false,
    );
  }
}

// Flyer Model
class Flyer {
  final String id;
  final String title;
  final String imageUrl;
  final DateTime startDate;
  final DateTime endDate;
  final bool isActive;
  final int order;
  
  Flyer({
    required this.id,
    required this.title,
    required this.imageUrl,
    required this.startDate,
    required this.endDate,
    this.isActive = true,
    this.order = 0,
  });
  
  factory Flyer.fromJson(Map<String, dynamic> json) {
    return Flyer(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      startDate: DateTime.parse(json['startDate'] ?? DateTime.now().toIso8601String()),
      endDate: DateTime.parse(json['endDate'] ?? DateTime.now().toIso8601String()),
      isActive: json['isActive'] ?? true,
      order: json['order'] ?? 0,
    );
  }
}

// Order Model
class AdminOrder {
  final String id;
  final String status;
  final String deliveryMethod;
  final double subtotal;
  final double discount;
  final double total;
  final double shippingCost;
  final String customerName;
  final String customerPhone;
  final String customerEmail;
  final String? address;
  final String? notes;
  final String? paymentId;
  final String? paymentStatus;
  final DateTime? dateApproved;
  final List<AdminOrderItem> items;
  final DateTime createdAt;
  final DateTime updatedAt;
  
  AdminOrder({
    required this.id,
    required this.status,
    required this.deliveryMethod,
    required this.subtotal,
    required this.discount,
    required this.total,
    required this.shippingCost,
    required this.customerName,
    required this.customerPhone,
    required this.customerEmail,
    this.address,
    this.notes,
    this.paymentId,
    this.paymentStatus,
    this.dateApproved,
    this.items = const [],
    required this.createdAt,
    required this.updatedAt,
  });
  
  factory AdminOrder.fromJson(Map<String, dynamic> json) {
    return AdminOrder(
      id: json['id'] ?? '',
      status: json['status'] ?? 'pending',
      deliveryMethod: json['deliveryMethod'] ?? '',
      subtotal: (json['subtotal'] ?? 0).toDouble(),
      discount: (json['discount'] ?? 0).toDouble(),
      total: (json['total'] ?? 0).toDouble(),
      shippingCost: (json['shippingCost'] ?? 0).toDouble(),
      customerName: json['customerName'] ?? '',
      customerPhone: json['customerPhone'] ?? '',
      customerEmail: json['customerEmail'] ?? '',
      address: json['address'],
      notes: json['notes'],
      paymentId: json['paymentId'],
      paymentStatus: json['paymentStatus'],
      dateApproved: json['dateApproved'] != null 
          ? DateTime.parse(json['dateApproved']) 
          : null,
      items: (json['items'] as List<dynamic>?)
          ?.map((e) => AdminOrderItem.fromJson(e as Map<String, dynamic>))
          .toList() ?? [],
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt: DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
    );
  }
}

class AdminOrderItem {
  final String id;
  final String productId;
  final int quantity;
  final double price;
  final String productName;
  final String? productCode;
  
  AdminOrderItem({
    required this.id,
    required this.productId,
    required this.quantity,
    required this.price,
    required this.productName,
    this.productCode,
  });
  
  factory AdminOrderItem.fromJson(Map<String, dynamic> json) {
    return AdminOrderItem(
      id: json['id'] ?? '',
      productId: json['productId'] ?? '',
      quantity: json['quantity'] ?? 0,
      price: (json['price'] ?? 0).toDouble(),
      productName: json['product']?['name'] ?? '',
      productCode: json['product']?['code'],
    );
  }
}

// Setting Model
class Setting {
  final String id;
  final String key;
  final String value;
  final String? description;
  
  Setting({
    required this.id,
    required this.key,
    required this.value,
    this.description,
  });
  
  factory Setting.fromJson(Map<String, dynamic> json) {
    return Setting(
      id: json['id'] ?? '',
      key: json['key'] ?? '',
      value: json['value'] ?? '',
      description: json['description'],
    );
  }
}

// Statistics Models
class TopProduct {
  final String productId;
  final String productName;
  final int totalQuantity;
  final double totalRevenue;
  
  TopProduct({
    required this.productId,
    required this.productName,
    required this.totalQuantity,
    required this.totalRevenue,
  });
  
  factory TopProduct.fromJson(Map<String, dynamic> json) {
    return TopProduct(
      productId: json['productId'] ?? '',
      productName: json['productName'] ?? '',
      totalQuantity: json['totalQuantity'] ?? 0,
      totalRevenue: (json['totalRevenue'] ?? 0).toDouble(),
    );
  }
}

class TopCategory {
  final String categoryId;
  final String categoryName;
  final int totalQuantity;
  final double totalRevenue;
  
  TopCategory({
    required this.categoryId,
    required this.categoryName,
    required this.totalQuantity,
    required this.totalRevenue,
  });
  
  factory TopCategory.fromJson(Map<String, dynamic> json) {
    return TopCategory(
      categoryId: json['categoryId'] ?? '',
      categoryName: json['categoryName'] ?? '',
      totalQuantity: json['totalQuantity'] ?? 0,
      totalRevenue: (json['totalRevenue'] ?? 0).toDouble(),
    );
  }
}