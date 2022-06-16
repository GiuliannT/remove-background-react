import { useRef, useState } from "react";

export const App = () => {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const dropAreaRef = useRef(null);
  const textDropAreaRef = useRef(null);
  const [widthCanvas, setwidthCanvas] = useState(0);
  const [heightCanvas, setheightCanvas] = useState(0);
  const [Image, setImage] = useState(null);
  const [removeWhatColor, setRemoveWhatColor] = useState({
    red1: 240,
    green1: 240,
    blue1: 240,

    red2: 255,
    green2: 255,
    blue2: 255,
  });

  const dragOver = (e) => {
    e.preventDefault();
    dropAreaRef.current.style.background = "rgb(150, 50, 150)";
    textDropAreaRef.current.textContent = "Drop Image";
  };
  const dragLeave = (e) => {
    e.preventDefault();
    dropAreaRef.current.style.background = "linear-gradient(rgb(50, 50, 50), rgb(150, 50, 150))";
    textDropAreaRef.current.textContent = "Drag & Drop To Upload File";
  };
  const fileDrop = (e) => {
    e.preventDefault();
    dropAreaRef.current.style.background = "linear-gradient(rgb(50, 50, 50), rgb(150, 50, 150))";
    textDropAreaRef.current.textContent = "Drag & Drop To Upload File";
    showFile(e.dataTransfer.files[0]);
  };

  const browseFile = (e) => {
    e.preventDefault();
    showFile(e.target.files[0]);
  };

  const showFile = (file) => {
    imgRef.current.name = file.name.split(".")[0];
    const fileType = file.type;
    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (validExtensions.includes(fileType)) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileURL = fileReader.result;
        setImage(fileURL);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    setwidthCanvas(imgRef.current.naturalWidth);
    setheightCanvas(imgRef.current.naturalHeight);
    setTimeout(() => removeBackground());
  };

  const removeBackground = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const newColor = { r: 0, g: 0, b: 0, a: 0 };
      for (let i = 0; i < data.length; i += 4) {
        if (
          data[i] >= removeWhatColor.red1 &&
          data[i] <= removeWhatColor.red2 &&
          data[i + 1] >= removeWhatColor.green1 &&
          data[i + 1] <= removeWhatColor.green2 &&
          data[i + 2] >= removeWhatColor.blue1 &&
          data[i + 2] <= removeWhatColor.blue2
        ) {
          data[i + 3] = newColor.a;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = imgRef.current.name + "-RemovedBG.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const changeColor = (e) => {
    if (!isNaN(e.target.value)) {
      setRemoveWhatColor({
        ...removeWhatColor,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <div className="container-all">
      <div className="container-app border-radius-5 mt-10">
        <div className="container-drop text-center unselectable" ref={dropAreaRef} onDragOver={dragOver} onDragLeave={dragLeave} onDrop={fileDrop}>
          <div className="w-50 mx-auto mb-10">
            <div className="upload-file" />
            <h3 className="text-white" ref={textDropAreaRef}>
              Drag & Drop To Upload File
            </h3>
            <h3 className="text-white mb-10">Or</h3>
            <label>
              <input className="d-none" onChange={browseFile} type="file" placeholder="hola" />
              <span className="btn">Browse File</span>
            </label>
          </div>
        </div>

        <div className="container-images">
          <img className="max-w-full max-h-200 flex mx-auto" ref={imgRef} src={Image}></img>
          <canvas className="max-w-full max-h-200 flex mx-auto" ref={canvasRef} width={widthCanvas} height={heightCanvas}></canvas>
        </div>

        <div className="container-choose-color text-white text-center">
          <h3>Choose color range you want to remove</h3>
          <div className="flex justify-center">
            <ul className="w-full">
              <li className="style-type-none">
                <h5>Red</h5>
                <input
                  className="border-radius-5 outline-none py-5 w-full mb-10 focus_outline-black text-center"
                  name="red1"
                  value={removeWhatColor.red1}
                  onChange={changeColor}
                />
              </li>
              <li className="style-type-none">
                <h5>Green</h5>
                <input
                  className="border-radius-5 outline-none py-5 w-full mb-10 focus_outline-black text-center"
                  name="green1"
                  value={removeWhatColor.green1}
                  onChange={changeColor}
                />
              </li>
              <li className="style-type-none">
                <h5>Blue</h5>
                <input
                  className="border-radius-5 outline-none py-5 w-full mb-10 focus_outline-black text-center"
                  name="blue1"
                  value={removeWhatColor.blue1}
                  onChange={changeColor}
                />
              </li>
            </ul>

            <div
              className="w-50 ml-10 border-t-2 border-b-2 border-l-2"
              style={{ backgroundColor: "rgb(" + removeWhatColor.red1 + "," + removeWhatColor.green1 + "," + removeWhatColor.blue1 + ")" }}
            />
            <div
              className="w-50 mr-10 border-t-2 border-b-2 border-r-2"
              style={{ backgroundColor: "rgb(" + removeWhatColor.red2 + "," + removeWhatColor.green2 + "," + removeWhatColor.blue2 + ")" }}
            />

            <ul className="w-full">
              <li className="style-type-none">
                <h5>Red</h5>
                <input
                  className="border-radius-5 outline-none py-5 w-full mb-10 focus_outline-black text-center"
                  name="red2"
                  value={removeWhatColor.red2}
                  onChange={changeColor}
                />
              </li>
              <li className="style-type-none">
                <h5>Green</h5>
                <input
                  className="border-radius-5 outline-none py-5 w-full mb-10 focus_outline-black text-center"
                  name="green2"
                  value={removeWhatColor.green2}
                  onChange={changeColor}
                />
              </li>
              <li className="style-type-none">
                <h5>Blue</h5>
                <input
                  className="border-radius-5 outline-none py-5 w-full mb-10 focus_outline-black text-center"
                  name="blue2"
                  value={removeWhatColor.blue2}
                  onChange={changeColor}
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="container-buttons">
          <button className="btn" onClick={handleClick}>
            Remove Background
          </button>
          {widthCanvas !== 0 && (
            <button className="btn" onClick={downloadImage}>
              Download Image
            </button>
          )}
        </div>
      </div>
      <footer className="footer">
        <p className="footer-p">Made by:</p>
        <a className="footer-a" href="https://www.linkedin.com/in/giulianoconti/" target="_blank">
          Giuliano Conti
        </a>
      </footer>
    </div>
  );
};
