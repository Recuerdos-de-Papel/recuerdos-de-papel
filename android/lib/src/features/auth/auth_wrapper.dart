import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/features/auth/auth_service.dart';
import 'package:recuerdos_de_papel_admin/src/features/auth/login_screen.dart';
import 'package:recuerdos_de_papel_admin/src/features/home/home_screen.dart';

class AuthWrapper extends ConsumerStatefulWidget {
  const AuthWrapper({super.key});

  @override
  ConsumerState<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends ConsumerState<AuthWrapper> {
  bool _isLoading = true;
  
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }
  
  Future<void> _checkAuth() async {
    final authService = ref.read(authServiceProvider);
    final isLoggedIn = await authService.isLoggedIn();
    
    if (isLoggedIn) {
      final token = await authService.getToken();
      if (token != null) {
        ref.read(authProvider.notifier).login(
          token,
          '',
          '',
        );
      }
    }
    
    setState(() => _isLoading = false);
  }
  
  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    
    final authState = ref.watch(authProvider);
    
    if (!authState.isAuthenticated) {
      return LoginScreen();
    }
    
    return HomeScreen();
  }
}