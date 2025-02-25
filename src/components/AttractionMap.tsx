
import React from "react";

// Mock component for Attraction Map
// In a real implementation, you would use a mapping library like react-leaflet or react-map-gl
const AttractionMap = () => {
  // These would be actual attractions with their coordinates
  const attractions = [
    { name: "Langkawi Cable Car", visitors: 2800, popularity: 95 },
    { name: "Langkawi Sky Bridge", visitors: 2400, popularity: 92 },
    { name: "Cenang Beach", visitors: 3200, popularity: 90 },
    { name: "Underwater World Langkawi", visitors: 1900, popularity: 85 },
    { name: "Kilim Karst Geoforest Park", visitors: 1600, popularity: 88 },
    { name: "Tanjung Rhu Beach", visitors: 1400, popularity: 82 },
    { name: "Mahsuri's Tomb", visitors: 1200, popularity: 75 },
    { name: "Telaga Tujuh Waterfalls", visitors: 950, popularity: 78 },
  ];

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
            {attractions.map((attraction, index) => (
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
                <div className="font-medium">{attraction.visitors} / day</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionMap;
