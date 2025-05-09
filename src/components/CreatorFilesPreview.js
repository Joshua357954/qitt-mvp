"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import {
  X,
  File,
  FileText,
  FileCode,
  FileArchive,
  FileVideo,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FilePieChart,
  FileJson,
} from "lucide-react";

export default function CreatorFilesPreview({ files, removeFile }) {
  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files?.forEach((file) => {
        if (file.url && file.url.startsWith("blob:")) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [files]);

  // Supported Image Types
  const imageTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];

  const getFileTypeName = (type) => {
    if (!type) return "File";
    const cleanedType = type.split(":")[0].trim().toLowerCase();
    if (cleanedType === "application/pdf") return "PDF";
    if (cleanedType === "application/msword") return "Word";
    if (cleanedType.includes("wordprocessingml.document")) return "Word";
    if (cleanedType === "text/plain") return "Text";
    if (cleanedType.includes("spreadsheetml")) return "Excel";
    if (cleanedType.includes("presentationml")) return "PowerPoint";
    if (cleanedType.includes("audio/")) return "Audio";
    if (cleanedType.includes("video/")) return "Video";
    if (cleanedType.includes("zip") || cleanedType.includes("compressed"))
      return "Archive";
    if (cleanedType.includes("json")) return "JSON";
    if (cleanedType.includes("javascript")) return "JS";
    if (cleanedType.includes("csv")) return "CSV";
    const lastPart = cleanedType.split(/[./]/).pop();
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  const getFileIcon = (type) => {
    if (!type) return <File className="w-5 h-5" />;
    const cleanedType = type.split(":")[0].trim().toLowerCase();
    
    if (imageTypes.includes(cleanedType)) return <FileImage className="w-5 h-5" />;
    if (cleanedType === "application/pdf") return <FileText className="w-5 h-5" />;
    if (cleanedType === "text/plain") return <FileText className="w-5 h-5" />;
    if (cleanedType.includes("wordprocessingml.document")) return <FileText className="w-5 h-5" />;
    if (cleanedType.includes("spreadsheetml")) return <FileSpreadsheet className="w-5 h-5" />;
    if (cleanedType.includes("json")) return <FileJson className="w-5 h-5" />;
    if (cleanedType.includes("javascript")) return <FileCode className="w-5 h-5" />;
    if (cleanedType.includes("zip") || cleanedType.includes("compressed"))
      return <FileArchive className="w-5 h-5" />;
    if (cleanedType.includes("audio/")) return <FileAudio className="w-5 h-5" />;
    if (cleanedType.includes("video/")) return <FileVideo className="w-5 h-5" />;
    
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (size) => {
    if (!size) return "0 B";
    if (size < 1024) return `${size} B`;
    if (size < 1048576) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1073741824) return `${(size / 1048576).toFixed(1)} MB`;
    return `${(size / 1073741824).toFixed(1)} GB`;
  };

  if (!files || files.length === 0) return null;

  return (
    <PhotoProvider>
      <section className="w-full mx-auto my-2 grid grid-cols-2 gap-2">
        {files.map((item, index) => (
          <div
            key={item?.url || index}
            className="rounded-lg relative flex p-2 items-center shadow-sm border transition-all hover:shadow-md"
          >
            {/* Remove Button */}
            {item?.url && (
              <button
                className="absolute top-0 right-0 p-1 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
                onClick={() => removeFile(item)}
                aria-label={`Remove ${item?.file?.name || 'file'}`}
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            )}

            {/* File Preview */}
            <div className="flex items-center w-full gap-2">
              {item?.url && imageTypes.includes(item?.file?.type) ? (
                <PhotoView src={item.url}>
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center cursor-pointer">
                    <Image
                      src={item.url}
                      width={40}
                      height={40}
                      className="object-contain max-w-full max-h-full rounded"
                      alt={item?.file?.name ? `Preview of ${item.file.name}` : "File preview"}
                      unoptimized
                    />
                  </div>
                </PhotoView>
              ) : (
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                  {getFileIcon(item?.file?.type)}
                </div>
              )}

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" title={item?.file?.name}>
                  {item?.file?.name?.split(".").slice(0, -1).join(".") ||
                    "Untitled"}
                </p>
                <p className="text-xs opacity-70 truncate">
                  {getFileTypeName(item?.file?.type)} 
                  {/* • {formatFileSize(item?.file?.size)} */}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </PhotoProvider>
  );
}