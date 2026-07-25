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
import 'package:recuerdos_de_papel_admin/src/features/families/families_screen.dart';

final GoRouter router = GoRouter(
  initialLocation: '/',
  routes: [
    // Auth route (sin BottomNav)
    GoRoute(
      path: '/',
      builder: (context, state) => const AuthWrapper(),
    ),
    // Rutas principales con ShellRoute para BottomNavigationBar persistente
    ShellRoute(
      builder: (context, state, child) {
        int selectedIndex = 0;
        final location = state.matchedLocation;
        if (location.startsWith('/products')) {
          selectedIndex = 1;
        } else if (location.startsWith('/orders')) {
          selectedIndex = 2;
        } else if (location.startsWith('/settings')) {
          selectedIndex = 3;
        } else if (location.startsWith('/statistics')) {
          selectedIndex = 4;
        } else if (location.startsWith('/categories') ||
                   location.startsWith('/families') ||
                   location.startsWith('/subfamilies') ||
                   location.startsWith('/promotions') ||
                   location.startsWith('/flyers')) {
          selectedIndex = 1;
        }

        return PopScope(
          canPop: false,
          onPopInvokedWithResult: (didPop, result) {
            if (!didPop && location == '/home') {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('Cerrar sesión'),
                  content: const Text('¿Está seguro de que desea salir?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancelar'),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pop(context);
                        context.go('/');
                      },
                      child: const Text('Salir'),
                    ),
                  ],
                ),
              );
            } else if (!didPop) {
              context.pop();
            }
          },
          child: Scaffold(
            body: child,
            bottomNavigationBar: NavigationBar(
              selectedIndex: selectedIndex,
              onDestinationSelected: (index) {
                switch (index) {
                  case 0:
                    context.go('/home');
                    break;
                  case 1:
                    context.go('/products');
                    break;
                  case 2:
                    context.go('/orders');
                    break;
                  case 3:
                    context.go('/settings');
                    break;
                  case 4:
                    context.go('/statistics');
                    break;
                }
              },
              destinations: const [
                NavigationDestination(
                  icon: Icon(Icons.home),
                  label: 'Inicio',
                ),
                NavigationDestination(
                  icon: Icon(Icons.inventory),
                  label: 'Productos',
                ),
                NavigationDestination(
                  icon: Icon(Icons.shopping_bag),
                  label: 'Pedidos',
                ),
                NavigationDestination(
                  icon: Icon(Icons.settings),
                  label: 'Config',
                ),
                NavigationDestination(
                  icon: Icon(Icons.analytics),
                  label: 'Estadísticas',
                ),
              ],
            ),
          ),
        );
      },
      routes: [
        GoRoute(
          path: '/home',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/products',
          builder: (context, state) => const ProductsScreen(),
          routes: [
            GoRoute(
              path: 'new',
              builder: (context, state) => const ProductsScreen(),
            ),
          ],
        ),
        GoRoute(
          path: '/categories',
          builder: (context, state) => const CategoriesScreen(),
        ),
        GoRoute(
          path: '/families',
          builder: (context, state) => const FamiliesScreen(),
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
    ),
  ],
);