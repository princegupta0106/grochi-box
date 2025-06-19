
import React from 'react';
import { Button } from "@/components/ui/button";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  weight: string;
  category: string;
  sub_category: string;
  minimum_order_qty: string;
  images: string;
  is_featured_today: boolean;
}

interface ProductFormProps {
  productForm: ProductFormData;
  setProductForm: (form: ProductFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ProductForm = ({ productForm, setProductForm, onSubmit, onCancel, isEditing }: ProductFormProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h3>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={productForm.name}
          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={productForm.category}
          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2"
          required
        />
        <textarea
          placeholder="Description"
          value={productForm.description}
          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2 col-span-2"
          rows={3}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={productForm.price}
          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2"
          required
        />
        <input
          type="text"
          placeholder="Weight (e.g., 1kg, 500g)"
          value={productForm.weight}
          onChange={(e) => setProductForm({...productForm, weight: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="text"
          placeholder="Sub Category"
          value={productForm.sub_category}
          onChange={(e) => setProductForm({...productForm, sub_category: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="number"
          placeholder="Minimum Order Quantity"
          value={productForm.minimum_order_qty}
          onChange={(e) => setProductForm({...productForm, minimum_order_qty: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        <input
          type="text"
          placeholder="Image URLs (comma separated)"
          value={productForm.images}
          onChange={(e) => setProductForm({...productForm, images: e.target.value})}
          className="border border-gray-300 rounded-lg px-3 py-2 col-span-2"
        />
        <label className="flex items-center gap-2 col-span-2">
          <input
            type="checkbox"
            checked={productForm.is_featured_today}
            onChange={(e) => setProductForm({...productForm, is_featured_today: e.target.checked})}
          />
          Featured Today
        </label>
        <div className="col-span-2 flex gap-2">
          <Button type="submit" className="bg-green-500 hover:bg-green-600">
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
