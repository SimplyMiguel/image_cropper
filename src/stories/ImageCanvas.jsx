import "react-image-crop/dist/ReactCrop.css";
import React, { useEffect, useRef, useState } from "react";
import "../index.css";
import exampleImage from "./exampleImage.png";
import ReactCrop from "react-image-crop";

const ImageCanvas = () => {
  const [assignmentImage, setAssignmentImage] = useState(null);
  const [crop, setCrop] = useState(null);
  const [questionCoordinates, setQuestionCoordinates] = useState([]);

  useEffect(() => {
    setAssignmentImage(exampleImage);
  }, []);

  useEffect(() => {
    console.log("crop changed");
  }, [crop]);

  const invalidCoord = (box1, box2) => {
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

  const drawBox = () => {
    for (const qc of questionCoordinates) {
      if (invalidCoord(crop, qc)) {
        return;
      }
    }

    // If no significant overlap with existing boxes, add the new crop
    setQuestionCoordinates([
      ...questionCoordinates,
      {
        x: crop.x,
        y: crop.y,
        width: crop.width,
        height: crop.height,
      },
    ]);
    setCrop(null);
  };
  const scaleImageToFitParent = () => {
    const image = document.getElementById("assignmentImage");
    const parentRef = document.getElementById("parent");

    const scale = Math.min(
      (parentRef.offsetWidth * 0.97) / image.offsetWidth,
      (parentRef.offsetHeight * 0.97) / image.offsetHeight
    );

    image.style.height = `${image.offsetHeight * scale}px`;
    image.style.width = `${image.offsetWidth * scale}px`;
  };

  return (
    <div
      id="parent"
      className="flex justify-center items-center bg-red-400 w-[100vw] h-[100vh]"
    >
      {assignmentImage && (
        <ReactCrop
          crop={crop}
          onChange={(c) => {
            setCrop(c);
          }}
          className="relative w-fit h-fit"
          onDragEnd={drawBox}
        >
          <img
            id="assignmentImage"
            src={assignmentImage}
            onLoad={scaleImageToFitParent}
            className=""
          />
          {questionCoordinates.map((boxCoordinates, index) => (
            <div
              className="box"
              style={{
                left: `${boxCoordinates.x}px`,
                top: `${boxCoordinates.y}px`,
                width: `${boxCoordinates.width}px`,
                height: `${boxCoordinates.height}px`,
              }}
            ></div>
          ))}
        </ReactCrop>
      )}
    </div>
  );
};

export default ImageCanvas;
