import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/features/settings/settings_service.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _isLoading = false;
  Map<String, Setting> _settings = {};
  
  @override
  void initState() {
    super.initState();
    _loadSettings();
  }
  
  Future<void> _loadSettings() async {
    setState(() => _isLoading = true);
    try {
      final settingsService = ref.read(settingsServiceProvider);
      final settings = await settingsService.getSettings();
      setState(() {
        _settings = {for (var s in settings) s.key: s};
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
  
  Future<void> _updateSetting(String key, String value) async {
    try {
      final settingsService = ref.read(settingsServiceProvider);
      await settingsService.updateSetting(key, value);
      _loadSettings();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }
  
  void _showSettingEditor(String key, String title) {
    final controller = TextEditingController(
      text: _settings[key]?.value ?? '',
    );
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Editar $title'),
        content: TextField(
          controller: controller,
          decoration: InputDecoration(labelText: title),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              _updateSetting(key, controller.text);
              Navigator.pop(context);
            },
            child: const Text('Guardar'),
          ),
        ],
      ),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: true,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Configuración'),
        ),
        body: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  _buildSettingTile(
                    'Mercado Pago',
                    'Alias',
                    'mp_alias',
                  ),
                  _buildSettingTile(
                    'Mercado Pago',
                    'CBU',
                    'mp_cbu',
                  ),
                  _buildSettingTile(
                    'Mercado Pago',
                    'QR',
                    'mp_qr',
                  ),
                  const SizedBox(height: 16),
                  _buildSettingTile(
                    'Costos',
                    'Costo Córdoba',
                    'cost_cordoba',
                  ),
                  _buildSettingTile(
                    'Costos',
                    'Costo Interior',
                    'cost_interior',
                  ),
                  const SizedBox(height: 16),
                  _buildSettingTile(
                    'Producción',
                    'Tiempo Producción',
                    'production_time',
                  ),
                  const SizedBox(height: 16),
                  _buildSettingTile(
                    'Contacto',
                    'WhatsApp',
                    'whatsapp',
                  ),
                  _buildSettingTile(
                    'Contacto',
                    'Instagram',
                    'instagram',
                  ),
                  _buildSettingTile(
                    'Contacto',
                    'Facebook',
                    'facebook',
                  ),
                  _buildSettingTile(
                    'Contacto',
                    'Email',
                    'email',
                  ),
                ],
              ),
      ),
    );
  }
  
  Widget _buildSettingTile(String category, String title, String key) {
    return Card(
      child: ListTile(
        title: Text(title),
        subtitle: Text(_settings[key]?.value ?? 'No configurado'),
        trailing: const Icon(Icons.edit),
        onTap: () => _showSettingEditor(key, title),
      ),
    );
  }
}