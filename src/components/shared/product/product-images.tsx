"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const ProductImages= ({images}: {images: string[]}) => {
  const [currentImage, setCurrentImage] = useState(images[0])
  return (
    <div>
      <div className="relative w-full h-[400px]">
        <Image
          src={currentImage}
          alt="Product Image"
          fill
          className="object-contain"
        />
      </div>
     {/*  <div className="flex gap-2 mt-2">
        {images.map((image) => (
          <div
            key={image}
            className={cn("cursor-pointer", {
              "ring-2 ring-blue-500": image === currentImage,
            })}
            onClick={() => setCurrentImage(image)}
          >
            <Image
              src={image}
              alt="Product Image Thumbnail"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
        ))}
      </div> */}
    </div>
  )
}

export default ProductImages