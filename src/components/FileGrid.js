"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoProvider, PhotoView } from "react-photo-view";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import Skeleton from "@/components/ui/Skeleton";


const PhotoGrid = ({ files }) => {
  const [loading, setLoading] = useState(true);

  // Simulating a loading effect (you can replace this with an API call)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  const isImage = (type) => {
    return type.includes("image");
  };

  return (
    <PhotoProvider>
      <div className="grid grid-cols-2 mt-5 px-0 relative w-full h-[240px]">
        {loading
          ? [...Array(4)].map((_, index) => (
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
          : files?.map((file, index) =>
              isImage(file.type) ? (
                <PhotoView key={index} src={file.url}>
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
                        src={file.url}
                        alt={file.originalName}
                        className="w-full h-full object-cover"
                      />
                    </CardContent>
                    {index === 3 && files.length > 4 && (
                      <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center text-white text-lg font-bold rounded-br-2xl">
                        +{files.length - 4} more
                      </div>
                    )}
                  </Card>
                </PhotoView>
              ) : (
                <Card
                  key={index}
                  className={`relative w-full h-full overflow-hidden rounded-none ${
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
                    <DocViewer
                      documents={[{ uri: file.url }]}
                      pluginRenderers={DocViewerRenderers}
                      className="w-full h-full"
                    />
                  </CardContent>
                </Card>
              )
            )}
      </div>
    </PhotoProvider>
  );
};

export default PhotoGrid;
