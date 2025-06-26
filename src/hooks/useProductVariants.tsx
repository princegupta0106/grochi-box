
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProductVariants = (productId?: string) => {
  return useQuery({
    queryKey: ["product-variants", productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId)
        .eq("is_active", true)
        .order("price");
      
      if (error) {
        console.error("Error fetching product variants:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!productId,
  });
};
