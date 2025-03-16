"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Skeleton from "@/components/ui/Skeleton"; // Import Skeleton
import "react-photo-view/dist/react-photo-view.css";

const PhotoGrid = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://picsum.photos/v2/list?page=1&limit=7"
        );
        const data = await response.json();
        setImages(
          data.map((img) => ({
            src: img.download_url,
            width: 400,
            height: 300,
          }))
        );
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <PhotoProvider>
      <div className="grid grid-cols-2 mt-5 px-0 relative w-full h-[240px]">
        {loading
          ? // Show skeletons while loading
            [...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                className={`w-full h-full rounded-none ${
                  index === 0
                    ? "rounded-tl-2xl"
                    : index === 1
                    ? "rounded-tr-2xl"
                    : index === 2
                    ? "rounded-bl-2xl"
                    : "rounded-br-2xl"
                }`}
              />
            ))
          : // Show images once loaded
            images.slice(0, 4).map((image, index) => (
              <PhotoView key={index} src={image.src}>
                <Card
                  className={`cursor-pointer relative w-full h-full overflow-hidden rounded-none ${
                    index === 0
                      ? "rounded-tl-2xl"
                      : index === 1
                      ? "rounded-tr-2xl"
                      : index === 2
                      ? "rounded-bl-2xl"
                      : "rounded-br-2xl"
                  }`}
                >
                  <CardContent className="p-0 w-full h-full">
                    <img
                      src={image.src}
                      alt={`Image ${index}`}
                      className={`w-full h-full object-cover ${
                        index === 0
                          ? "rounded-tl-2xl"
                          : index === 1
                          ? "rounded-tr-2xl"
                          : index === 2
                          ? "rounded-bl-2xl"
                          : "rounded-br-2xl"
                      }`}
                    />
                  </CardContent>
                  {index === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center text-white text-lg font-bold rounded-br-2xl">
                      +{images.length - 4} more
                    </div>
                  )}
                </Card>
              </PhotoView>
            ))}
      </div>
    </PhotoProvider>
  );
};

export default PhotoGrid;
