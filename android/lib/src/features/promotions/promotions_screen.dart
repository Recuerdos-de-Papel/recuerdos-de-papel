import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/features/promotions/promotions_service.dart';

class PromotionsScreen extends ConsumerStatefulWidget {
  const PromotionsScreen({super.key});

  @override
  ConsumerState<PromotionsScreen> createState() => _PromotionsScreenState();
}

class _PromotionsScreenState extends ConsumerState<PromotionsScreen> {
  bool _isLoading = false;
  List<Promotion> _promotions = [];
  
  @override
  void initState() {
    super.initState();
    _loadPromotions();
  }
  
  Future<void> _loadPromotions() async {
    setState(() => _isLoading = true);
    try {
      final promotionsService = ref.read(promotionsServiceProvider);
      final promotions = await promotionsService.getPromotions();
      setState(() => _promotions = promotions);
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
  
  Future<void> _toggleActive(Promotion promotion) async {
    try {
      final promotionsService = ref.read(promotionsServiceProvider);
      await promotionsService.updatePromotion(promotion.id, {
        'isActive': !promotion.isActive,
      });
      _loadPromotions();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }
  
  Future<void> _deletePromotion(Promotion promotion) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar Promoción'),
        content: Text('¿Está seguro de eliminar "${promotion.title}"?'),
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
        final promotionsService = ref.read(promotionsServiceProvider);
        await promotionsService.deletePromotion(promotion.id);
        _loadPromotions();
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(e.toString())),
          );
        }
      }
    }
  }
  
  void _showForm({Promotion? promotion}) {
    final _formKey = GlobalKey<FormState>();
    final _titleController = TextEditingController(text: promotion?.title ?? '');
    final _descriptionController = TextEditingController(
      text: promotion?.description ?? '',
    );
    final _discountController = TextEditingController(
      text: promotion?.discount.toString() ?? '',
    );
    final _codeController = TextEditingController(text: promotion?.code ?? '');
    bool _isActive = promotion?.isActive ?? true;
    DateTime _startDate = promotion?.startDate ?? DateTime.now();
    DateTime _endDate = promotion?.endDate ?? DateTime.now().add(const Duration(days: 30));
    
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
                  promotion == null ? 'Nueva Promoción' : 'Editar Promoción',
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
                TextFormField(
                  controller: _descriptionController,
                  decoration: const InputDecoration(labelText: 'Descripción'),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _discountController,
                  decoration: const InputDecoration(labelText: 'Descuento (%)'),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Ingrese el descuento';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _codeController,
                  decoration: const InputDecoration(labelText: 'Código'),
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
                        final promotionsService = ref.read(promotionsServiceProvider);
                        if (promotion == null) {
                          await promotionsService.createPromotion({
                            'title': _titleController.text,
                            'description': _descriptionController.text,
                            'discount': double.parse(_discountController.text),
                            'code': _codeController.text,
                            'startDate': _startDate,
                            'endDate': _endDate,
                            'isActive': _isActive,
                          });
                        } else {
                          await promotionsService.updatePromotion(promotion.id, {
                            'title': _titleController.text,
                            'description': _descriptionController.text,
                            'discount': double.parse(_discountController.text),
                            'code': _codeController.text,
                            'startDate': _startDate,
                            'endDate': _endDate,
                            'isActive': _isActive,
                          });
                        }
                        if (mounted) {
                          Navigator.pop(context);
                          _loadPromotions();
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
        title: const Text('Promociones'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadPromotions,
              child: ListView.builder(
                itemCount: _promotions.length,
                itemBuilder: (context, index) {
                  final promotion = _promotions[index];
                  return Card(
                    margin: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 4,
                    ),
                    child: ListTile(
                      title: Text(promotion.title),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${promotion.discount}% de descuento'),
                          Text(
                            '${promotion.startDate.toLocal().toString().split(' ')[0]} - ${promotion.endDate.toLocal().toString().split(' ')[0]}',
                          ),
                        ],
                      ),
                      trailing: Switch(
                        value: promotion.isActive,
                        onChanged: (_) => _toggleActive(promotion),
                      ),
                      onTap: () => _showForm(promotion: promotion),
                      onLongPress: () => _deletePromotion(promotion),
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