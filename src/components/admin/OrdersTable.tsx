
import React from 'react';
import { Eye, Settings } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  profiles?: {
    name: string;
    email: string;
  };
  order_items?: any[];
}

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onViewDetails: (orderId: string) => void;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}

const OrdersTable = ({ orders, isLoading, onViewDetails, onStatusUpdate }: OrdersTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'preparing':
        return 'bg-purple-100 text-purple-700';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                Loading orders...
              </TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No orders found
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.profiles?.name}</p>
                    <p className="text-sm text-gray-500">{order.profiles?.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {order.order_items?.length || 0} items
                </TableCell>
                <TableCell className="font-medium">
                  ₹{parseFloat(order.total_amount.toString())}
                </TableCell>
                <TableCell>
                  <Select
                    value={order.status}
                    onValueChange={(value) => onStatusUpdate(order.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewDetails(order.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
