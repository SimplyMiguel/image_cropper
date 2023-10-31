import { useEffect, useState } from "react";
import "./App.css";
import ImageCanvas from "./components/ImageCrop/ImageCanvas";
import exampleImage from "../src/stories/exampleImage.png";

function App() {
  const [coord, setCoord] = useState([]);

  useEffect(() => {
    console.log("coordinages\n", coord);
  }, [coord]);

  return (
    <div className="flex justify-center items-center">
      <ImageCanvas
        image={exampleImage}
        initialCropCoordinates={coord}
        onCoordinatesChange={(newC) => {
          setCoord(newC);
        }}
      />
    </div>
  );
}

export default App;
