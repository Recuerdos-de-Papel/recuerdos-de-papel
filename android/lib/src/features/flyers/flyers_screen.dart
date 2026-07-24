import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/features/flyers/flyers_service.dart';

class FlyersScreen extends ConsumerStatefulWidget {
  const FlyersScreen({super.key});

  @override
  ConsumerState<FlyersScreen> createState() => _FlyersScreenState();
}

class _FlyersScreenState extends ConsumerState<FlyersScreen> {
  bool _isLoading = false;
  List<Flyer> _flyers = [];
  
  @override
  void initState() {
    super.initState();
    _loadFlyers();
  }
  
  Future<void> _loadFlyers() async {
    setState(() => _isLoading = true);
    try {
      final flyersService = ref.read(flyersServiceProvider);
      final flyers = await flyersService.getFlyers();
      setState(() => _flyers = flyers);
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
  
  Future<void> _toggleActive(Flyer flyer) async {
    try {
      final flyersService = ref.read(flyersServiceProvider);
      await flyersService.updateFlyer(flyer.id, {
        'isActive': !flyer.isActive,
      });
      _loadFlyers();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }
  
  Future<void> _deleteFlyer(Flyer flyer) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar Flyer'),
        content: Text('¿Está seguro de eliminar "${flyer.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
    
    if (confirmed == true) {
      try {
        final flyersService = ref.read(flyersServiceProvider);
        await flyersService.deleteFlyer(flyer.id);
        _loadFlyers();
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(e.toString())),
          );
        }
      }
    }
  }
  
  void _showForm({Flyer? flyer}) {
    final _formKey = GlobalKey<FormState>();
    final _titleController = TextEditingController(text: flyer?.title ?? '');
    String? _imageUrl = flyer?.imageUrl;
    bool _isActive = flyer?.isActive ?? true;
    DateTime _startDate = flyer?.startDate ?? DateTime.now();
    DateTime _endDate = flyer?.endDate ?? DateTime.now().add(const Duration(days: 30));
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  flyer == null ? 'Nuevo Flyer' : 'Editar Flyer',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _titleController,
                  decoration: const InputDecoration(labelText: 'Título'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Ingrese el título';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                OutlinedButton.icon(
                  onPressed: () async {
                    final picker = ImagePicker();
                    final pickedFile = await picker.pickImage(
                      source: ImageSource.gallery,
                    );
                    if (pickedFile != null) {
                      // In a real app, upload to Supabase Storage
                      setState(() {
                        _imageUrl = pickedFile.path;
                      });
                    }
                  },
                  icon: const Icon(Icons.image),
                  label: const Text('Seleccionar Imagen'),
                ),
                if (_imageUrl != null)
                  Container(
                    margin: const EdgeInsets.only(top: 8),
                    height: 100,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      image: DecorationImage(
                        image: NetworkImage(_imageUrl!),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                const SizedBox(height: 16),
                ListTile(
                  title: const Text('Fecha Inicio'),
                  subtitle: Text(_startDate.toLocal().toString().split(' ')[0]),
                  trailing: const Icon(Icons.calendar_today),
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _startDate,
                      firstDate: DateTime.now().subtract(const Duration(days: 365)),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (picked != null) {
                      _startDate = picked;
                    }
                  },
                ),
                ListTile(
                  title: const Text('Fecha Fin'),
                  subtitle: Text(_endDate.toLocal().toString().split(' ')[0]),
                  trailing: const Icon(Icons.calendar_today),
                  onTap: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _endDate,
                      firstDate: DateTime.now().subtract(const Duration(days: 365)),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (picked != null) {
                      _endDate = picked;
                    }
                  },
                ),
                SwitchListTile(
                  title: const Text('Activo'),
                  value: _isActive,
                  onChanged: (value) {
                    _isActive = value;
                  },
                ),
                const SizedBox(height: 16),
                FilledButton(
                  onPressed: () async {
                    if (_formKey.currentState!.validate()) {
                      try {
                        final flyersService = ref.read(flyersServiceProvider);
                        if (flyer == null) {
                          await flyersService.createFlyer({
                            'title': _titleController.text,
                            'imageUrl': _imageUrl ?? '',
                            'startDate': _startDate,
                            'endDate': _endDate,
                            'isActive': _isActive,
                          });
                        } else {
                          await flyersService.updateFlyer(flyer.id, {
                            'title': _titleController.text,
                            'imageUrl': _imageUrl ?? '',
                            'startDate': _startDate,
                            'endDate': _endDate,
                            'isActive': _isActive,
                          });
                        }
                        if (mounted) {
                          Navigator.pop(context);
                          _loadFlyers();
                        }
                      } catch (e) {
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(e.toString())),
                          );
                        }
                      }
                    }
                  },
                  child: const Text('Guardar'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flyers'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadFlyers,
              child: ListView.builder(
                itemCount: _flyers.length,
                itemBuilder: (context, index) {
                  final flyer = _flyers[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 4,
                    ),
                    child: ListTile(
                      leading: flyer.imageUrl.isNotEmpty
                          ? Image.network(
                              flyer.imageUrl,
                              width: 50,
                              height: 50,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return const Icon(Icons.image, size: 50);
                              },
                            )
                          : const Icon(Icons.image, size: 50),
                      title: Text(flyer.title),
                      subtitle: Text(
                        '${flyer.startDate.toLocal().toString().split(' ')[0]} - ${flyer.endDate.toLocal().toString().split(' ')[0]}',
                      ),
                      trailing: Switch(
                        value: flyer.isActive,
                        onChanged: (_) => _toggleActive(flyer),
                      ),
                      onTap: () => _showForm(flyer: flyer),
                      onLongPress: () => _deleteFlyer(flyer),
                    ),
                  );
                },
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showForm(),
        child: const Icon(Icons.add),
      ),
    );
  }
}