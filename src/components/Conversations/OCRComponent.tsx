import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { getOcrResult } from 'src/utils/cloudFunctions';
import { StyledInput, StyledButton } from '../styles/InitialMenu.styles';
import { mergeImages, blobToFile } from 'src/utils/ocrUtils'

type OCRComponentProps = {
  setOcrText: React.Dispatch<React.SetStateAction<string | null>>,
  gcpApiKey: string;
  setGcpApiKey: React.Dispatch<React.SetStateAction<string>>;
};

const OCRComponent: React.FC<OCRComponentProps> = ({ setOcrText, gcpApiKey, setGcpApiKey }) => {
  const [ocrImages, setOcrImages] = useState<File[]>([]);
  const [mergeResults, setMergeResults] = useState<boolean>(true); 
  const [useMarkdown, setUseMarkdown] = useState<boolean>(false); 

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setOcrImages((prevImages) => [...prevImages, ...acceptedFiles]);
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
          setOcrImages((prevImages) => [...prevImages, blob]);
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
    if (mergeResults && gcpApiKey) {
      const mergedImageBlob = await mergeImages(ocrImages);
      if (mergedImageBlob) {
        const mergedImageFile = blobToFile(mergedImageBlob, "merged_image.png");
        // const objectUrl = URL.createObjectURL(mergedImageFile);
        // const img = document.createElement('img');
        // img.src = objectUrl;
        // img.width = 1000; // 任意の数値
        // document.body.appendChild(img); 
        const result = await getOcrResult(mergedImageFile, gcpApiKey, useMarkdown);
        setOcrText(result);
        return;
      }
    }
  
    let allResults = ''; 
    for (const ocrImage of ocrImages) {
      if (ocrImage && gcpApiKey) {
        const result = await getOcrResult(ocrImage, gcpApiKey, useMarkdown);
        if (!mergeResults) {
          setOcrText(result);
        } else {
          allResults += result;
        }
      }
    }
  
    if (!mergeResults) {
      setOcrText(allResults);
    }
  };  

  const removeImage = (indexToRemove: number) => {
    setOcrImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <label>2. OCR (Enable Your Google Cloud Vision API):</label>
      <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '10px' }}>
        <div>
          <label>3. Set GCP API Key:</label>
          <StyledInput
            type="password"
            placeholder="Enter GCP API Key"
            value={gcpApiKey}
            onChange={(e) => setGcpApiKey(e.target.value)}
          />
        </div>
        <div {...getRootProps()} style={{ border: '2px dashed gray', margin: '10px', padding: '20px', textAlign: 'center', width: '60%' }}>
          <input {...getInputProps()} />
          {isDragActive ? "Drop it like it's hot!" : '4. Click me or drag a file to upload! (or Ctrl+V/Cmd+V to paste)'}
        </div>


        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
          {ocrImages.map((image, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img 
                src={URL.createObjectURL(image)} 
                alt="Preview" 
                style={{ width: '200px', height: 'auto', border: 'solid 1px #AAA' }} 
              />
              <button 
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'red',
                  color: 'white',
                  fontSize: '16px',
                  lineHeight: '16px',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }} 
                onClick={() => removeImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <br></br>
        
        <div>
          <label>5. Select Option:</label>
          <br></br><br></br>
          <label>
            <input
              type="checkbox"
              checked={useMarkdown}
              onChange={() => setUseMarkdown(!useMarkdown)}
            />
            Use Markdown
          </label>
          {ocrImages.length > 1 && (
              <label>
                <input
                  type="checkbox"
                  checked={mergeResults}
                  onChange={() => setMergeResults(!mergeResults)}
                />
                Merge Results
              </label>
          )}
        </div>
        <br></br>
        <StyledButton onClick={executeOcr}>
          Execute OCR
        </StyledButton>
      </div>
    </>
  );
};

export default OCRComponent;
