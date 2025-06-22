import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OrderDetails from "@/components/OrderDetails";
import ProductForm from "@/components/admin/ProductForm";
import ProductsTable from "@/components/admin/ProductsTable";
import OrdersTable from "@/components/admin/OrdersTable";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import CouponsForm from "@/components/admin/CouponsForm";
import CouponsTable from "@/components/admin/CouponsTable";
import BannerForm from "@/components/admin/BannerForm";
import BannerTable from "@/components/admin/BannerTable";
import DashboardTab from "@/components/admin/DashboardTab";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "coupons" | "banners" | "locations">("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<string | null>(null);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    weight: "",
    category: "",
    sub_category: "",
    minimum_order_qty: "1",
    images: "",
    is_featured_today: false
  });

  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    minimum_amount: "",
    max_discount: "",
    usage_limit: "",
    expires_at: "",
    is_active: true
  });

  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    link_url: "",
    is_active: true,
    display_order: "0"
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles!orders_user_id_fkey(name, email, phone_number),
          order_items(*, products(name))
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch coupons with type casting to handle the types
  const { data: coupons = [], isLoading: couponsLoading, refetch: refetchCoupons } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch banners
  const { data: banners = [], isLoading: bannersLoading, refetch: refetchBanners } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const imagesArray = productForm.images.split(',').map(img => img.trim()).filter(img => img);
      
      const { error } = await supabase
        .from("products")
        .insert({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          weight: productForm.weight,
          category: productForm.category,
          sub_category: productForm.sub_category || null,
          minimum_order_qty: parseInt(productForm.minimum_order_qty),
          images: imagesArray,
          is_featured_today: productForm.is_featured_today
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      resetForm();
      refetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      weight: product.weight || "",
      category: product.category,
      sub_category: product.sub_category || "",
      minimum_order_qty: product.minimum_order_qty?.toString() || "1",
      images: product.images?.join(', ') || "",
      is_featured_today: product.is_featured_today || false
    });
    setShowAddProduct(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct) return;
    
    try {
      const imagesArray = productForm.images.split(',').map(img => img.trim()).filter(img => img);
      
      const { error } = await supabase
        .from("products")
        .update({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          weight: productForm.weight,
          category: productForm.category,
          sub_category: productForm.sub_category || null,
          minimum_order_qty: parseInt(productForm.minimum_order_qty),
          images: imagesArray,
          is_featured_today: productForm.is_featured_today
        })
        .eq("id", editingProduct);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      resetForm();
      refetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      weight: "",
      category: "",
      sub_category: "",
      minimum_order_qty: "1",
      images: "",
      is_featured_today: false
    });
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      refetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus as OrderStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      refetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await (supabase as any)
        .from("coupons")
        .insert({
          code: couponForm.code.toUpperCase(),
          type: couponForm.type,
          value: parseFloat(couponForm.value),
          minimum_amount: couponForm.minimum_amount ? parseFloat(couponForm.minimum_amount) : null,
          max_discount: couponForm.max_discount ? parseFloat(couponForm.max_discount) : null,
          usage_limit: couponForm.usage_limit ? parseInt(couponForm.usage_limit) : null,
          expires_at: couponForm.expires_at || null,
          is_active: couponForm.is_active
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon added successfully",
      });

      resetCouponForm();
      refetchCoupons();
    } catch (error) {
      console.error("Error adding coupon:", error);
      toast({
        title: "Error",
        description: "Failed to add coupon",
        variant: "destructive",
      });
    }
  };

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon.id);
    setCouponForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value.toString(),
      minimum_amount: coupon.minimum_amount?.toString() || "",
      max_discount: coupon.max_discount?.toString() || "",
      usage_limit: coupon.usage_limit?.toString() || "",
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().split('T')[0] : "",
      is_active: coupon.is_active
    });
    setShowAddCoupon(true);
  };

  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCoupon) return;
    
    try {
      const { error } = await (supabase as any)
        .from("coupons")
        .update({
          code: couponForm.code.toUpperCase(),
          type: couponForm.type,
          value: parseFloat(couponForm.value),
          minimum_amount: couponForm.minimum_amount ? parseFloat(couponForm.minimum_amount) : null,
          max_discount: couponForm.max_discount ? parseFloat(couponForm.max_discount) : null,
          usage_limit: couponForm.usage_limit ? parseInt(couponForm.usage_limit) : null,
          expires_at: couponForm.expires_at || null,
          is_active: couponForm.is_active
        })
        .eq("id", editingCoupon);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon updated successfully",
      });

      resetCouponForm();
      refetchCoupons();
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast({
        title: "Error",
        description: "Failed to update coupon",
        variant: "destructive",
      });
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const { error } = await (supabase as any)
        .from("coupons")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      });
      refetchCoupons();
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      });
    }
  };

  const resetCouponForm = () => {
    setCouponForm({
      code: "",
      type: "percentage",
      value: "",
      minimum_amount: "",
      max_discount: "",
      usage_limit: "",
      expires_at: "",
      is_active: true
    });
    setShowAddCoupon(false);
    setEditingCoupon(null);
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("banners")
        .insert({
          title: bannerForm.title,
          subtitle: bannerForm.subtitle || null,
          image_url: bannerForm.image_url,
          link_url: bannerForm.link_url || null,
          is_active: bannerForm.is_active,
          display_order: parseInt(bannerForm.display_order)
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Banner added successfully",
      });

      resetBannerForm();
      refetchBanners();
    } catch (error) {
      console.error("Error adding banner:", error);
      toast({
        title: "Error",
        description: "Failed to add banner",
        variant: "destructive",
      });
    }
  };

  const handleEditBanner = (banner: any) => {
    setEditingBanner(banner.id);
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image_url: banner.image_url,
      link_url: banner.link_url || "",
      is_active: banner.is_active,
      display_order: banner.display_order.toString()
    });
    setShowAddBanner(true);
  };

  const handleUpdateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingBanner) return;
    
    try {
      const { error } = await supabase
        .from("banners")
        .update({
          title: bannerForm.title,
          subtitle: bannerForm.subtitle || null,
          image_url: bannerForm.image_url,
          link_url: bannerForm.link_url || null,
          is_active: bannerForm.is_active,
          display_order: parseInt(bannerForm.display_order)
        })
        .eq("id", editingBanner);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Banner updated successfully",
      });

      resetBannerForm();
      refetchBanners();
    } catch (error) {
      console.error("Error updating banner:", error);
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const { error } = await supabase
        .from("banners")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
      refetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const resetBannerForm = () => {
    setBannerForm({
      title: "",
      subtitle: "",
      image_url: "",
      link_url: "",
      is_active: true,
      display_order: "0"
    });
    setShowAddBanner(false);
    setEditingBanner(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Admin Panel</h1>
          <p className="text-gray-700 mb-8">Please login to access admin panel</p>
          <Link
            to="/auth"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="border-b border-gray-200 bg-white">
        <div className="flex space-x-8 px-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "dashboard"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "products"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "orders"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "coupons"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Coupons ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab("banners")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "banners"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Banners ({banners.length})
          </button>
          <button
            onClick={() => setActiveTab("locations")}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeTab === "locations"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Locations
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "dashboard" && <DashboardTab />}

        {activeTab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Products</h2>
              <Button
                onClick={() => setShowAddProduct(true)}
                className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>

            {showAddProduct && (
              <ProductForm
                productForm={productForm}
                setProductForm={setProductForm}
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                onCancel={resetForm}
                isEditing={!!editingProduct}
              />
            )}

            <ProductsTable
              products={products}
              isLoading={productsLoading}
              onEdit={handleEditProduct}
              onDelete={deleteProduct}
            />
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>
            <OrdersTable
              orders={orders}
              isLoading={ordersLoading}
              onViewDetails={setSelectedOrderId}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        )}

        {activeTab === "coupons" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Coupons</h2>
              <Button
                onClick={() => setShowAddCoupon(true)}
                className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Coupon
              </Button>
            </div>

            {showAddCoupon && (
              <CouponsForm
                couponForm={couponForm}
                setCouponForm={setCouponForm}
                onSubmit={editingCoupon ? handleUpdateCoupon : handleAddCoupon}
                onCancel={resetCouponForm}
                isEditing={!!editingCoupon}
              />
            )}

            <CouponsTable
              coupons={coupons}
              isLoading={couponsLoading}
              onEdit={handleEditCoupon}
              onDelete={deleteCoupon}
            />
          </div>
        )}

        {activeTab === "banners" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Banners</h2>
              <Button
                onClick={() => setShowAddBanner(true)}
                className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Banner
              </Button>
            </div>

            {showAddBanner && (
              <BannerForm
                bannerForm={bannerForm}
                setBannerForm={setBannerForm}
                onSubmit={editingBanner ? handleUpdateBanner : handleAddBanner}
                onCancel={resetBannerForm}
                isEditing={!!editingBanner}
              />
            )}

            <BannerTable
              banners={banners}
              isLoading={bannersLoading}
              onEdit={handleEditBanner}
              onDelete={deleteBanner}
            />
          </div>
        )}

        {activeTab === "locations" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Location Management</h2>
          </div>
        )}
      </div>

      {selectedOrderId && (
        <OrderDetails
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};

export default Admin;
