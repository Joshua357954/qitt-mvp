"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function CreatorFilesPreview({ files, removeFile }) {
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.src));
    };
  }, [files]);

  return (
    <PhotoProvider>
      <section className="w-full mx-auto flex my-2 flex-wrap gap-2">
        {files.map((item) => (
          <div key={item.id} className="w-20 h-16 rounded relative">
            <PhotoView src={item.src}>
              <Image
                src={item.src}
                width={40}
                height={40}
                className="bg-contain object-cover w-full h-full rounded cursor-pointer"
                alt="preview"
                unoptimized
              />
            </PhotoView>
            <button
              className="bg-black rounded-full absolute top-1 right-2 p-[2px]"
              onClick={() => {
                URL.revokeObjectURL(item.src);
                removeFile(item.id);
              }}
            >
              <MdClose color="white" size={10} />
            </button>
          </div>
        ))}
      </section>
    </PhotoProvider>
  );
}
