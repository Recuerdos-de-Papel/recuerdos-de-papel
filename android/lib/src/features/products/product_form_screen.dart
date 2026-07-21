import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';
import 'package:recuerdos_de_papel_admin/src/features/products/products_service.dart';

class ProductFormScreen extends ConsumerStatefulWidget {
  final Product? product;
  
  const ProductFormScreen({super.key, this.product});
  
  @override
  ConsumerState<ProductFormScreen> createState() => _ProductFormScreenState();
}

class _ProductFormScreenState extends ConsumerState<ProductFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _codeController;
  late final TextEditingController _descriptionController;
  late final TextEditingController _priceController;
  late final TextEditingController _webPriceController;
  late final TextEditingController _costController;
  late final TextEditingController _stockController;
  
  String? _selectedSubfamilyId;
  bool _isOffer = false;
  bool _isActive = true;
  String _status = 'available';
  List<String> _images = [];
  bool _isLoading = false;
  
  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.product?.name ?? '');
    _codeController = TextEditingController(text: widget.product?.code ?? '');
    _descriptionController = TextEditingController(
      text: widget.product?.description ?? '',
    );
    _priceController = TextEditingController(
      text: widget.product?.price.toString() ?? '',
    );
    _webPriceController = TextEditingController(
      text: widget.product?.webPrice.toString() ?? '',
    );
    _costController = TextEditingController(
      text: widget.product?.cost?.toString() ?? '',
    );
    _stockController = TextEditingController(
      text: widget.product?.stock.toString() ?? '0',
    );
    _selectedSubfamilyId = widget.product?.subfamilyId;
    _isOffer = widget.product?.isOffer ?? false;
    _isActive = widget.product?.isActive ?? true;
    _status = widget.product?.status ?? 'available';
    _images = widget.product?.images ?? [];
  }
  
  Future<void> _pickImages() async {
    final picker = ImagePicker();
    final pickedFiles = await picker.pickMultiImage();
    
    if (pickedFiles.isNotEmpty) {
      setState(() {
        _images.addAll(pickedFiles.map((e) => e.path).toList());
      });
    }
  }
  
  Future<void> _saveProduct() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);
    
    try {
      final productsService = ref.read(productsServiceProvider);
      
      final data = {
        'name': _nameController.text,
        'code': _codeController.text,
        'description': _descriptionController.text,
        'price': double.parse(_priceController.text),
        'webPrice': double.parse(_webPriceController.text),
        'cost': _costController.text.isNotEmpty 
            ? double.parse(_costController.text) 
            : null,
        'stock': int.parse(_stockController.text),
        'subfamilyId': _selectedSubfamilyId,
        'isOffer': _isOffer,
        'isActive': _isActive,
        'status': _status,
        'images': _images,
      };
      
      if (widget.product == null) {
        await productsService.createProduct(data);
      } else {
        await productsService.updateProduct(widget.product!.id, data);
      }
      
      if (mounted) {
        Navigator.pop(context);
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
  
  @override
  void dispose() {
    _nameController.dispose();
    _codeController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _webPriceController.dispose();
    _costController.dispose();
    _stockController.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.product == null ? 'Nuevo Producto' : 'Editar Producto'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Images Section
                    Text(
                      'Imágenes',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    _buildImagesSection(),
                    
                    const SizedBox(height: 16),
                    
                    // Basic Info
                    TextFormField(
                      controller: _nameController,
                      decoration: const InputDecoration(
                        labelText: 'Nombre',
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Ingrese el nombre';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    
                    TextFormField(
                      controller: _codeController,
                      decoration: const InputDecoration(
                        labelText: 'Código',
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    TextFormField(
                      controller: _descriptionController,
                      decoration: const InputDecoration(
                        labelText: 'Descripción',
                      ),
                      maxLines: 3,
                    ),
                    const SizedBox(height: 16),
                    
                    // Prices
                    Text(
                      'Precios',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    
                    TextFormField(
                      controller: _priceController,
                      decoration: const InputDecoration(
                        labelText: 'Precio Normal',
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Ingrese el precio';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    
                    TextFormField(
                      controller: _webPriceController,
                      decoration: const InputDecoration(
                        labelText: 'Precio Web',
                      ),
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 16),
                    
                    TextFormField(
                      controller: _costController,
                      decoration: const InputDecoration(
                        labelText: 'Costo',
                      ),
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 16),
                    
                    TextFormField(
                      controller: _stockController,
                      decoration: const InputDecoration(
                        labelText: 'Stock',
                      ),
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 16),
                    
                    // Status
                    Text(
                      'Estado',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 8),
                    
                    SegmentedButton<String>(
                      segments: const [
                        ButtonSegment(
                          value: 'available',
                          label: Text('Disponible'),
                          icon: Icon(Icons.check),
                        ),
                        ButtonSegment(
                          value: 'in_production',
                          label: Text('Producción'),
                          icon: Icon(Icons.build),
                        ),
                        ButtonSegment(
                          value: 'out_of_stock',
                          label: Text('Agotado'),
                          icon: Icon(Icons.close),
                        ),
                      ],
                      selected: {_status},
                      onSelectionChanged: (values) {
                        setState(() => _status = values.first);
                      },
                    ),
                    const SizedBox(height: 16),
                    
                    // Switches
                    SwitchListTile(
                      title: const Text('Activo'),
                      value: _isActive,
                      onChanged: (value) {
                        setState(() => _isActive = value);
                      },
                    ),
                    SwitchListTile(
                      title: const Text('En Oferta'),
                      value: _isOffer,
                      onChanged: (value) {
                        setState(() => _isOffer = value);
                      },
                    ),
                    
                    const SizedBox(height: 24),
                    
                    FilledButton(
                      onPressed: _saveProduct,
                      child: const Text('Guardar'),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
  
  Widget _buildImagesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (_images.isNotEmpty)
          SizedBox(
            height: 100,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _images.length,
              itemBuilder: (context, index) {
                return Stack(
                  children: [
                    Container(
                      margin: const EdgeInsets.only(right: 8),
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        image: DecorationImage(
                          image: NetworkImage(_images[index]),
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    Positioned(
                      right: 0,
                      top: 0,
                      child: IconButton(
                        icon: const Icon(Icons.close, color: Colors.red),
                        onPressed: () {
                          setState(() {
                            _images.removeAt(index);
                          });
                        },
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        OutlinedButton.icon(
          onPressed: _pickImages,
          icon: const Icon(Icons.add_photo_alternate),
          label: const Text('Agregar Imágenes'),
        ),
      ],
    );
  }
}