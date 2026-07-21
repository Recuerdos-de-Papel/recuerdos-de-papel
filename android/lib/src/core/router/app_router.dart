import 'package:flutter/material.dart';
import 'package:recuerdos_de_papel_admin/src/features/auth/login_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/home/home_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/products/products_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/categories/categories_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/subfamilies/subfamilies_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/promotions/promotions_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/flyers/flyers_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/orders/orders_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/settings/settings_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/statistics/statistics_screen.dart';

class AppRouter {
  static const String initialRoute = '/login';
  
  static final Map<String, Widget Function(BuildContext)> routes = {
    '/login': (context) => const LoginScreen(),
    '/home': (context) => const HomeScreen(),
    '/products': (context) => const ProductsScreen(),
    '/categories': (context) => const CategoriesScreen(),
    '/subfamilies': (context) => const SubfamiliesScreen(),
    '/promotions': (context) => const PromotionsScreen(),
    '/flyers': (context) => const FlyersScreen(),
    '/orders': (context) => const OrdersScreen(),
    '/settings': (context) => const SettingsScreen(),
    '/statistics': (context) => const StatisticsScreen(),
  };
}