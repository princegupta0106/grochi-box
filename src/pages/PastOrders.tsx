
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  total_amount: number;
  delivery_fee: number;
  delivery_address: string;
  status: string;
  created_at: string;
  order_items?: {
    quantity: number;
    unit_price: number;
    total_price: number;
    products?: {
      name: string;
      images: string[];
    };
  }[];
}

const PastOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            quantity,
            unit_price,
            total_price,
            products (
              name,
              images
            )
          )
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load past orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your orders</p>
          <Link to="/auth" className="text-green-600 hover:text-green-700">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 flex items-center gap-3">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-800">Past Orders</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No orders yet</p>
            <Link
              to="/"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-800">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Items: {order.order_items?.length || 0}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Delivered to: {order.delivery_address}
                    </p>
                    <p className="font-semibold text-gray-800">
                      ₹{order.total_amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastOrders;
