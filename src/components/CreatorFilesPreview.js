import React, { useState } from "react";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function ImagePreview() {
  const [images, setImages] = useState([
    { id: "img1", src: "/writings.png" },
    { id: "img2", src: "/writings.png" },
    { id: "img3", src: "/writings.png" },
  ]);

  const handleRemove = (id) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  return (
    <PhotoProvider>
      <section className="w-4/5 sm:w-1/3 mx-auto flex my-2 justify-between">
        {images.map((item) => (
          <div key={item.id} className="w-20 h-16 rounded relative">
            <PhotoView src={item.src}>
              <Image
                src={item.src}
                width={40}
                height={40}
                className="bg-cover w-full h-full rounded cursor-pointer"
                alt="preview"
              />
            </PhotoView>
            <button
              className="bg-black rounded-full absolute top-1 right-2 p-[2px]"
              onClick={() => handleRemove(item.id)}
            >
              <MdClose color="white" size={10} />
            </button>
          </div>
        ))}
      </section>
    </PhotoProvider>
  );
}
