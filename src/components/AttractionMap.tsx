
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttractions } from "@/services/api";

// Mock component for Attraction Map
// In a real implementation, you would use a mapping library like react-leaflet or react-map-gl
const AttractionMap = () => {
  const { data: attractions, isLoading, error } = useQuery({
    queryKey: ['attractions'],
    queryFn: getAttractions
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-[400px]">Loading attractions data...</div>;
  }

  if (error || !attractions) {
    return <div className="flex justify-center items-center h-[400px]">Error loading attractions data</div>;
  }

  // Sort attractions by visitor count
  const sortedAttractions = [...attractions].sort((a, b) => 
    (b.visitors_count || 0) - (a.visitors_count || 0)
  ).slice(0, 8); // Top 8 attractions

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden h-[400px] relative">
      {/* This is a placeholder for the actual map */}
      <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Map visualization would be implemented with a mapping library
          </p>
          <div className="grid gap-3 text-sm">
            <div className="font-medium mb-2">Top Attractions by Daily Visitors:</div>
            {sortedAttractions.map((attraction, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    index === 0 ? "bg-red-500" :
                    index === 1 ? "bg-orange-500" :
                    index === 2 ? "bg-yellow-500" :
                    "bg-blue-500"
                  }`}></div>
                  <span>{attraction.name}</span>
                </div>
                <div className="font-medium">{attraction.visitors_count?.toLocaleString() || 0} visitors</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionMap;
