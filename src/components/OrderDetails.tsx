
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OrderDetailsProps {
  orderId: string;
  onClose: () => void;
}

const OrderDetails = ({ orderId, onClose }: OrderDetailsProps) => {
  const { data: order, isLoading } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles!orders_user_id_fkey(name, email, phone_number),
          order_items(
            *,
            products(name, images, category)
          )
        `)
        .eq("id", orderId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-center mt-2">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Order ID:</span> #{order.id.slice(0, 8)}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs capitalize ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </p>
                <p><span className="font-medium">Payment Method:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs capitalize ${
                    order.payment_method === 'cod' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Prepaid'}
                  </span>
                </p>
                <p><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
                <p><span className="font-medium">Total Amount:</span> ₹{parseFloat(order.total_amount.toString())}</p>
                <p><span className="font-medium">Delivery Fee:</span> ₹{parseFloat(order.delivery_fee?.toString() || '0')}</p>
                {order.order_location && (
                  <p><span className="font-medium">Order Location:</span> {order.order_location}</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Name:</span> {order.profiles?.name}</p>
                <p><span className="font-medium">Email:</span> {order.profiles?.email}</p>
                <p><span className="font-medium">Phone:</span> {order.phone_number}</p>
                <p><span className="font-medium">Delivery Address:</span> {order.delivery_address}</p>
                <p><span className="font-medium">Pincode:</span> {order.delivery_pincode}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.order_items?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                  {item.products?.images?.[0] ? (
                    <img 
                      src={item.products.images[0]} 
                      alt={item.products.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLDivElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl" style={{ display: item.products?.images?.[0] ? 'none' : 'flex' }}>
                    🛒
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.products?.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{item.products?.category}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Qty: {item.quantity} × ₹{parseFloat(item.unit_price.toString())}</span>
                      </div>
                      <div className="font-medium">
                        ₹{parseFloat(item.total_price.toString())}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
