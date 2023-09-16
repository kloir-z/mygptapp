import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getOcrResult } from 'src/utils/cloudFunctions';

type OCRComponentProps = {
  setOcrText: React.Dispatch<React.SetStateAction<string | null>>,
};

const OCRComponent: React.FC<OCRComponentProps> = ({ setOcrText }) => {
  const [ocrImage, setOcrImage] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setOcrImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const executeOcr = async () => {
    if (ocrImage) {
      const result = await getOcrResult(ocrImage);
      setOcrText(result);
    }
  };

  return (
    <>
      <label>Use OCR and Summarize:</label>
      <div style={{display: 'flex', flexDirection: 'column', paddingLeft: '10px'}}>
        <div {...getRootProps()} style={{ border: '2px dashed gray', padding: '20px', textAlign: 'center' }}>
          <input {...getInputProps()} />
          {isDragActive ? "Drop it like it's hot!" : 'Click me or drag a file to upload!'}
        </div>
        
        <button onClick={executeOcr}>
          OCR実行
        </button>

        {ocrImage && <img src={URL.createObjectURL(ocrImage)} alt="Preview" style={{ width: '200px', height: 'auto' }} />}
      </div>
    </>
  );
};

export default OCRComponent;
