"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Skeleton from "@/components/ui/Skeleton";
import "react-photo-view/dist/react-photo-view.css";

const CORNER_CLASSES = [
  "rounded-tl-2xl",
  "rounded-tr-2xl",
  "rounded-bl-2xl",
  "rounded-br-2xl",
];

const PhotoGrid = ({ files }) => {
  const [loading, setLoading] = useState(true);

  // Simulate a loading effect (you can replace this with an API call)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const isMoreThanFour = files.length > 4;
  const displayedFiles = files.slice(0, 4);

  return (
    <PhotoProvider>
      <div className="grid grid-cols-2 mt-5 px-0 relative w-full h-[240px]">
        {loading
          ? CORNER_CLASSES.map((cornerClass, index) => (
              <Skeleton
                key={index}
                className={`w-full h-full ${cornerClass}`}
              />
            ))
          : displayedFiles.map((file, index) => (
              <PhotoView key={index} src={file.url}>
                <Card
                  className={`cursor-pointer relative w-full h-full overflow-hidden ${CORNER_CLASSES[index]}`}
                >
                  <CardContent className="p-0 w-full h-full">
                    <img
                      src={file.url}
                      alt={`Image ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </CardContent>

                  {index === 3 && isMoreThanFour && (
                    <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center text-white text-lg font-bold rounded-br-2xl">
                      +{files.length - 4} more
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
