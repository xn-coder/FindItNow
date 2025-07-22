"use client";

import { useState } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { mockItems } from "@/lib/data";
import type { Item } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, MapOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ItemMarker({ item, onSelect }: { item: Item, onSelect: (item: Item) => void }) {
    return (
        <AdvancedMarker
            position={{ lat: item.lat, lng: item.lng }}
            onClick={() => onSelect(item)}
            title={item.name}
        >
            <div
                className={`w-4 h-4 rounded-full border-2 border-white shadow-md
                ${item.type === 'lost' ? 'bg-destructive' : 'bg-primary'}
                `}
            />
        </AdvancedMarker>
    );
}

function MapView() {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const map = useMap();

    const handleMarkerClick = (item: Item) => {
        setSelectedItem(item);
        if(map) {
            map.panTo({lat: item.lat, lng: item.lng});
        }
    }

    return (
        <>
            <div className="w-full h-[600px] rounded-lg overflow-hidden border shadow-md">
                <Map
                    defaultCenter={{ lat: 40.7580, lng: -73.9855 }} // Centered on Times Square
                    defaultZoom={12}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    mapId="finditnow_map"
                >
                    {mockItems.map((item) => (
                        <ItemMarker key={item.id} item={item} onSelect={handleMarkerClick} />
                    ))}
                    {selectedItem && (
                        <InfoWindow
                            position={{ lat: selectedItem.lat, lng: selectedItem.lng }}
                            onCloseClick={() => setSelectedItem(null)}
                            pixelOffset={[0, -30]}
                        >
                            <div className="p-1 max-w-xs">
                                <h3 className="font-bold">{selectedItem.name}</h3>
                                <Badge variant={selectedItem.type === "lost" ? "destructive" : "default"}>{selectedItem.type}</Badge>
                                <p className="text-sm text-muted-foreground">{selectedItem.location}</p>
                                <Button asChild variant="link" size="sm" className="p-0 h-auto mt-1">
                                    <Link href={`/browse?item=${selectedItem.id}`}>View Details</Link>
                                </Button>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </div>
             <div className="mt-4 flex justify-center items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div>Found Item</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-destructive"></div>Lost Item</div>
            </div>
        </>
    );
}


export default function MapPage() {
  const isMapEnabled = process.env.NEXT_PUBLIC_MAP_ENABLED !== 'false';
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!isMapEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <MapOff className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold mt-4">Map Feature Disabled</h1>
        <p className="text-muted-foreground mt-2">
          The map functionality is currently turned off by the administrator.
        </p>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full">
         <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Google Maps API Key Missing</AlertTitle>
            <AlertDescription>
              To view the map, please provide a Google Maps API key. Add it as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to your environment variables.
            </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-bold font-headline">Browse by Location</h1>
            <p className="mt-2 text-lg text-muted-foreground">
            Explore lost and found items visually on the map.
            </p>
        </div>
        <APIProvider apiKey={apiKey}>
           <MapView />
        </APIProvider>
    </div>
  );
}
