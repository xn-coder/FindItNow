
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getGalleryImages } from "@/lib/actions";
import type { GalleryImage } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
import { Card } from "./ui/card";
import { ImagePlus } from "lucide-react";

export function ItemGallery({ itemId }: { itemId: string }) {
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

    if (loading) {
        return (
             <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-full rounded-md" />
                ))}
            </div>
        )
    }

    if (images.length === 0) {
        return null; // Don't render anything if there are no extra images
    }

    return (
        <div>
             <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-primary"/>
                Additional Images
            </h3>
            <div className="grid grid-cols-4 gap-2">
                {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden rounded-md">
                        <div className="relative aspect-square w-full">
                             <a href={image.imageUrl} target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={image.imageUrl}
                                    alt="Gallery image"
                                    fill
                                    sizes="10vw"
                                    style={{objectFit: "cover"}}
                                    className="hover:scale-110 transition-transform duration-300"
                                />
                             </a>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

