import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { sup } from '@/_sdk/supabase';
import { useProducts } from '@/_store/products';
import { Product } from '@/_types/Product';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { calculateOrderTotals } from '@/_methods/cart';
import { CartItem } from '@/_types';
import { IndianRupee } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
}

export const Rupee = () => <IndianRupee className='inline' height={16} width={16} />

export function CreateOrderModal({ 
  isOpen, 
  onClose, 
  onOrderCreated 
}: CreateOrderModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{product: Product, quantity: number}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { products } = useProducts();

  const calculateTotals = () => {
    // Convert selected products to cart items
    const cartItems: CartItem[] = selectedProducts.map(item => ({
      id: item.product.id,
      quantity: item.quantity
    }));

    return calculateOrderTotals(cartItems, products);
  };

  const handleProductSelect = (product: Product) => {
    const existingProductIndex = selectedProducts.findIndex(item => item.product.id === product.id);
    
    if (existingProductIndex > -1) {
      // Remove if already selected
      const updatedProducts = [...selectedProducts];
      updatedProducts.splice(existingProductIndex, 1);
      setSelectedProducts(updatedProducts);
    } else {
      // Add with default quantity
      setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (product: Product, quantity: number) => {
    const updatedProducts = selectedProducts.map(item => 
      item.product.id === product.id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = async () => {
    if (!name || !phone || !address || selectedProducts.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const totals = calculateTotals();

    const orderData = {
      name,
      phone,
      address,
      products: selectedProducts.map(item => ({
        id: item.product.id,
        quantity: item.quantity,
        name: item.product.name,
        price: item.product.price
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      taxes: totals.taxes,
      total: totals.total,
      status: 'PENDING'
    };

    const { error } = await sup
      .from('guest_orders')
      .insert(orderData)
      .select();

    setIsSubmitting(false);

    if (error) {
      console.error('Error creating order:', error);
      return;
    }

    onOrderCreated?.();
    onClose();
  };

  const isFormValid = name.trim() !== '' && 
    phone.trim() !== '' && 
    address.trim() !== '' &&
    selectedProducts.length > 0;

  const totals = calculateTotals();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Fill in customer details and select products for the order
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Customer Name" 
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="Phone Number" 
                />
              </div>
              <div>
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea 
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full delivery address"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Products</h3>
            <ScrollArea className="h-[300px] border rounded-md p-2">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center justify-between mb-2 p-2 hover:bg-gray-100 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="checkbox" 
                      className="h-4 w-4"
                      checked={selectedProducts.some(item => item.product.id === product.id)}
                      onChange={() => handleProductSelect(product)}
                    />
                    <Label>{product.name} - <Rupee />{product.discount || product.price}</Label>
                  </div>
                  {selectedProducts.find(item => item.product.id === product.id) && (
                    <Select 
                      value={selectedProducts.find(item => item.product.id === product.id)?.quantity.toString()} 
                      onValueChange={(value) => handleQuantityChange(product, parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="Qty" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        {/* Order Summary */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span><Rupee/> {totals.subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Discount:</span>
                <span><Rupee /> {totals.discount.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Taxes:</span>
                <span><Rupee />{totals.taxes.toFixed(2)}</span>
              </p>
              <p className="flex justify-between font-bold text-lg mt-2">
                <span>Total:</span>
                <span><Rupee />{totals.total.toFixed(2)}</span>
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
