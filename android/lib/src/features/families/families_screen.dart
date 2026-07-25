import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:recuerdos_de_papel_admin/src/core/network/api_client.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/features/categories/categories_service.dart';

class FamiliesScreen extends ConsumerStatefulWidget {
  const FamiliesScreen({super.key});

  @override
  ConsumerState<FamiliesScreen> createState() => _FamiliesScreenState();
}

class _FamiliesScreenState extends ConsumerState<FamiliesScreen> {
  bool _isLoading = false;
  List<ProductFamily> _families = [];

  @override
  void initState() {
    super.initState();
    _loadFamilies();
  }

  Future<void> _loadFamilies() async {
    setState(() => _isLoading = true);
    try {
      final familiesService = ref.read(familiesServiceProvider);
      final families = await familiesService.getFamilies();
      setState(() => _families = families);
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

  Future<void> _toggleActive(ProductFamily family) async {
    try {
      final familiesService = ref.read(familiesServiceProvider);
      await familiesService.updateFamily(family.id, {
        'isActive': !family.isActive,
      });
      _loadFamilies();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Future<void> _deleteFamily(ProductFamily family) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar Familia'),
        content: Text('¿Está seguro de eliminar "${family.name}"?'),
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
        final familiesService = ref.read(familiesServiceProvider);
        await familiesService.deleteFamily(family.id);
        _loadFamilies();
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(e.toString())),
          );
        }
      }
    }
  }

  void _showCreateForm() {
    _showForm(null);
  }

  void _showEditForm(ProductFamily family) {
    _showForm(family);
  }

  void _showForm(ProductFamily? family) {
    final formKey = GlobalKey<FormState>();
    final nameController = TextEditingController(text: family?.name ?? '');
    final descriptionController = TextEditingController(text: family?.description ?? '');

    String? selectedCategoryId = family?.categoryId;
    bool activeValue = family?.isActive ?? true;
    List<Category> categories = [];
    bool isLoadingCategories = true;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            // Cargar categorías si no se han cargado
            if (isLoadingCategories) {
              ref.read(categoriesServiceProvider).getCategories().then((cats) {
                setSheetState(() {
                  categories = cats;
                  isLoadingCategories = false;
                });
              }).catchError((_) {
                setSheetState(() => isLoadingCategories = false);
              });
            }

            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom,
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Form(
                  key: formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        family == null ? 'Nueva Familia' : 'Editar Familia',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 16),
                      // Dropdown de Categoría
                      isLoadingCategories
                          ? const Center(child: CircularProgressIndicator())
                          : DropdownButtonFormField<String>(
                              value: selectedCategoryId,
                              decoration: const InputDecoration(
                                labelText: 'Categoría (Obligatorio)',
                              ),
                              items: categories.map((c) {
                                return DropdownMenuItem(
                                  value: c.id,
                                  child: Text(c.name),
                                );
                              }).toList(),
                              onChanged: (value) {
                                setSheetState(() => selectedCategoryId = value);
                              },
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Seleccione una categoría';
                                }
                                return null;
                              },
                            ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: nameController,
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
                        controller: descriptionController,
                        decoration: const InputDecoration(labelText: 'Descripción'),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 16),
                      SwitchListTile(
                        title: const Text('Activo'),
                        value: activeValue,
                        onChanged: (value) {
                          setSheetState(() => activeValue = value);
                        },
                      ),
                      const SizedBox(height: 16),
                      FilledButton(
                        onPressed: () async {
                          if (formKey.currentState!.validate()) {
                            try {
                              final familiesService = ref.read(familiesServiceProvider);
                              if (family == null) {
                                await familiesService.createFamily({
                                  'name': nameController.text,
                                  'description': descriptionController.text,
                                  'categoryId': selectedCategoryId,
                                  'isActive': activeValue,
                                });
                              } else {
                                await familiesService.updateFamily(family.id, {
                                  'name': nameController.text,
                                  'description': descriptionController.text,
                                  'categoryId': selectedCategoryId,
                                  'isActive': activeValue,
                                });
                              }
                              if (context.mounted) {
                                Navigator.pop(context);
                                _loadFamilies();
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Familias'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadFamilies,
              child: ListView.builder(
                itemCount: _families.length,
                itemBuilder: (context, index) {
                  final family = _families[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 4,
                    ),
                    child: ListTile(
                      title: Text(family.name),
                      subtitle: family.description != null
                          ? Text(family.description!)
                          : null,
                      trailing: Switch(
                        value: family.isActive,
                        onChanged: (_) => _toggleActive(family),
                      ),
                      onTap: () => _showEditForm(family),
                      onLongPress: () => _deleteFamily(family),
                    ),
                  );
                },
              ),
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showCreateForm,
        child: const Icon(Icons.add),
      ),
    );
  }
}