import 'package:flutter_test/flutter_test.dart';
import 'package:recuerdos_de_papel_admin/src/core/providers/providers.dart';

void main() {
  test('Product model creation', () {
    final product = Product(
      id: '1',
      subfamilyId: '1',
      name: 'Test Product',
      price: 100.0,
      webPrice: 90.0,
    );
    
    expect(product.id, '1');
    expect(product.name, 'Test Product');
    expect(product.price, 100.0);
  });
  
  test('Category model creation', () {
    final category = Category(
      id: '1',
      name: 'Test Category',
    );
    
    expect(category.id, '1');
    expect(category.name, 'Test Category');
  });
  
  test('Order model creation', () {
    final order = AdminOrder(
      id: '1',
      status: 'pending',
      deliveryMethod: 'delivery',
      subtotal: 100.0,
      discount: 0.0,
      total: 100.0,
      shippingCost: 0.0,
      customerName: 'Test Customer',
      customerPhone: '123456789',
      customerEmail: 'test@test.com',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    
    expect(order.id, '1');
    expect(order.status, 'pending');
    expect(order.customerName, 'Test Customer');
  });
}