
import React from 'react';
import { Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minimum_amount?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

interface CouponsTableProps {
  coupons: Coupon[];
  isLoading: boolean;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
}

const CouponsTable = ({ coupons, isLoading, onEdit, onDelete }: CouponsTableProps) => {
  const getCouponTypeLabel = (type: string) => {
    switch (type) {
      case 'free_delivery':
        return 'Free Delivery';
      case 'percentage':
        return 'Percentage Off';
      case 'flat_off':
        return 'Flat Off';
      case 'amount_based':
        return 'Off Over Amount';
      default:
        return type;
    }
  };

  const formatValue = (coupon: Coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}%`;
    } else if (coupon.type === 'free_delivery') {
      return 'Free Delivery';
    } else {
      return `₹${coupon.value}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Min Amount</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Loading coupons...
              </TableCell>
            </TableRow>
          ) : coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No coupons found
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>{getCouponTypeLabel(coupon.type)}</TableCell>
                <TableCell>{formatValue(coupon)}</TableCell>
                <TableCell>
                  {coupon.minimum_amount ? `₹${coupon.minimum_amount}` : '-'}
                </TableCell>
                <TableCell>
                  {coupon.used_count || 0}
                  {coupon.usage_limit ? `/${coupon.usage_limit}` : ''}
                </TableCell>
                <TableCell>
                  {coupon.expires_at 
                    ? new Date(coupon.expires_at).toLocaleDateString()
                    : 'No expiry'
                  }
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    coupon.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {coupon.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(coupon)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(coupon.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash className="w-4 h-4" />
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

export default CouponsTable;
