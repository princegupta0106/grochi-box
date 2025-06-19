
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CouponForm {
  code: string;
  type: string;
  value: string;
  minimum_amount: string;
  max_discount: string;
  usage_limit: string;
  expires_at: string;
  is_active: boolean;
}

interface CouponsFormProps {
  couponForm: CouponForm;
  setCouponForm: (form: CouponForm) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const CouponsForm = ({ couponForm, setCouponForm, onSubmit, onCancel, isEditing }: CouponsFormProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? "Edit Coupon" : "Add New Coupon"}
      </h3>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code *
            </label>
            <input
              type="text"
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter coupon code"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Type *
            </label>
            <Select
              value={couponForm.type}
              onValueChange={(value) => setCouponForm({ ...couponForm, type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select coupon type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free_delivery">Free Delivery</SelectItem>
                <SelectItem value="percentage">Percentage Off</SelectItem>
                <SelectItem value="flat_off">Flat Off</SelectItem>
                <SelectItem value="amount_based">Off Over Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {couponForm.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
            </label>
            <input
              type="number"
              value={couponForm.value}
              onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder={couponForm.type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Order Amount (₹)
            </label>
            <input
              type="number"
              value={couponForm.minimum_amount}
              onChange={(e) => setCouponForm({ ...couponForm, minimum_amount: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Minimum order amount"
            />
          </div>

          {couponForm.type === 'percentage' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Discount (₹)
              </label>
              <input
                type="number"
                value={couponForm.max_discount}
                onChange={(e) => setCouponForm({ ...couponForm, max_discount: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Maximum discount amount"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usage Limit
            </label>
            <input
              type="number"
              value={couponForm.usage_limit}
              onChange={(e) => setCouponForm({ ...couponForm, usage_limit: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Maximum number of uses"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="date"
              value={couponForm.expires_at}
              onChange={(e) => setCouponForm({ ...couponForm, expires_at: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={couponForm.is_active}
              onChange={(e) => setCouponForm({ ...couponForm, is_active: e.target.checked })}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            {isEditing ? "Update Coupon" : "Add Coupon"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CouponsForm;
