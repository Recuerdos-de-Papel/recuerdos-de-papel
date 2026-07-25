import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/features/statistics/statistics_service.dart';

class StatisticsScreen extends ConsumerStatefulWidget {
  const StatisticsScreen({super.key});

  @override
  ConsumerState<StatisticsScreen> createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends ConsumerState<StatisticsScreen> {
  bool _isLoading = false;
  Map<String, dynamic> _salesStats = {};
  List<TopProduct> _topProducts = [];
  List<TopCategory> _topCategories = [];
  
  @override
  void initState() {
    super.initState();
    _loadStatistics();
  }
  
  Future<void> _loadStatistics() async {
    setState(() => _isLoading = true);
    try {
      final statisticsService = ref.read(statisticsServiceProvider);
      
      final now = DateTime.now();
      final today = DateTime(now.year, now.month, now.day);
      final weekAgo = today.subtract(const Duration(days: 7));
      final monthAgo = DateTime(now.year, now.month - 1, now.day);
      final yearAgo = DateTime(now.year - 1, now.month, now.day);
      
      final dayStats = await statisticsService.getSalesStats(
        from: today,
        to: now,
      );
      final weekStats = await statisticsService.getSalesStats(
        from: weekAgo,
        to: now,
      );
      final monthStats = await statisticsService.getSalesStats(
        from: monthAgo,
        to: now,
      );
      final yearStats = await statisticsService.getSalesStats(
        from: yearAgo,
        to: now,
      );
      
      final topProducts = await statisticsService.getTopProducts(
        from: weekAgo,
        to: now,
      );
      
      final topCategories = await statisticsService.getTopCategories(
        from: weekAgo,
        to: now,
      );
      
      setState(() {
        _salesStats = {
          'day': dayStats,
          'week': weekStats,
          'month': monthStats,
          'year': yearStats,
        };
        _topProducts = topProducts;
        _topCategories = topCategories;
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: true,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Estadísticas'),
        ),
        body: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
                onRefresh: _loadStatistics,
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Facturación',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 16),
                      _buildBillingGrid(),
                      
                      const SizedBox(height: 24),
                      
                      Text(
                        'Productos Más Vendidos',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 16),
                      _buildTopProductsList(),
                      
                      const SizedBox(height: 24),
                      
                      Text(
                        'Categorías Más Vendidas',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 16),
                      _buildTopCategoriesList(),
                    ],
                  ),
                ),
              ),
      ),
    );
  }
  
  Widget _buildBillingGrid() {
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 16,
      mainAxisSpacing: 16,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        _buildStatCard(
          'Total Día',
          '\$${(_salesStats['day']?['totalSales'] ?? 0).toStringAsFixed(2)}',
          Icons.today,
        ),
        _buildStatCard(
          'Total Semana',
          '\$${(_salesStats['week']?['totalSales'] ?? 0).toStringAsFixed(2)}',
          Icons.view_week,
        ),
        _buildStatCard(
          'Total Mes',
          '\$${(_salesStats['month']?['totalSales'] ?? 0).toStringAsFixed(2)}',
          Icons.calendar_month,
        ),
        _buildStatCard(
          'Total Año',
          '\$${(_salesStats['year']?['totalSales'] ?? 0).toStringAsFixed(2)}',
          Icons.calendar_today,
        ),
      ],
    );
  }
  
  Widget _buildTopProductsList() {
    if (_topProducts.isEmpty) {
      return const Text('No hay datos disponibles');
    }
    
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _topProducts.length,
      itemBuilder: (context, index) {
        final product = _topProducts[index];
        return Card(
          child: ListTile(
            title: Text(product.productName),
            trailing: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('${product.totalQuantity} vendidos'),
                Text(
                  '\$${product.totalRevenue.toStringAsFixed(2)}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
  
  Widget _buildTopCategoriesList() {
    if (_topCategories.isEmpty) {
      return const Text('No hay datos disponibles');
    }
    
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _topCategories.length,
      itemBuilder: (context, index) {
        final category = _topCategories[index];
        return Card(
          child: ListTile(
            title: Text(category.categoryName),
            trailing: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('${category.totalQuantity} vendidos'),
                Text(
                  '\$${category.totalRevenue.toStringAsFixed(2)}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
  
  Widget _buildStatCard(String title, String value, IconData icon) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32),
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
}