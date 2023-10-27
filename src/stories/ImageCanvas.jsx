import "react-image-crop/dist/ReactCrop.css";
import React, { useEffect, useRef, useState } from "react";
import "../index.css";
import ReactCrop from "react-image-crop";
import exampleImagte from "./exampleImage.png";

const ImageCanvas = ({ image }) => {
  // This is temporary, just to show the image inside not storybook
  if (image === undefined) {
    image = exampleImagte;
  }
  const [crop, setCrop] = useState(null);
  const [cropCoordinates, setCropCoordinates] = useState([]);

  const invalidCoord = (box1, box2) => {
    const image = document.getElementById("image");
    box1 = {
      x: (box1.x * image.offsetWidth),
      y: (box1.y / image.offsetHeight),
      width: (box1.width / image.offsetWidth),
      height: (box1.height / image.offsetHeight),
    }
    box2 = {
      x: (box2.x * image.offsetWidth),
      y: (box2.y / image.offsetHeight),
      width: (box2.width / image.offsetWidth),
      height: (box2.height / image.offsetHeight),
    }
    // Why did we do the following??  I think it was to make sure that the boxes were not too small


    const xOverlap = Math.max(
      0,
      Math.min(box1.x + box1.width, box2.x + box2.width) -
        Math.max(box1.x, box2.x)
    );
    const yOverlap = Math.max(
      0,
      Math.min(box1.y + box1.height, box2.y + box2.height) -
        Math.max(box1.y, box2.y)
    );
    const overlapArea = xOverlap * yOverlap;
    return (
      overlapArea > 0.05 * box1.width * box1.height ||
      overlapArea > 0.05 * box2.width * box2.height
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "z" && e.metaKey) {
        setCropCoordinates((a) => a.slice(0, a.length - 1));
      }
    };

    const handleResize = () => {
      scaleImageToFitParent();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("resize", handleResize);
    };
  }, []);

  const drawBox = () => {
    const image = document.getElementById("image");
    if (
      crop.width < image.offsetWidth * 0.02 ||
      crop.height < image.offsetHeight * 0.02
    ) {
      return;
    }
    for (const qc of cropCoordinates) {
      if (invalidCoord(crop, qc)) {
        return;
      }
    }

    // The window and image may vary in size depending on the screen size, so save x, y, width, and height as a percentage of the image size
    const newCropInsert = {
      x: crop.x / image.offsetWidth,
      y: crop.y / image.offsetHeight,
      width: crop.width / image.offsetWidth,
      height: crop.height / image.offsetHeight,
    };

    console.log("newCropInsert:\n", newCropInsert);
    // setCropCoordinates((a) => [
    //   ...cropCoordinates,
    //   newCropInsert,
    // ]);
    setCrop(null);
  };

  const scaleImageToFitParent = () => {
    const image = document.getElementById("image");
    const parentRef = document.getElementById("parent");

    const scale = Math.min(
      (parentRef.offsetWidth * 0.97) / image.offsetWidth,
      (parentRef.offsetHeight * 0.97) / image.offsetHeight
    );

    image.style.height = `${image.offsetHeight * scale}px`;
  };

  return (
    <div
      id="parent"
      className="flex justify-center items-center bg-red-400 w-[100vw] h-[100vh]"
    >
      {image && (
        <ReactCrop
          crop={crop}
          onChange={(c) => {
            setCrop(c);
          }}
          className="relative w-fit h-fit"
          onDragEnd={drawBox}
        >
          <img
            id="image"
            src={image}
            onLoad={scaleImageToFitParent}
            className=""
          />
          {/* {cropCoordinates.map((boxCoordinates) => (
            <div
              className="box relative"
              style={{
                left: `${boxCoordinates.x}px`,
                top: `${boxCoordinates.y}px`,
                width: `${boxCoordinates.width}px`,
                height: `${boxCoordinates.height}px`,
              }}
            ></div>
          ))} */}
        </ReactCrop>
      )}
    </div>
  );
};

export default ImageCanvas;
