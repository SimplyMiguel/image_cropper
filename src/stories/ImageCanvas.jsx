import React, { useEffect, useRef } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import "../index.css";
import exampleImage from "./exampleImage.png";

const ImageCanvas = () => {
  const parentRef = useRef(null);
  const { editor, onReady } = useFabricJSEditor();

  useEffect(() => {
    if (parentRef.current && editor) {
      const parentWidth = parentRef.current.offsetWidth;
      const parentHeight = parentRef.current.offsetHeight;

      fabric.Image.fromURL(exampleImage, function (img) {
        editor.canvas.setWidth(Math.floor(parentWidth * 0.99));
        editor.canvas.setHeight(Math.floor(parentHeight * 0.99));

        // Calculate the scale factors for width and height
        const scaleFactorWidth = Math.floor(parentWidth * 0.98) / img.width;
        const scaleFactorHeight = Math.floor(parentHeight * 0.98) / img.height;

        // Use the smaller scale factor to fit the image within the canvas
        const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

        // Apply the scale factor to the image
        img.scale(scaleFactor);

        // Center the image on the canvas
        img.set({
          left: (editor.canvas.width - img.getScaledWidth()) / 2,
          top: (editor.canvas.height - img.getScaledHeight()) / 2,
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
        });

        editor.canvas.add(img);
        editor.canvas.renderAll();
      });
    }
  }, [editor]);

  return (
    <div ref={parentRef} className="w-[94vw] h-[94vh]">
      <div className="w-fit h-fit bg-orange-400">
        <FabricJSCanvas className="" onReady={onReady} />
      </div>
    </div>
  );
};

export default ImageCanvas;
