import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  bool _isLoading = true;
  DashboardStats _stats = DashboardStats(
    salesToday: 0,
    salesWeek: 0,
    salesMonth: 0,
    pendingOrders: 0,
    productionOrders: 0,
    readyOrders: 0,
    deliveredOrders: 0,
    totalIncome: 0,
  );
  
  @override
  void initState() {
    super.initState();
    _loadStats();
  }
  
  Future<void> _loadStats() async {
    setState(() => _isLoading = true);
    try {
      final apiClient = ref.read(apiClientProvider);
      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);
      final weekAgo = today.subtract(const Duration(days: 7));
      final monthAgo = DateTime(now.year, now.month - 1, now.day);
      
      final statisticsService = ref.read(statisticsServiceProvider);
      
      final dayStats = await statisticsService.getSalesStats(from: today, to: now);
      final weekStats = await statisticsService.getSalesStats(from: weekAgo, to: now);
      final monthStats = await statisticsService.getSalesStats(from: monthAgo, to: now);
      
      final ordersResponse = await apiClient.dio.get('/orders');
      final orders = ordersResponse.data as List;
      
      if (mounted) {
        setState(() {
          _stats = DashboardStats(
            salesToday: (dayStats['totalSales'] ?? 0).toDouble(),
            salesWeek: (weekStats['totalSales'] ?? 0).toDouble(),
            salesMonth: (monthStats['totalSales'] ?? 0).toDouble(),
            pendingOrders: orders.where((o) => o['status'] == 'pending').length,
            productionOrders: orders.where((o) => o['status'] == 'in_production').length,
            readyOrders: orders.where((o) => o['status'] == 'ready').length,
            deliveredOrders: orders.where((o) => o['status'] == 'delivered').length,
            totalIncome: (monthStats['totalSales'] ?? 0).toDouble(),
          );
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error al cargar estadísticas: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
  
  Future<void> _logout() async {
    print("CLICK Logout");
    final authService = ref.read(authServiceProvider);
    await authService.logout();
    ref.read(authProvider.notifier).logout();
    
    if (mounted) {
      context.go('/');
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (!didPop) {
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
                    _logout();
                  },
                  child: const Text('Salir'),
                ),
              ],
            ),
          );
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Dashboard'),
          actions: [
            IconButton(
              icon: const Icon(Icons.brightness_6),
              onPressed: () {
                ref.read(themeProvider.notifier).state = 
                  ref.read(themeProvider) == ThemeMode.dark 
                      ? ThemeMode.light 
                      : ThemeMode.dark;
              },
            ),
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: _logout,
            ),
          ],
        ),
        body: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
                onRefresh: _loadStats,
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Bienvenido, ${authState.adminName ?? 'Admin'}',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      const SizedBox(height: 24),
                      
                      // Sales Section
                      Text(
                        'Ventas',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 16),
                      _buildStatsGrid(),
                      
                      const SizedBox(height: 24),
                      
                      // Orders Section
                      Text(
                        'Pedidos',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 16),
                      _buildOrdersGrid(),
                      
                      const SizedBox(height: 24),
                      
                      // Quick Actions
                      Text(
                        'Acciones Rápidas',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 16),
                      _buildQuickActions(),
                    ],
                  ),
                ),
              ),
      ),
    );
  }
  
  Widget _buildStatsGrid() {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _buildStatCard(
          'Ventas Hoy',
          '\$${_stats.salesToday.toStringAsFixed(2)}',
          Icons.today,
          Colors.blue,
        ),
        _buildStatCard(
          'Ventas Semana',
          '\$${_stats.salesWeek.toStringAsFixed(2)}',
          Icons.view_week,
          Colors.green,
        ),
        _buildStatCard(
          'Ventas Mes',
          '\$${_stats.salesMonth.toStringAsFixed(2)}',
          Icons.calendar_month,
          Colors.orange,
        ),
        _buildStatCard(
          'Ingresos',
          '\$${_stats.totalIncome.toStringAsFixed(2)}',
          Icons.attach_money,
          Colors.purple,
        ),
      ],
    );
  }
  
  Widget _buildOrdersGrid() {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _buildStatCard(
          'Pendientes',
          '${_stats.pendingOrders}',
          Icons.pending,
          Colors.grey,
        ),
        _buildStatCard(
          'En Producción',
          '${_stats.productionOrders}',
          Icons.build,
          Colors.amber,
        ),
        _buildStatCard(
          'Listos',
          '${_stats.readyOrders}',
          Icons.check_circle,
          Colors.teal,
        ),
        _buildStatCard(
          'Entregados',
          '${_stats.deliveredOrders}',
          Icons.local_shipping,
          Colors.indigo,
        ),
      ],
    );
  }
  
  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 12),
            Text(
              value,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              style: Theme.of(context).textTheme.bodyMedium,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildQuickActions() {
    return GridView.count(
      crossAxisCount: 3,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _buildActionButton(
          'Productos',
          Icons.inventory,
          '/products',
          'PRODUCTS',
        ),
        _buildActionButton(
          'Categorías',
          Icons.category,
          '/categories',
          'CATEGORIES',
        ),
        _buildActionButton(
          'Familias',
          Icons.account_tree,
          '/families',
          'FAMILIES',
        ),
        _buildActionButton(
          'Subfamilias',
          Icons.category_outlined,
          '/subfamilies',
          'SUBFAMILIES',
        ),
        _buildActionButton(
          'Promociones',
          Icons.local_offer,
          '/promotions',
          'PROMOTIONS',
        ),
        _buildActionButton(
          'Flyers',
          Icons.image,
          '/flyers',
          'FLYERS',
        ),
        _buildActionButton(
          'Config',
          Icons.settings,
          '/settings',
          'SETTINGS',
        ),
      ],
    );
  }
  
  Widget _buildActionButton(String label, IconData icon, String route, String logName) {
    return Card(
      child: InkWell(
        onTap: () {
          debugPrint("CLICK $logName");
          context.go(route);
        },
        borderRadius: BorderRadius.circular(12),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32),
            const SizedBox(height: 8),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}