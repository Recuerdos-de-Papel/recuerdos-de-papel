import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';

class OfflineSyncService {
  final ApiClient apiClient;
  
  OfflineSyncService(this.apiClient);
  
  Future<void> syncPendingActions(List<PendingAction> actions) async {
    for (final action in actions) {
      try {
        switch (action.type) {
          case 'POST':
            await apiClient.dio.post(action.endpoint, data: action.data);
            break;
          case 'PUT':
            await apiClient.dio.put(action.endpoint, data: action.data);
            break;
          case 'DELETE':
            await apiClient.dio.delete(action.endpoint);
            break;
        }
      } catch (e) {
        // Log error but continue with other actions
        debugPrint('Error syncing action ${action.id}: $e');
      }
    }
  }
}

// Provider for offline sync
final offlineSyncProvider = Provider<OfflineSyncService>((ref) {
  return OfflineSyncService(ApiClient());
});

// Connectivity listener
class ConnectivityListener extends ConsumerWidget {
  final Widget child;
  
  const ConnectivityListener({super.key, required this.child});
  
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // In a real app, use connectivity_plus to listen for connectivity changes
    // and trigger sync when connection is restored
    return child;
  }
}