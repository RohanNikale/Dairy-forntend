import React, { useRef, useEffect } from 'react';
import bg from './bg2.jpg'
const ImageWithText = (props) => {
  const canvasRef = useRef(null);
  const imageUrl = bg;
  const text = "आज मैं दूर सही तुझसे,\nपर तुम हमेशा मेरे पास हो।\nकैसे बताऊँ मैं तुझको,\nकि तुम मेरे लिये कितना...";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.src = imageUrl;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';

      // Draw text on the canvas
      const lines = text.split('\n');
      const lineHeight = 40;
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 + index * lineHeight);
      });
    };
  }, [imageUrl, text]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'image-with-text.png';
    link.click();
  };

  return (
    <div className="canvas-container" style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width="600" height="300" style={{ border: '1px solid #d3d3d3' }}></canvas>
      <button onClick={downloadImage} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
        Download Image
      </button>
    </div>
  );
};

export default ImageWithText;
