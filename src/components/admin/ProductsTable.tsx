
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

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images?: string[];
  is_active: boolean;
}

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductsTable = ({ products, isLoading, onEdit, onDelete }: ProductsTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Loading products...
              </TableCell>
            </TableRow>
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLDivElement;
                        if (fallback) {
                          fallback.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-2xl" style={{ display: product.images?.[0] ? 'none' : 'flex' }}>
                    🛒
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="capitalize">{product.category}</TableCell>
                <TableCell>₹{parseFloat(product.price.toString())}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(product.id)}
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

export default ProductsTable;
