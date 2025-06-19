
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true);

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query.order("name");
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      return data || [];
    },
  });
};
