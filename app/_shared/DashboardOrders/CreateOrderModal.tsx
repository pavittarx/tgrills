import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { sup } from '@/_sdk/supabase';
import { useProducts } from '@/_store/products';
import { Product } from '@/_types/Product';
import { calculateOrderTotals } from '@/_methods/cart';
import { CartItem, Order } from '@/_types';
import { IndianRupee, Edit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
  existingOrder?: Order;
}

export const Rupee = () => <IndianRupee className='inline' height={16} width={16} />

export function CreateOrderModal({ 
  isOpen, 
  onClose, 
  onOrderCreated,
  existingOrder 
}: CreateOrderModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{product: Product, quantity: number}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState('PENDING');
  const [deliveryFee, setDeliveryFee] = useState(0);

  const { products } = useProducts();

  // Initialize form with existing order data when editing
  useEffect(() => {
    if (existingOrder) {
      setName(existingOrder.name);
      setPhone(existingOrder.phone.toString());
      setAddress(existingOrder.address);
      setOrderStatus(existingOrder.status);
      setDeliveryFee(existingOrder.deliveryFee || 0);

      // Convert existing order items to selected products
      const initialProducts = existingOrder.products.map(orderProduct => {
        const product = products.find(p => p.id === orderProduct.id);
        return product 
          ? { 
              product, 
              quantity: orderProduct.quantity 
            }
          : null;
      }).filter(Boolean) as { product: Product; quantity: number }[];

      setSelectedProducts(initialProducts);
    } else {
      // Reset form for new order
      resetForm();
    }
  }, [existingOrder, products, isOpen]);

  // Form reset utility
  const resetForm = () => {
    setName('');
    setPhone('');
    setAddress('');
    setSelectedProducts([]);
    setOrderStatus('PENDING');
    setDeliveryFee(0);
  };

  const calculateTotals = () => {
    // Convert selected products to cart items
    const cartItems: CartItem[] = selectedProducts.map(item => ({
      id: item.product.id,
      quantity: item.quantity
    }));

    return calculateOrderTotals(cartItems, products, deliveryFee);
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
      deliveryFee,
      total: totals.total,
      status: orderStatus
    };

    try {
      let result;
      if (existingOrder) {
        // Update existing order
        result = await sup
          .from('guest_orders')
          .update(orderData)
          .eq('id', existingOrder.id);
      } else {
        // Create new order
        result = await sup
          .from('guest_orders')
          .insert(orderData)
          .select();
      }

      if (result.error) throw result.error;

      onOrderCreated?.();
      onClose();
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="flex items-center space-x-4">
            <DialogTitle className="flex items-center">
              {existingOrder ? (
                <>
                  <Edit className="mr-2 h-6 w-6 text-primary" />
                  Edit Order
                </>
              ) : (
                'Create New Order'
              )}
            </DialogTitle>
            {existingOrder && (
              <Badge variant="outline" className="uppercase">
                Order #{existingOrder.id}
              </Badge>
            )}
          </div>
          <DialogDescription>
            {existingOrder 
              ? 'Modify the details of the existing order' 
              : 'Fill in customer details and select products for the order'}
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
              <div>
                <Label htmlFor="deliveryFee">Delivery Fee</Label>
                <Input 
                  id="deliveryFee"
                  value={deliveryFee > 0 ? deliveryFee : ''}
                  onChange={(e) => {
                    const fee = Number(e.target.value);
                    if(isNaN(fee)) return;
                    setDeliveryFee(fee);
                  }} 
                  placeholder="Delivery Fee" 
                  type="text"
                />
              </div>
              {existingOrder && (
                <div>
                  <Label htmlFor="status">Order Status</Label>
                  <Select 
                    value={orderStatus}
                    onValueChange={(value) => setOrderStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
              <p className="flex justify-between">
                <span>Delivery Fee:</span>
                <span><Rupee />{deliveryFee.toFixed(2)}</span>
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
            {isSubmitting 
              ? (existingOrder ? 'Updating...' : 'Creating...') 
              : (existingOrder ? 'Update Order' : 'Create Order')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
