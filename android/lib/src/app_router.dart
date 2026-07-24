import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:recuerdos_de_papel_admin/src/features/auth/auth_wrapper.dart';
import 'package:recuerdos_de_papel_admin/src/features/home/home_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/products/products_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/categories/categories_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/subfamilies/subfamilies_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/promotions/promotions_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/flyers/flyers_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/orders/orders_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/settings/settings_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/statistics/statistics_screen.dart';

final GoRouter router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const AuthWrapper(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomeScreen(),
    ),
    GoRoute(
      path: '/products',
      builder: (context, state) => const ProductsScreen(),
    ),
    GoRoute(
      path: '/categories',
      builder: (context, state) => const CategoriesScreen(),
    ),
    GoRoute(
      path: '/subfamilies',
      builder: (context, state) => const SubfamiliesScreen(),
    ),
    GoRoute(
      path: '/promotions',
      builder: (context, state) => const PromotionsScreen(),
    ),
    GoRoute(
      path: '/flyers',
      builder: (context, state) => const FlyersScreen(),
    ),
    GoRoute(
      path: '/orders',
      builder: (context, state) => const OrdersScreen(),
    ),
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsScreen(),
    ),
    GoRoute(
      path: '/statistics',
      builder: (context, state) => const StatisticsScreen(),
    ),
  ],
);