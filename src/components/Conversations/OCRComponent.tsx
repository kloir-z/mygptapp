import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { getOcrResult } from 'src/utils/cloudFunctions';

type OCRComponentProps = {
  setOcrText: React.Dispatch<React.SetStateAction<string | null>>,
  gcpApiKey: string;
  setGcpApiKey: React.Dispatch<React.SetStateAction<string>>;
};

const OCRComponent: React.FC<OCRComponentProps> = ({ setOcrText, gcpApiKey, setGcpApiKey }) => {
  const [ocrImage, setOcrImage] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setOcrImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleClipboardPaste = async (event: ClipboardEvent) => {
    const clipboardData = (event.clipboardData || (window as any).clipboardData);
    if (!clipboardData) return;

    const items = clipboardData.items;
    for (const item of items) {
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        if (blob) {
          setOcrImage(blob);
        }
      }
    }
  };
  

  useEffect(() => {
    document.addEventListener('paste', handleClipboardPaste);
    return () => {
      document.removeEventListener('paste', handleClipboardPaste);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('gcpApiKey', gcpApiKey);
  }, [gcpApiKey]);

  const executeOcr = async () => {
    if (ocrImage && gcpApiKey) {
      const result = await getOcrResult(ocrImage, gcpApiKey);
      setOcrText(result);
    }
  };

  return (
    <>
      <label>Use OCR and Summarize:</label>
      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '10px' }}>
        <input
          type="password"
          placeholder="Enter GCP API Key"
          value={gcpApiKey}
          onChange={(e) => setGcpApiKey(e.target.value)}
        />
        <div {...getRootProps()} style={{ border: '2px dashed gray', padding: '20px', textAlign: 'center' }}>
          <input {...getInputProps()} />
          {isDragActive ? "Drop it like it's hot!" : 'Click me or drag a file to upload! (Or Ctrl+V/Cmd+V to paste)'}
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
