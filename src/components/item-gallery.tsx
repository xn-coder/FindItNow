
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getGalleryImages } from "@/lib/actions";
import type { GalleryImage } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

type ItemGalleryProps = {
    itemId: string;
    onImageSelect: (imageUrl: string) => void;
    primaryImageUrl: string;
    selectedImageUrl: string;
}

export function ItemGallery({ itemId, onImageSelect, primaryImageUrl, selectedImageUrl }: ItemGalleryProps) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const galleryImages = await getGalleryImages(itemId);
                setImages(galleryImages);
            } catch (error) {
                console.error("Failed to fetch gallery images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [itemId]);

    const allImageUrls = [primaryImageUrl, ...images.map(img => img.imageUrl)];

    if (loading) {
        return (
             <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-full rounded-md" />
                ))}
            </div>
        )
    }

    if (allImageUrls.length <= 1) {
        return null; // Don't render anything if there are no extra images
    }

    return (
        <div>
            <div className="grid grid-cols-5 gap-2">
                {allImageUrls.map((imageUrl, index) => (
                    <Card 
                        key={index} 
                        className={cn(
                            "overflow-hidden rounded-md cursor-pointer border-2 transition-all",
                            selectedImageUrl === imageUrl ? "border-primary" : "border-transparent"
                        )}
                        onClick={() => onImageSelect(imageUrl)}
                    >
                        <div className="relative aspect-square w-full">
                            <Image
                                src={imageUrl}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                sizes="10vw"
                                style={{objectFit: "cover"}}
                                className="hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
