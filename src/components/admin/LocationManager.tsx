
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLocation {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  pincode: string;
  is_current_location: boolean;
  created_at: string;
}

const LocationManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [locations, setLocations] = useState<AdminLocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<AdminLocation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLocations();
    }
  }, [user]);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_locations')
        .select('*')
        .eq('admin_user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLocations(data || []);
      const current = data?.find(loc => loc.is_current_location);
      setCurrentLocation(current || null);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch locations",
        variant: "destructive"
      });
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Get address from coordinates using reverse geocoding
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
            );
            
            let address = `${latitude}, ${longitude}`;
            let pincode = '';
            
            if (response.ok) {
              const data = await response.json();
              if (data.results && data.results[0]) {
                address = data.results[0].formatted;
                pincode = data.results[0].components.postcode || '';
              }
            }

            // Save location to database
            await saveLocation(latitude, longitude, address, pincode);
          } catch (error) {
            console.error('Error getting address:', error);
            await saveLocation(latitude, longitude, `${latitude}, ${longitude}`, '');
          }
          
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Failed to get current location. Please enable location services.",
            variant: "destructive"
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const saveLocation = async (latitude: number, longitude: number, address: string, pincode: string) => {
    try {
      // Mark all other locations as not current
      await supabase
        .from('admin_locations')
        .update({ is_current_location: false })
        .eq('admin_user_id', user?.id);

      // Insert new location
      const { data, error } = await supabase
        .from('admin_locations')
        .insert({
          admin_user_id: user?.id,
          latitude,
          longitude,
          address,
          pincode,
          is_current_location: true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Location saved successfully",
      });

      fetchLocations();
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive"
      });
    }
  };

  const openInGoogleMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Location Management</h3>
        <Button
          onClick={getCurrentLocation}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          {loading ? 'Getting Location...' : 'Get Current Location'}
        </Button>
      </div>

      {currentLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-800 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Current Location
              </h4>
              <p className="text-green-700 text-sm mt-1">{currentLocation.address}</p>
              <p className="text-green-600 text-xs">
                Pincode: {currentLocation.pincode} | 
                Lat: {currentLocation.latitude.toFixed(6)} | 
                Lng: {currentLocation.longitude.toFixed(6)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openInGoogleMaps(currentLocation.latitude, currentLocation.longitude)}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open in Maps
            </Button>
          </div>
        </div>
      )}

      {locations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Location History</h4>
          {locations.map((location) => (
            <div 
              key={location.id} 
              className={`p-3 rounded-lg border ${
                location.is_current_location 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm">{location.address}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(location.created_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openInGoogleMaps(location.latitude, location.longitude)}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationManager;
