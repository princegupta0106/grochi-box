
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BannerFormProps {
  bannerForm: {
    title: string;
    subtitle: string;
    image_url: string;
    link_url: string;
    is_active: boolean;
    display_order: string;
  };
  setBannerForm: React.Dispatch<React.SetStateAction<{
    title: string;
    subtitle: string;
    image_url: string;
    link_url: string;
    is_active: boolean;
    display_order: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const BannerForm = ({ bannerForm, setBannerForm, onSubmit, onCancel, isEditing }: BannerFormProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      setBannerForm(prev => ({
        ...prev,
        image_url: data.publicUrl
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? "Edit Banner" : "Add New Banner"}
      </h3>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={bannerForm.title}
            onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={bannerForm.subtitle}
            onChange={(e) => setBannerForm(prev => ({ ...prev, subtitle: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="image">Banner Image *</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          {bannerForm.image_url && (
            <div className="mt-2">
              <img
                src={bannerForm.image_url}
                alt="Preview"
                className="w-32 h-20 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="link_url">Link URL</Label>
          <Input
            id="link_url"
            type="url"
            value={bannerForm.link_url}
            onChange={(e) => setBannerForm(prev => ({ ...prev, link_url: e.target.value }))}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={bannerForm.display_order}
            onChange={(e) => setBannerForm(prev => ({ ...prev, display_order: e.target.value }))}
            min="0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={bannerForm.is_active}
            onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={uploading || !bannerForm.image_url}>
            {uploading ? "Uploading..." : isEditing ? "Update Banner" : "Add Banner"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BannerForm;
