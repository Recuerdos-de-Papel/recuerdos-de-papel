import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/features/auth/auth_service.dart';

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
    // Will be implemented to fetch from API
    setState(() => _isLoading = false);
  }
  
  Future<void> _logout() async {
    final authService = ref.read(authServiceProvider);
    await authService.logout();
    ref.read(authProvider.notifier).logout();
    
    if (mounted) {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    
    return Scaffold(
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
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        onDestinationSelected: (index) {
          switch (index) {
            case 0:
              Navigator.pushReplacementNamed(context, '/home');
              break;
            case 1:
              Navigator.pushNamed(context, '/products');
              break;
            case 2:
              Navigator.pushNamed(context, '/orders');
              break;
            case 3:
              Navigator.pushNamed(context, '/settings');
              break;
            case 4:
              Navigator.pushNamed(context, '/statistics');
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
        ),
        _buildActionButton(
          'Categorías',
          Icons.category,
          '/categories',
        ),
        _buildActionButton(
          'Subfamilias',
          Icons.category_outlined,
          '/subfamilies',
        ),
        _buildActionButton(
          'Promociones',
          Icons.local_offer,
          '/promotions',
        ),
        _buildActionButton(
          'Flyers',
          Icons.image,
          '/flyers',
        ),
        _buildActionButton(
          'Config',
          Icons.settings,
          '/settings',
        ),
      ],
    );
  }
  
  Widget _buildActionButton(String label, IconData icon, String route) {
    return Card(
      child: InkWell(
        onTap: () => Navigator.pushNamed(context, route),
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