import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/features/subfamilies/subfamilies_service.dart';
import 'package:recuerdos_de_papel_admin/src/features/families/families_service.dart';


class SubfamiliesScreen extends ConsumerStatefulWidget {
  const SubfamiliesScreen({super.key});

  @override
  ConsumerState<SubfamiliesScreen> createState() => _SubfamiliesScreenState();
}

class _SubfamiliesScreenState extends ConsumerState<SubfamiliesScreen> {
  bool _isLoading = false;
  List<Subfamily> _subfamilies = [];
  
  @override
  void initState() {
    super.initState();
    _loadSubfamilies();
  }
  
  Future<void> _loadSubfamilies() async {
    setState(() => _isLoading = true);
    try {
      final subfamiliesService = ref.read(subfamiliesServiceProvider);
      final subfamilies = await subfamiliesService.getSubfamilies();
      if (mounted) {
        setState(() => _subfamilies = subfamilies);
      }
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
  
  Future<void> _toggleActive(Subfamily subfamily) async {
    try {
      final subfamiliesService = ref.read(subfamiliesServiceProvider);
      await subfamiliesService.updateSubfamily(subfamily.id, {
        'isActive': !subfamily.isActive,
      });
      _loadSubfamilies();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }
  
  Future<void> _deleteSubfamily(Subfamily subfamily) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar Subfamilia'),
        content: Text('¿Está seguro de eliminar "${subfamily.name}"?'),
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
        final subfamiliesService = ref.read(subfamiliesServiceProvider);
        await subfamiliesService.deleteSubfamily(subfamily.id);
        _loadSubfamilies();
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(e.toString())),
          );
        }
      }
    }
  }
  
  void _showForm({Subfamily? subfamily}) {
    final _formKey = GlobalKey<FormState>();
    final _nameController = TextEditingController(text: subfamily?.name ?? '');
    final _descriptionController = TextEditingController(
      text: subfamily?.description ?? '',
    );
    String? _selectedFamilyId = subfamily?.familyId;
    bool _isActive = subfamily?.isActive ?? true;
    List<ProductFamily> _families = [];
    bool _isLoadingFamilies = true;
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            // Cargar familias si no se han cargado
            if (_isLoadingFamilies) {
              ref.read(familiesServiceProvider).getFamilies().then((families) {
                setSheetState(() {
                  _families = families;
                  _isLoadingFamilies = false;
                });
              }).catchError((_) {
                setSheetState(() => _isLoadingFamilies = false);
              });
            }

            return Padding(
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
                        subfamily == null ? 'Nueva Subfamilia' : 'Editar Subfamilia',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _nameController,
                        decoration: const InputDecoration(labelText: 'Nombre'),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Ingrese el nombre';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _descriptionController,
                        decoration: const InputDecoration(labelText: 'Descripción'),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 16),
                      // Dropdown de Familia
                      _isLoadingFamilies
                          ? const Center(child: CircularProgressIndicator())
                          : DropdownButtonFormField<String>(
                              value: _selectedFamilyId,
                              decoration: const InputDecoration(
                                labelText: 'Familia (Obligatorio)',
                              ),
                              items: _families.map((f) {
                                return DropdownMenuItem(
                                  value: f.id,
                                  child: Text(f.name),
                                );
                              }).toList(),
                              onChanged: (value) {
                                setSheetState(() => _selectedFamilyId = value);
                              },
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Seleccione una familia';
                                }
                                return null;
                              },
                            ),
                      const SizedBox(height: 16),
                      SwitchListTile(
                        title: const Text('Activo'),
                        value: _isActive,
                        onChanged: (value) {
                          setSheetState(() => _isActive = value);
                        },
                      ),
                      const SizedBox(height: 16),
                      FilledButton(
                        onPressed: () async {
                          if (_formKey.currentState!.validate()) {
                            try {
                              final subfamiliesService = ref.read(subfamiliesServiceProvider);
                              if (subfamily == null) {
                                await subfamiliesService.createSubfamily({
                                  'name': _nameController.text,
                                  'description': _descriptionController.text,
                                  'familyId': _selectedFamilyId,
                                  'isActive': _isActive,
                                });
                              } else {
                                await subfamiliesService.updateSubfamily(subfamily.id, {
                                  'name': _nameController.text,
                                  'description': _descriptionController.text,
                                  'familyId': _selectedFamilyId,
                                  'isActive': _isActive,
                                });
                              }
                              if (context.mounted) {
                                Navigator.pop(context);
                                _loadSubfamilies();
                              }
                            } catch (e) {
                              if (context.mounted) {
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
            );
          },
        );
      },
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: true,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Subfamilias'),
        ),
        body: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
                onRefresh: _loadSubfamilies,
                child: ListView.builder(
                  itemCount: _subfamilies.length,
                  itemBuilder: (context, index) {
                    final subfamily = _subfamilies[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 4,
                      ),
                      child: ListTile(
                        title: Text(subfamily.name),
                        subtitle: subfamily.description != null
                            ? Text(subfamily.description!)
                            : null,
                        trailing: Switch(
                          value: subfamily.isActive,
                          onChanged: (_) => _toggleActive(subfamily),
                        ),
                        onTap: () => _showForm(subfamily: subfamily),
                        onLongPress: () => _deleteSubfamily(subfamily),
                      ),
                    );
                  },
                ),
              ),
        floatingActionButton: FloatingActionButton(
          onPressed: () => _showForm(),
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
}