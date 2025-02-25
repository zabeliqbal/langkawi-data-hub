
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Users, MapPin, Plane, Sailboat, FileText, 
  Calendar, Landmark, Menu, X, Download
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const Header = () => {
  const [activeTab, setActiveTab] = useState<string>("Home");

  const navItems = [
    { name: "Home", icon: <Landmark className="h-5 w-5" /> },
    { name: "Visitors", icon: <Users className="h-5 w-5" /> },
    { name: "Destinations", icon: <MapPin className="h-5 w-5" /> },
    { name: "Arrivals", icon: <Plane className="h-5 w-5" /> },
    { name: "Transportation", icon: <Sailboat className="h-5 w-5" /> },
    { name: "Reports", icon: <FileText className="h-5 w-5" /> },
    { name: "Forecasts", icon: <Calendar className="h-5 w-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center mr-4">
          {/* Using a div instead of an image since the image file doesn't exist */}
          <div className="h-9 w-9 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold text-xs">
            LADA
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-lg font-bold">LANGKAWI DATA</span>
            <span className="text-xs text-muted-foreground">Tourism Statistics Hub</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-2 md:space-x-4 mx-6">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`text-sm flex items-center ${
                activeTab === item.name ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.name}
            </Button>
          ))}
        </div>
        
        <div className="md:hidden flex-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex items-center mt-2 mb-6">
                {/* Using a div instead of an image since the image file doesn't exist */}
                <div className="h-8 w-8 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold text-xs">
                  LADA
                </div>
                <div className="ml-2 flex flex-col">
                  <span className="text-base font-bold">LANGKAWI DATA</span>
                  <span className="text-xs text-muted-foreground">Tourism Statistics Hub</span>
                </div>
              </div>
              <Separator className="mb-4" />
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={`justify-start ${
                      activeTab === item.name ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setActiveTab(item.name);
                    }}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" className="hidden md:flex gap-1">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
          <select 
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue="EN"
          >
            <option value="EN">EN</option>
            <option value="MS">MS</option>
            <option value="ZH">ZH</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
