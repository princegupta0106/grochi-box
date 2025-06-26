
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductVariant {
  id?: string;
  weight: string;
  price: string;
  stock_quantity: string;
}

interface ProductFormProps {
  productForm: {
    name: string;
    description: string;
    price: string;
    weight: string;
    category: string;
    sub_category: string;
    minimum_order_qty: string;
    images: string;
    is_featured_today: boolean;
  };
  setProductForm: React.Dispatch<React.SetStateAction<{
    name: string;
    description: string;
    price: string;
    weight: string;
    category: string;
    sub_category: string;
    minimum_order_qty: string;
    images: string;
    is_featured_today: boolean;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const ProductForm = ({ productForm, setProductForm, onSubmit, onCancel, isEditing }: ProductFormProps) => {
  const [uploading, setUploading] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([
    { weight: '', price: '', stock_quantity: '0' }
  ]);
  const { toast } = useToast();

  const uploadedImages = productForm.images ? productForm.images.split(',').map(img => img.trim()).filter(img => img) : [];

  const addVariant = () => {
    setVariants([...variants, { weight: '', price: '', stock_quantity: '0' }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string) => {
    const updated = variants.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    );
    setVariants(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        return data.publicUrl;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      const currentImages = uploadedImages;
      const allImages = [...currentImages, ...newImageUrls];

      setProductForm(prev => ({
        ...prev,
        images: allImages.join(', ')
      }));

      toast({
        title: "Success",
        description: `${files.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setProductForm(prev => ({
      ...prev,
      images: updatedImages.join(', ')
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h3>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={productForm.name}
              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={productForm.category}
              onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="sub_category">Sub Category</Label>
            <Input
              id="sub_category"
              value={productForm.sub_category}
              onChange={(e) => setProductForm(prev => ({ ...prev, sub_category: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="minimum_order_qty">Minimum Order Quantity</Label>
            <Input
              id="minimum_order_qty"
              type="number"
              value={productForm.minimum_order_qty}
              onChange={(e) => setProductForm(prev => ({ ...prev, minimum_order_qty: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={productForm.description}
            onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Product Variants */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Product Variants</Label>
            <Button type="button" onClick={addVariant} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Variant
            </Button>
          </div>
          
          {variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-2 p-3 border rounded">
              <div>
                <Label className="text-xs">Weight/Size</Label>
                <Input
                  placeholder="e.g., 500g, 1kg"
                  value={variant.weight}
                  onChange={(e) => updateVariant(index, 'weight', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Price (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, 'price', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Stock</Label>
                <Input
                  type="number"
                  value={variant.stock_quantity}
                  onChange={(e) => updateVariant(index, 'stock_quantity', e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={() => removeVariant(index)}
                  size="sm"
                  variant="outline"
                  disabled={variants.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <Label htmlFor="images">Product Images</Label>
          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {uploadedImages.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Product ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_featured_today"
            checked={productForm.is_featured_today}
            onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, is_featured_today: checked }))}
          />
          <Label htmlFor="is_featured_today">Featured Today</Label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : isEditing ? "Update Product" : "Add Product"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
